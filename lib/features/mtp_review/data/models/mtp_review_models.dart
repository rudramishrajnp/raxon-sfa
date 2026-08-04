class MtpSubmissionModel {
  final String id;
  final String employeeId;
  final String employeeName;
  final String employeeCode;
  final String hq;
  final String territory;
  final String month;
  final String status;
  final DateTime submittedAt;
  final List<MtpDailyPlanModel> dailyPlans;
  final MtpValidationSummaryModel validationSummary;
  final List<MtpAuditLogModel> auditTrail;

  MtpSubmissionModel({
    required this.id,
    required this.employeeId,
    required this.employeeName,
    required this.employeeCode,
    required this.hq,
    required this.territory,
    required this.month,
    required this.status,
    required this.submittedAt,
    required this.dailyPlans,
    required this.validationSummary,
    required this.auditTrail,
  });
}

class MtpDailyPlanModel {
  final DateTime date;
  final String workType;
  final String locationType;
  final List<String> plannedDoctors;
  final List<String> plannedChemists;
  final String? remarks;

  MtpDailyPlanModel({
    required this.date,
    required this.workType,
    required this.locationType,
    required this.plannedDoctors,
    required this.plannedChemists,
    this.remarks,
  });
}

class MtpValidationSummaryModel {
  final int totalWorkingDays;
  final int totalLeaveDays;
  final int hqDays;
  final int exHqDays;
  final int outstationDays;
  final int transitDays;
  final int plannedDoctorVisits;
  final double visitFrequencyCompliance;
  final List<String> validationIssues;

  MtpValidationSummaryModel({
    required this.totalWorkingDays,
    required this.totalLeaveDays,
    required this.hqDays,
    required this.exHqDays,
    required this.outstationDays,
    required this.transitDays,
    required this.plannedDoctorVisits,
    required this.visitFrequencyCompliance,
    required this.validationIssues,
  });
}

class MtpAuditLogModel {
  final String action;
  final String? remarks;
  final DateTime timestamp;
  final String byUser;

  MtpAuditLogModel({
    required this.action,
    this.remarks,
    required this.timestamp,
    required this.byUser,
  });
}
