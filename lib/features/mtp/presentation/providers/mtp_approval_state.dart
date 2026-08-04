import '../../data/models/mtp_audit_model.dart';

abstract class MtpApprovalState {}

class MtpApprovalInitial extends MtpApprovalState {}

class MtpApprovalLoading extends MtpApprovalState {}

class MtpApprovalSuccess extends MtpApprovalState {
  final String message;
  MtpApprovalSuccess(this.message);
}

class MtpApprovalError extends MtpApprovalState {
  final String message;
  MtpApprovalError(this.message);
}

class MtpAuditHistoryLoaded extends MtpApprovalState {
  final List<MtpAuditModel> auditLogs;
  MtpAuditHistoryLoaded(this.auditLogs);
}
