import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import 'dart:math';

class SalesTrendChartWidget extends StatelessWidget {
  const SalesTrendChartWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: AppColors.grey300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Weekly Sales Trend', style: AppTypography.headlineSmall),
          AppSizes.gap24,
          SizedBox(
            height: 150,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                _buildBar('Mon', 40),
                _buildBar('Tue', 60),
                _buildBar('Wed', 80),
                _buildBar('Thu', 50),
                _buildBar('Fri', 90),
                _buildBar('Sat', 30),
                _buildBar('Sun', 10),
              ],
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
          width: 24,
          height: max(10, 100 * (percentage / 100)),
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
          ),
        ),
        AppSizes.gap8,
        Text(label, style: AppTypography.bodySmall.copyWith(color: AppColors.grey600)),
      ],
    );
  }
}
