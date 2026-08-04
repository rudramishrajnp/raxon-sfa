import '../../data/models/reports_models.dart';

abstract class ReportsRepository {
  Future<ReportKpiModel> getDashboardKpis(String managerId, {Map<String, dynamic>? filters});
  Future<List<TeamPerformanceModel>> getTeamPerformance(String managerId, {Map<String, dynamic>? filters});
  Future<List<ChartDataModel>> getTrendData(String managerId, String metric, {Map<String, dynamic>? filters});
}
