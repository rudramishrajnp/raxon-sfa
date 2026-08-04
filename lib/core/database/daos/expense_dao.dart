import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/expense_table.dart';
import '../tables/expense_bill_table.dart';
import '../tables/misc_expense_table.dart';

part 'expense_dao.g.dart';

@DriftAccessor(tables: [ExpenseTable, ExpenseBillTable, MiscExpenseTable])
class ExpenseDao extends DatabaseAccessor<AppDatabase> with _$ExpenseDaoMixin {
  ExpenseDao(AppDatabase db) : super(db);

  Future<int> insertExpense(ExpenseTableCompanion entry) {
    return into(expenseTable).insert(entry);
  }

  Future<List<ExpenseEntry>> getAllExpenses() {
    return select(expenseTable).get();
  }
}
