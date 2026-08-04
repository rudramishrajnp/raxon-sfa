import '../../data/models/expense_model.dart';
import '../../data/models/misc_expense_model.dart';

class ExpenseValidator {
  final List<String> validCategories = [
    'Stationery', 'Local Transport', 'Parking', 'Food', 'Courier', 'Hotel', 'Other'
  ];

  String? validateMiscExpense(MiscExpenseModel misc) {
    if (misc.amount < 0) return 'Amount cannot be negative.';
    if (!validCategories.contains(misc.category)) return 'Invalid category selected.';
    return null;
  }

  String? validateExpense(ExpenseModel expense) {
    if (expense.taDistance < 0) return 'TA Distance cannot be negative.';
    if (expense.taAmount < 0) return 'TA Amount cannot be negative.';
    
    for (var misc in expense.miscExpenses) {
      final error = validateMiscExpense(misc);
      if (error != null) {
        return '${misc.category}: $error';
      }
    }
    
    return null;
  }
}
