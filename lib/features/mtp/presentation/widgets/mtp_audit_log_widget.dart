import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/mtp_audit_model.dart';
import 'mtp_status_badge.dart';

class MtpAuditLogWidget extends StatelessWidget {
  final List<MtpAuditModel> logs;

  const MtpAuditLogWidget({super.key, required this.logs});

  @override
  Widget build(BuildContext context) {
    if (logs.isEmpty) {
      return const Center(child: Text('No audit history available.'));
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: logs.length,
      itemBuilder: (context, index) {
        final log = logs[index];
        return Card(
          margin: const EdgeInsets.only(bottom: AppSizes.p8),
          elevation: 0,
          color: AppColors.surface,
          child: Padding(
            padding: const EdgeInsets.all(AppSizes.p16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      DateFormat('dd MMM yyyy, hh:mm a').format(log.actionDate),
                      style: AppTypography.labelSmall.copyWith(color: AppColors.textSecondary),
                    ),
                    MtpStatusBadge(status: log.newStatus),
                  ],
                ),
                AppSizes.gap8,
                Text(
                  'Action By: ${log.actionByName} (${log.actionBy})',
                  style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold),
                ),
                if (log.remarks != null && log.remarks!.isNotEmpty) ...[
                  AppSizes.gap4,
                  Text(
                    'Remarks: "${log.remarks}"',
                    style: AppTypography.bodySmall.copyWith(fontStyle: FontStyle.italic),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}
