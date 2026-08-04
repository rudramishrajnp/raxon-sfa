import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/dcr_review_models.dart';

class DcrGpsVerificationWidget extends StatelessWidget {
  final DcrSubmissionModel submission;

  const DcrGpsVerificationWidget({super.key, required this.submission});

  @override
  Widget build(BuildContext context) {
    bool hasIssues = submission.outsideGeofence || submission.gpsOverrideUsed || (submission.gpsAccuracy ?? 0) > 50;

    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: hasIssues ? AppColors.error : AppColors.grey300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.location_on, color: hasIssues ? AppColors.error : AppColors.primary),
              AppSizes.gap8,
              Text('GPS Verification', style: AppTypography.headlineSmall),
            ],
          ),
          AppSizes.gap16,
          if (hasIssues) ...[
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.error.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (submission.outsideGeofence)
                    _buildWarningText('Check-in was outside geofence (${submission.checkInDistance}m away)'),
                  if (submission.gpsOverrideUsed)
                    _buildWarningText('GPS Override was used for this visit.'),
                  if ((submission.gpsAccuracy ?? 0) > 50)
                    _buildWarningText('Low GPS Accuracy (${submission.gpsAccuracy}m)'),
                ],
              ),
            ),
            AppSizes.gap16,
          ],
          _buildInfoRow('Check-in Distance', '${submission.checkInDistance ?? 0}m'),
          AppSizes.gap8,
          _buildInfoRow('Check-out Distance', '${submission.checkOutDistance ?? 0}m'),
          AppSizes.gap8,
          _buildInfoRow('GPS Accuracy', '${submission.gpsAccuracy ?? 0}m'),
          AppSizes.gap16,
          // Placeholder for actual Map
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

  Widget _buildWarningText(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.warning_amber_rounded, color: AppColors.error, size: 16),
          AppSizes.gap8,
          Expanded(child: Text(text, style: AppTypography.bodySmall.copyWith(color: AppColors.error))),
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
