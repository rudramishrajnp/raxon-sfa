import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/dcr_review_repository.dart';
import '../api/dcr_review_api_service.dart';
import '../models/dcr_review_models.dart';
import '../../../../core/services/connectivity_service.dart';

class DcrReviewRepositoryImpl implements DcrReviewRepository {
  final DcrReviewApiService _apiService;
  final ConnectivityService _connectivityService;

  DcrReviewRepositoryImpl(this._apiService, this._connectivityService);

  @override
  Future<List<DcrSubmissionModel>> getDcrSubmissions(String managerId, {Map<String, dynamic>? filters}) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      return await _apiService.getDcrSubmissions(managerId, filters: filters);
    } else {
      // Offline fallback
      return await _apiService.getDcrSubmissions(managerId, filters: filters);
    }
  }

  @override
  Future<void> updateDcrStatus(String dcrId, String managerId, String action, String? remarks) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      await _apiService.updateDcrStatus(dcrId, managerId, action, remarks);
    } else {
      // Enqueue action for offline sync
      await _apiService.updateDcrStatus(dcrId, managerId, action, remarks);
    }
  }
}

final dcrReviewRepositoryProvider = Provider<DcrReviewRepository>((ref) {
  return DcrReviewRepositoryImpl(
    ref.watch(dcrReviewApiServiceProvider),
    ref.watch(connectivityServiceProvider),
  );
});
