import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../../../../features/communication/presentation/providers/communication_providers.dart';

import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../authentication/presentation/providers/auth_state.dart';

class DashboardAppBar extends ConsumerWidget implements PreferredSizeWidget {
  const DashboardAppBar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    String userName = 'User';
    String empCode = 'EMP-0000';

    if (authState is AuthStateAuthenticated) {
      userName = authState.user.name;
      empCode = authState.user.id;
    }

    final String todayDate = DateFormat('EEEE, dd MMM yyyy').format(DateTime.now());

    return Container(
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + AppSizes.p8,
        left: AppSizes.p16,
        right: AppSizes.p16,
        bottom: AppSizes.p8,
      ),
      decoration: BoxDecoration(
        color: AppColors.primary,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Top Row: Menu, Logo, Actions
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.menu, color: AppColors.onPrimary),
                onPressed: () => Scaffold.of(context).openDrawer(),
              ),
              Expanded(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.business_center, color: AppColors.onPrimary, size: 24),
                    AppSizes.gap8,
                    Text(
                      'RAXON',
                      style: AppTypography.titleLarge.copyWith(color: AppColors.onPrimary, letterSpacing: 1.5),
                    ),
                  ],
                ),
              ),
                            IconButton(
                icon: const Icon(Icons.chat_bubble_outline, color: AppColors.onPrimary),
                onPressed: () => context.push('/chats'),
              ),
              Consumer(
                builder: (context, ref, child) {
                  final unreadCountAsync = ref.watch(unreadNotificationCountProvider);
                  return Stack(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.notifications_none, color: AppColors.onPrimary),
                        onPressed: () => context.push('/notifications'),
                      ),
                      if (unreadCountAsync.value != null && unreadCountAsync.value! > 0)
                        Positioned(
                          right: 8,
                          top: 8,
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: BoxDecoration(
                              color: Colors.red,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                            child: Text(
                              '${unreadCountAsync.value}',
                              style: const TextStyle(color: Colors.white, fontSize: 10),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ),
                    ],
                  );
                },
              ),
              const CircleAvatar(
                radius: 16,
                backgroundColor: AppColors.onPrimary,
                child: Icon(Icons.person, color: AppColors.primary, size: 20),
              ),

            ],
          ),
          AppSizes.gap16,
          // Bottom Row: User Info, Date, GPS
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Hello, $userName',
                    style: AppTypography.titleMedium.copyWith(color: AppColors.onPrimary),
                  ),
                  Text(
                    empCode,
                    style: AppTypography.bodySmall.copyWith(color: AppColors.onPrimary.withOpacity(0.8)),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.location_on, color: AppColors.success, size: 14),
                      AppSizes.gap4,
                      Text(
                        'GPS Active',
                        style: AppTypography.labelSmall.copyWith(color: AppColors.onPrimary),
                      ),
                    ],
                  ),
                  AppSizes.gap4,
                  Text(
                    todayDate,
                    style: AppTypography.bodySmall.copyWith(color: AppColors.onPrimary.withOpacity(0.9)),
                  ),
                ],
              ),
            ],
          ),
          AppSizes.gap8,
        ],
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(130.0);
}
