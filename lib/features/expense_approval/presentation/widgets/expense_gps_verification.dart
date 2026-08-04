import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/expense_approval_models.dart';

class ExpenseGpsVerificationWidget extends StatelessWidget {
  final ExpenseSubmissionModel submission;

  const ExpenseGpsVerificationWidget({super.key, required this.submission});

  @override
  Widget build(BuildContext context) {
    if (submission.expenseLat == null || submission.expenseLng == null) {
      return const SizedBox.shrink();
    }

    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: submission.isSuspiciousLocation ? AppColors.error : AppColors.grey300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.location_on, color: submission.isSuspiciousLocation ? AppColors.error : AppColors.primary),
              AppSizes.gap8,
              Text('GPS Verification', style: AppTypography.headlineSmall),
            ],
          ),
          AppSizes.gap16,
          if (submission.isSuspiciousLocation) ...[
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.error.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.warning_amber_rounded, color: AppColors.error, size: 16),
                  AppSizes.gap8,
                  Expanded(child: Text('Expense logged far from planned route (${submission.distanceFromRoute}m).', style: AppTypography.bodySmall.copyWith(color: AppColors.error))),
                ],
              ),
            ),
            AppSizes.gap16,
          ],
          _buildInfoRow('Distance from Route', '${submission.distanceFromRoute ?? 0}m'),
          AppSizes.gap16,
          Container(
            height: 150,
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppColors.grey200,
              borderRadius: BorderRadius.circular(AppSizes.radius8),
            ),
            child: const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.map, color: AppColors.grey500, size: 40),
                  Text('Map View Unavailable Offline', style: TextStyle(color: AppColors.grey600)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTypography.bodyMedium.copyWith(color: AppColors.grey700)),
        Text(value, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
      ],
    );
  }
}
