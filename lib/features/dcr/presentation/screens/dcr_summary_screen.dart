import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/dcr_submission_provider.dart';
import '../providers/dcr_submission_state.dart';

class DcrSummaryScreen extends ConsumerStatefulWidget {
  final String checkInId;
  final String customerId;
  final String customerName;

  const DcrSummaryScreen({
    super.key,
    required this.checkInId,
    required this.customerId,
    required this.customerName,
  });

  @override
  ConsumerState<DcrSummaryScreen> createState() => _DcrSummaryScreenState();
}

class _DcrSummaryScreenState extends ConsumerState<DcrSummaryScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(dcrSubmissionNotifierProvider.notifier).loadSummary(widget.checkInId, widget.customerId));
  }

  void _onSubmit() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirm Submission'),
        content: const Text('Are you sure you want to submit this DCR? Once submitted, it will be locked and cannot be edited.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              ref.read(dcrSubmissionNotifierProvider.notifier).submitFinalDcr(widget.checkInId, widget.customerId, widget.customerName);
            },
            child: const Text('Submit & Lock'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(dcrSubmissionNotifierProvider, (previous, next) {
      if (next is DcrSubmissionSuccess) {
        AppFeedback.showSuccessDialog(
          context,
          title: 'Success',
          message: next.message,
          onOk: () {
            context.pop(); // close dialog
            context.go('/work-plan'); // go back to work plan
          },
        );
      } else if (next is DcrSubmissionError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      }
    });

    final state = ref.watch(dcrSubmissionNotifierProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Final DCR Summary')),
      body: SafeArea(
        child: _buildBody(state),
      ),
    );
  }

  Widget _buildBody(DcrSubmissionState state) {
    if (state is DcrSubmissionLoading || state is DcrSubmissionInitial) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state is DcrSubmissionError) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSizes.p24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: AppColors.error),
              AppSizes.gap16,
              Text(state.message, textAlign: TextAlign.center, style: AppTypography.bodyLarge),
              AppSizes.gap24,
              AppButton(
                text: 'Go Back',
                onPressed: () => context.pop(),
              ),
            ],
          ),
        ),
      );
    }

    if (state is DcrSubmissionLoaded) {
      final checkOut = state.checkOut;
      final report = state.report;
      
      final totalSamples = report.samples.fold(0, (sum, i) => sum + i.quantity);
      final totalOrders = report.orders.fold(0, (sum, i) => sum + i.quantity);

      return SingleChildScrollView(
        padding: const EdgeInsets.all(AppSizes.p24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(widget.customerName, style: AppTypography.headlineSmall.copyWith(fontWeight: FontWeight.bold)),
            AppSizes.gap16,
            
            _buildSection(
              title: 'Visit Details',
              children: [
                _buildInfoRow('Check-in', DateFormat('hh:mm a').format(checkOut.checkInTime)),
                _buildInfoRow('Check-out', DateFormat('hh:mm a').format(checkOut.checkOutTime)),
                _buildInfoRow('Duration', '${checkOut.visitDurationMinutes} mins'),
                _buildInfoRow('Call Status', checkOut.callStatus),
                _buildInfoRow('GPS Accuracy', '${checkOut.accuracy.toStringAsFixed(1)} m'),
              ],
            ),
            AppSizes.gap16,
            
            _buildSection(
              title: 'Report Summary',
              children: [
                _buildInfoRow('Samples Distributed', '$totalSamples items'),
                _buildInfoRow('Orders Booked', '$totalOrders items'),
                if (report.prescription != null)
                  _buildInfoRow('Prescription', report.prescription!.doctorType),
              ],
            ),
            AppSizes.gap16,

            _buildSection(
              title: 'Feedback',
              children: [
                if (checkOut.doctorMood != null) _buildInfoRow('Doctor Mood', checkOut.doctorMood!),
                _buildInfoRow('Feedback', report.summary?.doctorFeedback ?? 'N/A'),
                _buildInfoRow('Remarks', report.summary?.remarks ?? 'N/A'),
              ],
            ),
            AppSizes.gap32,

            AppButton(
              text: 'Confirm & Submit',
              onPressed: _onSubmit,
            ),
          ],
        ),
      );
    }

    return const SizedBox.shrink();
  }

  Widget _buildSection({required String title, required List<Widget> children}) {
    return Card(
      elevation: 0,
      color: AppColors.surface.withOpacity(0.5),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppSizes.radius12)),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
            const Divider(),
            ...children.map((child) => Padding(
              padding: const EdgeInsets.only(bottom: AppSizes.p8),
              child: child,
            )),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(flex: 2, child: Text(label, style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary))),
        Expanded(flex: 3, child: Text(value, textAlign: TextAlign.right, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold))),
      ],
    );
  }
}
