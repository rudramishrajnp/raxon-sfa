import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../models/punch_in_request.dart';
import '../models/punch_in_response.dart';

class AttendanceApiService {
  final Dio _dio;

  AttendanceApiService(this._dio);

  Future<PunchInResponse> punchIn(PunchInRequest request) async {
    final response = await _dio.post('/attendance/punch-in', data: request.toJson());
    return PunchInResponse(success: true, message: 'Punch In Successful');
  }
}

final attendanceApiServiceProvider = Provider<AttendanceApiService>((ref) {
  return AttendanceApiService(ref.watch(dioProvider));
});
