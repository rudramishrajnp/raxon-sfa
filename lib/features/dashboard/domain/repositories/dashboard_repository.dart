import '../../data/models/dashboard_summary_model.dart';
import '../../data/models/announcement_model.dart';

abstract class DashboardRepository {
  Future<DashboardSummaryModel> getDashboardSummary();
  Future<List<AnnouncementModel>> getLatestAnnouncements();
  Future<void> punchIn();
  Future<void> punchOut();
}
