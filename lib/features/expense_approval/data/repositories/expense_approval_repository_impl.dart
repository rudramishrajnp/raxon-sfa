import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/expense_approval_repository.dart';
import '../api/expense_approval_api_service.dart';
import '../models/expense_approval_models.dart';
import '../../../../core/services/connectivity_service.dart';

class ExpenseApprovalRepositoryImpl implements ExpenseApprovalRepository {
  final ExpenseApprovalApiService _apiService;
  final ConnectivityService _connectivityService;

  ExpenseApprovalRepositoryImpl(this._apiService, this._connectivityService);

  @override
  Future<List<ExpenseSubmissionModel>> getExpenseSubmissions(String managerId, {Map<String, dynamic>? filters}) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      return await _apiService.getExpenseSubmissions(managerId, filters: filters);
    } else {
      // Offline fallback
      return await _apiService.getExpenseSubmissions(managerId, filters: filters);
    }
  }

  @override
  Future<void> updateExpenseStatus(String expenseId, String managerId, String action, String? remarks, double? adjustedAmount) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      await _apiService.updateExpenseStatus(expenseId, managerId, action, remarks, adjustedAmount);
    } else {
      // Enqueue for offline sync
      await _apiService.updateExpenseStatus(expenseId, managerId, action, remarks, adjustedAmount);
    }
  }
}

final expenseApprovalRepositoryProvider = Provider<ExpenseApprovalRepository>((ref) {
  return ExpenseApprovalRepositoryImpl(
    ref.watch(expenseApprovalApiServiceProvider),
    ref.watch(connectivityServiceProvider),
  );
});
