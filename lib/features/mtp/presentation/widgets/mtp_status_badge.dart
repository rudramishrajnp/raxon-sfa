import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';

class MtpStatusBadge extends StatelessWidget {
  final String status;

  const MtpStatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    Color textColor;
    IconData iconData;

    switch (status.toUpperCase()) {
      case 'DRAFT':
        bgColor = AppColors.grey200;
        textColor = AppColors.grey700;
        iconData = Icons.edit_note;
        break;
      case 'PENDING':
        bgColor = Colors.orange.shade100;
        textColor = Colors.orange.shade800;
        iconData = Icons.hourglass_empty;
        break;
      case 'PROVISIONALLY_APPROVED':
        bgColor = Colors.blue.shade100;
        textColor = Colors.blue.shade800;
        iconData = Icons.check_circle_outline;
        break;
      case 'APPROVED':
        bgColor = AppColors.success.withOpacity(0.2);
        textColor = AppColors.success;
        iconData = Icons.verified;
        break;
      case 'REJECTED':
      case 'RETURNED_FOR_CORRECTION':
        bgColor = AppColors.error.withOpacity(0.2);
        textColor = AppColors.error;
        iconData = Icons.error_outline;
        break;
      case 'LOCKED':
        bgColor = AppColors.grey800;
        textColor = Colors.white;
        iconData = Icons.lock;
        break;
      default:
        bgColor = AppColors.grey200;
        textColor = AppColors.grey700;
        iconData = Icons.info_outline;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSizes.p12, vertical: 6.0),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(AppSizes.radius16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(iconData, size: 16, color: textColor),
          AppSizes.gap8,
          Text(
            status.replaceAll('_', ' '),
            style: AppTypography.labelSmall.copyWith(color: textColor, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
