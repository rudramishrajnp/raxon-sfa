import 'package:drift/drift.dart';

@DataClassName('AttendanceEntry')
class AttendanceTable extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get employeeId => text()();
  DateTimeColumn get date => dateTime()();
  DateTimeColumn get punchInTime => dateTime()();
  RealColumn get latitude => real()();
  RealColumn get longitude => real()();
  RealColumn get accuracy => real()();
  TextColumn get deviceId => text()();
  IntColumn get batteryPercentage => integer()();
  TextColumn get networkType => text()();
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
}
