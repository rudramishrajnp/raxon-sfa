import 'package:drift/drift.dart';

@DataClassName('ExpenseApprovalEntry')
class ExpenseApprovalTable extends Table {
  TextColumn get id => text()();
  TextColumn get expenseId => text()();
  TextColumn get approverId => text()();
  TextColumn get approverRole => text()();
  TextColumn get status => text()(); // Approved, Rejected, Returned, Partially Approved
  
  RealColumn get claimAmount => real()();
  RealColumn get approvedAmount => real().nullable()();
  RealColumn get rejectedAmount => real().nullable()();
  TextColumn get adjustmentReason => text().nullable()();
  TextColumn get remarks => text().nullable()();
  
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {id};
}
