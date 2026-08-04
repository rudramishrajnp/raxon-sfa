import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';

class TaWidget extends StatelessWidget {
  final String taType;
  final double taDistance;
  final double taRate;
  final double taAmount;
  final Function({String? type, double? distance, double? rate, double? amount}) onUpdate;

  const TaWidget({
    super.key,
    required this.taType,
    required this.taDistance,
    required this.taRate,
    required this.taAmount,
    required this.onUpdate,
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
            Text('Travel Allowance (TA)', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
            const Divider(),
            AppSizes.gap8,
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(value: 'Fixed', label: Text('Fixed Route')),
                ButtonSegment(value: 'PerKM', label: Text('Per KM')),
              ],
              selected: {taType},
              onSelectionChanged: (val) => onUpdate(type: val.first),
            ),
            AppSizes.gap16,
            if (taType == 'PerKM') ...[
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      initialValue: taDistance > 0 ? taDistance.toString() : '',
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      decoration: const InputDecoration(labelText: 'Distance (km)', border: OutlineInputBorder(), isDense: true),
                      onChanged: (val) => onUpdate(distance: double.tryParse(val) ?? 0),
                    ),
                  ),
                  AppSizes.gap16,
                  Expanded(
                    child: TextFormField(
                      initialValue: taRate.toString(),
                      readOnly: true,
                      decoration: InputDecoration(
                        labelText: 'Rate/km (₹)', 
                        border: const OutlineInputBorder(), 
                        isDense: true,
                        filled: true,
                        fillColor: Colors.grey.shade200,
                      ),
                    ),
                  ),
                ],
              ),
              AppSizes.gap16,
            ],
            TextFormField(
              key: ValueKey('taAmount_$taAmount'),
              initialValue: taAmount > 0 ? taAmount.toStringAsFixed(2) : '',
              readOnly: taType == 'PerKM',
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: taType == 'PerKM' ? 'Calculated TA (₹)' : 'Fixed TA Amount (₹)',
                border: const OutlineInputBorder(),
                isDense: true,
                filled: taType == 'PerKM',
                fillColor: taType == 'PerKM' ? Colors.grey.shade200 : null,
              ),
              onChanged: (val) {
                if (taType == 'Fixed') {
                  onUpdate(amount: double.tryParse(val) ?? 0);
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}
