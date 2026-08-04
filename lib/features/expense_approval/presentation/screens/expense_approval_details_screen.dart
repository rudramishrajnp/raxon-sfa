import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../providers/expense_approval_provider.dart';
import '../../data/models/expense_approval_models.dart';
import '../widgets/expense_gps_verification.dart';
import '../widgets/expense_approval_timeline.dart';
import '../widgets/expense_approval_dialog.dart';

class ExpenseApprovalDetailsScreen extends ConsumerStatefulWidget {
  final ExpenseSubmissionModel submission;

  const ExpenseApprovalDetailsScreen({super.key, required this.submission});

  @override
  ConsumerState<ExpenseApprovalDetailsScreen> createState() => _ExpenseApprovalDetailsScreenState();
}

class _ExpenseApprovalDetailsScreenState extends ConsumerState<ExpenseApprovalDetailsScreen> {
  late ExpenseSubmissionModel _submission;

  @override
  void initState() {
    super.initState();
    _submission = widget.submission;
  }

  void _showActionDialog(String action) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ExpenseApprovalDialog(
        actionType: action,
        claimedAmount: _submission.claimedAmount,
        onConfirm: (remarks, adjustedAmount) async {
          final success = await ref.read(expenseApprovalNotifierProvider.notifier).submitAction(_submission.id, action, remarks, adjustedAmount, _submission);
          if (success && mounted) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Expense $action successful')));
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
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Expense Details', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
            Text('${_submission.employeeName} - ${_submission.claimNumber}', style: AppTypography.bodySmall.copyWith(color: AppColors.onPrimary.withOpacity(0.8))),
          ],
        ),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: AppColors.onPrimary),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_submission.hasHighExpenseFlag) _buildHighExpenseWarning(),
            _buildHeader(),
            AppSizes.gap24,
            _buildExpenseBreakdown(),
            AppSizes.gap24,
            _buildBillsSection(),
            AppSizes.gap24,
            ExpenseGpsVerificationWidget(submission: _submission),
            AppSizes.gap24,
            ExpenseApprovalTimeline(auditTrail: _submission.auditTrail),
            AppSizes.gap32, // Space for bottom buttons
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomActions(),
    );
  }

  Widget _buildHighExpenseWarning() {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSizes.p16),
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
              const Icon(Icons.warning_amber_rounded, color: AppColors.warning),
              AppSizes.gap8,
              Text('High Expense Flag', style: AppTypography.headlineSmall.copyWith(color: AppColors.warning)),
            ],
          ),
          AppSizes.gap16,
          _buildInfoRow('Configured Limit', '₹${_submission.configuredLimit}'),
          AppSizes.gap8,
          _buildInfoRow('Claimed Amount', '₹${_submission.claimedAmount}'),
          AppSizes.gap8,
          _buildInfoRow('Exceeded Amount', '₹${_submission.claimedAmount - (_submission.configuredLimit ?? 0)}', color: AppColors.error),
          AppSizes.gap16,
          Text('Employee Justification:', style: AppTypography.bodySmall.copyWith(color: AppColors.grey700)),
          AppSizes.gap4,
          Text(_submission.employeeJustification ?? 'No justification provided.', style: AppTypography.bodyMedium.copyWith(fontStyle: FontStyle.italic)),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(_submission.employeeName, style: AppTypography.headlineMedium),
              _buildStatusBadge(_submission.status),
            ],
          ),
          AppSizes.gap8,
          Text('${_submission.employeeCode} | ${_submission.hq}', style: AppTypography.bodyMedium),
          AppSizes.gap16,
          _buildInfoRow('DCR Ref', _submission.dcrReference),
          AppSizes.gap8,
          _buildInfoRow('MTP Ref', _submission.mtpReference),
          AppSizes.gap8,
          _buildInfoRow('Date', DateFormat('dd MMM yyyy').format(_submission.date)),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color = AppColors.primary;
    if (status == 'Approved') color = AppColors.success;
    if (status == 'Partially Approved') color = Colors.purple;
    if (status == 'Rejected' || status == 'Returned') color = AppColors.error;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: color),
      ),
      child: Text(
        status,
        style: AppTypography.bodySmall.copyWith(color: color, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildExpenseBreakdown() {
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
          Text('Expense Breakdown', style: AppTypography.headlineSmall),
          AppSizes.gap16,
          _buildInfoRow('TA (Travel Allowance)', '₹${_submission.taAmount}'),
          AppSizes.gap8,
          _buildInfoRow('DA (Daily Allowance)', '₹${_submission.daAmount}'),
          AppSizes.gap8,
          _buildInfoRow('Misc Expenses', '₹${_submission.miscAmount}'),
          const Divider(height: AppSizes.p24),
          _buildInfoRow('Total Claimed', '₹${_submission.claimedAmount}', isBold: true),
          if (_submission.approvedAmount != null) ...[
            AppSizes.gap8,
            _buildInfoRow('Total Approved', '₹${_submission.approvedAmount}', isBold: true, color: AppColors.success),
          ],
        ],
      ),
    );
  }

  Widget _buildBillsSection() {
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
          Text('Uploaded Bills', style: AppTypography.headlineSmall),
          AppSizes.gap16,
          if (_submission.uploadedBills.isEmpty)
            Text('No bills uploaded.', style: AppTypography.bodyMedium.copyWith(color: AppColors.grey600))
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _submission.uploadedBills.length,
              separatorBuilder: (context, index) => AppSizes.gap8,
              itemBuilder: (context, index) {
                final bill = _submission.uploadedBills[index];
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      bill.type == 'pdf' ? Icons.picture_as_pdf : Icons.image,
                      color: AppColors.primary,
                    ),
                  ),
                  title: Text(bill.description, style: AppTypography.bodyMedium),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () {
                    context.push('/bill-preview', extra: bill);
                  },
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isBold = false, Color? color}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTypography.bodyMedium.copyWith(color: AppColors.grey700)),
        Text(value, style: AppTypography.bodyMedium.copyWith(fontWeight: isBold ? FontWeight.bold : FontWeight.normal, color: color)),
      ],
    );
  }

  Widget _buildBottomActions() {
    if (_submission.status == 'Approved' || _submission.status == 'Rejected') {
      return const SizedBox.shrink();
    }

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
                    text: 'Return',
                    onPressed: () => _showActionDialog('Return for Correction'),
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
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    text: 'Partial Approve',
                    onPressed: () => _showActionDialog('Partially Approve'),
                    type: AppButtonType.secondary,
                  ),
                ),
                AppSizes.gap16,
                Expanded(
                  child: AppButton(
                    text: 'Approve',
                    onPressed: () => _showActionDialog('Approve'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
