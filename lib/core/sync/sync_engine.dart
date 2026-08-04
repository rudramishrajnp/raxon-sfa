import 'dart:async';
import 'dart:convert';
import 'package:universal_io/io.dart';
import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'queue_manager.dart';
import 'retry_engine.dart';
import '../services/connectivity_service.dart';
import '../services/logger_service.dart';
import '../services/notification_service.dart';
import '../network/dio_client.dart';

import '../database/app_database.dart';

class SyncEngine {
  final QueueManager _queueManager;
  final ConnectivityService _connectivityService;
  final LoggerService _logger;
  final NotificationService _notificationService;
  final Dio _dio;
  final AppDatabase _db;
  
  bool _isSyncing = false;
  StreamSubscription? _connectivitySubscription;

  SyncEngine(
    this._queueManager,
    this._connectivityService,
    this._logger,
    this._notificationService,
    this._dio,
    this._db,
  ) {
    _initConnectivityListener();
  }

  void _initConnectivityListener() {
    _connectivitySubscription = _connectivityService.onConnectionChange.listen((isConnected) {
      if (isConnected) {
        _logger.info('Network restored. Triggering background sync.');
        startSync();
      }
    });
  }

  void dispose() {
    _connectivitySubscription?.cancel();
  }

  Future<void> startSync({bool isManual = false}) async {
    if (_isSyncing) {
      _logger.info('Sync already in progress. Skipping...');
      return;
    }

    final isConnected = await _connectivityService.isConnected();
    if (!isConnected) {
      _logger.warning('Cannot sync: No internet connection.');
      if (isManual) {
        _notificationService.sendLocalNotification(
          title: 'Sync Failed',
          body: 'No internet connection available.',
        );
      }
      return;
    }

    _isSyncing = true;
    _logger.info('Starting Sync Engine...');
    
    if (isManual) {
      _notificationService.sendLocalNotification(
        title: 'Sync Started',
        body: 'Synchronizing your offline data.',
      );
    }

    try {
      final pendingOperations = await _queueManager.getPendingOperations();
      if (pendingOperations.isEmpty) {
        _logger.info('No pending operations to sync.');
        _isSyncing = false;
        return;
      }
      
      _logger.info('Found ${pendingOperations.length} pending operations.');

      int successCount = 0;
      int failCount = 0;

      for (final operation in pendingOperations) {
        // Evaluate exponential backoff
        final delay = RetryEngine.calculateDelay(operation.retryCount);
        if (delay.inSeconds > 0 && DateTime.now().difference(operation.createdAt) < delay) {
           _logger.info('Skipping ${operation.entityType} due to backoff delay.');
           continue; // Skip for now
        }

        try {
          await _processOperation(operation);
          await _queueManager.markAsSynced(operation.id);
          successCount++;
          _logger.info('Successfully synced ${operation.entityType} - ${operation.operation}');
        } catch (e) {
          bool isDuplicate = false;
          if (e is DioException && e.response?.statusCode == 400) {
            final errorData = e.response?.data;
            if (errorData is Map && errorData['error'] != null) {
              final errorMsg = errorData['error'].toString().toLowerCase();
              if (errorMsg.contains('already punched in') || 
                  errorMsg.contains('already punched out') || 
                  errorMsg.contains('no punch-in found') || 
                  errorMsg.contains('already exists') || 
                  errorMsg.contains('duplicate mtp')) {
                isDuplicate = true;
              }
            }
          }

          if (isDuplicate) {
            await _queueManager.markAsSynced(operation.id);
            successCount++;
            _logger.info('Successfully synced (duplicate handled) ${operation.entityType} - ${operation.operation}');
          } else {
            failCount++;
            final isNetworkError = _isNetworkError(e);
            if (RetryEngine.shouldRetry(operation.retryCount, isNetworkError)) {
               await _queueManager.updateRetry(operation.id, e.toString(), operation.retryCount + 1);
               _logger.warning('Failed to sync ${operation.entityType}. Scheduled for retry. Error: $e');
            } else {
               await _queueManager.markAsFailed(operation.id, e.toString(), operation.retryCount);
               _logger.severe('Permanently failed to sync ${operation.entityType}. Moved to failed queue. Error: $e');
            }
          }
        }
      }

      if (isManual || failCount > 0) {
        _notificationService.sendLocalNotification(
          title: 'Sync Completed',
          body: 'Synced: $successCount. Failed: $failCount.',
        );
      }
    } finally {
      _isSyncing = false;
    }
  }

  Future<void> _processOperation(dynamic operation) async {
    final payloadMap = jsonDecode(operation.payload);
    
    if (operation.entityType == 'Attendance' && operation.operation == 'CREATE') {
      await _dio.post('/attendance/punch-in', data: payloadMap);
    } else if (operation.entityType == 'PunchOut' && operation.operation == 'CREATE') {
      await _dio.post('/attendance/punch-out', data: payloadMap);
    } else if (operation.entityType == 'GpsEvent' && operation.operation == 'CREATE') {
      final gpsData = <String, dynamic>{
        'latitude': payloadMap['latitude'],
        'longitude': payloadMap['longitude'],
        'timestamp': payloadMap['timestamp'],
      };
      if (payloadMap['accuracy'] != null) gpsData['accuracy'] = payloadMap['accuracy'];
      if (payloadMap['speed'] != null) gpsData['speed'] = payloadMap['speed'];
      if (payloadMap['batteryPercentage'] != null) gpsData['batteryPercentage'] = payloadMap['batteryPercentage'];

      await _dio.post('/attendance/breadcrumbs', data: {
        'logs': [gpsData]
      });
    } else if (operation.entityType == 'MTP') {
      if (operation.operation == 'SAVE_DRAFT') {
        final data = {
          'month': payloadMap['month'],
          'year': payloadMap['year'],
          'dailyPlans': (payloadMap['days'] as List).map((d) => {
            'date': d['date'].split('T')[0],
            'workType': d['workType'],
            'locationType': d['locationType'],
            'doctorIds': (d['doctors'] as List).map((doc) => doc['doctorId']).toList(),
            'chemistIds': [],
          }).toList(),
        };
        await _dio.post('/mtp/draft', data: data);
      } else if (operation.operation == 'UPDATE_DRAFT') {
        final data = {
          'mtpId': payloadMap['id'],
          'month': payloadMap['month'],
          'year': payloadMap['year'],
          'dailyPlans': (payloadMap['days'] as List).map((d) => {
            'date': d['date'].split('T')[0],
            'workType': d['workType'],
            'locationType': d['locationType'],
            'doctorIds': (d['doctors'] as List).map((doc) => doc['doctorId']).toList(),
            'chemistIds': [],
          }).toList(),
        };
        await _dio.put('/mtp/update', data: data);
      } else if (operation.operation == 'SUBMIT') {
        await _dio.post('/mtp/submit', data: {'mtpId': payloadMap['id']});
      }
    } else if (operation.entityType == 'Deviation' && operation.operation == 'CREATE') {
      await _dio.post('/work-plan/deviation', data: payloadMap);
    } else if (operation.entityType == 'JointWork' && operation.operation == 'CREATE') {
      await _dio.post('/work-plan/joint-work', data: payloadMap);
    } else if (operation.entityType == 'Customer' && operation.operation == 'CREATE') {
      final endpoint = (payloadMap['type'] as String).toLowerCase() == 'doctor' ? '/master/doctors/request' : '/master/chemists/request';
      await _dio.post(endpoint, data: payloadMap);
    } else if (operation.entityType == 'DcrCheckIn' && operation.operation == 'CREATE') {
      final dateStr = payloadMap['date'].split('T')[0];
      String? dcrId;
      try {
        final res = await _dio.get('/dcr/current', queryParameters: {'date': dateStr});
        if (res.data != null && res.data['dcr'] != null) {
          dcrId = res.data['dcr']['id'];
        }
      } catch (e) {}

      if (dcrId == null) {
        final draftRes = await _dio.post('/dcr/draft', data: {
          'date': dateStr,
          'workType': 'Field Work',
          'doctorCalls': []
        });
        dcrId = draftRes.data['dcrId'];
      }

      final checkInRes = await _dio.post('/dcr/check-in', data: {
        'dcrId': dcrId,
        'doctorId': payloadMap['customerId'],
        'lat': payloadMap['latitude'],
        'lng': payloadMap['longitude'],
        'timestamp': payloadMap['checkInTime'],
      });
      final callId = checkInRes.data['callId'];
      
      if (payloadMap['id'] != null) {
        await _db.dcrDao.updateCheckInCallId(payloadMap['id'], callId);
      }
    } else if (operation.entityType == 'DcrCheckOut' && operation.operation == 'CREATE') {
      // First, get callId
      final checkInIdInt = int.tryParse(payloadMap['checkInId'].toString());
      String? callId;
      if (checkInIdInt != null) {
        final localCheckIn = await _db.dcrDao.getCheckInById(checkInIdInt);
        callId = localCheckIn?.callId;
      }
      
      if (callId == null) {
        // If we still don't have a callId, it implies the Check-In hasn't synced yet.
        // We should throw an error to trigger a retry later.
        throw Exception('Dependency error: callId not found. CheckIn might not be synced yet.');
      }
      
      // Fetch report data if possible. Since we are inside SyncEngine, we don't have DcrReportRepository.
      // But we can query it directly using dcrDao.
      final entry = await (_db.select(_db.dcrReportTable)..where((t) => t.checkInId.equals(payloadMap['checkInId']))).getSingleOrNull();
      List<dynamic> samplesList = [];
      List<dynamic> ordersList = [];
      Map<String, dynamic>? prescriptionMap;
      if (entry != null) {
        if (entry.samplingData != null) samplesList = jsonDecode(entry.samplingData!);
        if (entry.orderData != null) ordersList = jsonDecode(entry.orderData!);
        if (entry.prescriptionData != null) prescriptionMap = jsonDecode(entry.prescriptionData!);
      }

      final payload = {
        'callId': callId,
        'lat': payloadMap['latitude'],
        'lng': payloadMap['longitude'],
        'timestamp': payloadMap['checkOutTime'],
        'inChamberTime': payloadMap['visitDurationMinutes'],
        'feedback': payloadMap['doctorMood'], 
        'samples': samplesList.map((s) => {
          'productId': s['productId'],
          'quantity': s['quantity']
        }).toList(),
        'orders': ordersList.map((o) => {
          'productId': o['productId'],
          'quantity': o['quantity'],
          'amount': o['totalValue']
        }).toList(),
        'prescriptions': [] 
      };

      if (prescriptionMap != null && prescriptionMap['promotedBrands'] != null) {
        final brands = List<String>.from(prescriptionMap['promotedBrands']);
        if (brands.isNotEmpty) {
          payload['prescriptions'] = brands.map((brandId) => {
            'productId': brandId,
            'prescriptionCount': prescriptionMap!['estimatedVolume'] ?? 1
          }).toList();
        }
      }

      await _dio.post('/dcr/check-out', data: payload);
    } else if (operation.entityType == 'DcrSubmission' && operation.operation == 'CREATE') {
      await _dio.post('/dcr/submit', data: {
        'date': payloadMap['submissionTime'].split('T')[0]
      });
    } else if (operation.entityType == 'Expense' && operation.operation == 'SAVE_DRAFT') {
      final data = {
        'date': payloadMap['date'].split('T')[0],
        'locationType': payloadMap['locationType'],
        'ta': payloadMap['taAmount'],
        'da': payloadMap['daAmount'],
        'misc': payloadMap['miscTotal'],
        'miscRemarks': (payloadMap['miscExpenses'] as List<dynamic>?)?.map((e) => e['remarks'] ?? e['category']).join(', ')
      };
      await _dio.post('/expense/submit', data: data);
    } else if (operation.entityType == 'ExpenseBill' && operation.operation == 'UPLOAD') {
      if (!kIsWeb) {
        final file = File(payloadMap['filePath']);
        if (await file.exists()) {
          FormData formData = FormData.fromMap({
            'bill': await MultipartFile.fromFile(file.path, filename: payloadMap['fileName']),
            'expenseId': payloadMap['expenseId'],
          });
          await _dio.post('/expense/upload-bill', data: formData);
        }
      }
    } else if (operation.entityType == 'SecondarySales' && operation.operation == 'CREATE') {
      // Sales entry loop
      final entryDate = payloadMap['entryDate'].toString().split('T')[0];
      final entityType = payloadMap['customerType']?.toString().toUpperCase() == 'CHEMIST' ? 'CHEMIST' : 'STOCKIST';
      final entityId = payloadMap['customerId'];
      
      final products = payloadMap['products'] as List<dynamic>? ?? [];
      for (var product in products) {
        if ((product['salesQty'] ?? 0) > 0 || (product['closingStock'] ?? 0) >= 0) {
          final data = {
            'entityType': entityType,
            'entityId': entityId,
            'productId': product['productId'],
            'entryDate': entryDate,
            'quantity': product['salesQty'] ?? 0,
            'value': (product['salesQty'] ?? 0) * (product['unitPrice'] ?? 0),
            'closingStock': product['closingStock']
          };
          await _dio.post('/sales/add', data: data);
        }
      }
    } else {
      _logger.warning('Unknown operation type: ${operation.entityType}');
    }
  }

  bool _isNetworkError(dynamic error) {
    if (error is DioException) {
       return error.type == DioExceptionType.connectionTimeout || 
              error.type == DioExceptionType.receiveTimeout ||
              error.type == DioExceptionType.connectionError;
    }
    return false;
  }
}

final syncEngineProvider = Provider<SyncEngine>((ref) {
  return SyncEngine(
    ref.watch(queueManagerProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(loggerServiceProvider),
    ref.watch(notificationServiceProvider),
    ref.watch(dioProvider),
    ref.watch(databaseProvider),
  );
});
