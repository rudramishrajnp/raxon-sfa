import 'package:drift/drift.dart';

@DataClassName('OverrideRequestEntry')
class OverrideRequestTable extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get employeeId => text()();
  TextColumn get customerId => text()();
  TextColumn get reason => text()();
  TextColumn get note => text().nullable()();
  TextColumn get photoPath => text().nullable()();
  RealColumn get latitude => real()();
  RealColumn get longitude => real()();
  DateTimeColumn get timestamp => dateTime().withDefault(currentDateAndTime)();
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();
}
