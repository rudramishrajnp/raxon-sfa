import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/dcr_review_models.dart';

class DcrJointWorkWidget extends StatelessWidget {
  final DcrSubmissionModel submission;

  const DcrJointWorkWidget({super.key, required this.submission});

  @override
  Widget build(BuildContext context) {
    if (!submission.isJointWork) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      margin: const EdgeInsets.only(bottom: AppSizes.p24),
      decoration: BoxDecoration(
        color: Colors.blue.withOpacity(0.05),
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: Colors.blue.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.group, color: Colors.blue),
              AppSizes.gap8,
              Text('Joint Work Details', style: AppTypography.headlineSmall.copyWith(color: Colors.blue)),
            ],
          ),
          AppSizes.gap16,
          Text('Accompanied By:', style: AppTypography.bodySmall.copyWith(color: AppColors.grey600)),
          AppSizes.gap4,
          Text(submission.jointManagerName ?? 'Unknown', style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
