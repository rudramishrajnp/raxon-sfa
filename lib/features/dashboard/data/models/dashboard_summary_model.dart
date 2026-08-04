class DashboardSummaryModel {
  final bool isPunchedIn;
  final DateTime? punchInTime;
  final Duration workingDuration;
  final String mtpStatus;
  final String routeName;
  final int targetCalls;
  final int completedCalls;
  final int plannedDoctors;
  final int visitedDoctors;
  final int pendingDoctors;
  final int samplesGiven;
  final double ordersBooked;
  final double expensesToday;

  DashboardSummaryModel({
    required this.isPunchedIn,
    this.punchInTime,
    required this.workingDuration,
    required this.mtpStatus,
    required this.routeName,
    required this.targetCalls,
    required this.completedCalls,
    required this.plannedDoctors,
    required this.visitedDoctors,
    required this.pendingDoctors,
    required this.samplesGiven,
    required this.ordersBooked,
    required this.expensesToday,
  });

  factory DashboardSummaryModel.fromJson(Map<String, dynamic> json) {
    return DashboardSummaryModel(
      isPunchedIn: json['isPunchedIn'] as bool? ?? false,
      punchInTime: json['punchInTime'] != null ? DateTime.parse(json['punchInTime']) : null,
      workingDuration: Duration(minutes: json['workingDurationMinutes'] as int? ?? 0),
      mtpStatus: json['mtpStatus'] as String? ?? 'Not Planned',
      routeName: json['routeName'] as String? ?? 'N/A',
      targetCalls: json['targetCalls'] as int? ?? 0,
      completedCalls: json['completedCalls'] as int? ?? 0,
      plannedDoctors: json['plannedDoctors'] as int? ?? 0,
      visitedDoctors: json['visitedDoctors'] as int? ?? 0,
      pendingDoctors: json['pendingDoctors'] as int? ?? 0,
      samplesGiven: json['samplesGiven'] as int? ?? 0,
      ordersBooked: (json['ordersBooked'] as num? ?? 0).toDouble(),
      expensesToday: (json['expensesToday'] as num? ?? 0).toDouble(),
    );
  }
}
