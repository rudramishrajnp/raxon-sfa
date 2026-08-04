import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/punch_out_provider.dart';
import '../providers/punch_out_state.dart';
import '../widgets/end_of_day_summary_widget.dart';

class PunchOutScreen extends ConsumerStatefulWidget {
  const PunchOutScreen({super.key});

  @override
  ConsumerState<PunchOutScreen> createState() => _PunchOutScreenState();
}

class _PunchOutScreenState extends ConsumerState<PunchOutScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(punchOutNotifierProvider.notifier).loadSummary();
    });
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<PunchOutState>(punchOutNotifierProvider, (previous, next) {
      if (next is PunchOutSuccess) {
        AppFeedback.showSuccessDialog(
          context,
          title: 'Day Completed',
          message: 'Your punch out has been recorded and data has been locked.',
          onOk: () {
            context.pop(); // dismiss dialog
            context.pop(); // pop screen
          },
        );
      } else if (next is PunchOutError) {
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Punch Out Failed'),
            content: Text(next.message),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx), 
                child: const Text('OK')
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  ref.read(punchOutNotifierProvider.notifier).confirmPunchOut(managerOverride: true);
                },
                child: const Text('Manager Override', style: TextStyle(color: AppColors.error)),
              ),
            ],
          ),
        );
      }
    });

    final state = ref.watch(punchOutNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Punch Out'),
        backgroundColor: AppColors.error,
        foregroundColor: Colors.white,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSizes.p24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (state is PunchOutLoading) ...[
                const Spacer(),
                const Center(child: CircularProgressIndicator()),
                AppSizes.gap16,
                Text(state.message, style: AppTypography.bodyMedium, textAlign: TextAlign.center),
                const Spacer(),
              ] else if (state is PunchOutSummaryLoaded) ...[
                Expanded(
                  child: SingleChildScrollView(
                    child: EndOfDaySummaryWidget(summary: state.summary),
                  ),
                ),
                AppSizes.gap24,
                SizedBox(
                  height: 60,
                  child: AppButton(
                    text: 'CONFIRM PUNCH OUT',
                    onPressed: () => _showConfirmationDialog(context),
                    type: AppButtonType.danger,
                    icon: Icons.power_settings_new,
                  ),
                ),
              ] else if (state is PunchOutError) ...[
                const Spacer(),
                const Icon(Icons.error_outline, size: 48, color: AppColors.error),
                AppSizes.gap16,
                Text(state.message, style: AppTypography.bodyMedium, textAlign: TextAlign.center),
                AppSizes.gap24,
                AppButton(
                  text: 'Retry',
                  onPressed: () => ref.read(punchOutNotifierProvider.notifier).loadSummary(),
                ),
                const Spacer(),
              ] else ...[
                const Spacer(),
              ],
            ],
          ),
        ),
      ),
    );
  }

  void _showConfirmationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirm Punch Out'),
        content: const Text('Are you sure you want to end your day? Your records for today will be locked.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              ref.read(punchOutNotifierProvider.notifier).confirmPunchOut();
            },
            child: const Text('Confirm', style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }
}
