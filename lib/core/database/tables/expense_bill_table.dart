import 'package:drift/drift.dart';

@DataClassName('ExpenseBillEntry')
class ExpenseBillTable extends Table {
  TextColumn get id => text()();
  TextColumn get expenseId => text()();
  TextColumn get filePath => text()();
  TextColumn get fileName => text()();
  TextColumn get fileType => text()(); // JPG, PNG, PDF
  IntColumn get fileSize => integer()();
  
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {id};
}
