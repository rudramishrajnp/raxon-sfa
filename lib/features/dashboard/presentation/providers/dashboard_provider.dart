import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/error/api_exceptions.dart';
import '../../domain/repositories/dashboard_repository.dart';
import '../../data/repositories/dashboard_repository_impl.dart';
import 'dashboard_state.dart';

class DashboardNotifier extends StateNotifier<DashboardState> {
  final DashboardRepository _repository;

  DashboardNotifier(this._repository) : super(DashboardStateInitial()) {
    loadDashboardData();
  }

  Future<void> loadDashboardData() async {
    state = DashboardStateLoading();
    try {
      final summary = await _repository.getDashboardSummary();
      final announcements = await _repository.getLatestAnnouncements();
      
      state = DashboardStateLoaded(
        summary: summary,
        announcements: announcements,
      );
    } on ApiException catch (e) {
      state = DashboardStateError(e.message);
    } catch (e) {
      state = DashboardStateError('Failed to load dashboard data. Please try again.');
    }
  }

  Future<void> togglePunchStatus() async {
    if (state is DashboardStateLoaded) {
      final currentState = state as DashboardStateLoaded;
      final isCurrentlyPunchedIn = currentState.summary.isPunchedIn;
      
      try {
        if (isCurrentlyPunchedIn) {
          await _repository.punchOut();
        } else {
          await _repository.punchIn();
        }
        
        // Refresh data after punch
        await loadDashboardData();
      } catch (e) {
        // Handle error (e.g., through a separate provider or snackbar in UI)
      }
    }
  }
}

final dashboardNotifierProvider = StateNotifierProvider<DashboardNotifier, DashboardState>((ref) {
  return DashboardNotifier(ref.watch(dashboardRepositoryProvider));
});
