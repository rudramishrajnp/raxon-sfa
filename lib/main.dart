import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'app.dart';
import 'package:raxon_sfa/core/background/workmanager_init.dart';
import 'core/storage/local_storage_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize core services here in the future (Firebase, local DB, etc.)
  final sharedPreferences = await SharedPreferences.getInstance();
  
  await BackgroundSyncManager.initialize();
  BackgroundSyncManager.registerPeriodicSync();

  runApp(
    ProviderScope(
      overrides: [
        sharedPrefsProvider.overrideWithValue(sharedPreferences),
      ],
      child: const RaxonApp(),
    ),
  );
}
