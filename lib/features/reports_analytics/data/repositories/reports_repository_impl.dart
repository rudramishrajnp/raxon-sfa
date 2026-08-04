import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/reports_repository.dart';
import '../api/reports_api_service.dart';
import '../models/reports_models.dart';

class ReportsRepositoryImpl implements ReportsRepository {
  final ReportsApiService _apiService;

  ReportsRepositoryImpl(this._apiService);

  @override
  Future<ReportKpiModel> getDashboardKpis(String managerId, {Map<String, dynamic>? filters}) async {
    return await _apiService.getDashboardKpis(managerId, filters: filters);
  }

  @override
  Future<List<TeamPerformanceModel>> getTeamPerformance(String managerId, {Map<String, dynamic>? filters}) async {
    return await _apiService.getTeamPerformance(managerId, filters: filters);
  }

  @override
  Future<List<ChartDataModel>> getTrendData(String managerId, String metric, {Map<String, dynamic>? filters}) async {
    return await _apiService.getTrendData(managerId, metric, filters: filters);
  }
}

final reportsRepositoryProvider = Provider<ReportsRepository>((ref) {
  return ReportsRepositoryImpl(ref.watch(reportsApiServiceProvider));
});
