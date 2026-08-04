import 'package:drift/drift.dart';

@DataClassName('ExpensePaymentEntry')
class ExpensePaymentTable extends Table {
  TextColumn get id => text()();
  TextColumn get expenseId => text()();
  TextColumn get financeId => text()();
  
  TextColumn get paymentDate => text()();
  TextColumn get paymentMode => text()(); // Cash, Bank Transfer, UPI, Cheque, Other
  TextColumn get transactionNumber => text().nullable()();
  TextColumn get referenceNumber => text().nullable()();
  TextColumn get status => text()(); // Paid, Hold, Failed
  
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {id};
}
