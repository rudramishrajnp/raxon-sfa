import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/reports_models.dart';

class ReportsKpiWidget extends StatelessWidget {
  final ReportKpiModel kpis;

  const ReportsKpiWidget({super.key, required this.kpis});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader('Attendance & Coverage'),
        AppSizes.gap12,
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          childAspectRatio: 2.2,
          mainAxisSpacing: AppSizes.p12,
          crossAxisSpacing: AppSizes.p12,
          children: [
            _buildKpiCard('Total MRs', '${kpis.totalMrs}', Icons.groups, Colors.blue),
            _buildKpiCard('Active', '${kpis.activeMrs}', Icons.check_circle, AppColors.success),
            _buildKpiCard('Present', '${kpis.present}', Icons.how_to_reg, Colors.teal),
            _buildKpiCard('Absent / Leave', '${kpis.absent} / ${kpis.onLeave}', Icons.person_off, AppColors.error),
            _buildKpiCard('Punched In', '${kpis.punchedIn}', Icons.login, Colors.indigo),
            _buildKpiCard('Punched Out', '${kpis.punchedOut}', Icons.logout, Colors.orange),
          ],
        ),
        
        AppSizes.gap24,
        _buildSectionHeader('Performance'),
        AppSizes.gap12,
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          childAspectRatio: 2.2,
          mainAxisSpacing: AppSizes.p12,
          crossAxisSpacing: AppSizes.p12,
          children: [
            _buildKpiCard('Total Calls', '${kpis.totalCalls}', Icons.phone, Colors.blueGrey),
            _buildKpiCard('Productive', '${kpis.productiveCalls}', Icons.call_made, AppColors.success),
            _buildKpiCard('Missed Calls', '${kpis.missedCalls}', Icons.call_missed, AppColors.error),
            _buildKpiCard('Orders', '${kpis.orders}', Icons.shopping_bag, Colors.purple),
          ],
        ),
        
        AppSizes.gap24,
        _buildSectionHeader('Financials'),
        AppSizes.gap12,
        GridView.count(
          crossAxisCount: 1,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          childAspectRatio: 4,
          mainAxisSpacing: AppSizes.p12,
          crossAxisSpacing: AppSizes.p12,
          children: [
            _buildKpiCard('Secondary Sales', '₹${kpis.secondarySales}', Icons.storefront, AppColors.success),
            _buildKpiCard('Total Expenses', '₹${kpis.expenses}', Icons.receipt_long, AppColors.warning),
          ],
        ),
      ],
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(title, style: AppTypography.headlineSmall);
  }

  Widget _buildKpiCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSizes.p12, vertical: AppSizes.p8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.05),
        borderRadius: BorderRadius.circular(AppSizes.radius8),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(AppSizes.p8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          AppSizes.gap12,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  title, 
                  style: AppTypography.bodySmall.copyWith(color: AppColors.grey700),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  value, 
                  style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
