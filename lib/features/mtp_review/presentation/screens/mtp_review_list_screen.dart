import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../providers/mtp_review_provider.dart';
import '../providers/mtp_review_state.dart';
import '../../data/models/mtp_review_models.dart';

class MtpReviewListScreen extends ConsumerWidget {
  const MtpReviewListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(mtpReviewNotifierProvider);
    final notifier = ref.read(mtpReviewNotifierProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text('MTP Approval', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: AppColors.onPrimary),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              _showFilters(context, notifier);
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => notifier.refresh(),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppSizes.p16),
            child: _buildSearchBar(notifier),
          ),
          Expanded(
            child: _buildContent(context, state, notifier),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar(MtpReviewNotifier notifier) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TextField(
        decoration: InputDecoration(
          hintText: 'Search Employee, Code, HQ...',
          prefixIcon: const Icon(Icons.search, color: AppColors.grey500),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppSizes.radius8),
            borderSide: BorderSide.none,
          ),
          filled: true,
          fillColor: AppColors.surface,
          contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: AppSizes.p16),
        ),
        onChanged: (val) => notifier.updateSearchQuery(val),
      ),
    );
  }

  void _showFilters(BuildContext context, MtpReviewNotifier notifier) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppSizes.radius24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(AppSizes.p24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Filter Status', style: AppTypography.headlineMedium),
              AppSizes.gap16,
              Wrap(
                spacing: 8.0,
                children: [
                  'All',
                  'Pending Approval',
                  'Approved',
                  'Rejected',
                  'Returned for Correction',
                  'Provisionally Approved',
                  'Locked'
                ].map((status) => ActionChip(
                  label: Text(status),
                  onPressed: () {
                    notifier.updateFilters({'status': status});
                    Navigator.pop(ctx);
                  },
                )).toList(),
              ),
              AppSizes.gap32,
            ],
          ),
        );
      },
    );
  }

  Widget _buildContent(BuildContext context, MtpReviewState state, MtpReviewNotifier notifier) {
    if (state is MtpReviewLoading) {
      return const Center(child: CircularProgressIndicator());
    } else if (state is MtpReviewError) {
      return Center(
        child: Text(state.message, style: AppTypography.bodyMedium.copyWith(color: AppColors.error)),
      );
    } else if (state is MtpReviewLoaded) {
      if (state.submissions.isEmpty) {
        return Center(
          child: Text('No MTPs found.', style: AppTypography.bodyLarge),
        );
      }
      return RefreshIndicator(
        onRefresh: () => notifier.refresh(),
        child: ListView.separated(
          padding: const EdgeInsets.all(AppSizes.p16),
          itemCount: state.submissions.length,
          separatorBuilder: (context, index) => AppSizes.gap16,
          itemBuilder: (context, index) {
            final submission = state.submissions[index];
            return _buildMtpCard(context, submission);
          },
        ),
      );
    }
    return const SizedBox.shrink();
  }

  Widget _buildMtpCard(BuildContext context, MtpSubmissionModel submission) {
    return GestureDetector(
      onTap: () {
        context.push('/mtp-review-details', extra: submission);
      },
      child: Container(
        padding: const EdgeInsets.all(AppSizes.p16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppSizes.radius12),
          border: Border.all(color: AppColors.grey300),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
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
                      Text(submission.employeeName, style: AppTypography.headlineSmall),
                      AppSizes.gap4,
                      Text('${submission.employeeCode} | ${submission.hq}', style: AppTypography.bodySmall),
                    ],
                  ),
                ),
                _buildStatusBadge(submission.status),
              ],
            ),
            const Divider(height: AppSizes.p24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildInfoCol('Month', submission.month),
                _buildInfoCol('Working Days', '${submission.validationSummary.totalWorkingDays}'),
                _buildInfoCol('Submitted', DateFormat('dd MMM').format(submission.submittedAt)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color = AppColors.primary;
    if (status == 'Approved' || status == 'Locked') color = AppColors.success;
    if (status == 'Rejected' || status == 'Returned for Correction') color = AppColors.error;
    if (status == 'Pending Approval') color = AppColors.warning;
    if (status == 'Provisionally Approved') color = Colors.purple;

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

  Widget _buildInfoCol(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTypography.bodySmall.copyWith(color: AppColors.grey600)),
        AppSizes.gap4,
        Text(value, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
      ],
    );
  }
}
