class ManagerDashboardSummaryModel {
  final int totalMRs;
  final int punchedIn;
  final int punchedOut;
  final int onLeave;
  final int workingOffline;
  final int pendingSync;

  final int plannedCalls;
  final int completedCalls;
  final int pendingCalls;
  final int ordersBooked;
  final int samplesDistributed;
  final double totalSecondarySales;
  final double totalExpenseClaims;

  ManagerDashboardSummaryModel({
    required this.totalMRs,
    required this.punchedIn,
    required this.punchedOut,
    required this.onLeave,
    required this.workingOffline,
    required this.pendingSync,
    required this.plannedCalls,
    required this.completedCalls,
    required this.pendingCalls,
    required this.ordersBooked,
    required this.samplesDistributed,
    required this.totalSecondarySales,
    required this.totalExpenseClaims,
  });
}
