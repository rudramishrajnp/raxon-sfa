class OverrideRequestModel {
  final String id;
  final String employeeId;
  final String employeeName;
  final String employeeCode;
  final String hq;
  
  final DateTime requestTime;
  final String reason;
  final String? remarks;
  
  final double currentLat;
  final double currentLng;
  final int batteryLevel;
  final String internetStatus;
  final String? photoUrl;
  
  final DateTime originalPunchIn;
  final DateTime originalPunchOut;
  final String? previousAttendanceId;
  
  final String status; // 'Pending', 'Approved', 'Rejected', 'Clarification Requested'
  final String syncStatus;

  final OverrideDataSummary dataSummary;
  final List<OverrideAuditLogModel> auditTrail;

  OverrideRequestModel({
    required this.id,
    required this.employeeId,
    required this.employeeName,
    required this.employeeCode,
    required this.hq,
    required this.requestTime,
    required this.reason,
    this.remarks,
    required this.currentLat,
    required this.currentLng,
    required this.batteryLevel,
    required this.internetStatus,
    this.photoUrl,
    required this.originalPunchIn,
    required this.originalPunchOut,
    this.previousAttendanceId,
    required this.status,
    required this.syncStatus,
    required this.dataSummary,
    this.auditTrail = const [],
  });

  String get totalWorkingHours {
    final diff = originalPunchOut.difference(originalPunchIn);
    return '${diff.inHours}h ${diff.inMinutes.remainder(60)}m';
  }
}

class OverrideDataSummary {
  final int dcrCount;
  final int orderCount;
  final double totalExpenses;

  OverrideDataSummary({
    required this.dcrCount,
    required this.orderCount,
    required this.totalExpenses,
  });
}

class OverrideAuditLogModel {
  final String action;
  final String byUser;
  final DateTime timestamp;
  final String? remarks;

  OverrideAuditLogModel({
    required this.action,
    required this.byUser,
    required this.timestamp,
    this.remarks,
  });
}

class OverrideSystemConfig {
  final bool allowRePunchIn;
  final int maxOverridesPerMonth;
  final bool approvalRequired;
  final int autoExpiryHours;

  OverrideSystemConfig({
    required this.allowRePunchIn,
    required this.maxOverridesPerMonth,
    required this.approvalRequired,
    required this.autoExpiryHours,
  });
}
