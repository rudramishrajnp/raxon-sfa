import 'package:drift/drift.dart';

@DataClassName('GpsLogEntry')
class GpsLogTable extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get eventName => text()(); // e.g., 'BACKGROUND', 'PUNCH_IN', 'CHECK_IN', 'ORDER_BOOKING'
  RealColumn get latitude => real()();
  RealColumn get longitude => real()();
  RealColumn get accuracy => real()();
  DateTimeColumn get timestamp => dateTime()();
  TextColumn get deviceId => text()();
  IntColumn get syncStatus => integer().withDefault(const Constant(0))(); // 0: Pending, 1: Synced
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
}
