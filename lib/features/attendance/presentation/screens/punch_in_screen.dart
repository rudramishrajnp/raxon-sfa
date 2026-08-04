import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../authentication/presentation/providers/auth_state.dart';
import '../providers/punch_in_provider.dart';
import '../providers/punch_in_state.dart';

class PunchInScreen extends ConsumerStatefulWidget {
  const PunchInScreen({super.key});

  @override
  ConsumerState<PunchInScreen> createState() => _PunchInScreenState();
}

class _PunchInScreenState extends ConsumerState<PunchInScreen> {
  late Timer _timer;
  DateTime _currentTime = DateTime.now();

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _currentTime = DateTime.now();
      });
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<PunchInState>(punchInNotifierProvider, (previous, next) {
      if (next is PunchInSuccess) {
        AppFeedback.showSuccessDialog(
          context,
          title: 'Punch In Successful',
          message: 'Your attendance has been recorded.',
          onOk: () {
            context.pop(); // Close dialog
            context.pop(); // Go back to dashboard
          },
        );
      } else if (next is PunchInError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      }
    });

    final authState = ref.watch(authNotifierProvider);
    String employeeName = 'User';
    String employeeCode = 'EMP-000';
    String hq = 'N/A';

    if (authState is AuthStateAuthenticated) {
      employeeName = authState.user.name;
      employeeCode = authState.user.id;
      hq = authState.user.territory;
    }

    final punchInState = ref.watch(punchInNotifierProvider);
    final isLoading = punchInState is PunchInLoading;
    final loadingMessage = isLoading ? (punchInState).message : null;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Punch In'),
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.onPrimary,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSizes.p24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Live Clock Card
              Card(
                color: AppColors.primary.withOpacity(0.1),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppSizes.radius12),
                  side: BorderSide(color: AppColors.primary.withOpacity(0.3)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(AppSizes.p24),
                  child: Column(
                    children: [
                      Text(
                        DateFormat('EEEE, dd MMM yyyy').format(_currentTime),
                        style: AppTypography.titleMedium.copyWith(color: AppColors.primary),
                      ),
                      AppSizes.gap8,
                      Text(
                        DateFormat('hh:mm:ss a').format(_currentTime),
                        style: AppTypography.displaySmall.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              AppSizes.gap24,

              // Employee Details
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppSizes.radius12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(AppSizes.p16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildDetailRow('Employee Name', employeeName),
                      const Divider(),
                      _buildDetailRow('Employee Code', employeeCode),
                      const Divider(),
                      _buildDetailRow('Headquarter', hq),
                      const Divider(),
                      _buildDetailRow("Today's MTP", 'Approved'),
                    ],
                  ),
                ),
              ),
              AppSizes.gap24,

              // Status Indicators
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildStatusIcon(Icons.location_on, 'GPS', AppColors.success),
                  _buildStatusIcon(Icons.wifi, 'Internet', AppColors.success),
                  _buildStatusIcon(Icons.battery_charging_full, 'Battery', AppColors.success),
                ],
              ),
              
              const Spacer(),
              
              if (isLoading)
                Column(
                  children: [
                    const CircularProgressIndicator(),
                    AppSizes.gap16,
                    Text(loadingMessage ?? 'Processing...', style: AppTypography.bodyMedium),
                    AppSizes.gap24,
                  ],
                ),

              // Punch Button
              SizedBox(
                height: 60,
                child: AppButton(
                  text: 'PUNCH IN',
                  onPressed: isLoading ? null : () => ref.read(punchInNotifierProvider.notifier).submitPunchIn(),
                  isLoading: isLoading,
                  icon: Icons.fingerprint,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSizes.p8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AppTypography.bodyMedium.copyWith(color: AppColors.grey600)),
          Text(value, style: AppTypography.titleSmall),
        ],
      ),
    );
  }

  Widget _buildStatusIcon(IconData icon, String label, Color color) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(AppSizes.p12),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color, size: 28),
        ),
        AppSizes.gap8,
        Text(label, style: AppTypography.labelSmall),
      ],
    );
  }
}
