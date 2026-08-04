import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/attendance_table.dart';
import '../tables/gps_log_table.dart';
import '../tables/sync_queue_table.dart';

part 'attendance_dao.g.dart';

@DriftAccessor(tables: [AttendanceTable, GpsLogTable, SyncQueueTable])
class AttendanceDao extends DatabaseAccessor<AppDatabase> with _$AttendanceDaoMixin {
  AttendanceDao(AppDatabase db) : super(db);

  Future<int> insertAttendance(AttendanceTableCompanion entry) {
    return into(attendanceTable).insert(entry);
  }

  Future<AttendanceEntry?> getLatestAttendance() {
    return (select(attendanceTable)
          ..orderBy([(t) => OrderingTerm.desc(t.createdAt)])
          ..limit(1))
        .getSingleOrNull();
  }
}
