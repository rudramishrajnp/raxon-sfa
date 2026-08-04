import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/reports_models.dart';

class TeamPerformanceWidget extends StatelessWidget {
  final List<TeamPerformanceModel> teamData;

  const TeamPerformanceWidget({super.key, required this.teamData});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Team Performance Ranking', style: AppTypography.headlineSmall),
        AppSizes.gap16,
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: teamData.length,
          separatorBuilder: (context, index) => AppSizes.gap12,
          itemBuilder: (context, index) {
            final mr = teamData[index];
            return Container(
              padding: const EdgeInsets.all(AppSizes.p16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(AppSizes.radius8),
                border: Border.all(color: AppColors.grey300),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: AppColors.primary.withOpacity(0.1),
                        child: Text('${index + 1}', style: AppTypography.bodyMedium.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold)),
                      ),
                      AppSizes.gap12,
                      Expanded(
                        child: Text(mr.employeeName, style: AppTypography.headlineSmall),
                      ),
                    ],
                  ),
                  const Divider(height: AppSizes.p24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildStat('Call Avg', '${mr.callAverage}'),
                      _buildStat('Coverage', '${mr.coveragePercentage}%'),
                      _buildStat('Sales', '₹${mr.salesValue / 1000}k'),
                      _buildStat('Attendance', '${mr.attendancePercentage}%'),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        Text(value, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
        AppSizes.gap4,
        Text(label, style: AppTypography.bodySmall.copyWith(color: AppColors.grey600)),
      ],
    );
  }
}
