import '../../data/models/manager_dashboard_summary_model.dart';
import '../../data/models/team_member_status_model.dart';

abstract class ManagerDashboardState {}

class ManagerDashboardInitial extends ManagerDashboardState {}
class ManagerDashboardLoading extends ManagerDashboardState {}
class ManagerDashboardLoaded extends ManagerDashboardState {
  final ManagerDashboardSummaryModel summary;
  final List<TeamMemberStatusModel> teamStatus;

  ManagerDashboardLoaded({
    required this.summary,
    required this.teamStatus,
  });
}
class ManagerDashboardError extends ManagerDashboardState {
  final String message;
  ManagerDashboardError(this.message);
}
