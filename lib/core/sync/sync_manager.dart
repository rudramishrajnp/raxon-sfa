import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'queue_manager.dart';
import 'sync_engine.dart';

// Adapter to maintain compatibility with existing repositories while
// delegating to the new QueueManager and SyncEngine.
class SyncManager {
  final QueueManager _queueManager;
  final SyncEngine _syncEngine;

  SyncManager(this._queueManager, this._syncEngine);

  Future<void> enqueueOperation(String entityType, String entityId, String operation, String payload) async {
    await _queueManager.enqueue(
      entityType: entityType,
      entityId: entityId,
      operation: operation,
      payload: payload,
    );
  }

  Future<void> processQueue() async {
    await _syncEngine.startSync(isManual: false);
  }
}

final syncManagerProvider = Provider<SyncManager>((ref) {
  return SyncManager(
    ref.watch(queueManagerProvider),
    ref.watch(syncEngineProvider),
  );
});
