import '../../data/models/dashboard_summary_model.dart';
import '../../data/models/announcement_model.dart';

abstract class DashboardState {}

class DashboardStateInitial extends DashboardState {}

class DashboardStateLoading extends DashboardState {}

class DashboardStateLoaded extends DashboardState {
  final DashboardSummaryModel summary;
  final List<AnnouncementModel> announcements;

  DashboardStateLoaded({
    required this.summary,
    required this.announcements,
  });
  
  DashboardStateLoaded copyWith({
    DashboardSummaryModel? summary,
    List<AnnouncementModel>? announcements,
  }) {
    return DashboardStateLoaded(
      summary: summary ?? this.summary,
      announcements: announcements ?? this.announcements,
    );
  }
}

class DashboardStateError extends DashboardState {
  final String message;
  DashboardStateError(this.message);
}
