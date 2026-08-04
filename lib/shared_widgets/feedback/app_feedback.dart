import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_sizes.dart';
import '../../core/constants/app_typography.dart';
import '../buttons/app_button.dart';

class AppLoadingIndicator extends StatelessWidget {
  final String? message;
  const AppLoadingIndicator({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const CircularProgressIndicator(color: AppColors.primary),
          if (message != null) ...[
            AppSizes.gap16,
            Text(message!, style: AppTypography.bodyMedium),
          ]
        ],
      ),
    );
  }
}

class AppEmptyState extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final String? actionText;
  final VoidCallback? onAction;

  const AppEmptyState({
    super.key,
    required this.title,
    required this.description,
    required this.icon,
    this.actionText,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 80, color: AppColors.grey300),
            AppSizes.gap24,
            Text(title, style: AppTypography.titleLarge, textAlign: TextAlign.center),
            AppSizes.gap8,
            Text(description, style: AppTypography.bodyMedium.copyWith(color: AppColors.grey600), textAlign: TextAlign.center),
            if (actionText != null && onAction != null) ...[
              AppSizes.gap24,
              AppButton(text: actionText!, onPressed: onAction!),
            ]
          ],
        ),
      ),
    );
  }
}

class AppFeedback {
  AppFeedback._();

  static void showSnackBar(BuildContext context, String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? AppColors.error : AppColors.grey900,
      ),
    );
  }

  static void showSuccessDialog(BuildContext context, {required String title, required String message, VoidCallback? onOk}) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        icon: const Icon(Icons.check_circle, color: AppColors.success, size: 48),
        title: Text(title),
        content: Text(message, textAlign: TextAlign.center),
        actions: [
          AppButton(text: 'OK', onPressed: () {
            Navigator.pop(context);
            onOk?.call();
          }),
        ],
      ),
    );
  }

  static void showConfirmationDialog(BuildContext context, {required String title, required String message, required VoidCallback onConfirm}) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          AppButton(type: AppButtonType.text, text: 'Cancel', onPressed: () => Navigator.pop(context)),
          AppButton(type: AppButtonType.primary, text: 'Confirm', onPressed: () {
            Navigator.pop(context);
            onConfirm();
          }),
        ],
      ),
    );
  }
}
