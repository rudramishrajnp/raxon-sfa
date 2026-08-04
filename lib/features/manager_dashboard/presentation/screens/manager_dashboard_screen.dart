import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../authentication/presentation/providers/auth_state.dart';
import '../providers/manager_dashboard_provider.dart';
import '../providers/manager_dashboard_state.dart';
import '../widgets/manager_info_header.dart';
import '../widgets/live_team_summary_grid.dart';
import '../widgets/manager_performance_summary.dart';
import '../widgets/live_team_status_list.dart';
import '../widgets/manager_quick_actions.dart';
import 'package:go_router/go_router.dart';

class ManagerDashboardScreen extends ConsumerWidget {
  const ManagerDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final dashboardState = ref.watch(managerDashboardNotifierProvider);

    if (authState is! AuthStateAuthenticated) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final manager = authState.user;

    return Scaffold(
      appBar: AppBar(
        title: Text('Manager Panel', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: AppColors.onPrimary),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              ref.read(authNotifierProvider.notifier).logout();
              context.go('/login');
            },
          )
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(managerDashboardNotifierProvider.notifier).refresh(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(AppSizes.p16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ManagerInfoHeader(manager: manager),
              AppSizes.gap24,
              ManagerQuickActions(),
              AppSizes.gap24,
              _buildDashboardContent(context, dashboardState, ref),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDashboardContent(BuildContext context, ManagerDashboardState state, WidgetRef ref) {
    if (state is ManagerDashboardLoading) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: CircularProgressIndicator(),
        ),
      );
    } else if (state is ManagerDashboardError) {
      return Center(
        child: Column(
          children: [
            const Icon(Icons.error_outline, color: AppColors.error, size: 48),
            AppSizes.gap16,
            Text(state.message, style: AppTypography.bodyMedium, textAlign: TextAlign.center),
            AppSizes.gap16,
            ElevatedButton(
              onPressed: () => ref.read(managerDashboardNotifierProvider.notifier).refresh(),
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    } else if (state is ManagerDashboardLoaded) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          LiveTeamSummaryGrid(summary: state.summary),
          AppSizes.gap24,
          ManagerPerformanceSummary(summary: state.summary),
          AppSizes.gap24,
          LiveTeamStatusList(teamStatus: state.teamStatus),
          AppSizes.gap32, // Bottom padding
        ],
      );
    }
    
    return const SizedBox.shrink();
  }
}
