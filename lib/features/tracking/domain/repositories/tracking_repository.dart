abstract class TrackingRepository {
  /// Save an event-based or background location update
  Future<void> saveLocationEvent({
    required String eventName,
    required double latitude,
    required double longitude,
    required double accuracy,
    required DateTime timestamp,
  });

  /// Sync all pending logs from local database to remote server
  Future<void> syncPendingLogs();
}
