import 'package:drift/drift.dart';

@DataClassName('ExpenseAuditEntry')
class ExpenseAuditTable extends Table {
  TextColumn get id => text()();
  TextColumn get expenseId => text()();
  TextColumn get action => text()(); 
  TextColumn get performedBy => text()(); // User ID
  TextColumn get role => text()(); // Role of user performing action
  TextColumn get timestamp => text()();
  TextColumn get deviceId => text().nullable()();
  TextColumn get details => text().nullable()(); // JSON string or text for details
  
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {id};
}
