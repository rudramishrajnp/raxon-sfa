import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../providers/team_tracking_provider.dart';
import '../providers/team_tracking_state.dart';
import '../widgets/team_search_bar.dart';
import '../widgets/team_filters_sheet.dart';
import '../../data/models/team_tracking_models.dart';

class TeamTrackingScreen extends ConsumerWidget {
  const TeamTrackingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(teamTrackingNotifierProvider);
    final notifier = ref.read(teamTrackingNotifierProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text('Live Team Tracking', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: AppColors.onPrimary),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              showModalBottomSheet(
                context: context,
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
                builder: (context) => TeamFiltersSheet(
                  initialFilters: const {}, // Get from provider in real app
                  onApply: (filters) {
                    notifier.updateFilters(filters);
                  },
                ),
              );
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
            child: TeamSearchBar(
              onChanged: (query) => notifier.updateSearchQuery(query),
            ),
          ),
          Expanded(
            child: _buildContent(context, state, ref),
          ),
        ],
      ),
    );
  }

  Widget _buildContent(BuildContext context, TeamTrackingState state, WidgetRef ref) {
    if (state is TeamTrackingLoading) {
      return const Center(child: CircularProgressIndicator());
    } else if (state is TeamTrackingError) {
      return Center(
        child: Text(state.message, style: AppTypography.bodyMedium.copyWith(color: AppColors.error)),
      );
    } else if (state is TeamTrackingLoaded) {
      if (state.teamMembers.isEmpty) {
        return Center(
          child: Text('No team members found.', style: AppTypography.bodyLarge),
        );
      }
      return RefreshIndicator(
        onRefresh: () => ref.read(teamTrackingNotifierProvider.notifier).refresh(),
        child: ListView.separated(
          padding: const EdgeInsets.all(AppSizes.p16),
          itemCount: state.teamMembers.length,
          separatorBuilder: (context, index) => AppSizes.gap16,
          itemBuilder: (context, index) {
            final member = state.teamMembers[index];
            return _buildMemberCard(context, member);
          },
        ),
      );
    }
    return const SizedBox.shrink();
  }

  Widget _buildMemberCard(BuildContext context, TeamMemberLocationModel member) {
    return GestureDetector(
      onTap: () {
        context.push('/team-route', extra: member);
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
              children: [
                CircleAvatar(
                  backgroundColor: AppColors.primary.withOpacity(0.1),
                  child: Text(
                    member.name[0],
                    style: AppTypography.headlineSmall.copyWith(color: AppColors.primary),
                  ),
                ),
                AppSizes.gap12,
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(member.name, style: AppTypography.headlineSmall),
                      AppSizes.gap4,
                      Text('${member.employeeCode} | ${member.hq} - ${member.territory}', style: AppTypography.bodySmall),
                    ],
                  ),
                ),
                _buildStatusChip(member.currentStatus, member.isOnline),
              ],
            ),
            const Divider(height: AppSizes.p24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildInfoColumn(Icons.local_activity, 'Last Activity', DateFormat('hh:mm a').format(member.lastActivityTime)),
                _buildInfoColumn(Icons.gps_fixed, 'Last GPS', DateFormat('hh:mm a').format(member.lastGpsTime)),
                _buildInfoColumn(Icons.battery_std, 'Battery', member.batteryLevel != null ? '${member.batteryLevel}%' : 'N/A'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusChip(String status, bool isOnline) {
    Color color = isOnline ? AppColors.success : AppColors.grey500;
    if (status == 'Offline' || status == 'Punched Out') color = AppColors.grey500;
    if (status == 'At Doctor') color = AppColors.warning;
    
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

  Widget _buildInfoColumn(IconData icon, String label, String value) {
    return Column(
      children: [
        Icon(icon, size: 16, color: AppColors.grey600),
        AppSizes.gap4,
        Text(label, style: AppTypography.bodySmall.copyWith(color: AppColors.grey600, fontSize: 10)),
        Text(value, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.bold)),
      ],
    );
  }
}
