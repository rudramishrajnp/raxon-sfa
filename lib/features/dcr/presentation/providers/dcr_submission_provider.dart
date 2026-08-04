import '../../data/repositories/dcr_submission_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/services/location_service.dart';
import '../../domain/repositories/dcr_submission_repository.dart';
import '../../domain/validators/dcr_submission_validator.dart';
import '../../data/models/dcr_submission_model.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../authentication/presentation/providers/auth_state.dart';
import 'dcr_submission_state.dart';

class DcrSubmissionNotifier extends StateNotifier<DcrSubmissionState> {
  final DcrSubmissionRepository _repository;
  final Ref _ref;

  DcrSubmissionNotifier(this._repository, this._ref) : super(DcrSubmissionInitial());

  Future<void> loadSummary(String checkInId, String customerId) async {
    state = DcrSubmissionLoading();
    try {
      final isLocked = await _repository.isDcrLocked(checkInId);
      if (isLocked) {
        state = DcrSubmissionError('This DCR is already locked and submitted.');
        return;
      }

      final checkOut = await _repository.getCheckOutData(checkInId);
      final report = await _repository.getReportData(checkInId, customerId);

      final validator = DcrSubmissionValidator();
      final error = validator.validateForSubmission(checkOut, report);

      if (error != null) {
        state = DcrSubmissionError(error);
        return;
      }

      state = DcrSubmissionLoaded(checkOut: checkOut!, report: report!);
    } catch (e) {
      state = DcrSubmissionError('Failed to load DCR summary: ${e.toString()}');
    }
  }

  Future<void> submitFinalDcr(String checkInId, String customerId, String customerName) async {
    if (state is! DcrSubmissionLoaded) return;
    
    state = DcrSubmissionLoading();
    try {
      final authState = _ref.read(authNotifierProvider);
      String employeeId = 'UNKNOWN';
      if (authState is AuthStateAuthenticated) {
        employeeId = authState.user.id;
      }

      final locationService = _ref.read(locationServiceProvider);
      final isEnabled = await locationService.isLocationServiceEnabled();
      
      double lat = 0.0;
      double lng = 0.0;
      
      if (isEnabled) {
        try {
          final position = await locationService.getCurrentPosition();
          lat = position.latitude;
          lng = position.longitude;
        } catch (_) {}
      }

      final submission = DcrSubmissionModel(
        dcrId: const Uuid().v4(),
        checkInId: checkInId,
        customerId: customerId,
        customerName: customerName,
        submissionTime: DateTime.now(),
        isJointWork: false,
        taggedManagers: [],
        isLocked: true,
        createdBy: employeeId,
        deviceId: 'DEVICE_ID_MOCK',
        appVersion: '1.0.0',
        latitude: lat,
        longitude: lng,
      );

      await _repository.submitFinalDcr(submission);
      
      state = DcrSubmissionSuccess('DCR Submitted Successfully and Locked.');
    } catch (e) {
      state = DcrSubmissionError('Failed to submit DCR: ${e.toString()}');
    }
  }
}

final dcrSubmissionNotifierProvider = StateNotifierProvider<DcrSubmissionNotifier, DcrSubmissionState>((ref) {
  return DcrSubmissionNotifier(
    ref.watch(dcrSubmissionRepositoryProvider),
    ref,
  );
});
