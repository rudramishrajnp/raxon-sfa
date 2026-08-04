import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/dcr_review_repository.dart';
import '../../data/repositories/dcr_review_repository_impl.dart';
import 'dcr_review_state.dart';
import '../../data/models/dcr_review_models.dart';
import '../../../../core/services/notification_service.dart';

class DcrReviewNotifier extends StateNotifier<DcrReviewState> {
  final DcrReviewRepository _repository;
  final NotificationService _notificationService;
  final String _managerId;

  Map<String, dynamic> _currentFilters = {};
  String _searchQuery = '';
  List<DcrSubmissionModel> _allSubmissions = [];

  DcrReviewNotifier(this._repository, this._notificationService, this._managerId) : super(DcrReviewInitial()) {
    loadSubmissions();
  }

  Future<void> loadSubmissions({bool showLoading = true}) async {
    if (showLoading) state = DcrReviewLoading();
    try {
      _allSubmissions = await _repository.getDcrSubmissions(_managerId, filters: _currentFilters);
      _applyFiltersAndSearch();
    } catch (e) {
      if (showLoading) state = DcrReviewError("Failed to load DCR submissions: ${e.toString()}");
    }
  }

  void _applyFiltersAndSearch() {
    var filtered = _allSubmissions;

    // Filter by Status
    if (_currentFilters['status'] != null && _currentFilters['status'] != 'All') {
      filtered = filtered.where((s) => s.reviewStatus == _currentFilters['status']).toList();
    }
    
    // Joint Work Filter
    if (_currentFilters['jointWork'] == true) {
      filtered = filtered.where((s) => s.isJointWork).toList();
    }
    
    // Deviation Filter
    if (_currentFilters['deviation'] == true) {
      filtered = filtered.where((s) => s.isDeviation).toList();
    }

    // Apply Search
    if (_searchQuery.isNotEmpty) {
      final query = _searchQuery.toLowerCase();
      filtered = filtered.where((s) => 
        s.employeeName.toLowerCase().contains(query) ||
        s.employeeCode.toLowerCase().contains(query) ||
        s.doctorName.toLowerCase().contains(query) ||
        (s.chemistName?.toLowerCase().contains(query) ?? false)
      ).toList();
    }

    state = DcrReviewLoaded(submissions: filtered);
  }

  Future<void> refresh() async {
    await loadSubmissions(showLoading: false);
  }

  void updateFilters(Map<String, dynamic> filters) {
    _currentFilters = filters;
    _applyFiltersAndSearch();
  }

  void updateSearchQuery(String query) {
    _searchQuery = query;
    _applyFiltersAndSearch();
  }

  Future<bool> submitAction(String dcrId, String action, String? remarks, DcrSubmissionModel submission) async {
    try {
      await _repository.updateDcrStatus(dcrId, _managerId, action, remarks);
      
      // Handle Notifications based on action
      if (action == 'Request Clarification') {
        await _notificationService.sendLocalNotification(
          title: 'Clarification Requested',
          body: 'Manager requested clarification on DCR for ${submission.doctorName}',
        );
      } else if (action == 'Approve Override' || action == 'Reject Override') {
        await _notificationService.sendLocalNotification(
          title: 'GPS Override ${action.split(' ')[0]}',
          body: 'GPS Override request for ${submission.doctorName} was ${action.split(' ')[0].toLowerCase()}',
        );
      }
      
      await loadSubmissions(showLoading: false);
      return true;
    } catch (e) {
      return false;
    }
  }
}

final dcrReviewNotifierProvider = StateNotifierProvider<DcrReviewNotifier, DcrReviewState>((ref) {
  return DcrReviewNotifier(
    ref.watch(dcrReviewRepositoryProvider),
    ref.watch(notificationServiceProvider),
    'MGR-100'
  );
});
