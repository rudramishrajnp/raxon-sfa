import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/mtp_provider.dart';
import '../providers/mtp_state.dart';
import '../widgets/mtp_calendar_widget.dart';
import '../widgets/day_planning_widget.dart';
import '../widgets/mtp_status_badge.dart';
import '../../data/models/mtp_models.dart';

class MtpScreen extends ConsumerStatefulWidget {
  const MtpScreen({super.key});

  @override
  ConsumerState<MtpScreen> createState() => _MtpScreenState();
}

class _MtpScreenState extends ConsumerState<MtpScreen> {
  int _selectedMonth = DateTime.now().month;
  int _selectedYear = DateTime.now().year;

  @override
  void initState() {
    super.initState();
    Future.microtask(() => _loadData());
  }

  void _loadData() {
    ref.read(mtpNotifierProvider.notifier).loadMtp(_selectedMonth, _selectedYear);
  }

  void _onMonthChanged(int increment) {
    setState(() {
      _selectedMonth += increment;
      if (_selectedMonth > 12) {
        _selectedMonth = 1;
        _selectedYear++;
      } else if (_selectedMonth < 1) {
        _selectedMonth = 12;
        _selectedYear--;
      }
    });
    _loadData();
  }

  void _showDayPlanner(DateTime date, MtpDayModel? existingPlan) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppSizes.radius16)),
      ),
      builder: (context) {
        return DayPlanningWidget(
          date: date,
          initialPlan: existingPlan,
          onSave: (newPlan) {
            ref.read(mtpNotifierProvider.notifier).updateDayPlan(newPlan);
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<MtpState>(mtpNotifierProvider, (previous, next) {
      if (next is MtpSaved) {
        AppFeedback.showSnackBar(context, next.message);
      } else if (next is MtpError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      } else if (next is MtpSubmitted) {
        AppFeedback.showSuccessDialog(
          context,
          title: 'MTP Submitted',
          message: 'Your Monthly Tour Plan has been submitted for approval.',
          onOk: () {
            context.pop();
          },
        );
      }
    });

    final state = ref.watch(mtpNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Monthly Tour Plan'),
      ),
      body: _buildBody(state),
    );
  }

  Widget _buildBody(MtpState state) {
    if (state is MtpLoading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(),
            AppSizes.gap16,
            Text(state.message),
          ],
        ),
      );
    }

    if (state is MtpLoaded) {
      final mtp = state.mtp;
      final daysInMonth = DateTime(_selectedYear, _selectedMonth + 1, 0).day;
      final plannedDaysCount = mtp.days.length;
      final progress = plannedDaysCount / daysInMonth;

      return SafeArea(
        child: Column(
          children: [
            // Month Selector
            Padding(
              padding: const EdgeInsets.all(AppSizes.p16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: const Icon(Icons.chevron_left),
                    onPressed: () => _onMonthChanged(-1),
                  ),
                  Text(
                    DateFormat('MMMM yyyy').format(DateTime(_selectedYear, _selectedMonth)),
                    style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold),
                  ),
                  IconButton(
                    icon: const Icon(Icons.chevron_right),
                    onPressed: () => _onMonthChanged(1),
                  ),
                ],
              ),
            ),
            
            // Status and Progress
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSizes.p16),
              child: Card(
                elevation: 0,
                color: AppColors.surface,
                child: Padding(
                  padding: const EdgeInsets.all(AppSizes.p16),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          MtpStatusBadge(status: mtp.status),
                          Text('$plannedDaysCount / $daysInMonth Days Planned', style: AppTypography.bodySmall),
                        ],
                      ),
                      AppSizes.gap8,
                      LinearProgressIndicator(
                        value: progress,
                        backgroundColor: AppColors.grey300,
                        color: AppColors.primary,
                        minHeight: 8,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            
            // Weekday Headers
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSizes.p16, vertical: AppSizes.p8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) {
                  return Expanded(
                    child: Text(
                      day,
                      textAlign: TextAlign.center,
                      style: AppTypography.labelSmall.copyWith(
                        color: day == 'S' ? AppColors.error : AppColors.textSecondary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),

            // Calendar
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: AppSizes.p16),
                child: MtpCalendarWidget(
                  month: _selectedMonth,
                  year: _selectedYear,
                  plannedDays: mtp.days,
                  onDayTap: mtp.status == 'DRAFT' || mtp.status == 'REJECTED' || mtp.status == 'RETURNED_FOR_CORRECTION' 
                      ? _showDayPlanner 
                      : (date, plan) {
                          // View only mode if locked/submitted
                          if (plan != null) {
                            AppFeedback.showSnackBar(context, 'MTP is ${mtp.status}. Editing is disabled.');
                          }
                        },
                ),
              ),
            ),

            // Actions
            if (mtp.status == 'DRAFT' || mtp.status == 'REJECTED' || mtp.status == 'RETURNED_FOR_CORRECTION')
              Padding(
                padding: const EdgeInsets.all(AppSizes.p16),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => ref.read(mtpNotifierProvider.notifier).saveDraft(),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: AppSizes.p16),
                        ),
                        child: const Text('Save Draft'),
                      ),
                    ),
                    AppSizes.gap16,
                    Expanded(
                      child: AppButton(
                        text: 'Submit MTP',
                        onPressed: () => ref.read(mtpNotifierProvider.notifier).submitMtp(),
                      ),
                    ),
                  ],
                ),
              )
            else if (mtp.id != null)
              Padding(
                padding: const EdgeInsets.all(AppSizes.p16),
                child: AppButton(
                  text: 'View Approval History',
                  onPressed: () => context.push('/mtp-approval/${mtp.id}'),
                ),
              ),
          ],
        ),
      );
    }

    return const SizedBox.shrink();
  }
}
