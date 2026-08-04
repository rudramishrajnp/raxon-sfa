import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/analytics_providers.dart';
import 'package:raxon_sfa/core/services/logger_service.dart';
import 'package:raxon_sfa/features/admin/data/services/export_service.dart';

class ReportCenterScreen extends ConsumerWidget {
  const ReportCenterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final reportConfigsAsync = ref.watch(reportConfigsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Report Center'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.push('/admin/reports/builder'),
          ),
        ],
      ),
      body: reportConfigsAsync.when(
        data: (configs) {
          if (configs.isEmpty) return const Center(child: Text('No reports configured.'));
          return ListView.builder(
            itemCount: configs.length,
            itemBuilder: (context, index) {
              final config = configs[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: const Icon(Icons.insert_chart),
                  title: Text(config.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Type: ${config.type} | Schedule: ${config.schedule}'),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.download, color: Colors.blue),
                        onPressed: () async {
                          ref.read(loggerServiceProvider).logAudit(
                            action: 'EXPORT_REPORT',
                            entityType: 'Report',
                            entityId: config.id,
                            userId: 'Admin',
                          );
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Generating Export...')));
                          await ref.read(exportServiceProvider).exportReport(config.name, 'PDF');
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Export Downloaded.')));
                          }
                        },
                      ),
                    ],
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
