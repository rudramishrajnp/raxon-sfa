import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../shared_widgets/buttons/app_button.dart';

class ExpenseHomeScreen extends StatelessWidget {
  const ExpenseHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Expenses')),
      body: Padding(
        padding: const EdgeInsets.all(AppSizes.p24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AppButton(
              text: 'New Daily Expense',
              onPressed: () => context.push('/expense-entry'),
            ),
            AppSizes.gap16,
            AppButton(
              text: 'Demo: Manager Review',
              onPressed: () => context.push('/manager-review', extra: {'expenseId': 'E123', 'claimAmount': 3500.0}),
              type: AppButtonType.outline,
            ),
            AppSizes.gap16,
            AppButton(
              text: 'Demo: Finance Payment',
              onPressed: () => context.push('/finance-review', extra: {'expenseId': 'E123', 'approvedAmount': 3500.0}),
              type: AppButtonType.outline,
            ),
            AppSizes.gap16,
            AppButton(
              text: 'Demo: Payment Status',
              onPressed: () => context.push('/payment-status', extra: {'expenseId': 'E123'}),
              type: AppButtonType.outline,
            ),
          ],
        ),
      ),
    );
  }
}
