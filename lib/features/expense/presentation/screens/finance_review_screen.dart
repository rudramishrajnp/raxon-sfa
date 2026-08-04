import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/expense_approval_provider.dart';
import '../providers/expense_approval_state.dart';

class FinanceReviewScreen extends ConsumerStatefulWidget {
  final String expenseId;
  final double approvedAmount;

  const FinanceReviewScreen({
    super.key,
    required this.expenseId,
    required this.approvedAmount,
  });

  @override
  ConsumerState<FinanceReviewScreen> createState() => _FinanceReviewScreenState();
}

class _FinanceReviewScreenState extends ConsumerState<FinanceReviewScreen> {
  String _selectedPaymentMode = 'Bank Transfer';
  final _transactionNumberController = TextEditingController();
  final _referenceNumberController = TextEditingController();

  final List<String> _paymentModes = ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Other'];

  @override
  void dispose() {
    _transactionNumberController.dispose();
    _referenceNumberController.dispose();
    super.dispose();
  }

  void _submit(String status) {
    if (status == 'Paid' && _selectedPaymentMode != 'Cash' && _transactionNumberController.text.trim().isEmpty) {
      AppFeedback.showSnackBar(context, 'Transaction number is required', isError: true);
      return;
    }

    ref.read(expenseApprovalNotifierProvider.notifier).submitFinancePayment(
      expenseId: widget.expenseId,
      financeId: 'FINANCE_999',
      status: status,
      paymentMode: _selectedPaymentMode,
      transactionNumber: _transactionNumberController.text,
      referenceNumber: _referenceNumberController.text,
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
            context.pop();
            context.pop();
          },
        );
      } else if (next is ExpenseApprovalError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      }
    });

    final isLoading = ref.watch(expenseApprovalNotifierProvider) is ExpenseApprovalLoading;

    return Scaffold(
      appBar: AppBar(title: const Text('Finance Processing')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Amount to Pay: ₹${widget.approvedAmount.toStringAsFixed(2)}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            AppSizes.gap24,
            DropdownButtonFormField<String>(
              value: _selectedPaymentMode,
              decoration: const InputDecoration(
                labelText: 'Payment Mode',
                border: OutlineInputBorder(),
              ),
              items: _paymentModes.map((mode) => DropdownMenuItem(value: mode, child: Text(mode))).toList(),
              onChanged: (value) {
                if (value != null) setState(() => _selectedPaymentMode = value);
              },
            ),
            AppSizes.gap16,
            if (_selectedPaymentMode != 'Cash') ...[
              TextField(
                controller: _transactionNumberController,
                decoration: const InputDecoration(
                  labelText: 'Transaction Number',
                  border: OutlineInputBorder(),
                ),
              ),
              AppSizes.gap16,
            ],
            TextField(
              controller: _referenceNumberController,
              decoration: const InputDecoration(
                labelText: 'Reference Number (Optional)',
                border: OutlineInputBorder(),
              ),
            ),
            AppSizes.gap32,
            if (isLoading)
              const Center(child: CircularProgressIndicator())
            else ...[
              AppButton(
                text: 'Release Payment',
                onPressed: () => _submit('Paid'),
              ),
              AppSizes.gap16,
              AppButton(
                text: 'Hold Payment',
                onPressed: () => _submit('Hold'),
                type: AppButtonType.outline,
              ),
              AppSizes.gap16,
              AppButton(
                text: 'Reject Payment',
                onPressed: () => _submit('Failed'),
                type: AppButtonType.outline,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
