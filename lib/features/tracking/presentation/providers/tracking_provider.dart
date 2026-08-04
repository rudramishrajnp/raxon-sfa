import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/permission_service.dart';
import '../../services/background_location_service.dart';

class TrackingState {
  final bool isTracking;
  final String? error;

  TrackingState({this.isTracking = false, this.error});

  TrackingState copyWith({bool? isTracking, String? error}) {
    return TrackingState(
      isTracking: isTracking ?? this.isTracking,
      error: error,
    );
  }
}

class TrackingNotifier extends StateNotifier<TrackingState> {
  final BackgroundLocationService _backgroundLocationService;
  final PermissionService _permissionService;

  TrackingNotifier(
    this._backgroundLocationService,
    this._permissionService,
  ) : super(TrackingState(isTracking: _backgroundLocationService.isTracking));

  Future<void> startTracking() async {
    try {
      final hasPermission = await _permissionService.requestLocationPermission();
      if (!hasPermission) {
        state = state.copyWith(error: 'Location permission is required for background tracking.');
        return;
      }

      // Background permission is typically needed for true background tracking
      // We assume it's handled or requested in a real scenario
      
      await _backgroundLocationService.startBackgroundTracking();
      state = state.copyWith(isTracking: true, error: null);
    } catch (e) {
      state = state.copyWith(error: 'Failed to start tracking: ${e.toString()}');
    }
  }

  void stopTracking() {
    _backgroundLocationService.stopBackgroundTracking();
    state = state.copyWith(isTracking: false, error: null);
  }

  Future<void> logEvent(String eventName) async {
    await _backgroundLocationService.captureEventLocation(eventName);
  }
}

final trackingNotifierProvider = StateNotifierProvider<TrackingNotifier, TrackingState>((ref) {
  return TrackingNotifier(
    ref.watch(backgroundLocationServiceProvider),
    ref.watch(permissionServiceProvider),
  );
});
