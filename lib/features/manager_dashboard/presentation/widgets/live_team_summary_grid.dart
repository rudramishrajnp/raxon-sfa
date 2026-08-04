import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/manager_dashboard_summary_model.dart';

class LiveTeamSummaryGrid extends StatelessWidget {
  final ManagerDashboardSummaryModel summary;

  const LiveTeamSummaryGrid({super.key, required this.summary});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Live Team Summary', style: AppTypography.headlineSmall),
        AppSizes.gap16,
        GridView.count(
          crossAxisCount: 3,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: AppSizes.p12,
          crossAxisSpacing: AppSizes.p12,
          childAspectRatio: 1.0,
          children: [
            _buildStatCard('Total MRs', summary.totalMRs.toString(), Colors.blue),
            _buildStatCard('Punched In', summary.punchedIn.toString(), Colors.green),
            _buildStatCard('Punched Out', summary.punchedOut.toString(), Colors.orange),
            _buildStatCard('On Leave', summary.onLeave.toString(), Colors.purple),
            _buildStatCard('Offline', summary.workingOffline.toString(), Colors.grey),
            _buildStatCard('Pending Sync', summary.pendingSync.toString(), Colors.red),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: color.withOpacity(0.3)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            value,
            style: AppTypography.headlineMedium.copyWith(color: color, fontWeight: FontWeight.bold),
          ),
          AppSizes.gap4,
          Text(
            label,
            textAlign: TextAlign.center,
            style: AppTypography.bodySmall.copyWith(color: AppColors.grey700),
          ),
        ],
      ),
    );
  }
}
