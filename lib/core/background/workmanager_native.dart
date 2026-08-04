import 'package:flutter/foundation.dart';
import 'package:workmanager/workmanager.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../sync/sync_engine.dart';
import '../database/app_database.dart';
import '../services/connectivity_service.dart';
import '../services/logger_service.dart';
import '../services/notification_service.dart';
import '../sync/queue_manager.dart';
import 'package:dio/dio.dart';

const syncTaskName = "raxon.sync.task";

@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((task, inputData) async {
    try {
      // In a real app, initialize dependency injection or instantiate required services
      // Since Riverpod requires a ProviderContainer or widget tree, we instantiate manually here for background execution.
      final logger = LoggerService();
      final db = AppDatabase();
      final queueManager = QueueManager(db);
      final connectivity = ConnectivityService();
      final notification = NotificationService();
      
      final syncEngine = SyncEngine(
        queueManager,
        connectivity,
        logger,
        notification,
        Dio(), 
        db,
      );
      
      logger.info('Background WorkManager triggered: $task');

      if (task == syncTaskName) {
         await syncEngine.startSync(isManual: false);
      }
      return Future.value(true);
    } catch (e) {
      debugPrint('Background task failed: $e');
      return Future.value(false);
    }
  });
}

class BackgroundSyncManager {
  static Future<void> initialize() async {
    await Workmanager().initialize(
      callbackDispatcher,
      isInDebugMode: kDebugMode,
    );
  }

  static void registerPeriodicSync() {
    Workmanager().registerPeriodicTask(
      "raxon.sync.periodic",
      syncTaskName,
      frequency: const Duration(minutes: 15),
      constraints: Constraints(
        networkType: NetworkType.connected,
        requiresBatteryNotLow: true, // Battery optimization
      ),
    );
  }

  static void registerOneOffSync() {
    Workmanager().registerOneOffTask(
      "raxon.sync.oneoff",
      syncTaskName,
      constraints: Constraints(
        networkType: NetworkType.connected,
      ),
    );
  }
}
