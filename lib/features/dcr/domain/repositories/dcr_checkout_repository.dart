import '../../data/models/dcr_checkout_model.dart';
import '../../data/models/dcr_report_model.dart';

abstract class DcrCheckOutRepository {
  Future<void> submitCheckOut(DcrCheckOutModel checkOut);
  Future<bool> hasCheckedIn(String checkInId);
  Future<DateTime?> getCheckInTime(String checkInId);
  Future<DcrReportModel?> getDcrReport(String checkInId, String customerId);
}
