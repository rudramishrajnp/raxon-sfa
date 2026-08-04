import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:drift/drift.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/punch_out_repository.dart';
import '../api/punch_out_api_service.dart';
import '../models/end_of_day_summary_model.dart';
import '../models/punch_out_request.dart';

class PunchOutRepositoryImpl implements PunchOutRepository {
  final PunchOutApiService _apiService;
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;

  PunchOutRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
  );

  @override
  Future<EndOfDaySummaryModel> getEndOfDaySummary(String employeeId) async {
    // Attempt to fetch from local database first (if we had the tables set up for all of these).
    // For now we will return a synthesized model based on what we can gather.
    final now = DateTime.now();
    final punchIn = DateTime(now.year, now.month, now.day, 9, 0); 
    
    return EndOfDaySummaryModel(
      employeeName: 'Demo MR',
      employeeCode: employeeId,
      punchInTime: punchIn,
      currentTime: now,
      totalWorkingHours: now.difference(punchIn),
      plannedCalls: 10,
      completedCalls: 8,
      pendingCalls: 2,
      totalSamplesGiven: 15,
      ordersBooked: 15000.0,
      todayExpenses: 450.0,
      isGpsActive: true,
      hasIncompleteDcr: false,
      hasMissingExpenses: false,
    );
  }

  @override
  Future<void> submitPunchOut(PunchOutRequest request) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        await _apiService.punchOut(request);
      } catch (e) {
        await _syncManager.enqueueOperation(
          'PunchOut',
          request.employeeId,
          'CREATE',
          jsonEncode(request.toJson()),
        );
      }
    } else {
      await _syncManager.enqueueOperation(
        'PunchOut',
        request.employeeId,
        'CREATE',
        jsonEncode(request.toJson()),
      );
    }
  }
}

final punchOutRepositoryProvider = Provider<PunchOutRepository>((ref) {
  return PunchOutRepositoryImpl(
    ref.watch(punchOutApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
  );
});
