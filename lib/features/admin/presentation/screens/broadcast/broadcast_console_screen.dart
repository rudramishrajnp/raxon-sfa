import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class BroadcastConsoleScreen extends ConsumerWidget {
  const BroadcastConsoleScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Broadcast Console'),
      ),
      body: GridView.count(
        crossAxisCount: 2,
        padding: const EdgeInsets.all(16),
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        children: [
          _buildCard(
            context,
            icon: Icons.create,
            title: 'Compose Message',
            onTap: () => context.push('/admin/broadcast/compose'),
          ),
          _buildCard(
            context,
            icon: Icons.history,
            title: 'Broadcast History',
            onTap: () => context.push('/admin/broadcast/history'),
          ),
          _buildCard(
            context,
            icon: Icons.analytics,
            title: 'Delivery Tracking',
            onTap: () => context.push('/admin/broadcast/tracking'),
          ),
          _buildCard(
            context,
            icon: Icons.dashboard_customize,
            title: 'Notification Templates',
            onTap: () => context.push('/admin/broadcast/templates'),
          ),
        ],
      ),
    );
  }

  Widget _buildCard(BuildContext context, {required IconData icon, required String title, required VoidCallback onTap}) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 48, color: Theme.of(context).primaryColor),
            const SizedBox(height: 16),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
