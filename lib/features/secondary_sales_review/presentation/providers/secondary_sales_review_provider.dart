import '../../data/repositories/secondary_sales_review_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/secondary_sales_review_repository.dart';
import '../../data/models/secondary_sales_review_models.dart';
import 'secondary_sales_review_state.dart';
import '../../../../core/services/notification_service.dart';

class SecondarySalesReviewNotifier extends StateNotifier<SecondarySalesReviewState> {
  final SecondarySalesReviewRepository _repository;
  final NotificationService _notificationService;
  final String _managerId;

  Map<String, dynamic> _currentFilters = {};
  String _searchQuery = '';
  List<SalesReviewModel> _allSales = [];
  SalesAnalyticsSummary? _analytics;
  List<SalesExceptionReport> _exceptions = [];

  SecondarySalesReviewNotifier(this._repository, this._notificationService, this._managerId) : super(SecondarySalesReviewInitial()) {
    loadData();
  }

  Future<void> loadData({bool showLoading = true}) async {
    if (showLoading) state = SecondarySalesReviewLoading();
    try {
      final futures = await Future.wait([
        _repository.getSalesReviews(_managerId, filters: _currentFilters),
        _repository.getAnalyticsSummary(_managerId),
        _repository.getExceptionReports(_managerId),
      ]);

      _allSales = futures[0] as List<SalesReviewModel>;
      _analytics = futures[1] as SalesAnalyticsSummary;
      _exceptions = futures[2] as List<SalesExceptionReport>;

      _applyFiltersAndSearch();
    } catch (e) {
      if (showLoading) state = SecondarySalesReviewError("Failed to load secondary sales data: ${e.toString()}");
    }
  }

  void _applyFiltersAndSearch() {
    if (_analytics == null) return;
    var filtered = _allSales;

    if (_currentFilters['status'] != null && _currentFilters['status'] != 'All') {
      filtered = filtered.where((s) => s.status == _currentFilters['status']).toList();
    }
    
    if (_searchQuery.isNotEmpty) {
      final query = _searchQuery.toLowerCase();
      filtered = filtered.where((s) => 
        s.employeeName.toLowerCase().contains(query) ||
        s.employeeCode.toLowerCase().contains(query) ||
        s.stockistName.toLowerCase().contains(query) ||
        (s.retailerName != null && s.retailerName!.toLowerCase().contains(query)) ||
        s.products.any((p) => p.productName.toLowerCase().contains(query))
      ).toList();
    }

    state = SecondarySalesReviewLoaded(
      sales: filtered,
      analytics: _analytics!,
      exceptions: _exceptions,
    );
  }

  Future<void> refresh() async {
    await loadData(showLoading: false);
  }

  void updateFilters(Map<String, dynamic> filters) {
    _currentFilters = filters;
    _applyFiltersAndSearch();
  }

  void updateSearchQuery(String query) {
    _searchQuery = query;
    _applyFiltersAndSearch();
  }

  Future<bool> submitAction(String salesId, String action, String? remarks, SalesReviewModel salesData) async {
    try {
      await _repository.updateSalesStatus(salesId, _managerId, action, remarks);
      
      String title = 'Sales $action';
      String body = 'Secondary sales for ${salesData.stockistName} was ${action.toLowerCase()}.';
      
      await _notificationService.sendLocalNotification(
        title: title,
        body: body,
      );
      
      await loadData(showLoading: false);
      return true;
    } catch (e) {
      return false;
    }
  }
}

final secondarySalesReviewNotifierProvider = StateNotifierProvider<SecondarySalesReviewNotifier, SecondarySalesReviewState>((ref) {
  return SecondarySalesReviewNotifier(
    ref.watch(secondarySalesReviewRepositoryProvider),
    ref.watch(notificationServiceProvider),
    'MGR-100'
  );
});
