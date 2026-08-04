import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/audit_log_providers.dart';

class LoginHistoryScreen extends ConsumerWidget {
  const LoginHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final historyAsync = ref.watch(loginHistoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Login History'),
      ),
      body: historyAsync.when(
        data: (history) {
          if (history.isEmpty) return const Center(child: Text('No login history found.'));
          return ListView.builder(
            itemCount: history.length,
            itemBuilder: (context, index) {
              final h = history[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: Icon(h.isSuccess ? Icons.check_circle : Icons.error, color: h.isSuccess ? Colors.green : Colors.red),
                  title: Text(h.userName, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Device: ${h.deviceName} | IP: ${h.ipAddress}\nTime: ${DateFormat('dd-MMM-yyyy HH:mm:ss').format(h.loginTime)}'),
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
