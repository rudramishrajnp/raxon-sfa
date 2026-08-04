class ExecutiveKpiModel {
  final int totalEmployees;
  final int activeEmployees;
  final int present;
  final int absent;
  final int onLeave;
  final int totalDoctors;
  final int totalChemists;
  final int totalStockists;
  final int totalCalls;
  final int productiveCalls;
  final int ordersBooked;
  final int samplesDistributed;
  final double totalExpenses;
  final double primarySales;
  final double secondarySales;
  final double collection;

  ExecutiveKpiModel({
    required this.totalEmployees,
    required this.activeEmployees,
    required this.present,
    required this.absent,
    required this.onLeave,
    required this.totalDoctors,
    required this.totalChemists,
    required this.totalStockists,
    required this.totalCalls,
    required this.productiveCalls,
    required this.ordersBooked,
    required this.samplesDistributed,
    required this.totalExpenses,
    required this.primarySales,
    required this.secondarySales,
    required this.collection,
  });
}

class ReportConfigModel {
  final String id;
  final String name;
  final String type; // Attendance, MTP, DCR, Expense, Sales
  final List<String> columns;
  final String schedule; // Daily, Weekly, Monthly
  final List<String> emailRecipients;

  ReportConfigModel({
    required this.id,
    required this.name,
    required this.type,
    required this.columns,
    required this.schedule,
    required this.emailRecipients,
  });
}
