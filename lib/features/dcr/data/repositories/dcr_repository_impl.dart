import 'dart:convert';
import 'package:drift/drift.dart' as drift;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/dcr_repository.dart';
import '../api/dcr_api_service.dart';
import '../../data/models/dcr_checkin_model.dart';
import '../../data/models/override_request_model.dart';

class DcrRepositoryImpl implements DcrRepository {
  final DcrApiService _apiService;
  // ignore: unused_field
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;

  DcrRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
  );

  @override
  Future<void> submitCheckIn(DcrCheckInModel checkIn) async {
    final isConnected = await _connectivityService.isConnected();
    String? callId;
    bool syncSuccess = false;

    if (isConnected) {
      try {
        callId = await _apiService.submitCheckIn(checkIn);
        syncSuccess = true;
      } catch (e) {
        // Fallback to offline
      }
    }

    // Save to local database
    final companion = DcrCheckInTableCompanion.insert(
      employeeId: checkIn.employeeId,
      customerId: checkIn.customerId,
      date: checkIn.date,
      checkInTime: checkIn.checkInTime,
      latitude: checkIn.latitude,
      longitude: checkIn.longitude,
      accuracy: checkIn.accuracy,
      distance: checkIn.distance,
      isInternetAvailable: drift.Value(checkIn.isInternetAvailable),
      batteryPercentage: drift.Value(checkIn.batteryPercentage),
      syncStatus: drift.Value(syncSuccess ? 1 : 0),
      callId: drift.Value(callId),
    );
    final checkInId = await _db.dcrDao.insertDcrCheckIn(companion);

    // Enqueue if offline
    if (!syncSuccess) {
      // Pass the local checkInId so checkOut can reference it
      final payload = checkIn.toJson();
      payload['id'] = checkInId; 
      await _syncManager.enqueueOperation('DcrCheckIn', checkIn.customerId, 'CREATE', jsonEncode(payload));
    }
  }

  @override
  Future<void> submitOverrideRequest(OverrideRequestModel request) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        await _apiService.submitOverrideRequest(request);
      } catch (e) {
        await _syncManager.enqueueOperation('DcrOverride', request.customerId, 'CREATE', jsonEncode(request.toJson()));
      }
    } else {
      await _syncManager.enqueueOperation('DcrOverride', request.customerId, 'CREATE', jsonEncode(request.toJson()));
    }
  }

  @override
  Future<bool> hasPunchedInToday(String employeeId) async {
    // Check Attendance table for today's Punch In
    final today = DateTime.now();
    final startOfDay = DateTime(today.year, today.month, today.day);
    
    final entry = await (_db.select(_db.attendanceTable)
      ..where((t) => t.date.isBiggerOrEqualValue(startOfDay))
    ).getSingleOrNull();

    return entry != null;
  }

  @override
  Future<bool> hasCheckedInToCustomerToday(String employeeId, String customerId) async {
    final today = DateTime.now();
    final startOfDay = DateTime(today.year, today.month, today.day);
    
    final entry = await (_db.select(_db.dcrCheckInTable)
      ..where((t) => t.customerId.equals(customerId))
      ..where((t) => t.date.isBiggerOrEqualValue(startOfDay))
    ).getSingleOrNull();

    return entry != null;
  }
}

final dcrRepositoryProvider = Provider<DcrRepository>((ref) {
  return DcrRepositoryImpl(
    ref.watch(dcrApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
  );
});
