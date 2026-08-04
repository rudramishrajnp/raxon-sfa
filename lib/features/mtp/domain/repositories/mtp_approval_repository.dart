import '../../data/models/mtp_approval_request.dart';
import '../../data/models/mtp_audit_model.dart';

abstract class MtpApprovalRepository {
  Future<void> processApproval(MtpApprovalRequest request);
  Future<List<MtpAuditModel>> getMtpAuditHistory(String mtpId);
  Future<void> cancelDraft(String mtpId);
}
