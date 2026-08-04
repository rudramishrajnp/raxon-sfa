import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../providers/work_plan_provider.dart';

class JointWorkDialog extends ConsumerStatefulWidget {
  const JointWorkDialog({super.key});

  @override
  ConsumerState<JointWorkDialog> createState() => _JointWorkDialogState();
}

class _JointWorkDialogState extends ConsumerState<JointWorkDialog> {
  String? _selectedManagerId;
  String? _selectedManagerName;

  // Mock list of managers
  final List<Map<String, String>> _managers = [
    {'id': 'AM01', 'name': 'Alice Smith (Area Manager)'},
    {'id': 'RM01', 'name': 'Bob Johnson (Regional Manager)'},
    {'id': 'AD01', 'name': 'Admin User'},
  ];

  void _submit() {
    if (_selectedManagerId == null || _selectedManagerName == null) return;
    ref.read(workPlanNotifierProvider.notifier).submitJointWork(_selectedManagerId!, _selectedManagerName!);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppSizes.radius16)),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Joint Work', style: AppTypography.titleLarge.copyWith(fontWeight: FontWeight.bold)),
            AppSizes.gap16,
            const Text('Select a manager if you are working jointly today. DCR entries will be synchronized.'),
            AppSizes.gap24,

            Text('Select Manager', style: AppTypography.labelLarge),
            AppSizes.gap8,
            DropdownButtonFormField<String>(
              value: _selectedManagerId,
              decoration: const InputDecoration(border: OutlineInputBorder()),
              items: _managers.map((m) => DropdownMenuItem(value: m['id'], child: Text(m['name']!))).toList(),
              onChanged: (v) {
                if (v != null) {
                  setState(() {
                    _selectedManagerId = v;
                    _selectedManagerName = _managers.firstWhere((m) => m['id'] == v)['name'];
                  });
                }
              },
            ),
            AppSizes.gap24,

            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('Cancel'),
                ),
                AppSizes.gap8,
                AppButton(
                  text: 'Confirm',
                  onPressed: _selectedManagerId != null ? _submit : null,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
