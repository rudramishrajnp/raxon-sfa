import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/expense_approval_provider.dart';
import '../providers/expense_approval_state.dart';

class ManagerReviewScreen extends ConsumerStatefulWidget {
  final String expenseId;
  final double claimAmount;

  const ManagerReviewScreen({
    super.key,
    required this.expenseId,
    required this.claimAmount,
  });

  @override
  ConsumerState<ManagerReviewScreen> createState() => _ManagerReviewScreenState();
}

class _ManagerReviewScreenState extends ConsumerState<ManagerReviewScreen> {
  final _approvedAmountController = TextEditingController();
  final _remarksController = TextEditingController();
  final _reasonController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _approvedAmountController.text = widget.claimAmount.toStringAsFixed(2);
  }

  @override
  void dispose() {
    _approvedAmountController.dispose();
    _remarksController.dispose();
    _reasonController.dispose();
    super.dispose();
  }

  void _submit(String status) {
    final approvedAmount = double.tryParse(_approvedAmountController.text);
    if (status == 'Approved' && approvedAmount == null) {
      AppFeedback.showSnackBar(context, 'Invalid approved amount', isError: true);
      return;
    }
    
    double? rejectedAmount;
    if (status == 'Partially Approved' && approvedAmount != null) {
      rejectedAmount = widget.claimAmount - approvedAmount;
      if (rejectedAmount <= 0) {
         AppFeedback.showSnackBar(context, 'Approved amount must be less than claim for Partial Approval', isError: true);
         return;
      }
      if (_reasonController.text.trim().isEmpty) {
        AppFeedback.showSnackBar(context, 'Adjustment reason is required', isError: true);
        return;
      }
    }

    ref.read(expenseApprovalNotifierProvider.notifier).submitManagerReview(
      expenseId: widget.expenseId,
      approverId: 'MANAGER_123', // Hardcoded for demo
      approverRole: 'Area Manager',
      status: status,
      claimAmount: widget.claimAmount,
      approvedAmount: status == 'Rejected' ? 0.0 : approvedAmount,
      rejectedAmount: status == 'Rejected' ? widget.claimAmount : rejectedAmount,
      adjustmentReason: _reasonController.text,
      remarks: _remarksController.text,
    );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(expenseApprovalNotifierProvider, (previous, next) {
      if (next is ExpenseApprovalSuccess) {
        AppFeedback.showSuccessDialog(
          context,
          title: 'Success',
          message: next.message,
          onOk: () {
            context.pop(); // Close dialog
            context.pop(); // Go back
          },
        );
      } else if (next is ExpenseApprovalError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      }
    });

    final isLoading = ref.watch(expenseApprovalNotifierProvider) is ExpenseApprovalLoading;

    return Scaffold(
      appBar: AppBar(title: const Text('Review Expense')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSizes.p16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildClaimSummary(),
              AppSizes.gap24,
              Text('Approval Action', style: AppTypography.titleMedium),
              AppSizes.gap16,
              TextField(
                controller: _approvedAmountController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Approved Amount',
                  border: OutlineInputBorder(),
                  prefixText: '₹ ',
                ),
              ),
              AppSizes.gap16,
              TextField(
                controller: _reasonController,
                decoration: const InputDecoration(
                  labelText: 'Adjustment Reason (if partially approving)',
                  border: OutlineInputBorder(),
                ),
                maxLines: 2,
              ),
              AppSizes.gap16,
              TextField(
                controller: _remarksController,
                decoration: const InputDecoration(
                  labelText: 'Remarks / Comments',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
              AppSizes.gap24,
              if (isLoading)
                const Center(child: CircularProgressIndicator())
              else ...[
                Row(
                  children: [
                    Expanded(
                      child: AppButton(
                        text: 'Approve',
                        onPressed: () => _submit('Approved'),
                      ),
                    ),
                    AppSizes.gap16,
                    Expanded(
                      child: AppButton(
                        text: 'Partial',
                        onPressed: () => _submit('Partially Approved'),
                        type: AppButtonType.outline,
                      ),
                    ),
                  ],
                ),
                AppSizes.gap16,
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => _submit('Returned for Correction'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.orange,
                          side: const BorderSide(color: Colors.orange),
                          padding: const EdgeInsets.symmetric(vertical: AppSizes.p16),
                        ),
                        child: const Text('Return', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      ),
                    ),
                    AppSizes.gap16,
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => _submit('Rejected'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.error,
                          side: const BorderSide(color: AppColors.error),
                          padding: const EdgeInsets.symmetric(vertical: AppSizes.p16),
                        ),
                        child: const Text('Reject', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildClaimSummary() {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: Colors.blue.withOpacity(0.05),
        borderRadius: BorderRadius.circular(AppSizes.radius8),
        border: Border.all(color: Colors.blue.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Expense Summary', style: AppTypography.titleMedium.copyWith(color: AppColors.primary)),
          AppSizes.gap8,
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Claimed Amount:'),
              Text('₹${widget.claimAmount.toStringAsFixed(2)}', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
            ],
          ),
          AppSizes.gap8,
          Row(
            children: [
              const Icon(Icons.warning, color: Colors.orange, size: 16),
              AppSizes.gap8,
              Text('High Expense Flag Detected', style: AppTypography.bodySmall.copyWith(color: Colors.orange)),
            ],
          ),
        ],
      ),
    );
  }
}
