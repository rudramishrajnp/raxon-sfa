import '../../data/models/misc_expense_model.dart';

abstract class ExpenseState {}

class ExpenseInitial extends ExpenseState {}

class ExpenseLoading extends ExpenseState {}

class ExpenseLoaded extends ExpenseState {
  final DateTime date;
  final String locationType;
  final double daAmount;
  
  final String taType;
  final double taDistance;
  final double taRate;
  final double taAmount;
  
  final List<MiscExpenseModel> miscExpenses;
  
  final double grandTotal;

  ExpenseLoaded({
    required this.date,
    required this.locationType,
    required this.daAmount,
    required this.taType,
    required this.taDistance,
    required this.taRate,
    required this.taAmount,
    required this.miscExpenses,
    required this.grandTotal,
  });
}

class ExpenseSuccess extends ExpenseState {
  final String message;
  ExpenseSuccess(this.message);
}

class ExpenseError extends ExpenseState {
  final String message;
  ExpenseError(this.message);
}
