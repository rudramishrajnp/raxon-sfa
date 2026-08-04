import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../providers/override_provider.dart';
import '../providers/override_state.dart';
import '../../data/models/override_models.dart';

class ManagerOverrideListScreen extends ConsumerWidget {
  const ManagerOverrideListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(overrideNotifierProvider);
    final notifier = ref.read(overrideNotifierProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text('Re-Punch-In Requests', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: AppColors.onPrimary),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => notifier.loadRequests(),
          ),
        ],
      ),
      body: _buildContent(context, state, notifier),
    );
  }

  Widget _buildContent(BuildContext context, OverrideState state, OverrideNotifier notifier) {
    if (state is OverrideLoading || state is OverrideInitial) {
      return const Center(child: CircularProgressIndicator());
    } else if (state is OverrideError) {
      return Center(
        child: Text(state.message, style: AppTypography.bodyMedium.copyWith(color: AppColors.error)),
      );
    } else if (state is OverrideLoaded) {
      if (state.pendingRequests.isEmpty) {
        return Center(
          child: Text('No pending requests found.', style: AppTypography.bodyLarge),
        );
      }
      return RefreshIndicator(
        onRefresh: () => notifier.loadRequests(),
        child: ListView.separated(
          padding: const EdgeInsets.all(AppSizes.p16),
          itemCount: state.pendingRequests.length,
          separatorBuilder: (context, index) => AppSizes.gap16,
          itemBuilder: (context, index) {
            final request = state.pendingRequests[index];
            return _buildRequestCard(context, request);
          },
        ),
      );
    }
    return const SizedBox.shrink();
  }

  Widget _buildRequestCard(BuildContext context, OverrideRequestModel request) {
    return GestureDetector(
      onTap: () {
        context.push('/override-review', extra: request);
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
                      Text(request.employeeName, style: AppTypography.headlineSmall),
                      AppSizes.gap4,
                      Text('${request.employeeCode} | ${request.hq}', style: AppTypography.bodySmall.copyWith(color: AppColors.grey600)),
                    ],
                  ),
                ),
                _buildStatusBadge(request.status),
              ],
            ),
            const Divider(height: AppSizes.p24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildInfoCol('Request Time', DateFormat('hh:mm a').format(request.requestTime)),
                _buildInfoCol('Original Punch Out', DateFormat('hh:mm a').format(request.originalPunchOut)),
              ],
            ),
            AppSizes.gap16,
            Text('Reason: ${request.reason}', style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color = AppColors.primary;
    if (status == 'Approved') color = AppColors.success;
    if (status == 'Rejected') color = AppColors.error;
    if (status == 'Clarification Requested') color = AppColors.warning;

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
