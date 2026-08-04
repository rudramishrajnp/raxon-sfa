import '../../data/models/secondary_sales_review_models.dart';

abstract class SecondarySalesReviewRepository {
  Future<List<SalesReviewModel>> getSalesReviews(String managerId, {Map<String, dynamic>? filters});
  Future<SalesAnalyticsSummary> getAnalyticsSummary(String managerId);
  Future<List<SalesExceptionReport>> getExceptionReports(String managerId);
  Future<void> updateSalesStatus(String salesId, String managerId, String action, String? remarks);
}
