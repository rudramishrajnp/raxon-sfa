import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../utils/haversine_utility.dart';

class GeofenceService {
  static const double defaultRadiusMeters = 50.0;

  bool isWithinGeofence({
    required double currentLat,
    required double currentLng,
    required double targetLat,
    required double targetLng,
    double radius = defaultRadiusMeters,
  }) {
    final distance = HaversineUtility.calculateDistanceInMeters(
      currentLat, currentLng, targetLat, targetLng,
    );
    return distance <= radius;
  }
  
  double getDistance({
    required double currentLat,
    required double currentLng,
    required double targetLat,
    required double targetLng,
  }) {
    return HaversineUtility.calculateDistanceInMeters(
      currentLat, currentLng, targetLat, targetLng,
    );
  }
}

final geofenceServiceProvider = Provider<GeofenceService>((ref) {
  return GeofenceService();
});
