import '../../data/models/override_models.dart';

abstract class OverrideRepository {
  Future<OverrideSystemConfig> getSystemConfig();
  Future<List<OverrideRequestModel>> getPendingRequests(String managerId);
  Future<void> submitOverrideRequest(OverrideRequestModel request);
  Future<void> updateRequestStatus(String requestId, String managerId, String action, String remarks);
}
