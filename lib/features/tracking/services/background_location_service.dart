import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import '../../../core/services/location_service.dart';
import '../domain/repositories/tracking_repository.dart';
import '../data/repositories/tracking_repository_impl.dart';

class BackgroundLocationService {
  final LocationService _locationService;
  final TrackingRepository _trackingRepository;
  
  StreamSubscription<Position>? _positionStreamSubscription;
  bool _isTracking = false;

  Timer? _periodicTimer;

  BackgroundLocationService(this._locationService, this._trackingRepository);

  bool get isTracking => _isTracking;

  Future<void> startBackgroundTracking() async {
    if (_isTracking) return;

    final isEnabled = await _locationService.isLocationServiceEnabled();
    if (!isEnabled) {
      throw Exception('Location services are disabled.');
    }

    // Battery optimization settings:
    // distanceFilter: 500 meters (stops frequent updates when stationary)
    // For 15 minute interval, a timer is used alongside the distance stream
    const LocationSettings locationSettings = LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 500,
    );

    _isTracking = true;
    _positionStreamSubscription = Geolocator.getPositionStream(locationSettings: locationSettings).listen(
      (Position? position) {
        if (position != null) {
          _trackingRepository.saveLocationEvent(
            eventName: 'BACKGROUND_500M',
            latitude: position.latitude,
            longitude: position.longitude,
            accuracy: position.accuracy,
            timestamp: position.timestamp,
          );
        }
      },
      onError: (error) {
        // Handle stream error
        _isTracking = false;
      },
    );

    // Setup 15-minute periodic capture (Simulating Workmanager periodic task)
    _periodicTimer = Timer.periodic(const Duration(minutes: 15), (timer) {
      captureEventLocation('BACKGROUND_15MIN');
      // Attempt background sync
      _trackingRepository.syncPendingLogs();
    });

    // Initial capture when tracking starts
    try {
      final initialPosition = await _locationService.getCurrentPosition();
      await _trackingRepository.saveLocationEvent(
        eventName: 'TRACKING_STARTED',
        latitude: initialPosition.latitude,
        longitude: initialPosition.longitude,
        accuracy: initialPosition.accuracy,
        timestamp: initialPosition.timestamp,
      );
    } catch (e) {
      // Ignore initial capture failure
    }
  }

  void stopBackgroundTracking() {
    _positionStreamSubscription?.cancel();
    _positionStreamSubscription = null;
    _periodicTimer?.cancel();
    _periodicTimer = null;
    _isTracking = false;
  }

  Future<void> captureEventLocation(String eventName) async {
    try {
      final position = await _locationService.getCurrentPosition();
      await _trackingRepository.saveLocationEvent(
        eventName: eventName,
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        timestamp: position.timestamp,
      );
    } catch (e) {
      // Handle or log error capturing event location
    }
  }
}

final backgroundLocationServiceProvider = Provider<BackgroundLocationService>((ref) {
  return BackgroundLocationService(
    ref.watch(locationServiceProvider),
    ref.watch(trackingRepositoryProvider),
  );
});
