import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/sync/queue_manager.dart';
import '../../../../core/sync/sync_engine.dart';
import '../../../../core/database/app_database.dart';

class SyncCenterState {
  final List<SyncQueueEntry> pending;
  final List<SyncQueueEntry> completed;
  final List<SyncQueueEntry> failed;
  final bool isSyncing;

  SyncCenterState({
    this.pending = const [],
    this.completed = const [],
    this.failed = const [],
    this.isSyncing = false,
  });

  SyncCenterState copyWith({
    List<SyncQueueEntry>? pending,
    List<SyncQueueEntry>? completed,
    List<SyncQueueEntry>? failed,
    bool? isSyncing,
  }) {
    return SyncCenterState(
      pending: pending ?? this.pending,
      completed: completed ?? this.completed,
      failed: failed ?? this.failed,
      isSyncing: isSyncing ?? this.isSyncing,
    );
  }
}

class SyncCenterNotifier extends StateNotifier<SyncCenterState> {
  final QueueManager _queueManager;
  final SyncEngine _syncEngine;

  SyncCenterNotifier(this._queueManager, this._syncEngine) : super(SyncCenterState()) {
    loadData();
  }

  Future<void> loadData() async {
    final pending = await _queueManager.getPendingOperations();
    final completed = await _queueManager.getCompletedOperations();
    final failed = await _queueManager.getFailedOperations();
    
    state = state.copyWith(
      pending: pending,
      completed: completed,
      failed: failed,
    );
  }

  Future<void> startManualSync() async {
    state = state.copyWith(isSyncing: true);
    await _syncEngine.startSync(isManual: true);
    await loadData();
    state = state.copyWith(isSyncing: false);
  }

  Future<void> clearCompleted() async {
    await _queueManager.clearCompleted();
    await loadData();
  }
}

final syncCenterProvider = StateNotifierProvider<SyncCenterNotifier, SyncCenterState>((ref) {
  return SyncCenterNotifier(
    ref.watch(queueManagerProvider),
    ref.watch(syncEngineProvider),
  );
});
