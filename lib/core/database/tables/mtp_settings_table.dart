import 'package:drift/drift.dart';

@DataClassName('MtpSettingsEntry')
class MtpSettingsTable extends Table {
  TextColumn get id => text()(); // Single row, e.g., 'DEFAULT'
  IntColumn get submissionDeadlineDay => integer().withDefault(const Constant(25))();
  IntColumn get provisionalApprovalEndDay => integer().withDefault(const Constant(2))();
  @override
  Set<Column> get primaryKey => {id};
}
