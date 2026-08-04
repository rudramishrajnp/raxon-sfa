import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_sizes.dart';
import '../../../core/constants/app_strings.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/services/startup_service.dart';
import 'providers/splash_provider.dart';
import 'providers/splash_state.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  Widget build(BuildContext context) {
    // Listen for state changes to trigger navigation once startup is completed
    ref.listen<SplashState>(splashNotifierProvider, (previous, next) {
      if (next is SplashStateCompleted) {
        _handleNavigationDecision(next.result);
      }
    });

    final splashState = ref.watch(splashNotifierProvider);

    return Scaffold(
      backgroundColor: AppColors.primary,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Animated Logo Placeholder
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 20,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(
                    Icons.business_center,
                    size: 64,
                    color: AppColors.primary,
                  ),
                ),
              ),
              AppSizes.gap32,

              // App Name
              Text(
                AppStrings.appName.toUpperCase(),
                style: AppTypography.headlineMedium.copyWith(
                  color: AppColors.onPrimary,
                  letterSpacing: 2.5,
                ),
                textAlign: TextAlign.center,
              ),
              AppSizes.gap16,

              // Version Number
              Text(
                "v1.0.0",
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.onPrimary.withOpacity(0.8),
                  letterSpacing: 1.0,
                ),
              ),

              SizedBox(height: 64.0),

              // Dynamic Status / Loading / Error Indicators
              _buildStatusIndicator(splashState),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusIndicator(SplashState state) {
    if (state is SplashStateLoading) {
      return Column(
        children: [
          const SizedBox(
            width: 40,
            height: 40,
            child: CircularProgressIndicator(
              color: AppColors.onPrimary,
              strokeWidth: 3,
            ),
          ),
          AppSizes.gap24,
          Text(
            state.message,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.onPrimary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      );
    } else if (state is SplashStateError) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSizes.p32),
        child: Column(
          children: [
            const Icon(Icons.error_outline, color: AppColors.error, size: 48),
            AppSizes.gap16,
            Text(
              state.errorMessage,
              style: AppTypography.bodyMedium.copyWith(color: AppColors.onPrimary),
              textAlign: TextAlign.center,
            ),
            AppSizes.gap24,
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.surface,
                foregroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(horizontal: AppSizes.p24, vertical: AppSizes.p12),
              ),
              onPressed: () {
                ref.read(splashNotifierProvider.notifier).retry();
              },
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            )
          ],
        ),
      );
    }

    // Default empty space for Initial or Completed state
    return const SizedBox(height: 80);
  }

  void _handleNavigationDecision(StartupResult result) {
    // In the real application with existing routes, we will use:
    // context.go('/login') or context.go('/dashboard')
    
    switch (result) {
      case StartupResult.firstTimeUser:
      case StartupResult.invalidSession:
      case StartupResult.deviceMismatch:
        context.go('/login');
        break;
      case StartupResult.loggedInUser:
        context.go('/dashboard');
        break;
    }
  }
}
