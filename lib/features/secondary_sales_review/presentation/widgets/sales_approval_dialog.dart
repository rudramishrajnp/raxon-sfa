import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';

class SalesApprovalDialog extends StatefulWidget {
  final String actionType; // 'Approve', 'Reject', 'Return for Correction'
  final Function(String remarks) onConfirm;

  const SalesApprovalDialog({
    super.key, 
    required this.actionType,
    required this.onConfirm,
  });

  @override
  State<SalesApprovalDialog> createState() => _SalesApprovalDialogState();
}

class _SalesApprovalDialogState extends State<SalesApprovalDialog> {
  final TextEditingController _remarksController = TextEditingController();

  @override
  void dispose() {
    _remarksController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    bool requiresRemarks = widget.actionType == 'Reject' || widget.actionType == 'Return for Correction';

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
                  ? 'Remarks are mandatory for this action.'
                  : 'Add optional remarks.',
              style: AppTypography.bodyMedium.copyWith(color: requiresRemarks ? AppColors.error : AppColors.grey700),
            ),
            AppSizes.gap8,
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
