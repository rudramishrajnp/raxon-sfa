import 'package:drift/drift.dart';

@DataClassName('MiscExpenseEntry')
class MiscExpenseTable extends Table {
  TextColumn get id => text()();
  TextColumn get expenseId => text()(); // FK to ExpenseTable
  TextColumn get category => text()(); // Stationery, Local Transport, Parking, Food, Courier, Hotel, Other
  RealColumn get amount => real().withDefault(const Constant(0.0))();
  TextColumn get remarks => text().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
