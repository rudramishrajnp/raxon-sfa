class HighExpenseFlagEngine {
  bool checkTotalExpenseLimit(double grandTotal, String role) {
    // Example logic to flag based on grand total
    double limit = role == 'MR' ? 3000.0 : 5000.0;
    return grandTotal > limit;
  }
}
