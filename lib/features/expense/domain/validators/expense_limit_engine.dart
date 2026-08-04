import '../../data/models/expense_limit_model.dart';

class ExpenseLimitEngine {
  // Stubbed configuration. In a real application, these would be fetched from the Super Admin Matrix API
  final List<ExpenseLimitModel> _limits = [
    ExpenseLimitModel(role: 'MR', category: 'Stationery', dailyLimit: 200.0),
    ExpenseLimitModel(role: 'MR', category: 'Food', dailyLimit: 300.0),
    ExpenseLimitModel(role: 'AA', category: 'Stationery', dailyLimit: 500.0),
    ExpenseLimitModel(role: 'MR', category: 'Hotel', dailyLimit: 1500.0),
  ];

  ExpenseLimitModel? getLimit(String role, String category) {
    try {
      return _limits.firstWhere((l) => l.role == role && l.category == category);
    } catch (e) {
      return null;
    }
  }

  bool isHighExpense(double amount, String role, String category) {
    final limit = getLimit(role, category);
    if (limit == null) return false;
    return amount > limit.dailyLimit;
  }
}
