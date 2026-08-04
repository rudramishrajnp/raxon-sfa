import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import 'package:go_router/go_router.dart';

class ManagerQuickActions extends StatelessWidget {
  const ManagerQuickActions({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Quick Actions', style: AppTypography.headlineSmall),
        AppSizes.gap16,
        GridView.count(
          crossAxisCount: 4,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: AppSizes.p16,
          crossAxisSpacing: AppSizes.p12,
          children: [
            _buildActionItem(context, Icons.location_on, 'Team Tracking', () {
              context.push('/team-tracking');
            }),
            _buildActionItem(context, Icons.approval, 'MTP Approval', () {
              context.push('/mtp-review');
            }),
            _buildActionItem(context, Icons.assignment, 'DCR Review', () {
              context.push('/dcr-review');
            }),
            _buildActionItem(context, Icons.receipt_long, 'Expense Approval', () {
              context.push('/expense-approval');
            }),
            _buildActionItem(context, Icons.how_to_reg, 'Overrides', () {
              context.push('/manager-overrides');
            }),
            _buildActionItem(context, Icons.storefront, 'Secondary Sales', () {
              context.push('/secondary-sales-review');
            }),
            _buildActionItem(context, Icons.bar_chart, 'Reports', () {
              context.push('/reports-analytics');
            }),
            _buildActionItem(context, Icons.notifications, 'Notifications', () {}),
            _buildActionItem(context, Icons.chat, 'Chat', () {}),
          ],
        ),
      ],
    );
  }

  Widget _buildActionItem(BuildContext context, IconData icon, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(AppSizes.p12),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: AppColors.primary, size: 28),
          ),
          AppSizes.gap8,
          Expanded(
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: AppTypography.bodySmall,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
