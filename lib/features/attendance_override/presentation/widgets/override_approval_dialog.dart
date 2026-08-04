import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';

class OverrideApprovalDialog extends StatefulWidget {
  final String actionType; // 'Approve', 'Reject', 'Return for Clarification'
  final Function(String remarks) onConfirm;

  const OverrideApprovalDialog({
    super.key, 
    required this.actionType,
    required this.onConfirm,
  });

  @override
  State<OverrideApprovalDialog> createState() => _OverrideApprovalDialogState();
}

class _OverrideApprovalDialogState extends State<OverrideApprovalDialog> {
  final TextEditingController _remarksController = TextEditingController();

  @override
  void dispose() {
    _remarksController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        padding: const EdgeInsets.all(AppSizes.p24),
        decoration: const BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.vertical(top: Radius.circular(AppSizes.radius24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(widget.actionType, style: AppTypography.headlineMedium),
            AppSizes.gap16,
            Text(
              'Remarks are mandatory for this action.',
              style: AppTypography.bodyMedium.copyWith(color: AppColors.error),
            ),
            AppSizes.gap8,
            TextField(
              controller: _remarksController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'Enter mandatory remarks...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppSizes.radius8),
                ),
                filled: true,
                fillColor: AppColors.background,
              ),
            ),
            AppSizes.gap24,
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    text: 'Cancel',
                    onPressed: () => Navigator.pop(context),
                    type: AppButtonType.secondary,
                  ),
                ),
                AppSizes.gap16,
                Expanded(
                  child: AppButton(
                    text: 'Confirm',
                    onPressed: () {
                      if (_remarksController.text.trim().isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Remarks are mandatory for this action.')),
                        );
                        return;
                      }
                      
                      widget.onConfirm(_remarksController.text.trim());
                      Navigator.pop(context);
                    },
                    type: AppButtonType.primary,
                  ),
                ),
              ],
            ),
            AppSizes.gap16,
          ],
        ),
      ),
    );
  }
}
