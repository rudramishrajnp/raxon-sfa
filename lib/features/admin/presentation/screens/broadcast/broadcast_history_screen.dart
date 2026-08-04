import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/holiday_broadcast_providers.dart';
import 'package:go_router/go_router.dart';

class BroadcastHistoryScreen extends ConsumerWidget {
  const BroadcastHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final broadcastsAsync = ref.watch(broadcastsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Broadcast History'),
      ),
      body: broadcastsAsync.when(
        data: (broadcasts) {
          if (broadcasts.isEmpty) return const Center(child: Text('No broadcasts found.'));
          return ListView.builder(
            itemCount: broadcasts.length,
            itemBuilder: (context, index) {
              final b = broadcasts[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  title: Text(b.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(
                    '${DateFormat('dd-MMM-yyyy HH:mm').format(b.createdAt)}\nAudience: ${b.targetAudience} | Category: ${b.category}',
                  ),
                  isThreeLine: true,
                  onTap: () {
                    // Navigate to delivery tracking for this broadcast
                  },
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
