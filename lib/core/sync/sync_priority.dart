enum SyncPriority {
  high(10), // Authentication, Attendance, GPS Events
  medium(5), // DCR, Orders, Expense, Secondary Sales, MTP
  low(1);   // Reports, Background Tasks, Bill Uploads

  final int value;
  const SyncPriority(this.value);

  static SyncPriority fromEntityType(String entityType) {
    switch (entityType.toLowerCase()) {
      case 'authentication':
      case 'attendance':
      case 'gpsevent':
      case 'punchin':
      case 'punchout':
        return SyncPriority.high;
      case 'dcr':
      case 'order':
      case 'expense':
      case 'secondarysales':
      case 'mtp':
        return SyncPriority.medium;
      case 'billupload':
      case 'report':
      default:
        return SyncPriority.low;
    }
  }
}
