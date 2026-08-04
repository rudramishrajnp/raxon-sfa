import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:drift/drift.dart';
import '../database/app_database.dart';
import 'sync_priority.dart';

class QueueManager {
  final AppDatabase _db;

  QueueManager(this._db);

  Future<void> enqueue({
    required String entityType,
    required String entityId,
    required String operation,
    required String payload,
  }) async {
    final priority = SyncPriority.fromEntityType(entityType);
    
    // Using default sync queue table properties, though an updated schema with priority would be ideal.
    // For now, we reuse the existing table. 
    await _db.syncQueueDao.insertSyncEntry(
      SyncQueueTableCompanion.insert(
        entityType: entityType,
        entityId: entityId,
        operation: operation,
        payload: payload,
        status: const Value(0), // 0 = Pending
      ),
    );
  }

  Future<List<SyncQueueEntry>> getPendingOperations() async {
    // In a real priority queue, we'd order by priority then date.
    // Here we'll fetch pending and sort them in Dart.
    final entries = await _db.syncQueueDao.getPendingSyncEntries();
    
    final sortedEntries = List<SyncQueueEntry>.from(entries);
    sortedEntries.sort((a, b) {
      final priorityA = SyncPriority.fromEntityType(a.entityType).value;
      final priorityB = SyncPriority.fromEntityType(b.entityType).value;
      if (priorityA != priorityB) {
        return priorityB.compareTo(priorityA); // Highest first
      }
      return a.createdAt.compareTo(b.createdAt); // Oldest first
    });
    
    return sortedEntries;
  }
  
  Future<List<SyncQueueEntry>> getFailedOperations() async {
    // Fetch operations where status is failed (e.g. status = 2)
    return (await _db.select(_db.syncQueueTable)..where((t) => t.status.equals(2))).get();
  }

  Future<List<SyncQueueEntry>> getCompletedOperations() async {
    // Fetch operations where status is synced (e.g. status = 1)
    return (await _db.select(_db.syncQueueTable)..where((t) => t.status.equals(1))).get();
  }

  Future<void> markAsSynced(int id) async {
    await _db.syncQueueDao.updateSyncStatus(id, 1);
  }

  Future<void> markAsFailed(int id, String error, int retryCount) async {
    // Status 2 for permanently failed
    await _db.syncQueueDao.updateSyncStatus(id, 2, error: error, retryCount: retryCount);
  }

  Future<void> updateRetry(int id, String error, int retryCount) async {
    await _db.syncQueueDao.updateSyncStatus(id, 0, error: error, retryCount: retryCount);
  }

  Future<void> clearCompleted() async {
    await (_db.delete(_db.syncQueueTable)..where((t) => t.status.equals(1))).go();
  }
}

final queueManagerProvider = Provider<QueueManager>((ref) {
  return QueueManager(ref.watch(databaseProvider));
});
