import '../../data/models/manager_dashboard_summary_model.dart';
import '../../data/models/team_member_status_model.dart';

abstract class ManagerDashboardRepository {
  Future<ManagerDashboardSummaryModel> getSummary(String managerId);
  Future<List<TeamMemberStatusModel>> getTeamStatus(String managerId);
}
