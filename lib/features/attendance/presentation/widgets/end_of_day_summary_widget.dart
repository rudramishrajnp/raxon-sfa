import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/end_of_day_summary_model.dart';

class EndOfDaySummaryWidget extends StatelessWidget {
  final EndOfDaySummaryModel summary;

  const EndOfDaySummaryWidget({super.key, required this.summary});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppSizes.radius12)),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'End of Day Summary',
              style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold, color: AppColors.primary),
              textAlign: TextAlign.center,
            ),
            const Divider(height: 32),
            _buildRow('Employee', '${summary.employeeName} (${summary.employeeCode})'),
            _buildRow('Punch In Time', DateFormat('hh:mm a').format(summary.punchInTime)),
            _buildRow('Current Time', DateFormat('hh:mm a').format(summary.currentTime)),
            _buildRow(
              'Total Working Hours',
              '${summary.totalWorkingHours.inHours}h ${summary.totalWorkingHours.inMinutes.remainder(60)}m',
            ),
            const Divider(height: 32),
            Text('Visits & Tasks', style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.bold)),
            AppSizes.gap8,
            _buildRow('Planned Calls', summary.plannedCalls.toString()),
            _buildRow('Completed Calls', summary.completedCalls.toString()),
            _buildRow('Pending Calls', summary.pendingCalls.toString(), 
                valueColor: summary.pendingCalls > 0 ? AppColors.error : AppColors.success),
            const Divider(height: 32),
            Text('Business', style: AppTypography.titleSmall.copyWith(fontWeight: FontWeight.bold)),
            AppSizes.gap8,
            _buildRow('Total Samples Given', summary.totalSamplesGiven.toString()),
            _buildRow('Orders Booked', '₹${summary.ordersBooked.toStringAsFixed(2)}'),
            _buildRow("Today's Expenses", '₹${summary.todayExpenses.toStringAsFixed(2)}'),
            const Divider(height: 32),
            _buildRow('GPS Status', summary.isGpsActive ? 'Active' : 'Inactive',
                valueColor: summary.isGpsActive ? AppColors.success : AppColors.error),
          ],
        ),
      ),
    );
  }

  Widget _buildRow(String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSizes.p4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AppTypography.bodyMedium.copyWith(color: AppColors.grey600)),
          Text(value, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold, color: valueColor)),
        ],
      ),
    );
  }
}
