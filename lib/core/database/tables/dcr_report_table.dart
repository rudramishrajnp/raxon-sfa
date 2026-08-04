import 'package:drift/drift.dart';

@DataClassName('DcrReportEntry')
class DcrReportTable extends Table {
  TextColumn get checkInId => text()();
  TextColumn get customerId => text()();
  TextColumn get samplingData => text().nullable()(); // JSON
  TextColumn get prescriptionData => text().nullable()(); // JSON
  TextColumn get orderData => text().nullable()(); // JSON
  TextColumn get summaryData => text().nullable()(); // JSON
  BoolColumn get isDraft => boolean().withDefault(const Constant(true))();
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {checkInId};
}
