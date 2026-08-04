import 'package:drift/drift.dart';

@DataClassName('MtpEntry')
class MtpTable extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get employeeId => text()();
  IntColumn get month => integer()();
  IntColumn get year => integer()();
  TextColumn get status => text().withDefault(const Constant('DRAFT'))();
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
}

@DataClassName('MtpDayEntry')
class MtpDayTable extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get mtpId => integer().customConstraint('REFERENCES mtp_table(id)')();
  DateTimeColumn get date => dateTime()();
  TextColumn get workType => text()(); // Field Work, Campaign, Meeting, Leave
  TextColumn get locationType => text()(); // HQ, Ex-HQ, Outstation, Transit
  TextColumn get notes => text().nullable()();
}

@DataClassName('MtpDoctorEntry')
class MtpDoctorTable extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get mtpDayId => integer().customConstraint('REFERENCES mtp_day_table(id)')();
  TextColumn get doctorId => text()();
  TextColumn get doctorName => text()();
  TextColumn get specialty => text()();
}
