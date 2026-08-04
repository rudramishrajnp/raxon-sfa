import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../providers/reports_provider.dart';
import '../providers/reports_state.dart';
import '../widgets/reports_kpi_widget.dart';
import '../widgets/reports_chart_widget.dart';
import '../widgets/team_performance_widget.dart';

class ReportsDashboardScreen extends ConsumerWidget {
  const ReportsDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(reportsNotifierProvider);
    final notifier = ref.read(reportsNotifierProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text('Reports & Analytics', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: AppColors.onPrimary),
        actions: [
          IconButton(
            icon: const Icon(Icons.picture_as_pdf),
            onPressed: () => notifier.exportReport('PDF', 'Manager_Dashboard_Report'),
          ),
          IconButton(
            icon: const Icon(Icons.file_download),
            onPressed: () => notifier.exportReport('Excel', 'Manager_Dashboard_Report'),
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => notifier.refresh(),
          ),
        ],
      ),
      body: _buildBody(state),
    );
  }

  Widget _buildBody(ReportsState state) {
    if (state is ReportsLoading || state is ReportsInitial) {
      return const Center(child: CircularProgressIndicator());
    } else if (state is ReportsError) {
      return Center(
        child: Text(state.message, style: AppTypography.bodyMedium.copyWith(color: AppColors.error)),
      );
    } else if (state is ReportsLoaded) {
      return RefreshIndicator(
        onRefresh: () async {
          // Trigger refresh logic if needed directly or let provider handle it via UI button
        },
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSizes.p16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildFilterBar(),
              AppSizes.gap24,
              ReportsKpiWidget(kpis: state.kpis),
              AppSizes.gap32,
              ReportsChartWidget(data: state.chartData, title: 'Weekly Sales Trend'),
              AppSizes.gap32,
              TeamPerformanceWidget(teamData: state.teamPerformance),
              AppSizes.gap32,
            ],
          ),
        ),
      );
    }
    return const SizedBox.shrink();
  }

  Widget _buildFilterBar() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _buildFilterChip('Date Range: This Week'),
          AppSizes.gap8,
          _buildFilterChip('HQ: All'),
          AppSizes.gap8,
          _buildFilterChip('Employee: All'),
          AppSizes.gap8,
          _buildFilterChip('Product: All'),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label) {
    return Chip(
      label: Text(label, style: AppTypography.bodySmall),
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSizes.radius16),
        side: const BorderSide(color: AppColors.grey300),
      ),
      deleteIcon: const Icon(Icons.arrow_drop_down, size: 18),
      onDeleted: () {},
    );
  }
}
