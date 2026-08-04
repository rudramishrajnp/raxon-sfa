import 'package:drift/drift.dart';

@DataClassName('DcrCheckOutEntry')
class DcrCheckOutTable extends Table {
  TextColumn get checkInId => text()();
  TextColumn get customerId => text()();
  DateTimeColumn get checkInTime => dateTime()();
  DateTimeColumn get checkOutTime => dateTime()();
  IntColumn get visitDurationMinutes => integer()();
  RealColumn get latitude => real()();
  RealColumn get longitude => real()();
  RealColumn get accuracy => real()();
  RealColumn get distance => real()();
  TextColumn get callStatus => text()();
  TextColumn get doctorMood => text().nullable()();
  TextColumn get productInterest => text().nullable()();
  TextColumn get competitorActivity => text().nullable()();
  TextColumn get newOpportunity => text().nullable()();
  TextColumn get complaint => text().nullable()();
  BoolColumn get followUpRequired => boolean().withDefault(const Constant(false))();
  TextColumn get nextVisitNotes => text().nullable()();
  TextColumn get remarks => text().nullable()();
  BoolColumn get isInternetAvailable => boolean().withDefault(const Constant(true))();
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {checkInId};
}
