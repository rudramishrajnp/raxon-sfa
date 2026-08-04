class ReportKpiModel {
  final int totalMrs;
  final int activeMrs;
  final int present;
  final int absent;
  final int onLeave;
  final int punchedIn;
  final int punchedOut;
  final int totalCalls;
  final int productiveCalls;
  final int missedCalls;
  final int orders;
  final int samples;
  final double expenses;
  final double secondarySales;

  ReportKpiModel({
    required this.totalMrs,
    required this.activeMrs,
    required this.present,
    required this.absent,
    required this.onLeave,
    required this.punchedIn,
    required this.punchedOut,
    required this.totalCalls,
    required this.productiveCalls,
    required this.missedCalls,
    required this.orders,
    required this.samples,
    required this.expenses,
    required this.secondarySales,
  });
}

class TeamPerformanceModel {
  final String employeeId;
  final String employeeName;
  final double callAverage;
  final double coveragePercentage;
  final double salesValue;
  final int ordersCount;
  final double expenseDisciplineScore; // out of 100
  final double attendancePercentage; // out of 100
  final double gpsCompliancePercentage; // out of 100

  TeamPerformanceModel({
    required this.employeeId,
    required this.employeeName,
    required this.callAverage,
    required this.coveragePercentage,
    required this.salesValue,
    required this.ordersCount,
    required this.expenseDisciplineScore,
    required this.attendancePercentage,
    required this.gpsCompliancePercentage,
  });
}

class ChartDataModel {
  final String label;
  final double value;

  ChartDataModel({required this.label, required this.value});
}

class ReportFiltersModel {
  DateTime? startDate;
  DateTime? endDate;
  String? employeeId;
  String? hq;
  String? zone;
  String? region;
  String? territory;
  String? productId;
  String? doctorId;
  String? chemistId;

  ReportFiltersModel({
    this.startDate,
    this.endDate,
    this.employeeId,
    this.hq,
    this.zone,
    this.region,
    this.territory,
    this.productId,
    this.doctorId,
    this.chemistId,
  });
  
  Map<String, dynamic> toMap() {
    return {
      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'employeeId': employeeId,
      'hq': hq,
      'zone': zone,
      'region': region,
      'territory': territory,
      'productId': productId,
      'doctorId': doctorId,
      'chemistId': chemistId,
    };
  }
}

class ScheduledReportModel {
  final String id;
  final String reportType;
  final String frequency; // 'Daily', 'Weekly', 'Monthly'
  final String format; // 'PDF', 'Excel', 'CSV'
  final String emailTo;
  final bool isActive;

  ScheduledReportModel({
    required this.id,
    required this.reportType,
    required this.frequency,
    required this.format,
    required this.emailTo,
    this.isActive = true,
  });
}
