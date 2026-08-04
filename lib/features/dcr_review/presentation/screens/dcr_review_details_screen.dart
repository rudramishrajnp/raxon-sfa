import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../providers/dcr_review_provider.dart';
import '../../data/models/dcr_review_models.dart';
import '../widgets/dcr_gps_verification.dart';
import '../widgets/dcr_joint_work_widget.dart';
import '../widgets/dcr_deviation_widget.dart';
import '../widgets/dcr_timeline_widget.dart';
import '../widgets/dcr_review_action_dialog.dart';

class DcrReviewDetailsScreen extends ConsumerStatefulWidget {
  final DcrSubmissionModel submission;

  const DcrReviewDetailsScreen({super.key, required this.submission});

  @override
  ConsumerState<DcrReviewDetailsScreen> createState() => _DcrReviewDetailsScreenState();
}

class _DcrReviewDetailsScreenState extends ConsumerState<DcrReviewDetailsScreen> {
  late DcrSubmissionModel _submission;

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
      builder: (context) => DcrReviewActionDialog(
        actionType: action,
        onConfirm: (remarks) async {
          final success = await ref.read(dcrReviewNotifierProvider.notifier).submitAction(_submission.id, action, remarks, _submission);
          if (success && mounted) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('DCR $action successful')));
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
            Text('DCR Details', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
            Text('${_submission.employeeName} - ${DateFormat('dd MMM').format(_submission.date)}', style: AppTypography.bodySmall.copyWith(color: AppColors.onPrimary.withOpacity(0.8))),
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
            _buildHeader(),
            AppSizes.gap16,
            DcrDeviationWidget(submission: _submission),
            DcrJointWorkWidget(submission: _submission),
            _buildVisitDetails(),
            AppSizes.gap24,
            DcrGpsVerificationWidget(submission: _submission),
            AppSizes.gap24,
            DcrTimelineWidget(submission: _submission),
            AppSizes.gap24,
            _buildAuditTrail(),
            AppSizes.gap32, // Space for bottom buttons
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomActions(),
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
              _buildStatusBadge(_submission.reviewStatus),
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
    if (status == 'Verified') color = AppColors.success;
    if (status == 'Flagged') color = AppColors.error;
    if (status == 'Clarification Requested') color = AppColors.warning;

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

  Widget _buildVisitDetails() {
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
          Text('Call Details', style: AppTypography.headlineSmall),
          AppSizes.gap16,
          _buildInfoRow('Doctor', _submission.doctorName),
          if (_submission.chemistName != null && _submission.chemistName!.isNotEmpty) ...[
            AppSizes.gap8,
            _buildInfoRow('Chemist', _submission.chemistName!),
          ],
          AppSizes.gap8,
          _buildInfoRow('Call Status', _submission.callStatus),
          AppSizes.gap8,
          _buildInfoRow('Duration', '${_submission.visitDurationMinutes ?? 0} mins'),
          const Divider(height: AppSizes.p24),
          Text('Discussion & Outputs', style: AppTypography.headlineSmall),
          AppSizes.gap16,
          _buildDetailSection('Samples Given', _submission.samplesGiven),
          _buildDetailSection('Orders Booked', _submission.ordersBooked),
          _buildDetailSection('Prescription Details', _submission.prescriptionDetails),
          _buildDetailSection('Doctor Feedback', _submission.doctorFeedback),
          _buildDetailSection('Competitor Activity', _submission.competitorActivity),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 120,
          child: Text(label, style: AppTypography.bodyMedium.copyWith(color: AppColors.grey600)),
        ),
        Expanded(
          child: Text(value, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }

  Widget _buildDetailSection(String label, String? content) {
    if (content == null || content.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSizes.p12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppTypography.bodySmall.copyWith(color: AppColors.grey600)),
          AppSizes.gap4,
          Text(content, style: AppTypography.bodyMedium),
        ],
      ),
    );
  }

  Widget _buildAuditTrail() {
    if (_submission.auditTrail.isEmpty) return const SizedBox.shrink();
    
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
          Text('Audit Trail', style: AppTypography.headlineSmall),
          AppSizes.gap16,
          ..._submission.auditTrail.map((log) => Padding(
            padding: const EdgeInsets.only(bottom: AppSizes.p12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  width: 80,
                  child: Text(
                    DateFormat('dd MMM HH:mm').format(log.timestamp),
                    style: AppTypography.bodySmall.copyWith(color: AppColors.grey600, fontSize: 10),
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(log.action, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
                      Text('By: ${log.byUser}', style: AppTypography.bodySmall),
                      if (log.remarks != null)
                        Text('Remarks: ${log.remarks}', style: AppTypography.bodySmall.copyWith(fontStyle: FontStyle.italic)),
                    ],
                  ),
                ),
              ],
            ),
          )),
        ],
      ),
    );
  }

  Widget _buildBottomActions() {
    if (_submission.reviewStatus == 'Verified') {
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
            if (_submission.gpsOverrideUsed) ...[
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Reject Override',
                      onPressed: () => _showActionDialog('Reject Override'),
                      type: AppButtonType.secondary,
                    ),
                  ),
                  AppSizes.gap16,
                  Expanded(
                    child: AppButton(
                      text: 'Approve Override',
                      onPressed: () => _showActionDialog('Approve Override'),
                    ),
                  ),
                ],
              ),
              AppSizes.gap16,
            ],
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    text: 'Flag',
                    onPressed: () => _showActionDialog('Flag'),
                    type: AppButtonType.secondary,
                  ),
                ),
                AppSizes.gap12,
                Expanded(
                  child: AppButton(
                    text: 'Clarify',
                    onPressed: () => _showActionDialog('Request Clarification'),
                    type: AppButtonType.secondary,
                  ),
                ),
                AppSizes.gap12,
                Expanded(
                  child: AppButton(
                    text: 'Verify',
                    onPressed: () => _showActionDialog('Verify'),
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
