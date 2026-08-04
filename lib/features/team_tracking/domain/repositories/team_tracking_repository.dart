import '../../data/models/team_tracking_models.dart';

abstract class TeamTrackingRepository {
  Future<List<TeamMemberLocationModel>> getLiveTeamLocations(String managerId, {Map<String, dynamic>? filters});
  Future<List<TrackingEventModel>> getRouteMovement(String employeeId, DateTime date);
  Future<void> logAuditRecord(String managerId, String employeeId, DateTime dateViewed);
}
