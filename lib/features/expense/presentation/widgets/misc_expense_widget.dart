import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/misc_expense_model.dart';
import '../../../../shared_widgets/buttons/app_button.dart';

class MiscExpenseWidget extends StatefulWidget {
  final List<MiscExpenseModel> expenses;
  final Function(String, double, String?) onAdd;
  final Function(String) onRemove;

  const MiscExpenseWidget({
    super.key,
    required this.expenses,
    required this.onAdd,
    required this.onRemove,
  });

  @override
  State<MiscExpenseWidget> createState() => _MiscExpenseWidgetState();
}

class _MiscExpenseWidgetState extends State<MiscExpenseWidget> {
  final _categories = ['Stationery', 'Local Transport', 'Parking', 'Food', 'Courier', 'Hotel', 'Other'];
  String _selectedCategory = 'Stationery';
  final _amountController = TextEditingController();
  final _remarksController = TextEditingController();

  void _handleAdd() {
    final amount = double.tryParse(_amountController.text) ?? 0.0;
    if (amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Enter a valid amount')));
      return;
    }
    
    widget.onAdd(_selectedCategory, amount, _remarksController.text.isNotEmpty ? _remarksController.text : null);
    _amountController.clear();
    _remarksController.clear();
  }

  @override
  void dispose() {
    _amountController.dispose();
    _remarksController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      color: AppColors.surface.withOpacity(0.5),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppSizes.radius12)),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Miscellaneous Expense', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
            const Divider(),
            AppSizes.gap8,
            
            // Add Form
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _selectedCategory,
                    decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder(), isDense: true),
                    items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedCategory = val);
                    },
                  ),
                ),
                AppSizes.gap8,
                Expanded(
                  child: TextFormField(
                    controller: _amountController,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    decoration: const InputDecoration(labelText: 'Amount', border: OutlineInputBorder(), isDense: true),
                  ),
                ),
              ],
            ),
            AppSizes.gap8,
            TextFormField(
              controller: _remarksController,
              decoration: const InputDecoration(labelText: 'Remarks (Optional)', border: OutlineInputBorder(), isDense: true),
            ),
            AppSizes.gap12,
            AppButton(text: 'Add Expense', onPressed: _handleAdd, type: AppButtonType.outline),
            
            if (widget.expenses.isNotEmpty) ...[
              AppSizes.gap16,
              const Text('Added Expenses', style: TextStyle(fontWeight: FontWeight.bold)),
              AppSizes.gap8,
              ...widget.expenses.map((e) => ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text('${e.category} - ₹${e.amount}'),
                subtitle: e.remarks != null ? Text(e.remarks!) : null,
                trailing: IconButton(
                  icon: const Icon(Icons.delete, color: AppColors.error),
                  onPressed: () => widget.onRemove(e.id),
                ),
              )),
            ]
          ],
        ),
      ),
    );
  }
}
