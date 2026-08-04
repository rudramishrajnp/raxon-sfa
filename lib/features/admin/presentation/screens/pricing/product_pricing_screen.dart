import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/pricing_sales_providers.dart';

class ProductPricingScreen extends ConsumerWidget {
  const ProductPricingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pricingAsync = ref.watch(productPricingProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Product Pricing Matrix'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
        ],
      ),
      body: pricingAsync.when(
        data: (pricingList) {
          if (pricingList.isEmpty) return const Center(child: Text('No pricing records found.'));
          return SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              columns: const [
                DataColumn(label: Text('Product')),
                DataColumn(label: Text('MRP')),
                DataColumn(label: Text('PTR')),
                DataColumn(label: Text('PTS')),
                DataColumn(label: Text('Distributor Price')),
                DataColumn(label: Text('Effective From')),
                DataColumn(label: Text('Actions')),
              ],
              rows: pricingList.map((pricing) => DataRow(
                cells: [
                  DataCell(Text(pricing.productName)),
                  DataCell(Text('₹${pricing.mrp}')),
                  DataCell(Text('₹${pricing.ptr}')),
                  DataCell(Text('₹${pricing.pts}')),
                  DataCell(Text('₹${pricing.distributorPrice}')),
                  DataCell(Text(DateFormat('dd-MMM-yyyy').format(pricing.effectiveFrom))),
                  DataCell(
                    IconButton(
                      icon: const Icon(Icons.edit, color: Colors.blue),
                      onPressed: () {
                        // Edit pricing logic
                      },
                    ),
                  ),
                ],
              )).toList(),
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.add),
      ),
    );
  }
}
