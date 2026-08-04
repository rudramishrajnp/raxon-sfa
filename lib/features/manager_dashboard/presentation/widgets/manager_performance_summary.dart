import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/manager_dashboard_summary_model.dart';

class ManagerPerformanceSummary extends StatelessWidget {
  final ManagerDashboardSummaryModel summary;

  const ManagerPerformanceSummary({super.key, required this.summary});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Today's Performance", style: AppTypography.headlineSmall),
        AppSizes.gap16,
        Container(
          padding: const EdgeInsets.all(AppSizes.p16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(AppSizes.radius12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              _buildRow('Planned Calls', summary.plannedCalls.toString()),
              const Divider(),
              _buildRow('Completed Calls', summary.completedCalls.toString(), color: AppColors.success),
              const Divider(),
              _buildRow('Pending Calls', summary.pendingCalls.toString(), color: AppColors.warning),
              const Divider(),
              _buildRow('Orders Booked', summary.ordersBooked.toString()),
              const Divider(),
              _buildRow('Samples Distributed', summary.samplesDistributed.toString()),
              const Divider(),
              _buildRow('Total Secondary Sales', '₹${summary.totalSecondarySales.toStringAsFixed(2)}', isCurrency: true),
              const Divider(),
              _buildRow('Total Expense Claims', '₹${summary.totalExpenseClaims.toStringAsFixed(2)}', isCurrency: true),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRow(String label, String value, {Color? color, bool isCurrency = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AppTypography.bodyMedium),
          Text(
            value,
            style: AppTypography.bodyLarge.copyWith(
              fontWeight: FontWeight.bold,
              color: color ?? AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
