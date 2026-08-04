class MtpApprovalRequest {
  final String mtpId;
  final String managerId;
  final String action; // APPROVE, REJECT, RETURN
  final String? remarks;

  MtpApprovalRequest({
    required this.mtpId,
    required this.managerId,
    required this.action,
    this.remarks,
  });

  Map<String, dynamic> toJson() => {
        'mtpId': mtpId,
        'managerId': managerId,
        'action': action,
        'remarks': remarks,
      };
}
