import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/expense_provider.dart';
import '../providers/expense_state.dart';
import '../widgets/da_widget.dart';
import '../widgets/ta_widget.dart';
import '../widgets/misc_expense_widget.dart';
import '../widgets/expense_summary_widget.dart';

class DailyExpenseEntryScreen extends ConsumerStatefulWidget {
  const DailyExpenseEntryScreen({super.key});

  @override
  ConsumerState<DailyExpenseEntryScreen> createState() => _DailyExpenseEntryScreenState();
}

class _DailyExpenseEntryScreenState extends ConsumerState<DailyExpenseEntryScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(expenseNotifierProvider.notifier).initializeNewExpense(DateTime.now(), 'HQ'));
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(expenseNotifierProvider, (previous, next) {
      if (next is ExpenseSuccess) {
        AppFeedback.showSuccessDialog(
          context,
          title: 'Success',
          message: next.message,
          onOk: () {
            context.pop(); // close dialog
            context.pop(); // go back
          },
        );
      } else if (next is ExpenseError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      }
    });

    final state = ref.watch(expenseNotifierProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Daily Expense Entry')),
      body: SafeArea(
        child: _buildBody(state),
      ),
    );
  }

  Widget _buildBody(ExpenseState state) {
    if (state is ExpenseLoading || state is ExpenseInitial) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state is ExpenseLoaded || state is ExpenseError) {
      ExpenseLoaded? loadedState;
      if (state is ExpenseLoaded) loadedState = state;
      // We will fallback if error but there is no previous loaded state
      if (loadedState == null) return const Center(child: CircularProgressIndicator());

      return Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSizes.p16),
              child: Column(
                children: [
                  DaWidget(
                    locationType: loadedState.locationType,
                    daAmount: loadedState.daAmount,
                    onLocationTypeChanged: ref.read(expenseNotifierProvider.notifier).updateLocationType,
                  ),
                  AppSizes.gap16,
                  TaWidget(
                    taType: loadedState.taType,
                    taDistance: loadedState.taDistance,
                    taRate: loadedState.taRate,
                    taAmount: loadedState.taAmount,
                    onUpdate: ref.read(expenseNotifierProvider.notifier).updateTA,
                  ),
                  AppSizes.gap16,
                  MiscExpenseWidget(
                    expenses: loadedState.miscExpenses,
                    onAdd: ref.read(expenseNotifierProvider.notifier).addMiscExpense,
                    onRemove: ref.read(expenseNotifierProvider.notifier).removeMiscExpense,
                  ),
                ],
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.all(AppSizes.p16),
            decoration: BoxDecoration(
              color: Theme.of(context).scaffoldBackgroundColor,
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5)),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ExpenseSummaryWidget(grandTotal: loadedState.grandTotal),
                AppSizes.gap16,
                AppButton(
                  text: 'Upload Bills',
                  onPressed: () => context.push('/bill-upload', extra: {'expenseId': 'temp_expense_123'}),
                  type: AppButtonType.outline,
                ),
                AppSizes.gap16,
                AppButton(
                  text: 'Save as Draft',
                  onPressed: () => ref.read(expenseNotifierProvider.notifier).saveDraft(),
                ),
              ],
            ),
          ),
        ],
      );
    }
    
    return const SizedBox.shrink();
  }
}
