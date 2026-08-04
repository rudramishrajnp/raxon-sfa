import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/expense_approval_models.dart';

class ExpenseApprovalTimeline extends StatelessWidget {
  final List<ExpenseAuditLogModel> auditTrail;

  const ExpenseApprovalTimeline({super.key, required this.auditTrail});

  @override
  Widget build(BuildContext context) {
    if (auditTrail.isEmpty) return const SizedBox.shrink();

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
              const Icon(Icons.history, color: AppColors.primary),
              AppSizes.gap8,
              Text('Approval History', style: AppTypography.headlineSmall),
            ],
          ),
          AppSizes.gap16,
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: auditTrail.length,
            itemBuilder: (context, index) {
              final log = auditTrail[index];
              final isLast = index == auditTrail.length - 1;
              return _buildTimelineRow(log, isLast);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineRow(ExpenseAuditLogModel log, bool isLast) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(
            width: 80,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  DateFormat('dd MMM').format(log.timestamp),
                  style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.bold),
                ),
                Text(
                  DateFormat('hh:mm a').format(log.timestamp),
                  style: AppTypography.bodySmall.copyWith(color: AppColors.grey600, fontSize: 10),
                ),
              ],
            ),
          ),
          AppSizes.gap12,
          Column(
            children: [
              Container(
                width: 12,
                height: 12,
                margin: const EdgeInsets.only(top: 4),
                decoration: BoxDecoration(
                  color: _getActionColor(log.action),
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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(log.action, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold, color: _getActionColor(log.action))),
                  AppSizes.gap4,
                  Text('By: ${log.byUser}', style: AppTypography.bodySmall.copyWith(color: AppColors.grey700)),
                  if (log.adjustmentAmount != null) ...[
                    AppSizes.gap4,
                    Text('Adjustment: ₹${log.adjustmentAmount}', style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.bold)),
                  ],
                  if (log.remarks != null && log.remarks!.isNotEmpty) ...[
                    AppSizes.gap4,
                    Text('Remarks: ${log.remarks}', style: AppTypography.bodySmall.copyWith(fontStyle: FontStyle.italic)),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Color _getActionColor(String action) {
    if (action.contains('Approve')) return AppColors.success;
    if (action.contains('Reject') || action.contains('Return')) return AppColors.error;
    if (action.contains('Submit')) return Colors.blue;
    return AppColors.grey600;
  }
}
