import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';

class MtpLockedScreen extends StatelessWidget {
  final String reason;

  const MtpLockedScreen({super.key, required this.reason});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSizes.p32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.lock_outline, size: 80, color: AppColors.error),
              AppSizes.gap24,
              Text(
                'Access Restricted',
                style: AppTypography.displaySmall.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppColors.error,
                ),
                textAlign: TextAlign.center,
              ),
              AppSizes.gap16,
              Text(
                reason,
                style: AppTypography.bodyLarge,
                textAlign: TextAlign.center,
              ),
              AppSizes.gap32,
              AppButton(
                text: 'Go to MTP',
                onPressed: () => context.pushReplacement('/mtp'),
              ),
              AppSizes.gap16,
              TextButton(
                onPressed: () => context.pushReplacement('/dashboard'),
                child: const Text('Return to Dashboard'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
