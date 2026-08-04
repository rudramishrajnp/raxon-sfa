import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/mtp_approval_provider.dart';
import '../providers/mtp_approval_state.dart';
import '../widgets/mtp_audit_log_widget.dart';

class MtpApprovalScreen extends ConsumerStatefulWidget {
  final String mtpId;
  const MtpApprovalScreen({super.key, required this.mtpId});

  @override
  ConsumerState<MtpApprovalScreen> createState() => _MtpApprovalScreenState();
}

class _MtpApprovalScreenState extends ConsumerState<MtpApprovalScreen> {
  final TextEditingController _remarksController = TextEditingController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(mtpApprovalNotifierProvider.notifier).loadAuditHistory(widget.mtpId);
    });
  }

  @override
  void dispose() {
    _remarksController.dispose();
    super.dispose();
  }

  void _handleAction(String action) {
    if ((action == 'REJECT' || action == 'RETURN') && _remarksController.text.isEmpty) {
      AppFeedback.showSnackBar(context, 'Remarks are required for ${action.toLowerCase()}', isError: true);
      return;
    }
    
    ref.read(mtpApprovalNotifierProvider.notifier).submitApprovalAction(
      widget.mtpId, 
      action,
      remarks: _remarksController.text.isNotEmpty ? _remarksController.text : null,
    );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<MtpApprovalState>(mtpApprovalNotifierProvider, (previous, next) {
      if (next is MtpApprovalSuccess) {
        AppFeedback.showSuccessDialog(
          context,
          title: 'Success',
          message: next.message,
          onOk: () {
            context.pop();
            context.pop(); // Go back
          },
        );
      } else if (next is MtpApprovalError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      }
    });

    final state = ref.watch(mtpApprovalNotifierProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('MTP Approval & History')),
      body: SafeArea(
        child: state is MtpApprovalLoading
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                padding: const EdgeInsets.all(AppSizes.p24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text('Manager Actions', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
                    const Divider(height: 32),
                    
                    TextField(
                      controller: _remarksController,
                      decoration: const InputDecoration(
                        labelText: 'Remarks (Required for Reject/Return)',
                        border: OutlineInputBorder(),
                      ),
                      maxLines: 3,
                    ),
                    AppSizes.gap16,
                    
                    Row(
                      children: [
                        Expanded(
                          child: AppButton(
                            text: 'Approve',
                            type: AppButtonType.primary,
                            onPressed: () => _handleAction('APPROVE'),
                          ),
                        ),
                        AppSizes.gap8,
                        Expanded(
                          child: AppButton(
                            text: 'Return',
                            type: AppButtonType.secondary,
                            onPressed: () => _handleAction('RETURN'),
                          ),
                        ),
                        AppSizes.gap8,
                        Expanded(
                          child: AppButton(
                            text: 'Reject',
                            type: AppButtonType.danger,
                            onPressed: () => _handleAction('REJECT'),
                          ),
                        ),
                      ],
                    ),
                    
                    AppSizes.gap24,
                    Text('Audit History', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
                    const Divider(height: 32),
                    
                    if (state is MtpAuditHistoryLoaded)
                      MtpAuditLogWidget(logs: state.auditLogs),
                  ],
                ),
              ),
      ),
    );
  }
}
