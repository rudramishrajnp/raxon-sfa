import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../authentication/data/models/user_model.dart'; // Or wherever the model is
import '../../../authentication/data/models/user_model.dart' as auth_model; // Use prefix if needed

class ManagerInfoHeader extends StatelessWidget {
  final auth_model.UserModel manager;
  // If no attendance for AM/RM, we can just omit it or mock it
  final String attendanceStatus = 'Present';

  const ManagerInfoHeader({super.key, required this.manager});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: AppColors.surface,
            child: Text(
              manager.name.isNotEmpty ? manager.name[0] : 'M',
              style: AppTypography.headlineMedium.copyWith(color: AppColors.primary),
            ),
          ),
          AppSizes.gap16,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  manager.name,
                  style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary),
                ),
                AppSizes.gap4,
                Text(
                  '${manager.role} | ID: ${manager.id}',
                  style: AppTypography.bodyMedium.copyWith(color: AppColors.onPrimary.withOpacity(0.8)),
                ),
                AppSizes.gap4,
                Text(
                  'Territory: ${manager.territory}',
                  style: AppTypography.bodySmall.copyWith(color: AppColors.onPrimary.withOpacity(0.8)),
                ),
                AppSizes.gap8,
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.success,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    'Status: $attendanceStatus',
                    style: AppTypography.bodySmall.copyWith(color: AppColors.onPrimary),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
