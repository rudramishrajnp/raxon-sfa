import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../providers/audit_log_providers.dart';

class AuditLogDashboard extends ConsumerWidget {
  const AuditLogDashboard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final logsAsync = ref.watch(auditLogsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Audit Logs'),
        actions: [
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'login') context.push('/admin/audit/login_history');
              if (value == 'device') context.push('/admin/audit/device_history');
            },
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'login', child: Text('Login History')),
              const PopupMenuItem(value: 'device', child: Text('Device History')),
            ],
          ),
        ],
      ),
      body: logsAsync.when(
        data: (logs) {
          if (logs.isEmpty) return const Center(child: Text('No audit logs found.'));
          return ListView.builder(
            itemCount: logs.length,
            itemBuilder: (context, index) {
              final log = logs[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: const Icon(Icons.security, color: Colors.blueGrey),
                  title: Text(log.action, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('${log.userName} | ${DateFormat('dd-MMM-yyyy HH:mm:ss').format(log.timestamp)}\n${log.details}'),
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
