import 'package:drift/drift.dart';

@DataClassName('JointWorkEntry')
class JointWorkTable extends Table {
  IntColumn get id => integer().autoIncrement()();
  DateTimeColumn get date => dateTime()();
  TextColumn get managerId => text()();
  TextColumn get managerName => text()();
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();
}
