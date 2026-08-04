import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../providers/dashboard_provider.dart';
import '../providers/dashboard_state.dart';
import '../widgets/dashboard_app_bar.dart';
import '../widgets/top_status_card.dart';
import '../widgets/quick_actions_grid.dart';
import '../widgets/today_summary_section.dart';
import '../widgets/announcements_section.dart';
import '../widgets/dashboard_drawer.dart';
import '../widgets/dashboard_bottom_nav.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final dashboardState = ref.watch(dashboardNotifierProvider);

    return Scaffold(
      appBar: const DashboardAppBar(),
      drawer: const DashboardDrawer(),
      bottomNavigationBar: DashboardBottomNav(
        currentIndex: _currentIndex,
        onIndexChanged: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
      body: _buildBody(dashboardState),
    );
  }

  Widget _buildBody(DashboardState state) {
    // Return empty placeholder for non-Home tabs for now
    if (_currentIndex != 0) {
      return Center(
        child: Text(
          'Tab $_currentIndex Content',
          style: AppTypography.titleLarge,
        ),
      );
    }

    if (state is DashboardStateLoading) {
      return const Center(child: CircularProgressIndicator());
    } else if (state is DashboardStateError) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: AppColors.error),
            AppSizes.gap16,
            Text(state.message, style: AppTypography.bodyMedium, textAlign: TextAlign.center),
            AppSizes.gap16,
            ElevatedButton(
              onPressed: () {
                ref.read(dashboardNotifierProvider.notifier).loadDashboardData();
              },
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    } else if (state is DashboardStateLoaded) {
      return RefreshIndicator(
        onRefresh: () => ref.read(dashboardNotifierProvider.notifier).loadDashboardData(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TopStatusCard(summary: state.summary),
              AppSizes.gap16,
              const QuickActionsGrid(),
              AppSizes.gap24,
              TodaySummarySection(summary: state.summary),
              AppSizes.gap24,
              AnnouncementsSection(announcements: state.announcements),
              AppSizes.gap24,
            ],
          ),
        ),
      );
    }

    return const SizedBox.shrink();
  }
}
