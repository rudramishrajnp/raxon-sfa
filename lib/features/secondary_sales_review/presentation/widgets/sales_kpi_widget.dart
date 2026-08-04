import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/secondary_sales_review_models.dart';

class SalesKpiWidget extends StatelessWidget {
  final SalesAnalyticsSummary analytics;

  const SalesKpiWidget({super.key, required this.analytics});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Performance Analytics', style: AppTypography.headlineSmall),
        AppSizes.gap16,
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          childAspectRatio: 1.5,
          mainAxisSpacing: AppSizes.p12,
          crossAxisSpacing: AppSizes.p12,
          children: [
            _buildKpiCard('Total Quantity', '${analytics.totalSalesQuantity}', Icons.shopping_cart, Colors.blue),
            _buildKpiCard('Total Value', '₹${analytics.totalSalesValue}', Icons.attach_money, AppColors.success),
            _buildKpiCard('Closing Stock', '₹${analytics.closingStockValue}', Icons.inventory, Colors.purple),
            _buildKpiCard('Top MR', analytics.highestPerformingMr, Icons.person, Colors.orange),
          ],
        ),
        AppSizes.gap16,
        Container(
          padding: const EdgeInsets.all(AppSizes.p16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(AppSizes.radius12),
            border: Border.all(color: AppColors.grey300),
          ),
          child: Column(
            children: [
              _buildRow('Best Selling', analytics.bestSellingProduct, AppColors.success),
              const Divider(height: AppSizes.p16),
              _buildRow('Slow Moving', analytics.slowMovingProduct, AppColors.error),
              const Divider(height: AppSizes.p16),
              _buildRow('Lowest Territory', analytics.lowestPerformingTerritory, AppColors.warning),
            ],
          ),
        )
      ],
    );
  }

  Widget _buildKpiCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 20),
              AppSizes.gap8,
              Expanded(
                child: Text(
                  title, 
                  style: AppTypography.bodySmall.copyWith(color: color, fontWeight: FontWeight.bold),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          AppSizes.gap8,
          Text(value, style: AppTypography.headlineSmall.copyWith(fontWeight: FontWeight.bold, fontSize: 16)),
        ],
      ),
    );
  }

  Widget _buildRow(String label, String value, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTypography.bodyMedium.copyWith(color: AppColors.grey700)),
        Text(value, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold, color: color)),
      ],
    );
  }
}
