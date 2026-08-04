import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/analytics_models.dart';

class ScheduledReportService {
  Future<void> scheduleReport(ReportConfigModel config) async {
    // Simulate scheduling a background job for email delivery
    await Future.delayed(const Duration(seconds: 1));
  }
}

final scheduledReportServiceProvider = Provider<ScheduledReportService>((ref) {
  return ScheduledReportService();
});
