import '../../data/models/expense_approval_model.dart';
import '../../data/models/expense_payment_model.dart';

abstract class ExpenseApprovalRepository {
  Future<void> submitApproval(ExpenseApprovalModel approval);
  Future<void> submitPayment(ExpensePaymentModel payment);
  Future<void> logAudit(String expenseId, String action, String performedBy, String role, {String? details});
}
