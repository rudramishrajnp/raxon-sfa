import '../../data/models/end_of_day_summary_model.dart';
import '../../data/models/punch_out_request.dart';

abstract class PunchOutRepository {
  Future<EndOfDaySummaryModel> getEndOfDaySummary(String employeeId);
  Future<void> submitPunchOut(PunchOutRequest request);
}
