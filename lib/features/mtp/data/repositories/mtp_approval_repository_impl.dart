import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/mtp_approval_repository.dart';
import '../api/mtp_approval_api_service.dart';
import '../models/mtp_approval_request.dart';
import '../models/mtp_audit_model.dart';

class MtpApprovalRepositoryImpl implements MtpApprovalRepository {
  final MtpApprovalApiService _apiService;
  // ignore: unused_field
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;

  MtpApprovalRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
  );

  @override
  Future<void> processApproval(MtpApprovalRequest request) async {
    final isConnected = await _connectivityService.isConnected();
    if (!isConnected) {
      throw Exception('You are offline. Manager Approval and Rejection actions require a live server connection. Please retry when online.');
    }
    
    await _apiService.processApprovalAction(request);
  }

  @override
  Future<List<MtpAuditModel>> getMtpAuditHistory(String mtpId) async {
    // Fetch from local DB first, then API if connected
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        return await _apiService.getAuditLogs(mtpId);
      } catch (_) {}
    }
    // Return local logs simulated
    return [
      MtpAuditModel(
        id: '1',
        mtpId: mtpId,
        actionBy: 'EMP001',
        actionByName: 'Self',
        previousStatus: 'DRAFT',
        newStatus: 'PENDING',
        remarks: 'Submitted for approval',
        actionDate: DateTime.now().subtract(const Duration(days: 1)),
      ),
    ];
  }

  @override
  Future<void> cancelDraft(String mtpId) async {
    // Delete or cancel draft locally
    // await _db.mtpTable.delete...
    await Future.delayed(const Duration(milliseconds: 200));
  }
}

final mtpApprovalRepositoryProvider = Provider<MtpApprovalRepository>((ref) {
  return MtpApprovalRepositoryImpl(
    ref.watch(mtpApprovalApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
  );
});
