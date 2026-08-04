import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/dashboard_summary_model.dart';

class TodaySummarySection extends StatelessWidget {
  final DashboardSummaryModel summary;

  const TodaySummarySection({super.key, required this.summary});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSizes.p16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Today's Summary",
            style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold),
          ),
          AppSizes.gap12,
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  'Doctors\nPlanned',
                  summary.plannedDoctors.toString(),
                  Icons.group,
                  Colors.blue,
                ),
              ),
              AppSizes.gap12,
              Expanded(
                child: _buildSummaryCard(
                  'Doctors\nVisited',
                  summary.visitedDoctors.toString(),
                  Icons.check_circle,
                  Colors.green,
                ),
              ),
              AppSizes.gap12,
              Expanded(
                child: _buildSummaryCard(
                  'Doctors\nPending',
                  summary.pendingDoctors.toString(),
                  Icons.pending_actions,
                  Colors.orange,
                ),
              ),
            ],
          ),
          AppSizes.gap12,
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  'Samples\nGiven',
                  summary.samplesGiven.toString(),
                  Icons.medication,
                  Colors.purple,
                ),
              ),
              AppSizes.gap12,
              Expanded(
                child: _buildSummaryCard(
                  'Orders\nBooked',
                  '₹${summary.ordersBooked.toStringAsFixed(0)}',
                  Icons.currency_rupee,
                  Colors.teal,
                ),
              ),
              AppSizes.gap12,
              Expanded(
                child: _buildSummaryCard(
                  'Expenses\nToday',
                  '₹${summary.expensesToday.toStringAsFixed(0)}',
                  Icons.receipt_long,
                  Colors.red,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: color),
              AppSizes.gap4,
              Expanded(
                child: Text(
                  value,
                  style: AppTypography.titleMedium.copyWith(
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          AppSizes.gap8,
          Text(
            title,
            style: AppTypography.labelSmall.copyWith(color: AppColors.grey600),
          ),
        ],
      ),
    );
  }
}
