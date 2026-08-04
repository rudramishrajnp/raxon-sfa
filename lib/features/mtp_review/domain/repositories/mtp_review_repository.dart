import '../../data/models/mtp_review_models.dart';

abstract class MtpReviewRepository {
  Future<List<MtpSubmissionModel>> getMtpSubmissions(String managerId, {Map<String, dynamic>? filters});
  Future<void> updateMtpStatus(String mtpId, String managerId, String action, String? remarks);
}
