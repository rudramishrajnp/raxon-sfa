import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/pricing_sales_providers.dart';

class ImportHistoryScreen extends ConsumerWidget {
  const ImportHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final historyAsync = ref.watch(importHistoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Import History'),
      ),
      body: historyAsync.when(
        data: (history) {
          if (history.isEmpty) return const Center(child: Text('No import history found.'));
          return ListView.builder(
            itemCount: history.length,
            itemBuilder: (context, index) {
              final h = history[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            h.fileName,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          Text(DateFormat('dd-MMM-yyyy HH:mm').format(h.importDate)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text('Imported By: ${h.importedBy}'),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildStatColumn('Total', h.totalRecords.toString(), Colors.blue),
                          _buildStatColumn('Success', h.successfulRecords.toString(), Colors.green),
                          _buildStatColumn('Failed', h.failedRecords.toString(), Colors.red),
                        ],
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

  Widget _buildStatColumn(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ],
    );
  }
}
