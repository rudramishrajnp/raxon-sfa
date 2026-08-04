import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/dashboard_summary_model.dart';
import '../providers/dashboard_provider.dart';

class TopStatusCard extends ConsumerWidget {
  final DashboardSummaryModel summary;

  const TopStatusCard({super.key, required this.summary});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Card(
      margin: const EdgeInsets.all(AppSizes.p16),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          children: [
            // Punch Status Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(AppSizes.p8),
                      decoration: BoxDecoration(
                        color: summary.isPunchedIn ? AppColors.success.withOpacity(0.1) : AppColors.error.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        summary.isPunchedIn ? Icons.fingerprint : Icons.power_settings_new,
                        color: summary.isPunchedIn ? AppColors.success : AppColors.error,
                      ),
                    ),
                    AppSizes.gap12,
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          summary.isPunchedIn ? 'Punched In' : 'Punched Out',
                          style: AppTypography.titleMedium,
                        ),
                        if (summary.punchInTime != null)
                          Text(
                            'Since ${DateFormat('hh:mm a').format(summary.punchInTime!)}',
                            style: AppTypography.bodySmall.copyWith(color: AppColors.grey600),
                          ),
                      ],
                    ),
                  ],
                ),
                ElevatedButton(
                  onPressed: () {
                    ref.read(dashboardNotifierProvider.notifier).togglePunchStatus();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: summary.isPunchedIn ? AppColors.error : AppColors.success,
                    foregroundColor: Colors.white,
                  ),
                  child: Text(summary.isPunchedIn ? 'PUNCH OUT' : 'PUNCH IN'),
                ),
              ],
            ),
            
            AppSizes.gap16,
            const Divider(),
            AppSizes.gap16,

            // Calls and Route Row
            Row(
              children: [
                Expanded(
                  child: _buildStatusColumn(
                    'Target Calls',
                    '${summary.completedCalls}/${summary.targetCalls}',
                    Icons.phone_in_talk,
                    AppColors.primary,
                  ),
                ),
                Container(width: 1, height: 40, color: AppColors.divider),
                Expanded(
                  child: _buildStatusColumn(
                    'MTP Status',
                    summary.mtpStatus,
                    Icons.event_note,
                    AppColors.secondary,
                  ),
                ),
                Container(width: 1, height: 40, color: AppColors.divider),
                Expanded(
                  child: _buildStatusColumn(
                    'Route',
                    summary.routeName,
                    Icons.map,
                    AppColors.warning,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusColumn(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, color: color, size: AppSizes.icon20),
        AppSizes.gap4,
        Text(
          value,
          style: AppTypography.titleSmall,
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        AppSizes.gap4,
        Text(
          label,
          style: AppTypography.labelSmall.copyWith(color: AppColors.grey500),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
