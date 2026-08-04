import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../providers/secondary_sales_review_provider.dart';
import '../providers/secondary_sales_review_state.dart';
import '../../data/models/secondary_sales_review_models.dart';
import '../widgets/sales_kpi_widget.dart';
import '../widgets/sales_trend_chart_widget.dart';
import '../widgets/sales_exception_report_widget.dart';

class SecondarySalesReviewDashboard extends ConsumerWidget {
  const SecondarySalesReviewDashboard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(secondarySalesReviewNotifierProvider);
    final notifier = ref.read(secondarySalesReviewNotifierProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text('Secondary Sales Review', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: AppColors.onPrimary),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => notifier.refresh(),
          ),
        ],
      ),
      body: _buildContent(context, state, notifier),
    );
  }

  Widget _buildContent(BuildContext context, SecondarySalesReviewState state, SecondarySalesReviewNotifier notifier) {
    if (state is SecondarySalesReviewLoading || state is SecondarySalesReviewInitial) {
      return const Center(child: CircularProgressIndicator());
    } else if (state is SecondarySalesReviewError) {
      return Center(
        child: Text(state.message, style: AppTypography.bodyMedium.copyWith(color: AppColors.error)),
      );
    } else if (state is SecondarySalesReviewLoaded) {
      return DefaultTabController(
        length: 2,
        child: Column(
          children: [
            const TabBar(
              labelColor: AppColors.primary,
              unselectedLabelColor: AppColors.grey500,
              indicatorColor: AppColors.primary,
              tabs: [
                Tab(text: 'Review Sales'),
                Tab(text: 'Analytics'),
              ],
            ),
            Expanded(
              child: TabBarView(
                children: [
                  _buildSalesList(context, state, notifier),
                  _buildAnalytics(context, state),
                ],
              ),
            ),
          ],
        ),
      );
    }
    return const SizedBox.shrink();
  }

  Widget _buildSalesList(BuildContext context, SecondarySalesReviewLoaded state, SecondarySalesReviewNotifier notifier) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(AppSizes.p16),
          child: _buildSearchBar(notifier),
        ),
        Expanded(
          child: RefreshIndicator(
            onRefresh: () => notifier.refresh(),
            child: ListView.separated(
              padding: const EdgeInsets.all(AppSizes.p16),
              itemCount: state.sales.length,
              separatorBuilder: (context, index) => AppSizes.gap16,
              itemBuilder: (context, index) {
                return _buildSalesCard(context, state.sales[index]);
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSearchBar(SecondarySalesReviewNotifier notifier) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius8),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2)),
        ],
      ),
      child: TextField(
        decoration: InputDecoration(
          hintText: 'Search MR, Stockist, Product...',
          prefixIcon: const Icon(Icons.search, color: AppColors.grey500),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppSizes.radius8), borderSide: BorderSide.none),
          filled: true,
          fillColor: AppColors.surface,
          contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: AppSizes.p16),
        ),
        onChanged: (val) => notifier.updateSearchQuery(val),
      ),
    );
  }

  Widget _buildSalesCard(BuildContext context, SalesReviewModel sales) {
    return GestureDetector(
      onTap: () {
        context.push('/secondary-sales-details', extra: sales);
      },
      child: Container(
        padding: const EdgeInsets.all(AppSizes.p16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppSizes.radius12),
          border: Border.all(color: AppColors.grey300),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(sales.stockistName, style: AppTypography.headlineSmall),
                      if (sales.retailerName != null) ...[
                        AppSizes.gap4,
                        Text('Retailer: ${sales.retailerName}', style: AppTypography.bodySmall.copyWith(color: AppColors.grey600)),
                      ],
                    ],
                  ),
                ),
                _buildStatusBadge(sales.status),
              ],
            ),
            const Divider(height: AppSizes.p24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildInfoCol('MR Name', sales.employeeName),
                _buildInfoCol('Date', DateFormat('dd MMM yyyy').format(sales.date)),
                _buildInfoCol('Value', '₹${sales.totalSalesValue}', color: AppColors.success),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color = AppColors.primary;
    if (status == 'Approved') color = AppColors.success;
    if (status == 'Rejected' || status == 'Returned') color = AppColors.error;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: color),
      ),
      child: Text(
        status,
        style: AppTypography.bodySmall.copyWith(color: color, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildInfoCol(String label, String value, {Color? color}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTypography.bodySmall.copyWith(color: AppColors.grey600)),
        AppSizes.gap4,
        Text(value, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold, color: color)),
      ],
    );
  }

  Widget _buildAnalytics(BuildContext context, SecondarySalesReviewLoaded state) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSizes.p16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SalesKpiWidget(analytics: state.analytics),
          AppSizes.gap24,
          const SalesTrendChartWidget(),
          AppSizes.gap24,
          SalesExceptionReportWidget(exceptions: state.exceptions),
          AppSizes.gap32,
        ],
      ),
    );
  }
}
