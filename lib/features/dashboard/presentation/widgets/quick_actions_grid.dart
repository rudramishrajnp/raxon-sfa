import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';

class QuickActionsGrid extends StatelessWidget {
  const QuickActionsGrid({super.key});

  @override
  Widget build(BuildContext context) {
    final actions = [
      {'title': 'Attendance', 'icon': Icons.calendar_month, 'color': Colors.blue},
      {'title': 'Work Plan', 'icon': Icons.assignment, 'color': Colors.indigo},
      {'title': 'DCR', 'icon': Icons.edit_document, 'color': Colors.teal},
      {'title': 'Orders', 'icon': Icons.shopping_cart, 'color': Colors.orange},
      {'title': 'Expenses', 'icon': Icons.account_balance_wallet, 'color': Colors.red},
      {'title': 'Sales', 'icon': Icons.storefront, 'color': Colors.purple},
      {'title': 'Chat', 'icon': Icons.chat, 'color': Colors.green},
      {'title': 'Reports', 'icon': Icons.bar_chart, 'color': Colors.blueGrey},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSizes.p16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Quick Actions',
            style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold),
          ),
          AppSizes.gap12,
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: actions.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 4,
              crossAxisSpacing: AppSizes.p8,
              mainAxisSpacing: AppSizes.p16,
              childAspectRatio: 0.8,
            ),
            itemBuilder: (context, index) {
              final action = actions[index];
              return _buildActionItem(
                context,
                action['title'] as String,
                action['icon'] as IconData,
                action['color'] as Color,
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildActionItem(BuildContext context, String title, IconData icon, Color color) {
    return InkWell(
      onTap: () {
        if (title == 'Attendance') {
          context.push('/punch-in');
        } else if (title == 'Work Plan') {
          context.push('/work-plan');
        } else if (title == 'Expenses') {
          context.push('/expense-home');
        } else if (title == 'Sales') {
          context.push('/closing-stock');
        }
      },
      borderRadius: BorderRadius.circular(AppSizes.radius12),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(AppSizes.p12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          AppSizes.gap8,
          Text(
            title,
            style: AppTypography.labelSmall,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
