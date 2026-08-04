import '../../data/models/reports_models.dart';

abstract class ReportsState {}

class ReportsInitial extends ReportsState {}
class ReportsLoading extends ReportsState {}
class ReportsLoaded extends ReportsState {
  final ReportKpiModel kpis;
  final List<TeamPerformanceModel> teamPerformance;
  final List<ChartDataModel> chartData;
  final ReportFiltersModel currentFilters;

  ReportsLoaded({
    required this.kpis,
    required this.teamPerformance,
    required this.chartData,
    required this.currentFilters,
  });
}
class ReportsError extends ReportsState {
  final String message;
  ReportsError(this.message);
}
