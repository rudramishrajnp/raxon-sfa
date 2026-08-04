import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/dcr_checkin_table.dart';
import '../tables/dcr_checkout_table.dart';
import '../tables/dcr_report_table.dart';
import '../tables/dcr_submission_table.dart';

part 'dcr_dao.g.dart';

@DriftAccessor(tables: [DcrCheckInTable, DcrCheckOutTable, DcrReportTable, DcrSubmissionTable])
class DcrDao extends DatabaseAccessor<AppDatabase> with _$DcrDaoMixin {
  DcrDao(AppDatabase db) : super(db);

  Future<int> insertDcrCheckIn(DcrCheckInTableCompanion entry) {
    return into(dcrCheckInTable).insert(entry);
  }

  Future<int> insertDcrCheckOut(DcrCheckOutTableCompanion entry) {
    return into(dcrCheckOutTable).insert(entry);
  }

  Future<DcrCheckInEntry?> getCheckInById(int id) {
    return (select(dcrCheckInTable)..where((t) => t.id.equals(id))).getSingleOrNull();
  }

  Future<void> updateCheckInCallId(int id, String callId) async {
    await (update(dcrCheckInTable)..where((t) => t.id.equals(id))).write(
      DcrCheckInTableCompanion(
        callId: Value(callId),
        syncStatus: const Value(1),
      ),
    );
  }
}
