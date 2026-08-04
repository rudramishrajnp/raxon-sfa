import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/sync_queue_table.dart';

part 'sync_queue_dao.g.dart';

@DriftAccessor(tables: [SyncQueueTable])
class SyncQueueDao extends DatabaseAccessor<AppDatabase> with _$SyncQueueDaoMixin {
  SyncQueueDao(AppDatabase db) : super(db);

  Future<int> insertSyncEntry(SyncQueueTableCompanion entry) {
    return into(syncQueueTable).insert(entry);
  }

  Future<List<SyncQueueEntry>> getPendingSyncEntries() {
    return (select(syncQueueTable)..where((t) => t.status.equals(0))).get(); // 0 = pending
  }
  
  Future<void> updateSyncStatus(int id, int status, {String? error, int? retryCount}) {
    return (update(syncQueueTable)..where((t) => t.id.equals(id))).write(
      SyncQueueTableCompanion(
        status: Value(status),
        errorMessage: error != null ? Value(error) : const Value.absent(),
        retryCount: retryCount != null ? Value(retryCount) : const Value.absent(),
      ),
    );
  }
}
