class ApiEndpoints {
  // Auth
  static const String login = '/auth/login';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';

  // MTP
  static const String getMtp = '/mtp/get';
  static const String submitMtp = '/mtp/submit';
  
  // DCR
  static const String submitDcr = '/dcr/submit';
  static const String submitDcrCheckIn = '/dcr/checkin';
  static const String submitDcrCheckOut = '/dcr/checkout';

  // Attendance
  static const String punchIn = '/attendance/punchin';
  static const String punchOut = '/attendance/punchout';
  
  // Expense
  static const String submitExpense = '/expense/submit';
  static const String uploadExpenseBill = '/expense/bill/upload';

  // Secondary Sales
  static const String submitSecondarySales = '/sales/secondary/submit';

  // Tracking
  static const String syncGpsLogs = '/tracking/gps/sync';
}
