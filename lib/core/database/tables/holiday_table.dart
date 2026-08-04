import 'package:drift/drift.dart';

@DataClassName('HolidayEntry')
class HolidayTable extends Table {
  IntColumn get id => integer().autoIncrement()();
  DateTimeColumn get date => dateTime()();
  TextColumn get name => text()();
  TextColumn get type => text()(); // National, Regional, Company
  TextColumn get regionId => text().nullable()(); // If regional
}
