import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/secondary_sales_review_models.dart';

class SalesExceptionReportWidget extends StatelessWidget {
  final List<SalesExceptionReport> exceptions;

  const SalesExceptionReportWidget({super.key, required this.exceptions});

  @override
  Widget build(BuildContext context) {
    if (exceptions.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Exception Reports', style: AppTypography.headlineSmall.copyWith(color: AppColors.error)),
        AppSizes.gap16,
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: exceptions.length,
          separatorBuilder: (context, index) => AppSizes.gap8,
          itemBuilder: (context, index) {
            final exception = exceptions[index];
            return Container(
              padding: const EdgeInsets.all(AppSizes.p12),
              decoration: BoxDecoration(
                color: AppColors.error.withOpacity(0.05),
                borderRadius: BorderRadius.circular(AppSizes.radius8),
                border: Border.all(color: AppColors.error.withOpacity(0.3)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.warning_rounded, color: AppColors.error, size: 20),
                  AppSizes.gap12,
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(exception.type, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold, color: AppColors.error)),
                        AppSizes.gap4,
                        Text(exception.description, style: AppTypography.bodySmall),
                        AppSizes.gap4,
                        Text('Related: ${exception.relatedEntity}', style: AppTypography.bodySmall.copyWith(fontStyle: FontStyle.italic)),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
