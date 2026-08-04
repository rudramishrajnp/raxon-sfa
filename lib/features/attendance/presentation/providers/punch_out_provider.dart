import '../../data/repositories/punch_out_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/location_service.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/services/device_info_service.dart';
import '../../../../core/services/battery_service.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../authentication/presentation/providers/auth_state.dart';
import '../../../tracking/presentation/providers/tracking_provider.dart';
import '../../domain/repositories/punch_out_repository.dart';
import '../../data/models/punch_out_request.dart';
import '../../data/models/end_of_day_summary_model.dart';
import 'punch_out_state.dart';

class PunchOutNotifier extends StateNotifier<PunchOutState> {
  final LocationService _locationService;
  final ConnectivityService _connectivityService;
  final DeviceInfoService _deviceInfoService;
  final BatteryService _batteryService;
  final PunchOutRepository _repository;
  final TrackingNotifier _trackingNotifier;
  final Ref _ref;

  EndOfDaySummaryModel? _summary;

  PunchOutNotifier(
    this._locationService,
    this._connectivityService,
    this._deviceInfoService,
    this._batteryService,
    this._repository,
    this._trackingNotifier,
    this._ref,
  ) : super(PunchOutInitial());

  Future<void> loadSummary() async {
    state = PunchOutLoading('Loading End of Day Summary...');
    try {
      final authState = _ref.read(authNotifierProvider);
      String employeeId = 'UNKNOWN';
      if (authState is AuthStateAuthenticated) {
        employeeId = authState.user.id;
      }
      _summary = await _repository.getEndOfDaySummary(employeeId);
      state = PunchOutSummaryLoaded(_summary!);
    } catch (e) {
      state = PunchOutError('Failed to load summary');
    }
  }

  Future<void> confirmPunchOut({bool managerOverride = false}) async {
    if (_summary == null) return;
    
    // 7, 8, 9. Validations
    if (!managerOverride) {
      if (_summary!.hasIncompleteDcr) {
        state = PunchOutError('Cannot punch out: Incomplete DCR entries.');
        return;
      }
      if (_summary!.hasMissingExpenses) {
        state = PunchOutError('Cannot punch out: Missing expense entries.');
        return;
      }
    }

    state = PunchOutLoading('Processing Punch Out...');
    
    try {
      // 4. Capture Network Type
      final isConnected = await _connectivityService.isConnected();
      final networkType = isConnected ? 'Online' : 'Offline';

      // 1. Capture Current GPS
      final position = await _locationService.getCurrentPosition();
      
      final deviceId = await _deviceInfoService.getDeviceId();
      
      // 3. Capture Battery %
      final batteryLevel = await _batteryService.getBatteryLevel();
      
      // 2. Capture Timestamp
      final now = DateTime.now();
      
      final authState = _ref.read(authNotifierProvider);
      String employeeId = 'UNKNOWN';
      if (authState is AuthStateAuthenticated) {
        employeeId = authState.user.id;
      }

      final request = PunchOutRequest(
        employeeId: employeeId,
        date: DateTime(now.year, now.month, now.day),
        punchOutTime: now,
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        deviceId: deviceId,
        batteryPercentage: batteryLevel,
        networkType: networkType,
        managerOverride: managerOverride,
      );

      // Log the event for GPS tracking
      await _trackingNotifier.logEvent('PUNCH_OUT');

      // 5, 12, 13. Store, Sync, Lock records via Repository
      await _repository.submitPunchOut(request);
      
      // Stop background tracking since day is ended
      _trackingNotifier.stopTracking();

      state = PunchOutSuccess();
    } catch (e) {
      state = PunchOutError('Failed to punch out: ${e.toString()}');
    }
  }
}

final punchOutNotifierProvider = StateNotifierProvider<PunchOutNotifier, PunchOutState>((ref) {
  return PunchOutNotifier(
    ref.watch(locationServiceProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(deviceInfoProvider),
    ref.watch(batteryServiceProvider),
    ref.watch(punchOutRepositoryProvider),
    ref.read(trackingNotifierProvider.notifier),
    ref,
  );
});
