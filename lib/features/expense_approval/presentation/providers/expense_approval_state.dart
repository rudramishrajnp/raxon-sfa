import '../../data/models/expense_approval_models.dart';

abstract class ExpenseApprovalState {}

class ExpenseApprovalInitial extends ExpenseApprovalState {}
class ExpenseApprovalLoading extends ExpenseApprovalState {}
class ExpenseApprovalLoaded extends ExpenseApprovalState {
  final List<ExpenseSubmissionModel> submissions;
  final bool isOfflineData;
  
  ExpenseApprovalLoaded({
    required this.submissions,
    this.isOfflineData = false,
  });
}
class ExpenseApprovalError extends ExpenseApprovalState {
  final String message;
  ExpenseApprovalError(this.message);
}
