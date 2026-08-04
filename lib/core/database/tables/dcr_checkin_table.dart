import 'package:drift/drift.dart';

@DataClassName('DcrCheckInEntry')
class DcrCheckInTable extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get employeeId => text()();
  TextColumn get customerId => text()();
  DateTimeColumn get date => dateTime()();
  DateTimeColumn get checkInTime => dateTime()();
  RealColumn get latitude => real()();
  RealColumn get longitude => real()();
  RealColumn get accuracy => real()();
  RealColumn get distance => real()();
  TextColumn get deviceId => text().nullable()();
  BoolColumn get isInternetAvailable => boolean().withDefault(const Constant(true))();
  IntColumn get batteryPercentage => integer().nullable()();
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();
  TextColumn get callId => text().nullable()();
}
