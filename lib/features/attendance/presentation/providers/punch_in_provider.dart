import '../../data/repositories/attendance_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/location_service.dart';
import '../../../../core/services/permission_service.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/services/device_info_service.dart';
import '../../../../core/services/battery_service.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../authentication/presentation/providers/auth_state.dart';
import '../../domain/repositories/attendance_repository.dart';
import '../../data/models/punch_in_request.dart';
import 'punch_in_state.dart';

class PunchInNotifier extends StateNotifier<PunchInState> {
  final LocationService _locationService;
  final PermissionService _permissionService;
  final ConnectivityService _connectivityService;
  final DeviceInfoService _deviceInfoService;
  final BatteryService _batteryService;
  final AttendanceRepository _repository;
  final Ref _ref;

  PunchInNotifier(
    this._locationService,
    this._permissionService,
    this._connectivityService,
    this._deviceInfoService,
    this._batteryService,
    this._repository,
    this._ref,
  ) : super(PunchInInitial());

  Future<void> submitPunchIn() async {
    state = PunchInLoading('Checking Permissions...');
    
    try {
      // 1. Check Location Permission
      final hasPermission = await _permissionService.requestLocationPermission();
      if (!hasPermission) {
        state = PunchInError('Location permission is required to punch in.');
        return;
      }

      // 2. Check GPS Enabled
      state = PunchInLoading('Checking GPS Status...');
      final isGpsEnabled = await _locationService.isLocationServiceEnabled();
      if (!isGpsEnabled) {
        state = PunchInError('Please enable GPS to punch in.');
        return;
      }

      // 3. Check Internet
      state = PunchInLoading('Getting Network Info...');
      final isConnected = await _connectivityService.isConnected();
      final networkType = isConnected ? 'Online' : 'Offline';

      // 4, 5, 6. Capture Location and Accuracy
      state = PunchInLoading('Acquiring Location...');
      final position = await _locationService.getCurrentPosition();

      // 7. Capture Timestamp
      final now = DateTime.now();
      
      // Get User Info
      final authState = _ref.read(authNotifierProvider);
      String employeeId = 'UNKNOWN';
      if (authState is AuthStateAuthenticated) {
        employeeId = authState.user.id;
      }

      // Get Device Info
      final deviceId = await _deviceInfoService.getDeviceId();
      
      // Get Battery Info
      final batteryLevel = await _batteryService.getBatteryLevel();

      final request = PunchInRequest(
        employeeId: employeeId,
        date: DateTime(now.year, now.month, now.day),
        punchInTime: now,
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        deviceId: deviceId,
        batteryPercentage: batteryLevel,
        networkType: networkType,
      );

      state = PunchInLoading('Saving Punch In Data...');
      await _repository.submitPunchIn(request);

      state = PunchInSuccess();

    } catch (e) {
      state = PunchInError('Failed to punch in: ${e.toString()}');
    }
  }
}

final punchInNotifierProvider = StateNotifierProvider<PunchInNotifier, PunchInState>((ref) {
  return PunchInNotifier(
    ref.watch(locationServiceProvider),
    ref.watch(permissionServiceProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(deviceInfoProvider),
    ref.watch(batteryServiceProvider),
    ref.watch(attendanceRepositoryProvider),
    ref,
  );
});
