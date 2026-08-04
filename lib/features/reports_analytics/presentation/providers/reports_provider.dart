import '../../data/repositories/reports_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/reports_repository.dart';
import '../../data/models/reports_models.dart';
import 'reports_state.dart';
import '../../domain/services/export_service.dart';
import '../../../../core/services/notification_service.dart';

class ReportsNotifier extends StateNotifier<ReportsState> {
  final ReportsRepository _repository;
  final ExportService _exportService;
  final NotificationService _notificationService;
  final String _managerId;

  ReportFiltersModel _currentFilters = ReportFiltersModel();

  ReportsNotifier(
    this._repository, 
    this._exportService, 
    this._notificationService, 
    this._managerId
  ) : super(ReportsInitial()) {
    loadData();
  }

  Future<void> loadData({bool showLoading = true}) async {
    if (showLoading) state = ReportsLoading();
    try {
      final filtersMap = _currentFilters.toMap();
      final futures = await Future.wait([
        _repository.getDashboardKpis(_managerId, filters: filtersMap),
        _repository.getTeamPerformance(_managerId, filters: filtersMap),
        _repository.getTrendData(_managerId, 'sales', filters: filtersMap),
      ]);

      state = ReportsLoaded(
        kpis: futures[0] as ReportKpiModel,
        teamPerformance: futures[1] as List<TeamPerformanceModel>,
        chartData: futures[2] as List<ChartDataModel>,
        currentFilters: _currentFilters,
      );
    } catch (e) {
      if (showLoading) state = ReportsError("Failed to load reports data: ${e.toString()}");
    }
  }

  Future<void> refresh() async {
    await loadData(showLoading: false);
  }

  void updateFilters(ReportFiltersModel filters) {
    _currentFilters = filters;
    loadData();
  }
  
  void clearFilters() {
    _currentFilters = ReportFiltersModel();
    loadData();
  }

  Future<void> exportReport(String format, String reportName) async {
    if (state is! ReportsLoaded) return;
    
    // Fire and forget notification
    _notificationService.sendLocalNotification(
      title: 'Export Started',
      body: 'Your $reportName is being exported to $format.',
    );
    
    bool success = false;
    final dataMap = {'managerId': _managerId};
    
    try {
      if (format == 'PDF') {
        success = await _exportService.exportToPdf(reportName, dataMap);
      } else if (format == 'Excel') {
        success = await _exportService.exportToExcel(reportName, dataMap);
      } else if (format == 'CSV') {
        success = await _exportService.exportToCsv(reportName, dataMap);
      }
      
      if (success) {
        _notificationService.sendLocalNotification(
          title: 'Export Completed',
          body: '$reportName has been successfully exported to $format.',
        );
      }
    } catch (e) {
      _notificationService.sendLocalNotification(
        title: 'Export Failed',
        body: 'Failed to export $reportName. Please try again.',
      );
    }
  }
}

final reportsNotifierProvider = StateNotifierProvider<ReportsNotifier, ReportsState>((ref) {
  return ReportsNotifier(
    ref.watch(reportsRepositoryProvider),
    ref.watch(exportServiceProvider),
    ref.watch(notificationServiceProvider),
    'MGR-100',
  );
});
