import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';

class SummaryWidget extends StatelessWidget {
  final int totalProducts;
  final int totalSalesQty;
  final double totalSalesValue;
  final int totalClosingStock;

  const SummaryWidget({
    super.key,
    required this.totalProducts,
    required this.totalSalesQty,
    required this.totalSalesValue,
    required this.totalClosingStock,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      color: AppColors.primary,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppSizes.radius12)),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          children: [
            Text('Summary', style: AppTypography.titleMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
            AppSizes.gap16,
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildSummaryItem('Total Products', '$totalProducts'),
                _buildSummaryItem('Total Sales Qty', '$totalSalesQty'),
              ],
            ),
            AppSizes.gap16,
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildSummaryItem('Closing Stock', '$totalClosingStock'),
                _buildSummaryItem('Sales Value', '₹${totalSalesValue.toStringAsFixed(2)}'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTypography.labelMedium.copyWith(color: Colors.white70)),
        AppSizes.gap4,
        Text(value, style: AppTypography.titleMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
      ],
    );
  }
}
