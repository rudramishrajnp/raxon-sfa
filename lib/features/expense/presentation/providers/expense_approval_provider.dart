import '../../data/repositories/expense_approval_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../domain/repositories/expense_approval_repository.dart';
import '../../data/models/expense_approval_model.dart';
import '../../data/models/expense_payment_model.dart';
import 'expense_approval_state.dart';

class ExpenseApprovalNotifier extends StateNotifier<ExpenseApprovalState> {
  final ExpenseApprovalRepository _repository;

  ExpenseApprovalNotifier(this._repository) : super(ExpenseApprovalInitial());

  Future<void> submitManagerReview({
    required String expenseId,
    required String approverId,
    required String approverRole,
    required String status,
    required double claimAmount,
    double? approvedAmount,
    double? rejectedAmount,
    String? adjustmentReason,
    String? remarks,
  }) async {
    state = ExpenseApprovalLoading();
    try {
      final approval = ExpenseApprovalModel(
        id: const Uuid().v4(),
        expenseId: expenseId,
        approverId: approverId,
        approverRole: approverRole,
        status: status,
        claimAmount: claimAmount,
        approvedAmount: approvedAmount,
        rejectedAmount: rejectedAmount,
        adjustmentReason: adjustmentReason,
        remarks: remarks,
      );

      await _repository.submitApproval(approval);
      
      // Log Audit
      await _repository.logAudit(
        expenseId,
        'Manager Review: $status',
        approverId,
        approverRole,
        details: 'Claimed: $claimAmount, Approved: $approvedAmount',
      );

      // In real app, trigger notification here

      state = ExpenseApprovalSuccess('Expense $status successfully.');
    } catch (e) {
      state = ExpenseApprovalError('Failed to submit review.');
    }
  }

  Future<void> submitFinancePayment({
    required String expenseId,
    required String financeId,
    required String status,
    required String paymentMode,
    String? transactionNumber,
    String? referenceNumber,
  }) async {
    state = ExpenseApprovalLoading();
    try {
      final payment = ExpensePaymentModel(
        id: const Uuid().v4(),
        expenseId: expenseId,
        financeId: financeId,
        paymentDate: DateTime.now(),
        paymentMode: paymentMode,
        transactionNumber: transactionNumber,
        referenceNumber: referenceNumber,
        status: status,
      );

      await _repository.submitPayment(payment);

      // Log Audit
      await _repository.logAudit(
        expenseId,
        'Finance Action: $status',
        financeId,
        'Finance',
        details: 'Mode: $paymentMode',
      );

      // In real app, trigger notification here

      state = ExpenseApprovalSuccess('Payment status updated to $status.');
    } catch (e) {
      state = ExpenseApprovalError('Failed to process payment.');
    }
  }
}

final expenseApprovalNotifierProvider = StateNotifierProvider<ExpenseApprovalNotifier, ExpenseApprovalState>((ref) {
  return ExpenseApprovalNotifier(ref.watch(expenseApprovalRepositoryProvider));
});
