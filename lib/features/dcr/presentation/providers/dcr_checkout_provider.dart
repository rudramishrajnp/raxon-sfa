import '../../data/repositories/dcr_checkout_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/location_service.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/services/geofence_service.dart';
import '../../domain/repositories/dcr_checkout_repository.dart';
import '../../domain/validators/dcr_checkout_validator.dart';
import '../../data/models/dcr_checkout_model.dart';
import 'dcr_checkout_state.dart';

class DcrCheckOutNotifier extends StateNotifier<DcrCheckOutState> {
  final DcrCheckOutRepository _repository;
  final Ref _ref;

  DcrCheckOutNotifier(this._repository, this._ref) : super(DcrCheckOutInitial());

  Future<void> loadCheckOutData(String checkInId, String customerId) async {
    state = DcrCheckOutLoading();
    try {
      final checkInTime = await _repository.getCheckInTime(checkInId);
      final report = await _repository.getDcrReport(checkInId, customerId);

      if (checkInTime == null) {
        state = DcrCheckOutError('Check-in record not found.');
        return;
      }

      state = DcrCheckOutLoaded(checkInTime: checkInTime, report: report);
    } catch (e) {
      state = DcrCheckOutError('Failed to load check-out data: ${e.toString()}');
    }
  }

  Future<void> submitCheckOut({
    required String checkInId,
    required String customerId,
    required String customerName,
    required DateTime checkInTime,
    required double targetLat,
    required double targetLng,
    required String callStatus,
    String? doctorMood,
    String? productInterest,
    String? competitorActivity,
    String? newOpportunity,
    String? complaint,
    required bool followUpRequired,
    String? nextVisitNotes,
    String? remarks,
  }) async {
    state = DcrCheckOutLoading();
    try {
      // Location
      final locationService = _ref.read(locationServiceProvider);
      final isEnabled = await locationService.isLocationServiceEnabled();
      if (!isEnabled) {
        state = DcrCheckOutError('Location services are disabled.');
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
        state = DcrCheckOutLocationError('You are ${distance.toStringAsFixed(0)} meters away. Must be within ${GeofenceService.defaultRadiusMeters.toStringAsFixed(0)} meters to check out.');
        return;
      }

      final checkOutTime = DateTime.now();
      final visitDuration = checkOutTime.difference(checkInTime).inMinutes;
      final isConnected = await _ref.read(connectivityServiceProvider).isConnected();

      final model = DcrCheckOutModel(
        checkInId: checkInId,
        customerId: customerId,
        customerName: customerName,
        checkInTime: checkInTime,
        checkOutTime: checkOutTime,
        visitDurationMinutes: visitDuration,
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        distance: distance,
        callStatus: callStatus,
        doctorMood: doctorMood,
        productInterest: productInterest,
        competitorActivity: competitorActivity,
        newOpportunity: newOpportunity,
        complaint: complaint,
        followUpRequired: followUpRequired,
        nextVisitNotes: nextVisitNotes,
        remarks: remarks,
        isInternetAvailable: isConnected,
      );

      final validator = DcrCheckOutValidator(_repository);
      final error = await validator.validateCheckOut(model);
      if (error != null) {
        state = DcrCheckOutError(error);
        return;
      }

      await _repository.submitCheckOut(model);
      state = DcrCheckOutSuccess('Checked out successfully!');
    } catch (e) {
      state = DcrCheckOutError('Failed to check out: ${e.toString()}');
    }
  }
}

final dcrCheckOutNotifierProvider = StateNotifierProvider<DcrCheckOutNotifier, DcrCheckOutState>((ref) {
  return DcrCheckOutNotifier(
    ref.watch(dcrCheckOutRepositoryProvider),
    ref,
  );
});
