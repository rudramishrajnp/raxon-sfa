import '../../data/models/punch_in_request.dart';

abstract class AttendanceRepository {
  Future<void> submitPunchIn(PunchInRequest request);
}
