import 'package:drift/drift.dart';

@DataClassName('DeviationEntry')
class DeviationTable extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get employeeId => text()();
  TextColumn get customerId => text()();
  TextColumn get reason => text()();
  TextColumn get remarks => text().nullable()();
  DateTimeColumn get deviationDate => dateTime().withDefault(currentDateAndTime)();
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();
}
