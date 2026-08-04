import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/manager_dashboard_repository.dart';
import '../api/manager_dashboard_api_service.dart';
import '../models/manager_dashboard_summary_model.dart';
import '../models/team_member_status_model.dart';
import '../../../../core/services/connectivity_service.dart';

class ManagerDashboardRepositoryImpl implements ManagerDashboardRepository {
  final ManagerDashboardApiService _apiService;
  final ConnectivityService _connectivityService;

  ManagerDashboardRepositoryImpl(this._apiService, this._connectivityService);

  @override
  Future<ManagerDashboardSummaryModel> getSummary(String managerId) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      // In a real app, you would save this to the local database for offline viewing
      return await _apiService.getDashboardSummary(managerId);
    } else {
      // Return cached summary from local DB
      return await _apiService.getDashboardSummary(managerId); // stub
    }
  }

  @override
  Future<List<TeamMemberStatusModel>> getTeamStatus(String managerId) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      // In a real app, save to local database
      return await _apiService.getTeamStatus(managerId);
    } else {
      // Return cached status from local DB
      return await _apiService.getTeamStatus(managerId); // stub
    }
  }
}

final managerDashboardRepositoryProvider = Provider<ManagerDashboardRepository>((ref) {
  return ManagerDashboardRepositoryImpl(
    ref.watch(managerDashboardApiServiceProvider),
    ref.watch(connectivityServiceProvider),
  );
});
