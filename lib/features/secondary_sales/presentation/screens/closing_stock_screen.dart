import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';

class ClosingStockScreen extends StatefulWidget {
  const ClosingStockScreen({super.key});

  @override
  State<ClosingStockScreen> createState() => _ClosingStockScreenState();
}

class _ClosingStockScreenState extends State<ClosingStockScreen> {
  String _customerType = 'Retailer';
  String _entryType = 'Monthly';
  final _searchController = TextEditingController();

  // Mock list for UI presentation
  final List<Map<String, String>> _customers = [
    {'id': '1', 'name': 'Apollo Pharmacy', 'city': 'Mumbai', 'area': 'Andheri'},
    {'id': '2', 'name': 'Wellness Forever', 'city': 'Mumbai', 'area': 'Bandra'},
    {'id': '3', 'name': 'National Distributors', 'city': 'Pune', 'area': 'Deccan'},
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Secondary Sales & Stock')),
      body: Padding(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          children: [
            _buildFilters(),
            AppSizes.gap16,
            TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search by Name, City, Area...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppSizes.radius8)),
              ),
              onChanged: (val) {
                setState(() {});
              },
            ),
            AppSizes.gap16,
            Expanded(
              child: ListView.builder(
                itemCount: _customers.length,
                itemBuilder: (context, index) {
                  final customer = _customers[index];
                  final name = customer['name']!;
                  final city = customer['city']!;
                  
                  if (_searchController.text.isNotEmpty && 
                      !name.toLowerCase().contains(_searchController.text.toLowerCase()) && 
                      !city.toLowerCase().contains(_searchController.text.toLowerCase())) {
                    return const SizedBox.shrink();
                  }

                  return Card(
                    margin: const EdgeInsets.only(bottom: AppSizes.p12),
                    child: ListTile(
                      title: Text(name, style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
                      subtitle: Text('${customer['area']}, $city', style: AppTypography.bodySmall),
                      trailing: const Icon(Icons.chevron_right, color: AppColors.primary),
                      onTap: () {
                        context.push('/secondary-sales-entry', extra: {
                          'customerId': customer['id'],
                          'customerName': customer['name'],
                          'customerType': _customerType,
                          'entryType': _entryType,
                        });
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilters() {
    return Column(
      children: [
        Row(
          children: [
            const Expanded(flex: 2, child: Text('Customer Type:')),
            Expanded(
              flex: 3,
              child: SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'Retailer', label: Text('Retailer')),
                  ButtonSegment(value: 'Stockist', label: Text('Stockist')),
                ],
                selected: {_customerType},
                onSelectionChanged: (val) {
                  setState(() => _customerType = val.first);
                },
              ),
            ),
          ],
        ),
        AppSizes.gap16,
        Row(
          children: [
            const Expanded(flex: 2, child: Text('Entry Type:')),
            Expanded(
              flex: 3,
              child: SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'Weekly', label: Text('Weekly')),
                  ButtonSegment(value: 'Monthly', label: Text('Monthly')),
                ],
                selected: {_entryType},
                onSelectionChanged: (val) {
                  setState(() => _entryType = val.first);
                },
              ),
            ),
          ],
        ),
      ],
    );
  }
}
