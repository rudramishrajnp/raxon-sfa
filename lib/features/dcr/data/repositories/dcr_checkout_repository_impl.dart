import 'dart:convert';
import 'package:drift/drift.dart' as drift;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/dcr_checkout_repository.dart';
import '../../domain/repositories/dcr_report_repository.dart';
import '../api/dcr_checkout_api_service.dart';
import '../../data/models/dcr_checkout_model.dart';
import '../../data/models/dcr_report_model.dart';
import 'dcr_report_repository_impl.dart';

class DcrCheckOutRepositoryImpl implements DcrCheckOutRepository {
  final DcrCheckOutApiService _apiService;
  final DcrReportRepository _reportRepository;
  // ignore: unused_field
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;

  DcrCheckOutRepositoryImpl(
    this._apiService,
    this._reportRepository,
    this._db,
    this._connectivityService,
    this._syncManager,
  );

  @override
  Future<void> submitCheckOut(DcrCheckOutModel checkOut) async {
    final isConnected = await _connectivityService.isConnected();
    bool syncSuccess = false;
    
    // Attempt to get callId from local checkIn
    final checkInIdInt = int.tryParse(checkOut.checkInId);
    String? callId;
    if (checkInIdInt != null) {
      final localCheckIn = await _db.dcrDao.getCheckInById(checkInIdInt);
      callId = localCheckIn?.callId;
    }
    
    // Save to local database
    final companion = DcrCheckOutTableCompanion.insert(
      checkInId: checkOut.checkInId,
      customerId: checkOut.customerId,
      checkInTime: checkOut.checkInTime,
      checkOutTime: checkOut.checkOutTime,
      visitDurationMinutes: checkOut.visitDurationMinutes,
      latitude: checkOut.latitude,
      longitude: checkOut.longitude,
      accuracy: checkOut.accuracy,
      distance: checkOut.distance,
      callStatus: checkOut.callStatus,
      doctorMood: drift.Value(checkOut.doctorMood),
      productInterest: drift.Value(checkOut.productInterest),
      competitorActivity: drift.Value(checkOut.competitorActivity),
      newOpportunity: drift.Value(checkOut.newOpportunity),
      complaint: drift.Value(checkOut.complaint),
      followUpRequired: drift.Value(checkOut.followUpRequired),
      nextVisitNotes: drift.Value(checkOut.nextVisitNotes),
      remarks: drift.Value(checkOut.remarks),
      isInternetAvailable: drift.Value(checkOut.isInternetAvailable),
      syncStatus: const drift.Value(0),
    );
    await _db.dcrDao.insertDcrCheckOut(companion);

    if (isConnected && callId != null) {
      try {
        final report = await _reportRepository.getDraft(checkOut.checkInId, checkOut.customerId) ?? DcrReportModel(
          checkInId: checkOut.checkInId,
          customerId: checkOut.customerId,
          isDraft: false,
        );
        await _apiService.submitCheckOut(checkOut, callId, report);
        syncSuccess = true;
      } catch (e) {
        // Fallback to offline
      }
    }

    if (!syncSuccess) {
      await _syncManager.enqueueOperation('DcrCheckOut', checkOut.checkInId, 'CREATE', jsonEncode(checkOut.toJson()));
    }
  }

  @override
  Future<bool> hasCheckedIn(String checkInId) async {
    final checkInIdInt = int.tryParse(checkInId);
    if (checkInIdInt == null) return false;
    final entry = await _db.dcrDao.getCheckInById(checkInIdInt);
    return entry != null;
  }

  @override
  Future<DateTime?> getCheckInTime(String checkInId) async {
    final checkInIdInt = int.tryParse(checkInId);
    if (checkInIdInt == null) return null;
    final entry = await _db.dcrDao.getCheckInById(checkInIdInt);
    return entry?.checkInTime;
  }

  @override
  Future<DcrReportModel?> getDcrReport(String checkInId, String customerId) async {
    return await _reportRepository.getDraft(checkInId, customerId);
  }
}

final dcrCheckOutRepositoryProvider = Provider<DcrCheckOutRepository>((ref) {
  return DcrCheckOutRepositoryImpl(
    ref.watch(dcrCheckOutApiServiceProvider),
    ref.watch(dcrReportRepositoryProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
  );
});
