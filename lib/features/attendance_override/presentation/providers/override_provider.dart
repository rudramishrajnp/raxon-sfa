import '../../data/repositories/override_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/override_repository.dart';
import '../../data/models/override_models.dart';
import '../../domain/services/attendance_resume_service.dart';
import 'override_state.dart';
import '../../../../core/services/notification_service.dart';

class OverrideNotifier extends StateNotifier<OverrideState> {
  final OverrideRepository _repository;
  final AttendanceResumeService _resumeService;
  final NotificationService _notificationService;
  final String _managerId;

  OverrideSystemConfig? _config;

  OverrideNotifier(this._repository, this._resumeService, this._notificationService, this._managerId) : super(OverrideInitial()) {
    loadRequests();
  }

  Future<void> loadRequests() async {
    state = OverrideLoading();
    try {
      _config = await _repository.getSystemConfig();
      final requests = await _repository.getPendingRequests(_managerId);
      state = OverrideLoaded(pendingRequests: requests, config: _config);
    } catch (e) {
      state = OverrideError('Failed to load requests: ${e.toString()}');
    }
  }

  Future<bool> processAction(String requestId, String action, String remarks, OverrideRequestModel request) async {
    try {
      await _repository.updateRequestStatus(requestId, _managerId, action, remarks);

      if (action == 'Approve') {
        // Resume session logic
        await _resumeService.resumeSession(request.employeeId, request.previousAttendanceId ?? '');
      }

      // Notify Employee
      String title = 'Re-Punch-In $action';
      String body = 'Your Re-Punch-In request was ${action.toLowerCase()}.';
      await _notificationService.sendLocalNotification(
        title: title,
        body: body,
      );

      // Reload
      await loadRequests();
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> submitRequest(OverrideRequestModel request) async {
    try {
      await _repository.submitOverrideRequest(request);
      
      // Notify Manager
      await _notificationService.sendLocalNotification(
        title: 'New Re-Punch-In Request',
        body: '${request.employeeName} requested a re-punch-in override.',
      );

      return true;
    } catch (e) {
      return false;
    }
  }
}

final overrideNotifierProvider = StateNotifierProvider<OverrideNotifier, OverrideState>((ref) {
  return OverrideNotifier(
    ref.watch(overrideRepositoryProvider),
    ref.watch(attendanceResumeServiceProvider),
    ref.watch(notificationServiceProvider),
    'MGR-100', // Mock manager ID
  );
});
