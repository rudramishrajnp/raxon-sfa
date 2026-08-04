class DeviationModel {
  final int? id;
  final String employeeId;
  final String customerId;
  final String reason;
  final String? remarks;
  final DateTime deviationDate;

  DeviationModel({
    this.id,
    required this.employeeId,
    required this.customerId,
    required this.reason,
    this.remarks,
    required this.deviationDate,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'employeeId': employeeId,
        'customerId': customerId,
        'reason': reason,
        'remarks': remarks,
        'deviationDate': deviationDate.toIso8601String(),
      };
}
