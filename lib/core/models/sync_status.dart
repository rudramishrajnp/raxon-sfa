enum SyncStatus {
  pending,
  inProgress,
  synced,
  failed,
}

extension SyncStatusExtension on SyncStatus {
  int get value {
    switch (this) {
      case SyncStatus.pending: return 0;
      case SyncStatus.inProgress: return 1;
      case SyncStatus.synced: return 2;
      case SyncStatus.failed: return 3;
    }
  }

  static SyncStatus fromValue(int value) {
    switch (value) {
      case 0: return SyncStatus.pending;
      case 1: return SyncStatus.inProgress;
      case 2: return SyncStatus.synced;
      case 3: return SyncStatus.failed;
      default: return SyncStatus.pending;
    }
  }
}
