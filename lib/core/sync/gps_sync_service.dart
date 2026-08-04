import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:drift/drift.dart';
import 'dart:convert';
import '../database/app_database.dart';
import 'queue_manager.dart';
import '../services/logger_service.dart';

class GpsSyncService {
  final AppDatabase _db;
  final QueueManager _queueManager;
  final LoggerService _logger;

  GpsSyncService(this._db, this._queueManager, this._logger);

  Future<void> queueGpsLogForSync(int logId) async {
    // 1. Fetch GPS Log from DB
    final log = await (_db.select(_db.gpsLogTable)..where((t) => t.id.equals(logId))).getSingleOrNull();
    
    if (log == null) {
      _logger.warning('Failed to queue GPS Log for sync. ID not found: $logId');
      return;
    }

    // 2. Prepare payload
    final payload = jsonEncode({
      'id': log.id,
      'latitude': log.latitude,
      'longitude': log.longitude,
      'timestamp': log.timestamp.toIso8601String(),
      'type': log.eventName, // Punch In, Punch Out, Breadcrumb, Check In, etc.
      'deviceId': log.deviceId,
    });

    // 3. Enqueue operation
    await _queueManager.enqueue(
      entityType: 'GpsEvent',
      entityId: log.id.toString(),
      operation: 'CREATE',
      payload: payload,
    );
    
    _logger.info('Queued GPS Log $logId for sync.');
  }
}

final gpsSyncServiceProvider = Provider<GpsSyncService>((ref) {
  return GpsSyncService(
    ref.watch(databaseProvider),
    ref.watch(queueManagerProvider),
    ref.watch(loggerServiceProvider),
  );
});
