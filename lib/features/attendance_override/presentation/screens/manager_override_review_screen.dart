import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../providers/override_provider.dart';
import '../../data/models/override_models.dart';
import '../widgets/override_approval_dialog.dart';

class ManagerOverrideReviewScreen extends ConsumerStatefulWidget {
  final OverrideRequestModel request;

  const ManagerOverrideReviewScreen({super.key, required this.request});

  @override
  ConsumerState<ManagerOverrideReviewScreen> createState() => _ManagerOverrideReviewScreenState();
}

class _ManagerOverrideReviewScreenState extends ConsumerState<ManagerOverrideReviewScreen> {
  void _showActionDialog(String action) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => OverrideApprovalDialog(
        actionType: action,
        onConfirm: (remarks) async {
          final success = await ref.read(overrideNotifierProvider.notifier).processAction(widget.request.id, action, remarks, widget.request);
          if (success && mounted) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Request $action successful')));
            Navigator.pop(context); // Go back to list
          } else if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to process action')));
          }
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final req = widget.request;
    return Scaffold(
      appBar: AppBar(
        title: Text('Review Override', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: AppColors.onPrimary),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildEmployeeDetails(req),
            AppSizes.gap16,
            _buildRequestDetails(req),
            AppSizes.gap16,
            _buildAttendanceData(req),
            AppSizes.gap16,
            _buildGpsAndDevice(req),
            AppSizes.gap16,
            _buildAuditTrail(req),
            AppSizes.gap32, // space for buttons
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomActions(req),
    );
  }

  Widget _buildEmployeeDetails(OverrideRequestModel req) {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: AppColors.grey300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(req.employeeName, style: AppTypography.headlineMedium),
          AppSizes.gap8,
          Text('${req.employeeCode} | ${req.hq}', style: AppTypography.bodyMedium),
        ],
      ),
    );
  }

  Widget _buildRequestDetails(OverrideRequestModel req) {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.warning.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: AppColors.warning),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.info_outline, color: AppColors.warning),
              AppSizes.gap8,
              Text('Re-Punch-In Request', style: AppTypography.headlineSmall.copyWith(color: AppColors.warning)),
            ],
          ),
          AppSizes.gap16,
          _buildInfoRow('Reason', req.reason, isBold: true),
          if (req.remarks != null && req.remarks!.isNotEmpty) ...[
            AppSizes.gap8,
            Text('Remarks:', style: AppTypography.bodySmall.copyWith(color: AppColors.grey700)),
            Text(req.remarks!, style: AppTypography.bodyMedium),
          ],
          AppSizes.gap16,
          _buildInfoRow('Request Time', DateFormat('dd MMM yyyy, hh:mm a').format(req.requestTime)),
        ],
      ),
    );
  }

  Widget _buildAttendanceData(OverrideRequestModel req) {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: AppColors.grey300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Session Data Before Punch-Out', style: AppTypography.headlineSmall),
          AppSizes.gap16,
          _buildInfoRow('Original Punch-In', DateFormat('hh:mm a').format(req.originalPunchIn)),
          AppSizes.gap8,
          _buildInfoRow('Original Punch-Out', DateFormat('hh:mm a').format(req.originalPunchOut)),
          AppSizes.gap8,
          _buildInfoRow('Working Hours', req.totalWorkingHours, isBold: true),
          const Divider(height: AppSizes.p24),
          Text('Data Summary', style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
          AppSizes.gap8,
          _buildInfoRow('DCR Submissions', '${req.dataSummary.dcrCount}'),
          AppSizes.gap8,
          _buildInfoRow('Orders Created', '${req.dataSummary.orderCount}'),
          AppSizes.gap8,
          _buildInfoRow('Expenses Logged', '₹${req.dataSummary.totalExpenses}'),
        ],
      ),
    );
  }

  Widget _buildGpsAndDevice(OverrideRequestModel req) {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: AppColors.grey300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Device & Location Context', style: AppTypography.headlineSmall),
          AppSizes.gap16,
          _buildInfoRow('Battery Level', '${req.batteryLevel}%'),
          AppSizes.gap8,
          _buildInfoRow('Internet Status', req.internetStatus),
          AppSizes.gap16,
          Container(
            height: 120,
            decoration: BoxDecoration(
              color: AppColors.grey200,
              borderRadius: BorderRadius.circular(AppSizes.radius8),
            ),
            child: const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.map, color: AppColors.grey500, size: 32),
                  Text('Map View (Offline)', style: TextStyle(color: AppColors.grey600)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAuditTrail(OverrideRequestModel req) {
    if (req.auditTrail.isEmpty) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: AppColors.grey300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('History', style: AppTypography.headlineSmall),
          AppSizes.gap16,
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: req.auditTrail.length,
            itemBuilder: (context, index) {
              final log = req.auditTrail[index];
              return Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(DateFormat('dd MMM').format(log.timestamp), style: AppTypography.bodySmall),
                    AppSizes.gap8,
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('${log.action} by ${log.byUser}', style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
                          if (log.remarks != null) Text(log.remarks!, style: AppTypography.bodySmall),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTypography.bodyMedium.copyWith(color: AppColors.grey700)),
        Text(value, style: AppTypography.bodyMedium.copyWith(fontWeight: isBold ? FontWeight.bold : FontWeight.normal)),
      ],
    );
  }

  Widget _buildBottomActions(OverrideRequestModel req) {
    if (req.status != 'Pending') return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5)),
        ],
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    text: 'Clarification',
                    onPressed: () => _showActionDialog('Return for Clarification'),
                    type: AppButtonType.secondary,
                  ),
                ),
                AppSizes.gap16,
                Expanded(
                  child: AppButton(
                    text: 'Reject',
                    onPressed: () => _showActionDialog('Reject'),
                    type: AppButtonType.secondary,
                  ),
                ),
              ],
            ),
            AppSizes.gap16,
            SizedBox(
              width: double.infinity,
              child: AppButton(
                text: 'Approve Re-Punch-In',
                onPressed: () => _showActionDialog('Approve'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
