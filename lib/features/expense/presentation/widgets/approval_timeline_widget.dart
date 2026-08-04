import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/expense_audit_model.dart';

class ApprovalTimelineWidget extends StatelessWidget {
  final List<ExpenseAuditModel> audits;

  const ApprovalTimelineWidget({super.key, required this.audits});

  @override
  Widget build(BuildContext context) {
    if (audits.isEmpty) {
      return const Text('No history available.', style: AppTypography.bodyMedium);
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: audits.length,
      itemBuilder: (context, index) {
        final audit = audits[index];
        final isLast = index == audits.length - 1;

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              children: [
                Container(
                  width: 16,
                  height: 16,
                  decoration: const BoxDecoration(
                    color: AppColors.primary,
                    shape: BoxShape.circle,
                  ),
                ),
                if (!isLast)
                  Container(
                    width: 2,
                    height: 40,
                    color: AppColors.primary.withOpacity(0.3),
                  ),
              ],
            ),
            AppSizes.gap16,
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    audit.action,
                    style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.bold),
                  ),
                  Text(
                    '${audit.role} • ${_formatDate(audit.timestamp)}',
                    style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
                  ),
                  if (audit.details != null && audit.details!.isNotEmpty) ...[
                    AppSizes.gap4,
                    Text(
                      audit.details!,
                      style: AppTypography.bodySmall,
                    ),
                  ],
                  if (!isLast) AppSizes.gap16,
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }
}
