import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/mtp_review_repository.dart';
import '../api/mtp_review_api_service.dart';
import '../models/mtp_review_models.dart';
import '../../../../core/services/connectivity_service.dart';

class MtpReviewRepositoryImpl implements MtpReviewRepository {
  final MtpReviewApiService _apiService;
  final ConnectivityService _connectivityService;

  MtpReviewRepositoryImpl(this._apiService, this._connectivityService);

  @override
  Future<List<MtpSubmissionModel>> getMtpSubmissions(String managerId, {Map<String, dynamic>? filters}) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      return await _apiService.getMtpSubmissions(managerId, filters: filters);
    } else {
      // In real app: fetch from local offline storage
      return await _apiService.getMtpSubmissions(managerId, filters: filters);
    }
  }

  @override
  Future<void> updateMtpStatus(String mtpId, String managerId, String action, String? remarks) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      await _apiService.updateMtpStatus(mtpId, managerId, action, remarks);
    } else {
      // In real app: enqueue action for offline sync
      await _apiService.updateMtpStatus(mtpId, managerId, action, remarks);
    }
  }
}

final mtpReviewRepositoryProvider = Provider<MtpReviewRepository>((ref) {
  return MtpReviewRepositoryImpl(
    ref.watch(mtpReviewApiServiceProvider),
    ref.watch(connectivityServiceProvider),
  );
});
