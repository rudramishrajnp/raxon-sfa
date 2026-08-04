import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/mtp_tables.dart';

part 'mtp_dao.g.dart';

@DriftAccessor(tables: [MtpTable, MtpDayTable, MtpDoctorTable])
class MtpDao extends DatabaseAccessor<AppDatabase> with _$MtpDaoMixin {
  MtpDao(AppDatabase db) : super(db);

  Future<int> insertMtp(MtpTableCompanion entry) {
    return into(mtpTable).insert(entry);
  }

  Future<List<MtpEntry>> getAllMtps() {
    return select(mtpTable).get();
  }
}
