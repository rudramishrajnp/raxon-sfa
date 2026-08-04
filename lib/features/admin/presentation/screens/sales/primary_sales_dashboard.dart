import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/pricing_sales_providers.dart';

class PrimarySalesDashboardScreen extends ConsumerWidget {
  const PrimarySalesDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final salesAsync = ref.watch(primarySalesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Primary Sales Dashboard'),
      ),
      body: salesAsync.when(
        data: (salesList) {
          final totalSalesValue = salesList.fold(0.0, (sum, item) => sum + item.netAmount);
          final totalQuantity = salesList.fold(0, (sum, item) => sum + item.quantity);
          final totalFreeQuantity = salesList.fold(0, (sum, item) => sum + item.freeQuantity);

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 1.5,
                  children: [
                    _buildKpiCard('Total Invoices', '${salesList.length}', Colors.blue),
                    _buildKpiCard('Total Sales Value', '₹${totalSalesValue.toStringAsFixed(2)}', Colors.green),
                    _buildKpiCard('Total Quantity', '$totalQuantity', Colors.orange),
                    _buildKpiCard('Total Free Qty', '$totalFreeQuantity', Colors.purple),
                  ],
                ),
                const SizedBox(height: 32),
                const Text('Recent Invoices', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: salesList.take(5).length,
                  itemBuilder: (context, index) {
                    final invoice = salesList[index];
                    return Card(
                      child: ListTile(
                        leading: const Icon(Icons.receipt),
                        title: Text(invoice.invoiceNumber),
                        subtitle: Text('${invoice.distributorName}\n₹${invoice.netAmount.toStringAsFixed(2)}'),
                        isThreeLine: true,
                      ),
                    );
                  },
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

  Widget _buildKpiCard(String title, String value, Color color) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 8),
            Text(title, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
