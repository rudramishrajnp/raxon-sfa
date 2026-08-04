import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';

class TeamFiltersSheet extends StatefulWidget {
  final Map<String, dynamic> initialFilters;
  final Function(Map<String, dynamic>) onApply;

  const TeamFiltersSheet({super.key, required this.initialFilters, required this.onApply});

  @override
  State<TeamFiltersSheet> createState() => _TeamFiltersSheetState();
}

class _TeamFiltersSheetState extends State<TeamFiltersSheet> {
  late String _selectedStatus;
  
  @override
  void initState() {
    super.initState();
    _selectedStatus = widget.initialFilters['status'] ?? 'All';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p24),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppSizes.radius24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Filters', style: AppTypography.headlineMedium),
          AppSizes.gap24,
          Text('Attendance Status', style: AppTypography.headlineSmall),
          AppSizes.gap8,
          Wrap(
            spacing: 8.0,
            children: ['All', 'Punched In', 'In Field', 'At Doctor', 'Offline', 'Punched Out', 'On Leave']
                .map((status) => ChoiceChip(
                      label: Text(status),
                      selected: _selectedStatus == status,
                      onSelected: (selected) {
                        if (selected) setState(() => _selectedStatus = status);
                      },
                    ))
                .toList(),
          ),
          AppSizes.gap32,
          AppButton(
            text: 'Apply Filters',
            onPressed: () {
              widget.onApply({'status': _selectedStatus});
              Navigator.pop(context);
            },
          ),
          AppSizes.gap16,
        ],
      ),
    );
  }
}
