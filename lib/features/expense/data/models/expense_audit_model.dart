class ExpenseAuditModel {
  final String id;
  final String expenseId;
  final String action;
  final String performedBy;
  final String role;
  final DateTime timestamp;
  final String? deviceId;
  final String? details;

  ExpenseAuditModel({
    required this.id,
    required this.expenseId,
    required this.action,
    required this.performedBy,
    required this.role,
    required this.timestamp,
    this.deviceId,
    this.details,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'expenseId': expenseId,
        'action': action,
        'performedBy': performedBy,
        'role': role,
        'timestamp': timestamp.toIso8601String(),
        'deviceId': deviceId,
        'details': details,
      };

  factory ExpenseAuditModel.fromJson(Map<String, dynamic> json) => ExpenseAuditModel(
        id: json['id'],
        expenseId: json['expenseId'],
        action: json['action'],
        performedBy: json['performedBy'],
        role: json['role'],
        timestamp: DateTime.parse(json['timestamp']),
        deviceId: json['deviceId'],
        details: json['details'],
      );
}
