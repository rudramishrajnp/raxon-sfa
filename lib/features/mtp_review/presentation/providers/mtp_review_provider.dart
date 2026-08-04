import '../../data/models/mtp_review_models.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/mtp_review_repository.dart';
import '../../data/repositories/mtp_review_repository_impl.dart';
import 'mtp_review_state.dart';

class MtpReviewNotifier extends StateNotifier<MtpReviewState> {
  final MtpReviewRepository _repository;
  final String _managerId;

  Map<String, dynamic> _currentFilters = {};
  String _searchQuery = '';
  List<MtpSubmissionModel> _allSubmissions = [];

  MtpReviewNotifier(this._repository, this._managerId) : super(MtpReviewInitial()) {
    loadSubmissions();
  }

  Future<void> loadSubmissions({bool showLoading = true}) async {
    if (showLoading) state = MtpReviewLoading();
    try {
      _allSubmissions = await _repository.getMtpSubmissions(_managerId, filters: _currentFilters);
      _applyFiltersAndSearch();
    } catch (e) {
      if (showLoading) state = MtpReviewError("Failed to load MTP submissions: ${e.toString()}");
    }
  }

  void _applyFiltersAndSearch() {
    var filtered = _allSubmissions;

    // Apply Status Filter
    if (_currentFilters['status'] != null && _currentFilters['status'] != 'All') {
      filtered = filtered.where((s) => s.status == _currentFilters['status']).toList();
    }

    // Apply Search
    if (_searchQuery.isNotEmpty) {
      final query = _searchQuery.toLowerCase();
      filtered = filtered.where((s) => 
        s.employeeName.toLowerCase().contains(query) ||
        s.employeeCode.toLowerCase().contains(query) ||
        s.hq.toLowerCase().contains(query) ||
        s.territory.toLowerCase().contains(query) ||
        s.month.toLowerCase().contains(query)
      ).toList();
    }

    state = MtpReviewLoaded(submissions: filtered);
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

  Future<bool> submitAction(String mtpId, String action, String? remarks) async {
    try {
      // action could be: Approve, Reject, Return for Correction, Save Draft
      await _repository.updateMtpStatus(mtpId, _managerId, action, remarks);
      // reload after action
      await loadSubmissions(showLoading: false);
      return true;
    } catch (e) {
      return false;
    }
  }
}

final mtpReviewNotifierProvider = StateNotifierProvider<MtpReviewNotifier, MtpReviewState>((ref) {
  // In a real app, managerId would come from auth state
  return MtpReviewNotifier(ref.watch(mtpReviewRepositoryProvider), 'MGR-100');
});
