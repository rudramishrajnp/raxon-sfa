import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';

class ExpenseApprovalDialog extends StatefulWidget {
  final String actionType; // 'Approve', 'Partially Approve', 'Reject', 'Return for Correction'
  final double claimedAmount;
  final Function(String remarks, double? adjustedAmount) onConfirm;

  const ExpenseApprovalDialog({
    super.key, 
    required this.actionType, 
    required this.claimedAmount,
    required this.onConfirm,
  });

  @override
  State<ExpenseApprovalDialog> createState() => _ExpenseApprovalDialogState();
}

class _ExpenseApprovalDialogState extends State<ExpenseApprovalDialog> {
  final TextEditingController _remarksController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.actionType == 'Partially Approve') {
      _amountController.text = widget.claimedAmount.toString();
    }
  }

  @override
  void dispose() {
    _remarksController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    bool isPartial = widget.actionType == 'Partially Approve';
    bool requiresRemarks = widget.actionType == 'Reject' || widget.actionType == 'Return for Correction' || isPartial;

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
            if (isPartial) ...[
              Text('Approved Amount (Claimed: ₹${widget.claimedAmount})', style: AppTypography.bodyMedium),
              AppSizes.gap8,
              TextField(
                controller: _amountController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: InputDecoration(
                  prefixText: '₹ ',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppSizes.radius8),
                  ),
                  filled: true,
                  fillColor: AppColors.background,
                ),
              ),
              AppSizes.gap16,
            ],
            Text(
              requiresRemarks 
                  ? 'Remarks are mandatory for this action.'
                  : 'Add optional remarks.',
              style: AppTypography.bodyMedium,
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
                      
                      double? adjustedAmount;
                      if (isPartial) {
                        adjustedAmount = double.tryParse(_amountController.text.trim());
                        if (adjustedAmount == null || adjustedAmount > widget.claimedAmount || adjustedAmount <= 0) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Please enter a valid amount less than or equal to claimed amount.')),
                          );
                          return;
                        }
                      }
                      
                      widget.onConfirm(_remarksController.text.trim(), adjustedAmount);
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
