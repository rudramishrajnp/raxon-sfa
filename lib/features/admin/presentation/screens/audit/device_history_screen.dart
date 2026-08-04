import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/audit_log_providers.dart';

class DeviceHistoryScreen extends ConsumerWidget {
  const DeviceHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final historyAsync = ref.watch(deviceHistoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Device History'),
      ),
      body: historyAsync.when(
        data: (history) {
          if (history.isEmpty) return const Center(child: Text('No device history found.'));
          return ListView.builder(
            itemCount: history.length,
            itemBuilder: (context, index) {
              final h = history[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: const Icon(Icons.smartphone, color: Colors.blue),
                  title: Text('${h.deviceModel} (${h.osVersion})', style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('User: ${h.userName}\nLast Sync: ${DateFormat('dd-MMM-yyyy HH:mm:ss').format(h.lastSync)}'),
                  isThreeLine: true,
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
