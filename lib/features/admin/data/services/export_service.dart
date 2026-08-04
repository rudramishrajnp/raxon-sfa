import 'package:flutter_riverpod/flutter_riverpod.dart';

class ExportService {
  Future<void> exportReport(String reportName, String format) async {
    // Simulate generating and downloading export
    await Future.delayed(const Duration(seconds: 2));
    // Implementation would use packages like 'pdf' or 'excel' to build file
  }
}

final exportServiceProvider = Provider<ExportService>((ref) {
  return ExportService();
});
