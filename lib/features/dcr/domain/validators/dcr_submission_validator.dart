import '../../data/models/dcr_checkout_model.dart';
import '../../data/models/dcr_report_model.dart';

class DcrSubmissionValidator {
  String? validateForSubmission(DcrCheckOutModel? checkOut, DcrReportModel? report) {
    if (checkOut == null) {
      return 'Check-Out data is missing. Please complete check-out first.';
    }
    
    if (report == null) {
      return 'DCR Report (Sampling/Orders) is missing.';
    }

    if (report.summary == null || (report.summary?.remarks?.isEmpty ?? true)) {
      return 'Call summary remarks are mandatory.';
    }

    if (checkOut.callStatus.isEmpty) {
      return 'Call status is mandatory.';
    }

    return null;
  }
}
