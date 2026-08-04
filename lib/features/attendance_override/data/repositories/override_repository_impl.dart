import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/override_repository.dart';
import '../api/override_api_service.dart';
import '../models/override_models.dart';
import '../../../../core/services/connectivity_service.dart';

class OverrideRepositoryImpl implements OverrideRepository {
  final OverrideApiService _apiService;
  final ConnectivityService _connectivityService;

  OverrideRepositoryImpl(this._apiService, this._connectivityService);

  @override
  Future<OverrideSystemConfig> getSystemConfig() async {
    return await _apiService.getSystemConfig();
  }

  @override
  Future<List<OverrideRequestModel>> getPendingRequests(String managerId) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      return await _apiService.getPendingRequests(managerId);
    } else {
      // Simulate reading from local DB
      return await _apiService.getPendingRequests(managerId); 
    }
  }

  @override
  Future<void> submitOverrideRequest(OverrideRequestModel request) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      await _apiService.submitOverrideRequest(request);
    } else {
      // Store in Drift DB with syncStatus 'Pending'
    }
  }

  @override
  Future<void> updateRequestStatus(String requestId, String managerId, String action, String remarks) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      await _apiService.updateRequestStatus(requestId, managerId, action, remarks);
    } else {
      // Store manager action in local DB to sync later
    }
  }
}

final overrideRepositoryProvider = Provider<OverrideRepository>((ref) {
  return OverrideRepositoryImpl(
    ref.watch(overrideApiServiceProvider),
    ref.watch(connectivityServiceProvider),
  );
});
