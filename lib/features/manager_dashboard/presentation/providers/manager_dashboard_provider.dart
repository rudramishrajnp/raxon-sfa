import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/manager_dashboard_repository.dart';
import '../../data/repositories/manager_dashboard_repository_impl.dart';
import 'manager_dashboard_state.dart';

class ManagerDashboardNotifier extends StateNotifier<ManagerDashboardState> {
  final ManagerDashboardRepository _repository;
  final String _managerId;

  ManagerDashboardNotifier(this._repository, this._managerId) : super(ManagerDashboardInitial()) {
    loadDashboard();
  }

  Future<void> loadDashboard() async {
    state = ManagerDashboardLoading();
    try {
      final summary = await _repository.getSummary(_managerId);
      final teamStatus = await _repository.getTeamStatus(_managerId);
      state = ManagerDashboardLoaded(summary: summary, teamStatus: teamStatus);
    } catch (e) {
      state = ManagerDashboardError("Failed to load dashboard: ${e.toString()}");
    }
  }

  Future<void> refresh() async {
    await loadDashboard();
  }
}

final managerDashboardNotifierProvider = StateNotifierProvider<ManagerDashboardNotifier, ManagerDashboardState>((ref) {
  // In a real app we'd get the managerId from auth state
  final managerId = 'AM123';
  return ManagerDashboardNotifier(
    ref.watch(managerDashboardRepositoryProvider),
    managerId,
  );
});
