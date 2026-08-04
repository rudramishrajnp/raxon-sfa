import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/analytics_models.dart';

abstract class AnalyticsRepository {
  Future<ExecutiveKpiModel> getExecutiveKpis();
  Future<List<ReportConfigModel>> getReportConfigs();
}

class AnalyticsRepositoryImpl implements AnalyticsRepository {
  @override
  Future<ExecutiveKpiModel> getExecutiveKpis() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return ExecutiveKpiModel(
      totalEmployees: 250,
      activeEmployees: 240,
      present: 220,
      absent: 10,
      onLeave: 10,
      totalDoctors: 15000,
      totalChemists: 5000,
      totalStockists: 500,
      totalCalls: 8500,
      productiveCalls: 6000,
      ordersBooked: 450,
      samplesDistributed: 12000,
      totalExpenses: 450000.0,
      primarySales: 1500000.0,
      secondarySales: 1200000.0,
      collection: 900000.0,
    );
  }

  @override
  Future<List<ReportConfigModel>> getReportConfigs() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return [
      ReportConfigModel(
        id: 'r1',
        name: 'Daily Attendance Report',
        type: 'Attendance',
        columns: ['Employee Name', 'Punch In', 'Punch Out', 'Status'],
        schedule: 'Daily',
        emailRecipients: ['admin@raxon.com'],
      ),
    ];
  }
}

final analyticsRepositoryProvider = Provider<AnalyticsRepository>((ref) {
  return AnalyticsRepositoryImpl();
});
