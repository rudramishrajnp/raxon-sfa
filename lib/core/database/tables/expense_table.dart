import 'package:drift/drift.dart';

@DataClassName('ExpenseEntry')
class ExpenseTable extends Table {
  TextColumn get id => text()();
  DateTimeColumn get date => dateTime()();
  TextColumn get locationType => text()(); // HQ, Ex-HQ, Outstation, Transit
  
  // DA (Read-only mapped from Admin matrix)
  RealColumn get daAmount => real().withDefault(const Constant(0.0))();
  
  // TA (Fixed or Per KM)
  TextColumn get taType => text()(); // Fixed, PerKM
  RealColumn get taDistance => real().withDefault(const Constant(0.0))();
  RealColumn get taRate => real().withDefault(const Constant(0.0))();
  RealColumn get taAmount => real().withDefault(const Constant(0.0))();
  
  // Totals
  RealColumn get miscTotal => real().withDefault(const Constant(0.0))();
  RealColumn get grandTotal => real().withDefault(const Constant(0.0))();
  
  TextColumn get status => text().withDefault(const Constant('Draft'))(); // Draft, PendingSync, Submitted, Approved, Rejected
  
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {id};
}
