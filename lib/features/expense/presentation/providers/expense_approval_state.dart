abstract class ExpenseApprovalState {}

class ExpenseApprovalInitial extends ExpenseApprovalState {}
class ExpenseApprovalLoading extends ExpenseApprovalState {}
class ExpenseApprovalSuccess extends ExpenseApprovalState {
  final String message;
  ExpenseApprovalSuccess(this.message);
}
class ExpenseApprovalError extends ExpenseApprovalState {
  final String message;
  ExpenseApprovalError(this.message);
}
