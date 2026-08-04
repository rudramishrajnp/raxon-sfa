import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../providers/mtp_review_provider.dart';
import '../../data/models/mtp_review_models.dart';
import '../widgets/mtp_validation_summary.dart';
import '../widgets/mtp_audit_trail_timeline.dart';
import '../widgets/mtp_action_bottom_sheet.dart';

class MtpReviewDetailsScreen extends ConsumerStatefulWidget {
  final MtpSubmissionModel submission;

  const MtpReviewDetailsScreen({super.key, required this.submission});

  @override
  ConsumerState<MtpReviewDetailsScreen> createState() => _MtpReviewDetailsScreenState();
}

class _MtpReviewDetailsScreenState extends ConsumerState<MtpReviewDetailsScreen> {
  late MtpSubmissionModel _submission;

  @override
  void initState() {
    super.initState();
    _submission = widget.submission;
  }

  void _showActionSheet(String action) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => MtpActionBottomSheet(
        actionType: action,
        onConfirm: (remarks) async {
          final success = await ref.read(mtpReviewNotifierProvider.notifier).submitAction(_submission.id, action, remarks);
          if (success && mounted) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('MTP $action successful')));
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
            Text('MTP Details', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
            Text('${_submission.employeeName} - ${_submission.month}', style: AppTypography.bodySmall.copyWith(color: AppColors.onPrimary.withOpacity(0.8))),
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
            _buildEmployeeHeader(),
            AppSizes.gap24,
            MtpValidationSummary(summary: _submission.validationSummary),
            AppSizes.gap24,
            Text('Daily Plan', style: AppTypography.headlineMedium),
            AppSizes.gap16,
            _buildDailyPlans(),
            AppSizes.gap24,
            MtpAuditTrailTimeline(auditTrail: _submission.auditTrail),
            AppSizes.gap32, // Space for bottom buttons
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomActions(),
    );
  }

  Widget _buildEmployeeHeader() {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
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
          Text('${_submission.employeeCode} | ${_submission.hq} - ${_submission.territory}', style: AppTypography.bodyMedium),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color = AppColors.primary;
    if (status == 'Approved' || status == 'Locked') color = AppColors.success;
    if (status == 'Rejected' || status == 'Returned for Correction') color = AppColors.error;
    if (status == 'Pending Approval') color = AppColors.warning;
    if (status == 'Provisionally Approved') color = Colors.purple;

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

  Widget _buildDailyPlans() {
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _submission.dailyPlans.length,
      separatorBuilder: (context, index) => AppSizes.gap8,
      itemBuilder: (context, index) {
        final plan = _submission.dailyPlans[index];
        bool isHolidayOrLeave = plan.workType == 'Holiday' || plan.workType == 'Leave';
        
        return Container(
          padding: const EdgeInsets.all(AppSizes.p12),
          decoration: BoxDecoration(
            color: isHolidayOrLeave ? AppColors.grey100 : AppColors.surface,
            borderRadius: BorderRadius.circular(AppSizes.radius8),
            border: Border.all(color: AppColors.grey300),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 50,
                child: Column(
                  children: [
                    Text(DateFormat('dd').format(plan.date), style: AppTypography.headlineMedium),
                    Text(DateFormat('E').format(plan.date), style: AppTypography.bodySmall),
                  ],
                ),
              ),
              AppSizes.gap12,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(plan.workType, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
                        if (!isHolidayOrLeave) ...[
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(plan.locationType, style: AppTypography.bodySmall.copyWith(color: AppColors.primary)),
                          ),
                        ],
                      ],
                    ),
                    if (plan.plannedDoctors.isNotEmpty) ...[
                      AppSizes.gap4,
                      Text('Doctors: ${plan.plannedDoctors.length}', style: AppTypography.bodySmall.copyWith(color: AppColors.grey700)),
                    ],
                    if (plan.plannedChemists.isNotEmpty) ...[
                      AppSizes.gap4,
                      Text('Chemists: ${plan.plannedChemists.length}', style: AppTypography.bodySmall.copyWith(color: AppColors.grey700)),
                    ],
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildBottomActions() {
    if (_submission.status == 'Approved' || _submission.status == 'Locked') {
      return const SizedBox.shrink();
    }

    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: AppButton(
                text: 'Return',
                onPressed: () => _showActionSheet('Return for Correction'),
                type: AppButtonType.secondary,
              ),
            ),
            AppSizes.gap16,
            Expanded(
              child: AppButton(
                text: 'Reject',
                onPressed: () => _showActionSheet('Reject'),
                type: AppButtonType.secondary,
              ),
            ),
            AppSizes.gap16,
            Expanded(
              flex: 2,
              child: AppButton(
                text: 'Approve',
                onPressed: () => _showActionSheet('Approve'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
