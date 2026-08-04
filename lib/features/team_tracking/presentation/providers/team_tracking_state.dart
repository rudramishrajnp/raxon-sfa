import '../../data/models/team_tracking_models.dart';

abstract class TeamTrackingState {}

class TeamTrackingInitial extends TeamTrackingState {}
class TeamTrackingLoading extends TeamTrackingState {}
class TeamTrackingLoaded extends TeamTrackingState {
  final List<TeamMemberLocationModel> teamMembers;
  final bool isOfflineData;
  
  TeamTrackingLoaded({
    required this.teamMembers,
    this.isOfflineData = false,
  });
}
class TeamTrackingError extends TeamTrackingState {
  final String message;
  TeamTrackingError(this.message);
}
