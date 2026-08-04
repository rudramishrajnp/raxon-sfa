import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/announcement_model.dart';

class AnnouncementsSection extends StatelessWidget {
  final List<AnnouncementModel> announcements;

  const AnnouncementsSection({super.key, required this.announcements});

  @override
  Widget build(BuildContext context) {
    if (announcements.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSizes.p16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Announcements',
            style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold),
          ),
          AppSizes.gap12,
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: announcements.length,
            separatorBuilder: (context, index) => AppSizes.gap8,
            itemBuilder: (context, index) {
              final announcement = announcements[index];
              return _buildAnnouncementCard(announcement);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildAnnouncementCard(AnnouncementModel announcement) {
    final isHighPriority = announcement.priority.toLowerCase() == 'high';
    
    return Container(
      padding: const EdgeInsets.all(AppSizes.p12),
      decoration: BoxDecoration(
        color: announcement.isRead ? AppColors.surface : AppColors.primary.withOpacity(0.05),
        borderRadius: BorderRadius.circular(AppSizes.radius8),
        border: Border.all(
          color: isHighPriority ? AppColors.error.withOpacity(0.5) : AppColors.divider,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            isHighPriority ? Icons.campaign : Icons.info_outline,
            color: isHighPriority ? AppColors.error : AppColors.primary,
          ),
          AppSizes.gap12,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  announcement.title,
                  style: AppTypography.bodyMedium.copyWith(
                    fontWeight: announcement.isRead ? FontWeight.normal : FontWeight.bold,
                  ),
                ),
                AppSizes.gap4,
                Text(
                  DateFormat('dd MMM yyyy, hh:mm a').format(announcement.date),
                  style: AppTypography.labelSmall.copyWith(color: AppColors.grey500),
                ),
              ],
            ),
          ),
          if (!announcement.isRead)
            Container(
              width: 8,
              height: 8,
              decoration: const BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
              ),
            ),
        ],
      ),
    );
  }
}
