class WorkPlanSummaryModel {
  final DateTime date;
  final String employeeName;
  final String employeeCode;
  final String? approvedRoute;
  final String? hq;
  final String workType;
  final String locationType;
  final int plannedDoctorCount;
  final int plannedChemistCount;
  final int completedCalls;
  final int pendingCalls;
  final String mtpStatus;

  WorkPlanSummaryModel({
    required this.date,
    required this.employeeName,
    required this.employeeCode,
    this.approvedRoute,
    this.hq,
    required this.workType,
    required this.locationType,
    required this.plannedDoctorCount,
    required this.plannedChemistCount,
    required this.completedCalls,
    required this.pendingCalls,
    required this.mtpStatus,
  });
}
