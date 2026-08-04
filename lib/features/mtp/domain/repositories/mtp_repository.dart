import '../../data/models/mtp_models.dart';

abstract class MtpRepository {
  Future<MtpModel?> getMtpForMonth(String employeeId, int month, int year);
  Future<void> saveDraft(MtpModel mtp);
  Future<void> submitMtp(MtpModel mtp);
}
