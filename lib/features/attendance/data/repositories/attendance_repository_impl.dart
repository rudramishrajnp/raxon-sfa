import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:drift/drift.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/attendance_repository.dart';
import '../api/attendance_api_service.dart';
import '../models/punch_in_request.dart';

class AttendanceRepositoryImpl implements AttendanceRepository {
  final AttendanceApiService _apiService;
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;

  AttendanceRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
  );

  @override
  Future<void> submitPunchIn(PunchInRequest request) async {
    // Insert into local Drift database
    await _db.attendanceDao.insertAttendance(
      AttendanceTableCompanion.insert(
        employeeId: request.employeeId,
        date: request.date,
        punchInTime: request.punchInTime,
        latitude: request.latitude,
        longitude: request.longitude,
        accuracy: request.accuracy,
        deviceId: request.deviceId,
        batteryPercentage: request.batteryPercentage,
        networkType: request.networkType,
        syncStatus: const Value(0), // 0 = Pending
      ),
    );

    // Sync to server if internet is available, else queue
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        await _apiService.punchIn(request);
        // Mark as synced in local DB (would typically update the record here)
      } catch (e) {
        // Enqueue for background sync if API fails
        await _syncManager.enqueueOperation(
          'Attendance',
          request.employeeId,
          'CREATE',
          jsonEncode(request.toJson()),
        );
      }
    } else {
      // Keep pending for background sync
      await _syncManager.enqueueOperation(
        'Attendance',
        request.employeeId,
        'CREATE',
        jsonEncode(request.toJson()),
      );
    }
  }
}

final attendanceRepositoryProvider = Provider<AttendanceRepository>((ref) {
  return AttendanceRepositoryImpl(
    ref.watch(attendanceApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
  );
});
