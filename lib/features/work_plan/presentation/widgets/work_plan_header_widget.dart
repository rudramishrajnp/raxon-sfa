import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/work_plan_summary_model.dart';
import '../../../mtp/presentation/widgets/mtp_status_badge.dart';

class WorkPlanHeaderWidget extends StatelessWidget {
  final WorkPlanSummaryModel summary;

  const WorkPlanHeaderWidget({super.key, required this.summary});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(AppSizes.p16),
      elevation: 0,
      color: AppColors.primary.withOpacity(0.05),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSizes.radius16),
        side: BorderSide(color: AppColors.primary.withOpacity(0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  DateFormat('EEEE, dd MMM yyyy').format(summary.date),
                  style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold),
                ),
                MtpStatusBadge(status: summary.mtpStatus),
              ],
            ),
            AppSizes.gap16,
            Row(
              children: [
                const Icon(Icons.person, size: 20, color: AppColors.textSecondary),
                AppSizes.gap8,
                Text('${summary.employeeName} (${summary.employeeCode})', style: AppTypography.bodyMedium),
              ],
            ),
            AppSizes.gap8,
            Row(
              children: [
                const Icon(Icons.location_on, size: 20, color: AppColors.textSecondary),
                AppSizes.gap8,
                Expanded(
                  child: Text(
                    'Route: ${summary.approvedRoute ?? "N/A"} | HQ: ${summary.hq ?? "N/A"}',
                    style: AppTypography.bodyMedium,
                  ),
                ),
              ],
            ),
            AppSizes.gap8,
            Row(
              children: [
                const Icon(Icons.work, size: 20, color: AppColors.textSecondary),
                AppSizes.gap8,
                Text('${summary.workType} (${summary.locationType})', style: AppTypography.bodyMedium),
              ],
            ),
            const Divider(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatColumn('Doctors', '${summary.plannedDoctorCount}'),
                _buildStatColumn('Chemists', '${summary.plannedChemistCount}'),
                _buildStatColumn('Completed', '${summary.completedCalls}', color: AppColors.success),
                _buildStatColumn('Pending', '${summary.pendingCalls}', color: AppColors.warning),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatColumn(String label, String value, {Color? color}) {
    return Column(
      children: [
        Text(
          value,
          style: AppTypography.headlineMedium.copyWith(
            fontWeight: FontWeight.bold,
            color: color ?? AppColors.textPrimary,
          ),
        ),
        Text(
          label,
          style: AppTypography.labelSmall.copyWith(color: AppColors.textSecondary),
        ),
      ],
    );
  }
}
