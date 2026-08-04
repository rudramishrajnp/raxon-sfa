import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/expense_repository.dart';
import '../api/expense_api_service.dart';
import '../../data/models/expense_model.dart';

class ExpenseRepositoryImpl implements ExpenseRepository {
  final ExpenseApiService _apiService;
  // ignore: unused_field
  final AppDatabase _db;
  // ignore: unused_field
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;

  ExpenseRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
  );

  @override
  Future<void> saveDraft(ExpenseModel expense) async {
    await _syncManager.enqueueOperation('Expense', expense.id, 'SAVE_DRAFT', jsonEncode(expense.toJson()));
  }
  
  @override
  Future<void> deleteDraft(String id) async {
    await _syncManager.enqueueOperation('Expense', id, 'DELETE_DRAFT', '{}');
  }

  @override
  Future<List<ExpenseModel>> getDrafts() async {
    return [];
  }

  @override
  Future<double> getDaForLocationType(String locationType) async {
    // Simulate mapping from Super Admin Matrix
    switch (locationType) {
      case 'HQ':
        return 200.0;
      case 'Ex-HQ':
        return 300.0;
      case 'Outstation':
        return 500.0;
      case 'Transit':
        return 250.0;
      default:
        return 200.0;
    }
  }
}

final expenseRepositoryProvider = Provider<ExpenseRepository>((ref) {
  return ExpenseRepositoryImpl(
    ref.watch(expenseApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
  );
});
