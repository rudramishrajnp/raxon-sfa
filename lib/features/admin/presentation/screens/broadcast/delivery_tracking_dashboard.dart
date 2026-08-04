import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/holiday_broadcast_providers.dart';

class DeliveryTrackingDashboard extends ConsumerWidget {
  const DeliveryTrackingDashboard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // For demo purposes, we fetch the tracking for a hardcoded ID or show a generic summary.
    final trackingAsync = ref.watch(deliveryTrackingProvider('b1'));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Delivery Tracking'),
      ),
      body: trackingAsync.when(
        data: (tracking) {
          if (tracking == null) return const Center(child: Text('No tracking data.'));
          
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Broadcast: Monthly Sales Meeting', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 24),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 1.5,
                  children: [
                    _buildKpiCard('Total Sent', tracking.totalSent.toString(), Colors.blue),
                    _buildKpiCard('Delivered', tracking.totalDelivered.toString(), Colors.green),
                    _buildKpiCard('Read', tracking.totalRead.toString(), Colors.purple),
                    _buildKpiCard('Acknowledged', tracking.totalAcknowledged.toString(), Colors.orange),
                    _buildKpiCard('Failed', tracking.totalFailed.toString(), Colors.red),
                  ],
                ),
                const SizedBox(height: 32),
                const Text('Delivery Rates', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                LinearProgressIndicator(
                  value: tracking.totalSent > 0 ? tracking.totalDelivered / tracking.totalSent : 0,
                  minHeight: 12,
                  color: Colors.green,
                  backgroundColor: Colors.grey.shade300,
                ),
                const SizedBox(height: 8),
                Text('Delivered: ${tracking.totalSent > 0 ? ((tracking.totalDelivered / tracking.totalSent) * 100).toStringAsFixed(1) : 0}%'),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }

  Widget _buildKpiCard(String title, String value, Color color) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 8),
            Text(title, textAlign: TextAlign.center, style: const TextStyle(fontSize: 14)),
          ],
        ),
      ),
    );
  }
}
