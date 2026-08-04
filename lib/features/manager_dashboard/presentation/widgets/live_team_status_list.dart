import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/team_member_status_model.dart';

class LiveTeamStatusList extends StatelessWidget {
  final List<TeamMemberStatusModel> teamStatus;

  const LiveTeamStatusList({super.key, required this.teamStatus});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Live Team Status', style: AppTypography.headlineSmall),
        AppSizes.gap16,
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: teamStatus.length,
          separatorBuilder: (context, index) => const Divider(height: AppSizes.p32),
          itemBuilder: (context, index) {
            final member = teamStatus[index];
            return _buildMemberTile(member);
          },
        ),
      ],
    );
  }

  Widget _buildMemberTile(TeamMemberStatusModel member) {
    return Column(
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
                  Text('${member.hq} | ${member.currentStatus}', style: AppTypography.bodyMedium),
                ],
              ),
            ),
            _buildStatusIndicator(member),
          ],
        ),
        AppSizes.gap12,
        _buildInfoRow(Icons.access_time, 'Last GPS: ${DateFormat('hh:mm a').format(member.lastGpsUpdateTime)}'),
        AppSizes.gap4,
        _buildInfoRow(Icons.local_activity, 'Activity: ${member.lastActivity}'),
        AppSizes.gap4,
        Row(
          children: [
            if (member.batteryLevel != null)
              Expanded(child: _buildInfoRow(Icons.battery_std, 'Battery: ${member.batteryLevel}%')),
            Expanded(child: _buildInfoRow(Icons.sync, 'Sync: ${member.syncStatus}')),
          ],
        ),
      ],
    );
  }

  Widget _buildStatusIndicator(TeamMemberStatusModel member) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: member.isOnline ? AppColors.success.withOpacity(0.1) : AppColors.error.withOpacity(0.1),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: member.isOnline ? AppColors.success : AppColors.error),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: member.isOnline ? AppColors.success : AppColors.error,
              shape: BoxShape.circle,
            ),
          ),
          AppSizes.gap8,
          Text(
            member.isOnline ? 'Online' : 'Offline',
            style: AppTypography.bodySmall.copyWith(
              color: member.isOnline ? AppColors.success : AppColors.error,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.grey600),
        AppSizes.gap8,
        Expanded(
          child: Text(
            text,
            style: AppTypography.bodySmall.copyWith(color: AppColors.grey700),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
