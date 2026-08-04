import 'package:drift/drift.dart';

@DataClassName('DcrSubmissionEntry')
class DcrSubmissionTable extends Table {
  TextColumn get dcrId => text()();
  TextColumn get checkInId => text()();
  TextColumn get customerId => text()();
  DateTimeColumn get submissionTime => dateTime()();
  BoolColumn get isJointWork => boolean().withDefault(const Constant(false))();
  TextColumn get taggedManagers => text().nullable()(); // JSON list
  BoolColumn get isLocked => boolean().withDefault(const Constant(true))();
  
  // Audit Trail
  TextColumn get createdBy => text()();
  TextColumn get deviceId => text().nullable()();
  TextColumn get appVersion => text().nullable()();
  RealColumn get latitude => real()();
  RealColumn get longitude => real()();
  
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {dcrId};
}
