import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../authentication/presentation/providers/auth_state.dart';

class DashboardDrawer extends ConsumerWidget {
  const DashboardDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    String userName = 'User';
    String userEmail = '';

    if (authState is AuthStateAuthenticated) {
      userName = authState.user.name;
      userEmail = authState.user.email;
    }

    return Drawer(
      child: Column(
        children: [
          UserAccountsDrawerHeader(
            decoration: const BoxDecoration(color: AppColors.primary),
            accountName: Text(userName, style: AppTypography.titleMedium.copyWith(color: Colors.white)),
            accountEmail: Text(userEmail, style: AppTypography.bodySmall.copyWith(color: Colors.white70)),
            currentAccountPicture: const CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(Icons.person, color: AppColors.primary, size: 40),
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                _buildDrawerItem(Icons.dashboard, 'Dashboard', onTap: () => context.pop()),
                _buildDrawerItem(Icons.calendar_month, 'Attendance'),
                _buildDrawerItem(Icons.event_note, 'MTP'),
                _buildDrawerItem(Icons.edit_document, 'DCR'),
                _buildDrawerItem(Icons.shopping_cart, 'Orders'),
                _buildDrawerItem(Icons.account_balance_wallet, 'Expenses'),
                _buildDrawerItem(Icons.storefront, 'Secondary Sales'),
                _buildDrawerItem(Icons.notifications, 'Notifications'),
                _buildDrawerItem(Icons.chat, 'Chat'),
                const Divider(),
                _buildDrawerItem(Icons.person, 'Profile'),
                                _buildDrawerItem(Icons.admin_panel_settings, 'Admin Panel', onTap: () {
                  context.pop();
                  context.push('/admin-dashboard');
                }),
                _buildDrawerItem(Icons.settings, 'Settings'),
                _buildDrawerItem(
                  Icons.logout,
                  'Logout',
                  color: AppColors.error,
                  onTap: () {
                    // Close drawer
                    context.pop();
                    ref.read(authNotifierProvider.notifier).logout();
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title, {Color? color, VoidCallback? onTap}) {
    return ListTile(
      leading: Icon(icon, color: color ?? AppColors.grey700),
      title: Text(
        title,
        style: AppTypography.bodyMedium.copyWith(color: color ?? AppColors.textPrimary),
      ),
      onTap: onTap ?? () {},
    );
  }
}
