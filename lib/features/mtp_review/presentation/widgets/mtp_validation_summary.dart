import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/mtp_review_models.dart';

class MtpValidationSummary extends StatelessWidget {
  final MtpValidationSummaryModel summary;

  const MtpValidationSummary({super.key, required this.summary});

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
          Row(
            children: [
              const Icon(Icons.analytics, color: AppColors.primary),
              AppSizes.gap8,
              Text('Validation Summary', style: AppTypography.headlineSmall),
            ],
          ),
          AppSizes.gap16,
          _buildGrid(context),
          if (summary.validationIssues.isNotEmpty) ...[
            AppSizes.gap16,
            const Divider(),
            AppSizes.gap8,
            Row(
              children: [
                const Icon(Icons.warning_amber_rounded, color: AppColors.error, size: 20),
                AppSizes.gap8,
                Text('Attention Required', style: AppTypography.bodyMedium.copyWith(color: AppColors.error, fontWeight: FontWeight.bold)),
              ],
            ),
            AppSizes.gap8,
            ...summary.validationIssues.map((issue) => Padding(
              padding: const EdgeInsets.only(bottom: 4.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('• ', style: TextStyle(color: AppColors.error, fontSize: 16)),
                  Expanded(child: Text(issue, style: AppTypography.bodySmall.copyWith(color: AppColors.error))),
                ],
              ),
            )),
          ],
        ],
      ),
    );
  }

  Widget _buildGrid(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 2.5,
      mainAxisSpacing: 8,
      crossAxisSpacing: 8,
      children: [
        _buildStatItem('Working Days', '${summary.totalWorkingDays}'),
        _buildStatItem('Leave Days', '${summary.totalLeaveDays}'),
        _buildStatItem('HQ Days', '${summary.hqDays}'),
        _buildStatItem('Ex-HQ Days', '${summary.exHqDays}'),
        _buildStatItem('Outstation', '${summary.outstationDays}'),
        _buildStatItem('Transit', '${summary.transitDays}'),
        _buildStatItem('Planned Visits', '${summary.plannedDoctorVisits}'),
        _buildStatItem('Freq Compliance', '${summary.visitFrequencyCompliance}%', 
          color: summary.visitFrequencyCompliance < 90 ? AppColors.error : AppColors.success),
      ],
    );
  }

  Widget _buildStatItem(String label, String value, {Color? color}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(label, style: AppTypography.bodySmall.copyWith(color: AppColors.grey600)),
        AppSizes.gap4,
        Text(value, style: AppTypography.bodyLarge.copyWith(color: color ?? AppColors.textPrimary, fontWeight: FontWeight.bold)),
      ],
    );
  }
}
