import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../providers/dcr_checkin_provider.dart';

class OverrideRequestDialog extends ConsumerStatefulWidget {
  final String customerId;
  final double targetLat;
  final double targetLng;

  const OverrideRequestDialog({
    super.key, 
    required this.customerId,
    required this.targetLat,
    required this.targetLng,
  });

  @override
  ConsumerState<OverrideRequestDialog> createState() => _OverrideRequestDialogState();
}

class _OverrideRequestDialogState extends ConsumerState<OverrideRequestDialog> {
  final TextEditingController _noteController = TextEditingController();
  String _selectedReason = 'GPS Accuracy Poor';

  final List<String> _reasons = [
    'GPS Accuracy Poor',
    'Customer Location Moved',
    'Meeting Outside Clinic',
    'Other',
  ];

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  void _submit() {
    ref.read(dcrCheckInNotifierProvider.notifier).submitOverrideRequest(
      widget.customerId,
      _selectedReason,
      _noteController.text,
      widget.targetLat,
      widget.targetLng,
    );
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
            Text('Request Check-In Override', style: AppTypography.titleLarge.copyWith(fontWeight: FontWeight.bold)),
            AppSizes.gap16,
            const Text('Send a request to your Area Manager to override the GPS geofence restriction.'),
            AppSizes.gap24,

            Text('Reason', style: AppTypography.labelLarge),
            AppSizes.gap8,
            DropdownButtonFormField<String>(
              value: _selectedReason,
              decoration: const InputDecoration(border: OutlineInputBorder()),
              items: _reasons.map((r) => DropdownMenuItem(value: r, child: Text(r))).toList(),
              onChanged: (v) {
                if (v != null) setState(() => _selectedReason = v);
              },
            ),
            AppSizes.gap16,
            
            TextField(
              controller: _noteController,
              decoration: const InputDecoration(
                labelText: 'Additional Note',
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
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
                  text: 'Submit Request',
                  onPressed: _submit,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
