import '../../data/repositories/dcr_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/location_service.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/services/geofence_service.dart';
import '../../domain/repositories/dcr_repository.dart';
import '../../domain/validators/dcr_validator.dart';
import '../../data/models/dcr_checkin_model.dart';
import '../../data/models/override_request_model.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../authentication/presentation/providers/auth_state.dart';
import 'dcr_checkin_state.dart';

class DcrCheckInNotifier extends StateNotifier<DcrCheckInState> {
  final DcrRepository _repository;
  final Ref _ref;

  DcrCheckInNotifier(this._repository, this._ref) : super(DcrCheckInInitial());

  String _getEmployeeId() {
    final authState = _ref.read(authNotifierProvider);
    if (authState is AuthStateAuthenticated) {
      return authState.user.id;
    }
    return 'UNKNOWN';
  }

  Future<void> submitCheckIn(String customerId, double targetLat, double targetLng) async {
    state = DcrCheckInLoading();
    try {
      final employeeId = _getEmployeeId();
      
      // Validation
      final validator = DcrValidator(_repository);
      final error = await validator.validateCheckIn(employeeId, customerId);
      if (error != null) {
        state = DcrCheckInError(error);
        return;
      }

      // Location
      final locationService = _ref.read(locationServiceProvider);
      final isEnabled = await locationService.isLocationServiceEnabled();
      if (!isEnabled) {
        state = DcrCheckInError('Location services are disabled.');
        return;
      }

      final position = await locationService.getCurrentPosition();

      // Geofence
      final geofenceService = _ref.read(geofenceServiceProvider);
      final distance = geofenceService.getDistance(
        currentLat: position.latitude, 
        currentLng: position.longitude, 
        targetLat: targetLat, 
        targetLng: targetLng,
      );

      if (distance > GeofenceService.defaultRadiusMeters) {
        state = DcrLocationError('You are ${distance.toStringAsFixed(0)} meters away. Must be within ${GeofenceService.defaultRadiusMeters.toStringAsFixed(0)} meters to check in.');
        return;
      }

      // Device State
      final isConnected = await _ref.read(connectivityServiceProvider).isConnected();
      int batteryLevel = 85; // Mock

      // Submit
      final checkIn = DcrCheckInModel(
        employeeId: employeeId,
        customerId: customerId,
        date: DateTime.now(),
        checkInTime: DateTime.now(),
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        distance: distance,
        isInternetAvailable: isConnected,
        batteryPercentage: batteryLevel,
        deviceId: 'DEVICE_ID_MOCK',
      );

      await _repository.submitCheckIn(checkIn);
      state = DcrCheckInSuccess('Checked in successfully!');
    } catch (e) {
      state = DcrCheckInError('Failed to check in: ${e.toString()}');
    }
  }

  Future<void> submitOverrideRequest(String customerId, String reason, String note, double targetLat, double targetLng) async {
    state = DcrCheckInLoading();
    try {
      final locationService = _ref.read(locationServiceProvider);
      final position = await locationService.getCurrentPosition();
      
      final request = OverrideRequestModel(
        employeeId: _getEmployeeId(),
        customerId: customerId,
        reason: reason,
        note: note,
        latitude: position.latitude,
        longitude: position.longitude,
        timestamp: DateTime.now(),
      );

      await _repository.submitOverrideRequest(request);
      state = DcrCheckInSuccess('Override request sent to Area Manager.');
    } catch (e) {
      state = DcrCheckInError('Failed to send override request.');
    }
  }
}

final dcrCheckInNotifierProvider = StateNotifierProvider<DcrCheckInNotifier, DcrCheckInState>((ref) {
  return DcrCheckInNotifier(
    ref.watch(dcrRepositoryProvider),
    ref,
  );
});
