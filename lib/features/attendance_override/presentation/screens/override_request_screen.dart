import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../providers/override_provider.dart';
import '../../data/models/override_models.dart';
import 'package:uuid/uuid.dart';

class OverrideRequestScreen extends ConsumerStatefulWidget {
  const OverrideRequestScreen({super.key});

  @override
  ConsumerState<OverrideRequestScreen> createState() => _OverrideRequestScreenState();
}

class _OverrideRequestScreenState extends ConsumerState<OverrideRequestScreen> {
  final _reasonController = TextEditingController();
  final _remarksController = TextEditingController();

  @override
  void dispose() {
    _reasonController.dispose();
    _remarksController.dispose();
    super.dispose();
  }

  void _submitRequest() async {
    if (_reasonController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter a reason')));
      return;
    }

    final request = OverrideRequestModel(
      id: const Uuid().v4(),
      employeeId: 'EMP-001', // Mock for now
      employeeName: 'Rajesh Kumar',
      employeeCode: 'RK001',
      hq: 'Mumbai',
      requestTime: DateTime.now(),
      reason: _reasonController.text.trim(),
      remarks: _remarksController.text.trim(),
      currentLat: 19.1136,
      currentLng: 72.8697,
      batteryLevel: 80,
      internetStatus: 'Online',
      originalPunchIn: DateTime.now().subtract(const Duration(hours: 4)),
      originalPunchOut: DateTime.now().subtract(const Duration(minutes: 5)),
      status: 'Pending Approval',
      syncStatus: 'Pending',
      dataSummary: OverrideDataSummary(dcrCount: 4, orderCount: 2, totalExpenses: 150.0),
    );

    final success = await ref.read(overrideNotifierProvider.notifier).submitRequest(request);

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Re-Punch-In Request Submitted')));
        context.pop();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to submit request')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Request Re-Punch-In', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: AppColors.onPrimary),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(AppSizes.p16),
              decoration: BoxDecoration(
                color: AppColors.warning.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppSizes.radius12),
                border: Border.all(color: AppColors.warning),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: AppColors.warning),
                  AppSizes.gap16,
                  Expanded(
                    child: Text(
                      'You are requesting an override to Re-Punch-In. Your manager must approve this request.',
                      style: AppTypography.bodyMedium,
                    ),
                  ),
                ],
              ),
            ),
            AppSizes.gap24,
            Text('Reason for Re-Punch-In *', style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
            AppSizes.gap8,
            TextField(
              controller: _reasonController,
              decoration: InputDecoration(
                hintText: 'e.g. Accidental Punch-Out',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppSizes.radius8)),
              ),
            ),
            AppSizes.gap16,
            Text('Additional Remarks', style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
            AppSizes.gap8,
            TextField(
              controller: _remarksController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'Provide details...',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(AppSizes.radius8)),
              ),
            ),
            AppSizes.gap32,
            AppButton(
              text: 'Submit Request',
              onPressed: _submitRequest,
            ),
          ],
        ),
      ),
    );
  }
}
