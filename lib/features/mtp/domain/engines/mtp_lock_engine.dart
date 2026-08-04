import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/mtp_models.dart';

enum ModuleAccessStatus {
  granted,
  grantedProvisionally,
  blockedSubmissionOverdue,
  blockedApprovalOverdue,
}

class MtpLockEngine {
  final int submissionDeadlineDay;
  final int provisionalApprovalEndDay;

  MtpLockEngine({
    this.submissionDeadlineDay = 25,
    this.provisionalApprovalEndDay = 2,
  });

  ModuleAccessStatus evaluateAccess({
    required DateTime currentDate,
    required MtpModel? currentMonthMtp,
    required MtpModel? nextMonthMtp,
  }) {
    final day = currentDate.day;

    // 1. Check if next month's MTP is overdue
    if (day > submissionDeadlineDay) {
      if (nextMonthMtp == null || nextMonthMtp.status == 'DRAFT' || nextMonthMtp.status == 'RETURNED_FOR_CORRECTION') {
        return ModuleAccessStatus.blockedSubmissionOverdue;
      }
    }

    // 2. Check current month's MTP approval status
    if (currentMonthMtp != null) {
      if (currentMonthMtp.status == 'APPROVED') {
        return ModuleAccessStatus.granted;
      }

      if (currentMonthMtp.status == 'PENDING') {
        if (day <= provisionalApprovalEndDay) {
          return ModuleAccessStatus.grantedProvisionally;
        } else {
          return ModuleAccessStatus.blockedApprovalOverdue;
        }
      }

      if (currentMonthMtp.status == 'REJECTED' || currentMonthMtp.status == 'RETURNED_FOR_CORRECTION') {
        return ModuleAccessStatus.blockedApprovalOverdue;
      }
    } else {
      // No MTP for current month
      return ModuleAccessStatus.blockedApprovalOverdue;
    }

    return ModuleAccessStatus.granted;
  }
}

final mtpLockEngineProvider = Provider<MtpLockEngine>((ref) {
  return MtpLockEngine(); // In a real app, settings would be loaded from DB
});
