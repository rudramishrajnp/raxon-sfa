import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/services/device_info_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/tracking_repository.dart';
import '../api/tracking_api_service.dart';
import '../models/gps_log_request.dart';

class TrackingRepositoryImpl implements TrackingRepository {
  final TrackingApiService _apiService;
  // ignore: unused_field
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;
  final DeviceInfoService _deviceInfoService;

  TrackingRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
    this._deviceInfoService,
  );

  @override
  Future<void> saveLocationEvent({
    required String eventName,
    required double latitude,
    required double longitude,
    required double accuracy,
    required DateTime timestamp,
  }) async {
    final deviceId = await _deviceInfoService.getDeviceId();
    
    final request = GpsLogRequest(
      eventName: eventName,
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy,
      timestamp: timestamp,
      deviceId: deviceId,
    );

    // 1. Save to Local Database (Offline First)
    // await _db.into(_db.gpsLogTable).insert(...);

    // 2. Add to Sync Queue or try to sync immediately
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        await _apiService.syncGpsLogs([request]);
        // Update local DB status to synced (1)
      } catch (e) {
        // Enqueue for background sync on failure
        await _syncManager.enqueueOperation(
          'Tracking',
          timestamp.toIso8601String(),
          'CREATE',
          jsonEncode(request.toJson()),
        );
      }
    } else {
      // Enqueue for background sync when internet is restored
      await _syncManager.enqueueOperation(
        'Tracking',
        timestamp.toIso8601String(),
        'CREATE',
        jsonEncode(request.toJson()),
      );
    }
  }

  @override
  Future<void> syncPendingLogs() async {
    final isConnected = await _connectivityService.isConnected();
    if (!isConnected) return;

    try {
      // 1. Fetch pending logs from Local Database where syncStatus == 0
      // final pendingLogs = await (_db.select(_db.gpsLogTable)..where((tbl) => tbl.syncStatus.equals(0))).get();
      
      // 2. Map to GpsLogRequest list
      // final requests = pendingLogs.map(...).toList();
      
      // 3. Sync with API
      // if (requests.isNotEmpty) {
      //   await _apiService.syncGpsLogs(requests);
      //   // 4. Update syncStatus to 1
      // }
    } catch (e) {
      // Silent error in background sync, will retry later
    }
  }
}

final trackingRepositoryProvider = Provider<TrackingRepository>((ref) {
  return TrackingRepositoryImpl(
    ref.watch(trackingApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
    ref.watch(deviceInfoProvider),
  );
});
