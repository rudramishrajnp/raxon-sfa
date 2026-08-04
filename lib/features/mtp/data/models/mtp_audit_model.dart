class MtpAuditModel {
  final String id;
  final String mtpId;
  final String actionBy;
  final String actionByName;
  final String previousStatus;
  final String newStatus;
  final String? remarks;
  final DateTime actionDate;

  MtpAuditModel({
    required this.id,
    required this.mtpId,
    required this.actionBy,
    required this.actionByName,
    required this.previousStatus,
    required this.newStatus,
    this.remarks,
    required this.actionDate,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'mtpId': mtpId,
        'actionBy': actionBy,
        'actionByName': actionByName,
        'previousStatus': previousStatus,
        'newStatus': newStatus,
        'remarks': remarks,
        'actionDate': actionDate.toIso8601String(),
      };

  factory MtpAuditModel.fromJson(Map<String, dynamic> json) => MtpAuditModel(
        id: json['id'] as String,
        mtpId: json['mtpId'] as String,
        actionBy: json['actionBy'] as String,
        actionByName: json['actionByName'] as String,
        previousStatus: json['previousStatus'] as String,
        newStatus: json['newStatus'] as String,
        remarks: json['remarks'] as String?,
        actionDate: DateTime.parse(json['actionDate'] as String),
      );
}
