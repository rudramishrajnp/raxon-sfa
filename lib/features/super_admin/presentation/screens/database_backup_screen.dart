import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/super_admin_providers.dart';

class DatabaseBackupScreen extends ConsumerWidget {
  const DatabaseBackupScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final backupsAsync = ref.watch(backupHistoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Database & Backups'),
        actions: [
          IconButton(icon: const Icon(Icons.backup), onPressed: () {}), // Trigger manual backup
        ],
      ),
      body: backupsAsync.when(
        data: (backups) {
          if (backups.isEmpty) return const Center(child: Text('No backups found.'));
          return ListView.builder(
            itemCount: backups.length,
            itemBuilder: (context, index) {
              final backup = backups[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: const Icon(Icons.storage, color: Colors.blue),
                  title: Text(DateFormat('dd-MMM-yyyy HH:mm:ss').format(backup.backupTime), style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Size: ${backup.size} | Status: ${backup.status}'),
                  trailing: TextButton.icon(
                    onPressed: () {}, // Restore
                    icon: const Icon(Icons.restore),
                    label: const Text('Restore'),
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
