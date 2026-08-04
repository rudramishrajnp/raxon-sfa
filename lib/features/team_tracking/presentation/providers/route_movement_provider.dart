import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/team_tracking_repository.dart';
import '../../data/repositories/team_tracking_repository_impl.dart';
import '../../data/models/team_tracking_models.dart';

abstract class RouteMovementState {}

class RouteMovementInitial extends RouteMovementState {}
class RouteMovementLoading extends RouteMovementState {}
class RouteMovementLoaded extends RouteMovementState {
  final List<TrackingEventModel> events;
  RouteMovementLoaded(this.events);
}
class RouteMovementError extends RouteMovementState {
  final String message;
  RouteMovementError(this.message);
}

class RouteMovementNotifier extends StateNotifier<RouteMovementState> {
  final TeamTrackingRepository _repository;

  RouteMovementNotifier(this._repository) : super(RouteMovementInitial());

  Future<void> loadRoute(String employeeId, DateTime date) async {
    state = RouteMovementLoading();
    try {
      final events = await _repository.getRouteMovement(employeeId, date);
      // In real app, log audit here using repository
      // _repository.logAuditRecord(managerId, employeeId, DateTime.now());
      state = RouteMovementLoaded(events);
    } catch (e) {
      state = RouteMovementError("Failed to load route: ${e.toString()}");
    }
  }
}

final routeMovementNotifierProvider = StateNotifierProvider.family<RouteMovementNotifier, RouteMovementState, String>((ref, employeeId) {
  return RouteMovementNotifier(ref.watch(teamTrackingRepositoryProvider));
});
