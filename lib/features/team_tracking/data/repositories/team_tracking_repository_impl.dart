import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/team_tracking_repository.dart';
import '../api/team_tracking_api_service.dart';
import '../models/team_tracking_models.dart';
import '../../../../core/services/connectivity_service.dart';

class TeamTrackingRepositoryImpl implements TeamTrackingRepository {
  final TeamTrackingApiService _apiService;
  final ConnectivityService _connectivityService;

  TeamTrackingRepositoryImpl(this._apiService, this._connectivityService);

  @override
  Future<List<TeamMemberLocationModel>> getLiveTeamLocations(String managerId, {Map<String, dynamic>? filters}) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      return await _apiService.getLiveTeamLocations(managerId, filters: filters);
    } else {
      // In real app: Fetch from local database
      return await _apiService.getLiveTeamLocations(managerId, filters: filters);
    }
  }

  @override
  Future<List<TrackingEventModel>> getRouteMovement(String employeeId, DateTime date) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      return await _apiService.getRouteMovement(employeeId, date);
    } else {
      // In real app: Fetch from local database
      return await _apiService.getRouteMovement(employeeId, date);
    }
  }
  
  @override
  Future<void> logAuditRecord(String managerId, String employeeId, DateTime dateViewed) async {
    // Simulate logging audit record
    await Future.delayed(const Duration(milliseconds: 200));
  }
}

final teamTrackingRepositoryProvider = Provider<TeamTrackingRepository>((ref) {
  return TeamTrackingRepositoryImpl(
    ref.watch(teamTrackingApiServiceProvider),
    ref.watch(connectivityServiceProvider),
  );
});
