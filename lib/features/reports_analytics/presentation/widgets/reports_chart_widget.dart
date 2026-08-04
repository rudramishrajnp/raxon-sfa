import 'package:flutter/material.dart';
import 'dart:math';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/reports_models.dart';

class ReportsChartWidget extends StatelessWidget {
  final List<ChartDataModel> data;
  final String title;

  const ReportsChartWidget({
    super.key,
    required this.data,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    if (data.isEmpty) return const SizedBox.shrink();

    // Find max value for scaling
    double maxValue = 0;
    for (var d in data) {
      if (d.value > maxValue) maxValue = d.value;
    }
    if (maxValue == 0) maxValue = 1; // Prevent division by zero

    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: AppColors.grey300),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 8, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppTypography.headlineSmall),
          AppSizes.gap24,
          SizedBox(
            height: 180,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: data.map((d) {
                final percentage = (d.value / maxValue);
                return _buildBar(d.label, percentage);
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBar(String label, double percentage) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Container(
          width: 30,
          height: max(10, 140 * percentage), // 140 is available height for bar
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
            gradient: LinearGradient(
              begin: Alignment.bottomCenter,
              end: Alignment.topCenter,
              colors: [
                AppColors.primary,
                AppColors.primary.withOpacity(0.6),
              ],
            ),
          ),
        ),
        AppSizes.gap8,
        Text(label, style: AppTypography.bodySmall.copyWith(color: AppColors.grey600)),
      ],
    );
  }
}
