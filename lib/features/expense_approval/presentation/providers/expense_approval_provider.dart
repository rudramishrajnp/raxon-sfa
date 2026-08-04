import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/expense_approval_repository.dart';
import '../../data/repositories/expense_approval_repository_impl.dart';
import 'expense_approval_state.dart';
import '../../data/models/expense_approval_models.dart';
import '../../../../core/services/notification_service.dart';

class ExpenseApprovalNotifier extends StateNotifier<ExpenseApprovalState> {
  final ExpenseApprovalRepository _repository;
  final NotificationService _notificationService;
  final String _managerId;

  Map<String, dynamic> _currentFilters = {};
  String _searchQuery = '';
  List<ExpenseSubmissionModel> _allSubmissions = [];

  ExpenseApprovalNotifier(this._repository, this._notificationService, this._managerId) : super(ExpenseApprovalInitial()) {
    loadSubmissions();
  }

  Future<void> loadSubmissions({bool showLoading = true}) async {
    if (showLoading) state = ExpenseApprovalLoading();
    try {
      _allSubmissions = await _repository.getExpenseSubmissions(_managerId, filters: _currentFilters);
      _applyFiltersAndSearch();
    } catch (e) {
      if (showLoading) state = ExpenseApprovalError("Failed to load expense claims: ${e.toString()}");
    }
  }

  void _applyFiltersAndSearch() {
    var filtered = _allSubmissions;

    // Filter by Status
    if (_currentFilters['status'] != null && _currentFilters['status'] != 'All') {
      filtered = filtered.where((s) => s.status == _currentFilters['status']).toList();
    }
    
    // High Expense Flag Filter
    if (_currentFilters['highExpense'] == true) {
      filtered = filtered.where((s) => s.hasHighExpenseFlag).toList();
    }

    // Apply Search
    if (_searchQuery.isNotEmpty) {
      final query = _searchQuery.toLowerCase();
      filtered = filtered.where((s) => 
        s.employeeName.toLowerCase().contains(query) ||
        s.employeeCode.toLowerCase().contains(query) ||
        s.claimNumber.toLowerCase().contains(query) ||
        s.expenseCategories.any((cat) => cat.toLowerCase().contains(query))
      ).toList();
    }

    state = ExpenseApprovalLoaded(submissions: filtered);
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

  Future<bool> submitAction(String expenseId, String action, String? remarks, double? adjustedAmount, ExpenseSubmissionModel submission) async {
    try {
      await _repository.updateExpenseStatus(expenseId, _managerId, action, remarks, adjustedAmount);
      
      // Notify Employee
      String title = 'Expense $action';
      String body = 'Your expense claim ${submission.claimNumber} was ${action.toLowerCase()}.';
      if (action == 'Partially Approve') {
        title = 'Expense Partially Approved';
        body = 'Your claim ${submission.claimNumber} was partially approved. Amount: $adjustedAmount';
      }
      
      await _notificationService.sendLocalNotification(
        title: title,
        body: body,
      );
      
      await loadSubmissions(showLoading: false);
      return true;
    } catch (e) {
      return false;
    }
  }
}

final expenseApprovalNotifierProvider = StateNotifierProvider<ExpenseApprovalNotifier, ExpenseApprovalState>((ref) {
  return ExpenseApprovalNotifier(
    ref.watch(expenseApprovalRepositoryProvider),
    ref.watch(notificationServiceProvider),
    'MGR-100'
  );
});
