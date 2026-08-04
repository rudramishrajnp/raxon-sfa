import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_sizes.dart';

enum AppButtonType { primary, secondary, outline, text, danger }

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final AppButtonType type;
  final bool isLoading;
  final IconData? icon;
  final Color? backgroundColor;
  final Color? foregroundColor;

  const AppButton({
    super.key,
    required this.text,
    required this.onPressed,
    AppButtonType? type,
    this.isLoading = false,
    this.icon,
    this.backgroundColor,
    this.foregroundColor,
    bool? isOutlined,
  }) : type = (isOutlined ?? false) ? AppButtonType.outline : (type ?? AppButtonType.primary);

  @override
  Widget build(BuildContext context) {
    if (type == AppButtonType.outline) {
      return OutlinedButton(
        style: backgroundColor != null || foregroundColor != null
            ? OutlinedButton.styleFrom(
                backgroundColor: backgroundColor,
                foregroundColor: foregroundColor,
              )
            : null,
        onPressed: isLoading ? null : onPressed,
        child: _buildChild(),
      );
    } else if (type == AppButtonType.text) {
      return TextButton(
        style: foregroundColor != null
            ? TextButton.styleFrom(foregroundColor: foregroundColor)
            : null,
        onPressed: isLoading ? null : onPressed,
        child: _buildChild(),
      );
    }

    return ElevatedButton(
      style: _getElevatedStyle(),
      onPressed: isLoading ? null : onPressed,
      child: _buildChild(),
    );
  }

  Widget _buildChild() {
    if (isLoading) {
      return const SizedBox(
        height: 20,
        width: 20,
        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
      );
    }
    if (icon != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: AppSizes.icon20),
          AppSizes.gap8,
          Text(text),
        ],
      );
    }
    return Text(text);
  }

  ButtonStyle? _getElevatedStyle() {
    if (backgroundColor != null || foregroundColor != null) {
      return ElevatedButton.styleFrom(
        backgroundColor: backgroundColor,
        foregroundColor: foregroundColor,
      );
    }
    switch (type) {
      case AppButtonType.secondary:
        return ElevatedButton.styleFrom(
          backgroundColor: AppColors.secondary,
          foregroundColor: AppColors.onSecondary,
        );
      case AppButtonType.danger:
        return ElevatedButton.styleFrom(
          backgroundColor: AppColors.error,
          foregroundColor: AppColors.onError,
        );
      default:
        return null; // Theme default (Primary)
    }
  }
}
