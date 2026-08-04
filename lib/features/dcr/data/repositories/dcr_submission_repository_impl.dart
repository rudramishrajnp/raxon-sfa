import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/dcr_submission_repository.dart';
import '../api/dcr_submission_api_service.dart';
import '../../data/models/dcr_submission_model.dart';
import '../../data/models/dcr_checkout_model.dart';
import '../../data/models/dcr_report_model.dart';

class DcrSubmissionRepositoryImpl implements DcrSubmissionRepository {
  final DcrSubmissionApiService _apiService;
  // ignore: unused_field
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;

  DcrSubmissionRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
  );

  @override
  Future<void> submitFinalDcr(DcrSubmissionModel submission) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        await _apiService.submitFinalDcr(submission);
      } catch (e) {
        await _syncManager.enqueueOperation('DcrSubmission', submission.dcrId, 'CREATE', jsonEncode(submission.toJson()));
      }
    } else {
      await _syncManager.enqueueOperation('DcrSubmission', submission.dcrId, 'CREATE', jsonEncode(submission.toJson()));
    }
  }

  @override
  Future<DcrCheckOutModel?> getCheckOutData(String checkInId) async {
    final entry = await (_db.select(_db.dcrCheckOutTable)..where((t) => t.checkInId.equals(checkInId))).getSingleOrNull();
    if (entry == null) return null;

    return DcrCheckOutModel(
      checkInId: entry.checkInId,
      customerId: entry.customerId,
      customerName: 'Customer', // We might need to join with customer table for name
      checkInTime: entry.checkInTime,
      checkOutTime: entry.checkOutTime,
      visitDurationMinutes: entry.visitDurationMinutes,
      latitude: entry.latitude,
      longitude: entry.longitude,
      accuracy: entry.accuracy,
      distance: entry.distance,
      callStatus: entry.callStatus,
      doctorMood: entry.doctorMood,
      productInterest: entry.productInterest,
      competitorActivity: entry.competitorActivity,
      newOpportunity: entry.newOpportunity,
      complaint: entry.complaint,
      followUpRequired: entry.followUpRequired,
      nextVisitNotes: entry.nextVisitNotes,
      remarks: entry.remarks,
      isInternetAvailable: entry.isInternetAvailable,
    ); 
  }

  @override
  Future<DcrReportModel?> getReportData(String checkInId, String customerId) async {
    final entry = await (_db.select(_db.dcrReportTable)..where((t) => t.checkInId.equals(checkInId))).getSingleOrNull();
    if (entry == null) {
      return DcrReportModel(
        checkInId: checkInId,
        customerId: customerId,
        samples: [],
        orders: [],
        summary: CallSummaryModel(),
        isDraft: false,
      );
    }
    
    return DcrReportModel(
      checkInId: entry.checkInId,
      customerId: entry.customerId,
      samples: entry.samplingData != null ? (jsonDecode(entry.samplingData!) as List).map((e) => SampleItemModel.fromJson(e)).toList() : [],
      prescription: entry.prescriptionData != null ? PrescriptionModel.fromJson(jsonDecode(entry.prescriptionData!)) : null,
      orders: entry.orderData != null ? (jsonDecode(entry.orderData!) as List).map((e) => OrderItemModel.fromJson(e)).toList() : [],
      summary: entry.summaryData != null ? CallSummaryModel.fromJson(jsonDecode(entry.summaryData!)) : null,
      isDraft: entry.isDraft,
    );
  }

  @override
  Future<bool> isDcrLocked(String checkInId) async {
    return false; // Stub
  }
}

final dcrSubmissionRepositoryProvider = Provider<DcrSubmissionRepository>((ref) {
  return DcrSubmissionRepositoryImpl(
    ref.watch(dcrSubmissionApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
  );
});
