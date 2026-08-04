import '../../data/models/dcr_submission_model.dart';
import '../../data/models/dcr_checkout_model.dart';
import '../../data/models/dcr_report_model.dart';

abstract class DcrSubmissionRepository {
  Future<void> submitFinalDcr(DcrSubmissionModel submission);
  Future<DcrCheckOutModel?> getCheckOutData(String checkInId);
  Future<DcrReportModel?> getReportData(String checkInId, String customerId);
  Future<bool> isDcrLocked(String checkInId);
}
