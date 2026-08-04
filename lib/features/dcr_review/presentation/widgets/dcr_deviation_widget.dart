import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/dcr_review_models.dart';

class DcrDeviationWidget extends StatelessWidget {
  final DcrSubmissionModel submission;

  const DcrDeviationWidget({super.key, required this.submission});

  @override
  Widget build(BuildContext context) {
    if (!submission.isDeviation) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      margin: const EdgeInsets.only(bottom: AppSizes.p24),
      decoration: BoxDecoration(
        color: AppColors.warning.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: AppColors.warning),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.alt_route, color: AppColors.warning),
              AppSizes.gap8,
              Text('MTP Deviation', style: AppTypography.headlineSmall.copyWith(color: AppColors.warning)),
            ],
          ),
          AppSizes.gap16,
          Text('Reason for Deviation:', style: AppTypography.bodySmall.copyWith(color: AppColors.grey700)),
          AppSizes.gap4,
          Text(submission.deviationReason ?? 'No reason provided', style: AppTypography.bodyMedium.copyWith(fontStyle: FontStyle.italic)),
        ],
      ),
    );
  }
}
