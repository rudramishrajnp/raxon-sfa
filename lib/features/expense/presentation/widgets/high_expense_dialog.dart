import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';

class HighExpenseDialog extends StatefulWidget {
  final double amount;
  final double limit;
  final String category;

  const HighExpenseDialog({
    super.key,
    required this.amount,
    required this.limit,
    required this.category,
  });

  @override
  State<HighExpenseDialog> createState() => _HighExpenseDialogState();
}

class _HighExpenseDialogState extends State<HighExpenseDialog> {
  final _justificationController = TextEditingController();

  @override
  void dispose() {
    _justificationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Row(
        children: [
          const Icon(Icons.warning_amber_rounded, color: AppColors.error),
          AppSizes.gap8,
          const Text('High Expense Flag'),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('The entered amount for ${widget.category} exceeds the configured limit.', style: AppTypography.bodyMedium),
            AppSizes.gap16,
            _buildRow('Entered Amount:', '₹${widget.amount.toStringAsFixed(2)}'),
            _buildRow('Configured Limit:', '₹${widget.limit.toStringAsFixed(2)}'),
            _buildRow('Exceeded By:', '₹${(widget.amount - widget.limit).toStringAsFixed(2)}', isError: true),
            AppSizes.gap16,
            Text('Justification Required *', style: AppTypography.labelMedium),
            AppSizes.gap8,
            TextField(
              controller: _justificationController,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText: 'Enter reason for exceeding limit...',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        AppButton(
          text: 'Confirm & Flag',
          onPressed: () {
            if (_justificationController.text.trim().isEmpty) {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Justification is required.')));
              return;
            }
            Navigator.of(context).pop(_justificationController.text);
          },
        ),
      ],
    );
  }

  Widget _buildRow(String label, String value, {bool isError = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSizes.p4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AppTypography.bodyMedium),
          Text(
            value,
            style: AppTypography.titleSmall.copyWith(
              color: isError ? AppColors.error : AppColors.textPrimary,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
