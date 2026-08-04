import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/secondary_sales_review_repository.dart';
import '../api/secondary_sales_review_api_service.dart';
import '../models/secondary_sales_review_models.dart';
import '../../../../core/services/connectivity_service.dart';

class SecondarySalesReviewRepositoryImpl implements SecondarySalesReviewRepository {
  final SecondarySalesReviewApiService _apiService;
  final ConnectivityService _connectivityService;

  SecondarySalesReviewRepositoryImpl(this._apiService, this._connectivityService);

  @override
  Future<List<SalesReviewModel>> getSalesReviews(String managerId, {Map<String, dynamic>? filters}) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      return await _apiService.getSalesReviews(managerId, filters: filters);
    } else {
      return await _apiService.getSalesReviews(managerId, filters: filters);
    }
  }

  @override
  Future<SalesAnalyticsSummary> getAnalyticsSummary(String managerId) async {
    return await _apiService.getAnalyticsSummary(managerId);
  }

  @override
  Future<List<SalesExceptionReport>> getExceptionReports(String managerId) async {
    return await _apiService.getExceptionReports(managerId);
  }

  @override
  Future<void> updateSalesStatus(String salesId, String managerId, String action, String? remarks) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      await _apiService.updateSalesStatus(salesId, managerId, action, remarks);
    } else {
      await _apiService.updateSalesStatus(salesId, managerId, action, remarks);
    }
  }
}

final secondarySalesReviewRepositoryProvider = Provider<SecondarySalesReviewRepository>((ref) {
  return SecondarySalesReviewRepositoryImpl(
    ref.watch(secondarySalesReviewApiServiceProvider),
    ref.watch(connectivityServiceProvider),
  );
});
