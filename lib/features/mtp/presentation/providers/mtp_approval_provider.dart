import '../../data/repositories/mtp_approval_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/mtp_approval_repository.dart';
import '../../data/models/mtp_approval_request.dart';
import 'mtp_approval_state.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../authentication/presentation/providers/auth_state.dart';

class MtpApprovalNotifier extends StateNotifier<MtpApprovalState> {
  final MtpApprovalRepository _repository;
  final Ref _ref;

  MtpApprovalNotifier(this._repository, this._ref) : super(MtpApprovalInitial());

  String _getUserId() {
    final authState = _ref.read(authNotifierProvider);
    if (authState is AuthStateAuthenticated) {
      return authState.user.id;
    }
    return 'UNKNOWN';
  }

  Future<void> submitApprovalAction(String mtpId, String action, {String? remarks}) async {
    state = MtpApprovalLoading();
    try {
      final request = MtpApprovalRequest(
        mtpId: mtpId,
        managerId: _getUserId(),
        action: action, // 'APPROVE', 'REJECT', 'RETURN'
        remarks: remarks,
      );
      await _repository.processApproval(request);
      state = MtpApprovalSuccess('MTP ${action.toLowerCase()} successfully');
    } catch (e) {
      state = MtpApprovalError('Failed to process approval action');
    }
  }

  Future<void> loadAuditHistory(String mtpId) async {
    state = MtpApprovalLoading();
    try {
      final logs = await _repository.getMtpAuditHistory(mtpId);
      state = MtpAuditHistoryLoaded(logs);
    } catch (e) {
      state = MtpApprovalError('Failed to load audit history');
    }
  }
}

final mtpApprovalNotifierProvider = StateNotifierProvider<MtpApprovalNotifier, MtpApprovalState>((ref) {
  return MtpApprovalNotifier(
    ref.watch(mtpApprovalRepositoryProvider),
    ref,
  );
});
