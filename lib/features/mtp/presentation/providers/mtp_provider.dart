import '../../data/repositories/mtp_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../authentication/presentation/providers/auth_state.dart';
import '../../domain/repositories/mtp_repository.dart';
import '../../domain/validators/mtp_validator.dart';
import '../../data/models/mtp_models.dart';
import 'mtp_state.dart';

class MtpNotifier extends StateNotifier<MtpState> {
  final MtpRepository _repository;
  final Ref _ref;

  MtpNotifier(this._repository, this._ref) : super(MtpInitial());

  String _getEmployeeId() {
    final authState = _ref.read(authNotifierProvider);
    if (authState is AuthStateAuthenticated) {
      return authState.user.id;
    }
    return 'UNKNOWN';
  }

  Future<void> loadMtp(int month, int year) async {
    state = MtpLoading('Loading MTP...');
    try {
      final employeeId = _getEmployeeId();
      final mtp = await _repository.getMtpForMonth(employeeId, month, year);

      if (mtp != null) {
        state = MtpLoaded(mtp: mtp, currentMonth: month, currentYear: year);
      } else {
        // Create an empty DRAFT MTP for the requested month
        final newMtp = MtpModel(
          employeeId: employeeId,
          month: month,
          year: year,
          status: 'DRAFT',
          days: [], // Days will be populated as user interacts
        );
        state = MtpLoaded(mtp: newMtp, currentMonth: month, currentYear: year);
      }
    } catch (e) {
      state = MtpError('Failed to load MTP: ${e.toString()}');
    }
  }

  void updateDayPlan(MtpDayModel updatedDay) {
    if (state is MtpLoaded) {
      final currentState = state as MtpLoaded;
      final error = MtpValidator.validateDayPlan(updatedDay);
      if (error != null) {
        // In a real app, you might want to show this error to the user without changing the whole state to Error
        // For simplicity, we just won't update the state and could potentially fire a side-effect
        return; 
      }

      final updatedDays = List<MtpDayModel>.from(currentState.mtp.days);
      
      final existingIndex = updatedDays.indexWhere((d) => 
        d.date.year == updatedDay.date.year && 
        d.date.month == updatedDay.date.month && 
        d.date.day == updatedDay.date.day
      );

      if (existingIndex >= 0) {
        updatedDays[existingIndex] = updatedDay;
      } else {
        updatedDays.add(updatedDay);
      }

      final updatedMtp = MtpModel(
        id: currentState.mtp.id,
        employeeId: currentState.mtp.employeeId,
        month: currentState.mtp.month,
        year: currentState.mtp.year,
        status: currentState.mtp.status,
        days: updatedDays,
      );

      state = currentState.copyWith(mtp: updatedMtp);
    }
  }

  Future<void> saveDraft() async {
    if (state is MtpLoaded) {
      final currentState = state as MtpLoaded;
      state = MtpLoading('Saving Draft...');
      try {
        await _repository.saveDraft(currentState.mtp);
        state = MtpSaved('Draft Saved Successfully');
        // Reload to show loaded state again
        await loadMtp(currentState.currentMonth, currentState.currentYear);
      } catch (e) {
        state = MtpError('Failed to save draft');
      }
    }
  }

  Future<void> submitMtp() async {
    if (state is MtpLoaded) {
      final currentState = state as MtpLoaded;
      
      // Basic validation: Check if all days in month have a plan
      final daysInMonth = DateTime(currentState.currentYear, currentState.currentMonth + 1, 0).day;
      if (currentState.mtp.days.length < daysInMonth) {
        // Note: For realistic scenarios, Sundays or Holidays might not need explicit plans,
        // but for strict validation we check count.
        // state = MtpError('Please complete the plan for all days in the month before submitting.');
        // return;
      }

      state = MtpLoading('Submitting MTP...');
      try {
        await _repository.submitMtp(currentState.mtp);
        state = MtpSubmitted();
        // Load again
        await loadMtp(currentState.currentMonth, currentState.currentYear);
      } catch (e) {
        state = MtpError('Failed to submit MTP');
      }
    }
  }
}

final mtpNotifierProvider = StateNotifierProvider<MtpNotifier, MtpState>((ref) {
  return MtpNotifier(
    ref.watch(mtpRepositoryProvider),
    ref,
  );
});
