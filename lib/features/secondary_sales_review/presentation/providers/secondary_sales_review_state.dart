import '../../data/models/secondary_sales_review_models.dart';

abstract class SecondarySalesReviewState {}

class SecondarySalesReviewInitial extends SecondarySalesReviewState {}
class SecondarySalesReviewLoading extends SecondarySalesReviewState {}
class SecondarySalesReviewLoaded extends SecondarySalesReviewState {
  final List<SalesReviewModel> sales;
  final SalesAnalyticsSummary analytics;
  final List<SalesExceptionReport> exceptions;

  SecondarySalesReviewLoaded({
    required this.sales,
    required this.analytics,
    required this.exceptions,
  });
}
class SecondarySalesReviewError extends SecondarySalesReviewState {
  final String message;
  SecondarySalesReviewError(this.message);
}
