import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/expense_approval_repository.dart';
import '../api/expense_approval_api_service.dart';
import '../models/expense_approval_model.dart';
import '../models/expense_audit_model.dart';
import '../models/expense_payment_model.dart';

class ExpenseApprovalRepositoryImpl implements ExpenseApprovalRepository {
  final ExpenseApprovalApiService _apiService;
  // ignore: unused_field
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;

  ExpenseApprovalRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
  );

  @override
  Future<void> submitApproval(ExpenseApprovalModel approval) async {
    final isConnected = await _connectivityService.isConnected();
    
    // Save to local DB first
    // await _db.into(_db.expenseApprovalTable).insert(...);

    if (isConnected) {
      try {
        await _apiService.submitApproval(approval);
      } catch (e) {
        await _syncManager.enqueueOperation('ExpenseApproval', approval.id, 'INSERT', jsonEncode(approval.toJson()));
      }
    } else {
      await _syncManager.enqueueOperation('ExpenseApproval', approval.id, 'INSERT', jsonEncode(approval.toJson()));
    }
  }

  @override
  Future<void> submitPayment(ExpensePaymentModel payment) async {
    final isConnected = await _connectivityService.isConnected();
    
    // Save to local DB first
    
    if (isConnected) {
      try {
        await _apiService.submitPayment(payment);
      } catch (e) {
        await _syncManager.enqueueOperation('ExpensePayment', payment.id, 'INSERT', jsonEncode(payment.toJson()));
      }
    } else {
      await _syncManager.enqueueOperation('ExpensePayment', payment.id, 'INSERT', jsonEncode(payment.toJson()));
    }
  }

  @override
  Future<void> logAudit(String expenseId, String action, String performedBy, String role, {String? details}) async {
    final audit = ExpenseAuditModel(
      id: const Uuid().v4(),
      expenseId: expenseId,
      action: action,
      performedBy: performedBy,
      role: role,
      timestamp: DateTime.now(),
      details: details,
    );

    // Save to local DB
    await _syncManager.enqueueOperation('ExpenseAudit', audit.id, 'INSERT', jsonEncode(audit.toJson()));
  }
}

final expenseApprovalRepositoryProvider = Provider<ExpenseApprovalRepository>((ref) {
  return ExpenseApprovalRepositoryImpl(
    ref.watch(expenseApprovalApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
  );
});
