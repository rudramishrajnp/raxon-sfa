import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/dcr_review_models.dart';

class DcrTimelineWidget extends StatelessWidget {
  final DcrSubmissionModel submission;

  const DcrTimelineWidget({super.key, required this.submission});

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
          Text('Visit Timeline', style: AppTypography.headlineSmall),
          AppSizes.gap16,
          if (submission.checkInTime != null)
            _buildTimelineItem('Check-In', submission.checkInTime!, true, true),
          if (submission.checkOutTime != null)
            _buildTimelineItem('Check-Out', submission.checkOutTime!, false, false),
          if (submission.checkInTime == null && submission.checkOutTime == null)
            Text('No timeline data available.', style: AppTypography.bodyMedium.copyWith(color: AppColors.grey600)),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(String title, DateTime time, bool isFirst, bool isLast) {
    return IntrinsicHeight(
      child: Row(
        children: [
          SizedBox(
            width: 60,
            child: Text(
              DateFormat('hh:mm a').format(time),
              style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.bold),
            ),
          ),
          AppSizes.gap12,
          Column(
            children: [
              Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.surface, width: 2),
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: AppColors.grey300,
                  ),
                ),
            ],
          ),
          AppSizes.gap12,
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: AppSizes.p24),
              child: Text(title, style: AppTypography.bodyMedium),
            ),
          ),
        ],
      ),
    );
  }
}
