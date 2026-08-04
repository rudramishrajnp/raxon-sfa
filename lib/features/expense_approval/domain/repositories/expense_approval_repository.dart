import '../../data/models/expense_approval_models.dart';

abstract class ExpenseApprovalRepository {
  Future<List<ExpenseSubmissionModel>> getExpenseSubmissions(String managerId, {Map<String, dynamic>? filters});
  Future<void> updateExpenseStatus(String expenseId, String managerId, String action, String? remarks, double? adjustedAmount);
}
