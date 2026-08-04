import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';

class DcrReviewActionDialog extends StatefulWidget {
  final String actionType; // 'Verify', 'Flag', 'Request Clarification', 'Approve Override', 'Reject Override'
  final Function(String remarks) onConfirm;

  const DcrReviewActionDialog({super.key, required this.actionType, required this.onConfirm});

  @override
  State<DcrReviewActionDialog> createState() => _DcrReviewActionDialogState();
}

class _DcrReviewActionDialogState extends State<DcrReviewActionDialog> {
  final TextEditingController _remarksController = TextEditingController();

  @override
  void dispose() {
    _remarksController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    bool requiresRemarks = widget.actionType == 'Flag' || 
                           widget.actionType == 'Request Clarification' || 
                           widget.actionType == 'Reject Override';

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
              requiresRemarks 
                  ? 'Please provide remarks/reason for this action. This will be visible to the MR.'
                  : 'Add optional remarks.',
              style: AppTypography.bodyMedium,
            ),
            AppSizes.gap16,
            TextField(
              controller: _remarksController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'Enter remarks...',
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
                      if (requiresRemarks && _remarksController.text.trim().isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Remarks are mandatory for this action.')),
                        );
                        return;
                      }
                      widget.onConfirm(_remarksController.text.trim());
                      Navigator.pop(context);
                    },
                    type: requiresRemarks ? AppButtonType.primary : AppButtonType.primary,
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
