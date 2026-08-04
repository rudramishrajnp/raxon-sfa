import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';

class DaWidget extends StatelessWidget {
  final String locationType;
  final double daAmount;
  final Function(String) onLocationTypeChanged;

  const DaWidget({
    super.key,
    required this.locationType,
    required this.daAmount,
    required this.onLocationTypeChanged,
  });

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
            Text('Daily Allowance (DA)', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
            const Divider(),
            AppSizes.gap8,
            DropdownButtonFormField<String>(
              value: locationType,
              decoration: const InputDecoration(
                labelText: 'Location Type',
                border: OutlineInputBorder(),
                isDense: true,
              ),
              items: ['HQ', 'Ex-HQ', 'Outstation', 'Transit']
                  .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                  .toList(),
              onChanged: (val) {
                if (val != null) onLocationTypeChanged(val);
              },
            ),
            AppSizes.gap16,
            TextFormField(
              key: ValueKey('daAmount_$daAmount'),
              initialValue: '₹${daAmount.toStringAsFixed(2)}',
              readOnly: true,
              decoration: InputDecoration(
                labelText: 'Auto-calculated DA',
                border: const OutlineInputBorder(),
                filled: true,
                fillColor: Colors.grey.shade200,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
