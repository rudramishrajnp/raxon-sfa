import '../../data/models/dcr_checkin_model.dart';
import '../../data/models/override_request_model.dart';

abstract class DcrRepository {
  Future<void> submitCheckIn(DcrCheckInModel checkIn);
  Future<void> submitOverrideRequest(OverrideRequestModel request);
  Future<bool> hasPunchedInToday(String employeeId);
  Future<bool> hasCheckedInToCustomerToday(String employeeId, String customerId);
}
