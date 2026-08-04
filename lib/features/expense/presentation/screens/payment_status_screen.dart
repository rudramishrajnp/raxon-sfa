import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/expense_audit_model.dart';
import '../widgets/approval_timeline_widget.dart';

class PaymentStatusScreen extends StatelessWidget {
  final String expenseId;

  const PaymentStatusScreen({super.key, required this.expenseId});

  @override
  Widget build(BuildContext context) {
    // Mocking the audit history for demonstration
    final List<ExpenseAuditModel> mockAudits = [
      ExpenseAuditModel(
        id: '1',
        expenseId: expenseId,
        action: 'Expense Submitted',
        performedBy: 'USER_1',
        role: 'MR',
        timestamp: DateTime.now().subtract(const Duration(days: 2)),
        details: 'Claimed: ₹3500.00',
      ),
      ExpenseAuditModel(
        id: '2',
        expenseId: expenseId,
        action: 'Manager Review: Approved',
        performedBy: 'MANAGER_1',
        role: 'Area Manager',
        timestamp: DateTime.now().subtract(const Duration(days: 1)),
        details: 'Approved Full Amount.',
      ),
      ExpenseAuditModel(
        id: '3',
        expenseId: expenseId,
        action: 'Finance Action: Paid',
        performedBy: 'FINANCE_1',
        role: 'Finance',
        timestamp: DateTime.now().subtract(const Duration(hours: 2)),
        details: 'Mode: Bank Transfer, Txn: TRN873920',
      ),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Reimbursement History')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildStatusHeader(),
            AppSizes.gap24,
            const Text('Approval & Payment Timeline', style: AppTypography.titleMedium),
            AppSizes.gap16,
            ApprovalTimelineWidget(audits: mockAudits),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusHeader() {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.success.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: AppColors.success.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          const Icon(Icons.check_circle, color: AppColors.success, size: 48),
          AppSizes.gap8,
          Text('PAID', style: AppTypography.titleLarge.copyWith(color: AppColors.success, fontWeight: FontWeight.bold)),
          AppSizes.gap4,
          const Text('Reimbursement completed on Aug 2, 2026'),
        ],
      ),
    );
  }
}
