import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/analytics_providers.dart';

class ExecutiveDashboard extends ConsumerWidget {
  const ExecutiveDashboard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final kpisAsync = ref.watch(executiveKpisProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Executive Dashboard'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: () => ref.refresh(executiveKpisProvider)),
        ],
      ),
      body: kpisAsync.when(
        data: (kpis) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSectionTitle('Employee Overview'),
                GridView.count(
                  crossAxisCount: 3,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                  childAspectRatio: 1.5,
                  children: [
                    _buildKpiCard('Total Employees', '${kpis.totalEmployees}', Colors.blue),
                    _buildKpiCard('Present', '${kpis.present}', Colors.green),
                    _buildKpiCard('On Leave/Absent', '${kpis.onLeave + kpis.absent}', Colors.orange),
                  ],
                ),
                const SizedBox(height: 16),
                _buildSectionTitle('Coverage (Doctors, Chemists, Stockists)'),
                GridView.count(
                  crossAxisCount: 3,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                  childAspectRatio: 1.5,
                  children: [
                    _buildKpiCard('Doctors', '${kpis.totalDoctors}', Colors.indigo),
                    _buildKpiCard('Chemists', '${kpis.totalChemists}', Colors.teal),
                    _buildKpiCard('Stockists', '${kpis.totalStockists}', Colors.cyan),
                  ],
                ),
                const SizedBox(height: 16),
                _buildSectionTitle('Call Productivity'),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                  childAspectRatio: 2,
                  children: [
                    _buildKpiCard('Total Calls', '${kpis.totalCalls}', Colors.deepPurple),
                    _buildKpiCard('Productive Calls', '${kpis.productiveCalls}', Colors.purple),
                  ],
                ),
                const SizedBox(height: 16),
                _buildSectionTitle('Financial Overview'),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                  childAspectRatio: 2,
                  children: [
                    _buildKpiCard('Primary Sales', '₹${(kpis.primarySales/100000).toStringAsFixed(2)} L', Colors.green.shade700),
                    _buildKpiCard('Secondary Sales', '₹${(kpis.secondarySales/100000).toStringAsFixed(2)} L', Colors.lightGreen.shade700),
                    _buildKpiCard('Total Expenses', '₹${(kpis.totalExpenses/100000).toStringAsFixed(2)} L', Colors.red.shade700),
                    _buildKpiCard('Collection', '₹${(kpis.collection/100000).toStringAsFixed(2)} L', Colors.amber.shade700),
                  ],
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Text(
        title,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildKpiCard(String title, String value, Color color) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 4),
            Text(title, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
