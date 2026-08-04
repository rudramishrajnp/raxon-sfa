import '../../data/models/dcr_report_model.dart';

class DcrReportValidator {
  String? validateReport(DcrReportModel report) {
    if (report.samples.any((s) => s.quantity < 0 || s.quantity > s.maxStock)) {
      return 'Invalid sample quantities detected.';
    }
    if (report.orders.any((o) => o.quantity < 0)) {
      return 'Invalid order quantities detected.';
    }
    if (report.prescription != null) {
      if (report.prescription!.doctorType == 'Prescriber' && report.prescription!.promotedBrands.isEmpty) {
        return 'Please select at least one promoted brand for a prescriber.';
      }
    }
    if (report.summary == null || (report.summary?.remarks?.isEmpty ?? true) && (report.summary?.doctorFeedback?.isEmpty ?? true)) {
      return 'Call summary or remarks are required.';
    }
    return null;
  }
}
