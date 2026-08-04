import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/team_tracking_repository.dart';
import '../../data/repositories/team_tracking_repository_impl.dart';
import 'team_tracking_state.dart';
import '../../../../core/services/connectivity_service.dart';

class TeamTrackingNotifier extends StateNotifier<TeamTrackingState> {
  final TeamTrackingRepository _repository;
  final ConnectivityService _connectivityService;
  final String _managerId;
  
  Timer? _refreshTimer;
  Map<String, dynamic> _currentFilters = {};
  String _searchQuery = '';

  TeamTrackingNotifier(this._repository, this._connectivityService, this._managerId) : super(TeamTrackingInitial()) {
    loadTeamLocations();
    _startAutoRefresh();
  }

  void _startAutoRefresh() {
    // Configurable interval, using 1 minute for demo
    _refreshTimer = Timer.periodic(const Duration(minutes: 1), (_) {
      if (state is TeamTrackingLoaded) {
        refresh(showLoading: false);
      }
    });
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  Future<void> loadTeamLocations({bool showLoading = true}) async {
    if (showLoading) state = TeamTrackingLoading();
    try {
      final members = await _repository.getLiveTeamLocations(_managerId, filters: _currentFilters);
      
      // Apply local search
      final filteredMembers = _searchQuery.isEmpty 
          ? members 
          : members.where((m) => 
              m.name.toLowerCase().contains(_searchQuery.toLowerCase()) || 
              m.employeeCode.toLowerCase().contains(_searchQuery.toLowerCase()) ||
              m.territory.toLowerCase().contains(_searchQuery.toLowerCase())
            ).toList();

      final isConnected = await _connectivityService.isConnected();
      state = TeamTrackingLoaded(teamMembers: filteredMembers, isOfflineData: !isConnected);
    } catch (e) {
      if (showLoading) state = TeamTrackingError("Failed to load team locations: ${e.toString()}");
    }
  }

  Future<void> refresh({bool showLoading = true}) async {
    await loadTeamLocations(showLoading: showLoading);
  }

  void updateFilters(Map<String, dynamic> filters) {
    _currentFilters = filters;
    loadTeamLocations();
  }

  void updateSearchQuery(String query) {
    _searchQuery = query;
    loadTeamLocations();
  }
}

final teamTrackingNotifierProvider = StateNotifierProvider<TeamTrackingNotifier, TeamTrackingState>((ref) {
  // In real app, get managerId from auth
  final managerId = 'AM123';
  return TeamTrackingNotifier(
    ref.watch(teamTrackingRepositoryProvider),
    ref.watch(connectivityServiceProvider),
    managerId,
  );
});
