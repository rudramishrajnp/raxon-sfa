import '../../data/models/dcr_review_models.dart';

abstract class DcrReviewRepository {
  Future<List<DcrSubmissionModel>> getDcrSubmissions(String managerId, {Map<String, dynamic>? filters});
  Future<void> updateDcrStatus(String dcrId, String managerId, String action, String? remarks);
}
