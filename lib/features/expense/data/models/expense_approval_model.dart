class ExpenseApprovalModel {
  final String id;
  final String expenseId;
  final String approverId;
  final String approverRole;
  final String status;
  final double claimAmount;
  final double? approvedAmount;
  final double? rejectedAmount;
  final String? adjustmentReason;
  final String? remarks;

  ExpenseApprovalModel({
    required this.id,
    required this.expenseId,
    required this.approverId,
    required this.approverRole,
    required this.status,
    required this.claimAmount,
    this.approvedAmount,
    this.rejectedAmount,
    this.adjustmentReason,
    this.remarks,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'expenseId': expenseId,
        'approverId': approverId,
        'approverRole': approverRole,
        'status': status,
        'claimAmount': claimAmount,
        'approvedAmount': approvedAmount,
        'rejectedAmount': rejectedAmount,
        'adjustmentReason': adjustmentReason,
        'remarks': remarks,
      };

  factory ExpenseApprovalModel.fromJson(Map<String, dynamic> json) => ExpenseApprovalModel(
        id: json['id'],
        expenseId: json['expenseId'],
        approverId: json['approverId'],
        approverRole: json['approverRole'],
        status: json['status'],
        claimAmount: (json['claimAmount'] as num).toDouble(),
        approvedAmount: json['approvedAmount'] != null ? (json['approvedAmount'] as num).toDouble() : null,
        rejectedAmount: json['rejectedAmount'] != null ? (json['rejectedAmount'] as num).toDouble() : null,
        adjustmentReason: json['adjustmentReason'],
        remarks: json['remarks'],
      );
}
