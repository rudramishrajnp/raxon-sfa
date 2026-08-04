class EndOfDaySummaryModel {
  final String employeeName;
  final String employeeCode;
  final DateTime punchInTime;
  final DateTime currentTime;
  final Duration totalWorkingHours;
  final int plannedCalls;
  final int completedCalls;
  final int pendingCalls;
  final int totalSamplesGiven;
  final double ordersBooked;
  final double todayExpenses;
  final bool isGpsActive;
  final bool hasIncompleteDcr;
  final bool hasMissingExpenses;

  EndOfDaySummaryModel({
    required this.employeeName,
    required this.employeeCode,
    required this.punchInTime,
    required this.currentTime,
    required this.totalWorkingHours,
    required this.plannedCalls,
    required this.completedCalls,
    required this.pendingCalls,
    required this.totalSamplesGiven,
    required this.ordersBooked,
    required this.todayExpenses,
    required this.isGpsActive,
    required this.hasIncompleteDcr,
    required this.hasMissingExpenses,
  });
}
