class ExpenseSubmissionModel {
  final String id;
  final String claimNumber;
  final String employeeId;
  final String employeeName;
  final String employeeCode;
  final String hq;
  final DateTime date;
  
  final String dcrReference;
  final String mtpReference;
  
  final double taAmount;
  final double daAmount;
  final double miscAmount;
  final double claimedAmount;
  final double? approvedAmount;
  
  final List<String> expenseCategories;
  final List<ExpenseBillModel> uploadedBills;
  
  final String status; // 'Pending Approval', 'Approved', 'Partially Approved', 'Returned', 'Rejected'
  final bool hasHighExpenseFlag;
  final double? configuredLimit;
  final String? employeeJustification;
  
  final double? expenseLat;
  final double? expenseLng;
  final DateTime? expenseTime;
  final double? distanceFromRoute; // meters
  final bool isSuspiciousLocation;
  
  final String syncStatus;
  
  final List<ExpenseAuditLogModel> auditTrail;

  ExpenseSubmissionModel({
    required this.id,
    required this.claimNumber,
    required this.employeeId,
    required this.employeeName,
    required this.employeeCode,
    required this.hq,
    required this.date,
    required this.dcrReference,
    required this.mtpReference,
    required this.taAmount,
    required this.daAmount,
    required this.miscAmount,
    required this.claimedAmount,
    this.approvedAmount,
    required this.expenseCategories,
    required this.uploadedBills,
    required this.status,
    this.hasHighExpenseFlag = false,
    this.configuredLimit,
    this.employeeJustification,
    this.expenseLat,
    this.expenseLng,
    this.expenseTime,
    this.distanceFromRoute,
    this.isSuspiciousLocation = false,
    required this.syncStatus,
    this.auditTrail = const [],
  });
}

class ExpenseBillModel {
  final String id;
  final String url;
  final String type; // 'image', 'pdf'
  final String description;

  ExpenseBillModel({
    required this.id,
    required this.url,
    required this.type,
    required this.description,
  });
}

class ExpenseAuditLogModel {
  final String action;
  final String byUser;
  final DateTime timestamp;
  final String? remarks;
  final double? adjustmentAmount;

  ExpenseAuditLogModel({
    required this.action,
    required this.byUser,
    required this.timestamp,
    this.remarks,
    this.adjustmentAmount,
  });
}
