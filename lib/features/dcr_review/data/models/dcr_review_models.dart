class DcrSubmissionModel {
  final String id;
  final String employeeId;
  final String employeeName;
  final String employeeCode;
  final String hq;
  final String territory;
  final DateTime date;
  final String doctorName;
  final String chemistName;
  final String callStatus; // e.g., 'Completed', 'Draft', 'Submitted'
  final String syncStatus;
  final bool isJointWork;
  final String? jointManagerName;
  final bool isDeviation;
  final String? deviationReason;
  
  final DateTime? checkInTime;
  final DateTime? checkOutTime;
  final int? visitDurationMinutes;
  final double? checkInDistance; // meters from clinic
  final double? checkOutDistance;
  final double? gpsAccuracy;
  final bool outsideGeofence;
  final bool gpsOverrideUsed;
  
  final String? samplesGiven;
  final String? ordersBooked;
  final String? prescriptionDetails;
  final String? doctorFeedback;
  final String? competitorActivity;
  
  final String reviewStatus; // 'Pending', 'Verified', 'Flagged', 'Clarification Requested'
  final List<DcrAuditLogModel> auditTrail;
  
  // Coordinates for mapping
  final double? clinicLat;
  final double? clinicLng;
  final double? checkInLat;
  final double? checkInLng;
  final double? checkOutLat;
  final double? checkOutLng;

  DcrSubmissionModel({
    required this.id,
    required this.employeeId,
    required this.employeeName,
    required this.employeeCode,
    required this.hq,
    required this.territory,
    required this.date,
    required this.doctorName,
    this.chemistName = '',
    required this.callStatus,
    required this.syncStatus,
    this.isJointWork = false,
    this.jointManagerName,
    this.isDeviation = false,
    this.deviationReason,
    this.checkInTime,
    this.checkOutTime,
    this.visitDurationMinutes,
    this.checkInDistance,
    this.checkOutDistance,
    this.gpsAccuracy,
    this.outsideGeofence = false,
    this.gpsOverrideUsed = false,
    this.samplesGiven,
    this.ordersBooked,
    this.prescriptionDetails,
    this.doctorFeedback,
    this.competitorActivity,
    required this.reviewStatus,
    this.auditTrail = const [],
    this.clinicLat,
    this.clinicLng,
    this.checkInLat,
    this.checkInLng,
    this.checkOutLat,
    this.checkOutLng,
  });
}

class DcrAuditLogModel {
  final String action;
  final String byUser;
  final DateTime timestamp;
  final String? remarks;

  DcrAuditLogModel({
    required this.action,
    required this.byUser,
    required this.timestamp,
    this.remarks,
  });
}
