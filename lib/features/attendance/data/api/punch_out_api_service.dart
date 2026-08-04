import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../models/punch_out_request.dart';
import '../models/punch_out_response.dart';

class PunchOutApiService {
  final Dio _dio;

  PunchOutApiService(this._dio);

  Future<PunchOutResponse> punchOut(PunchOutRequest request) async {
    final response = await _dio.post('/attendance/punch-out', data: request.toJson());
    return PunchOutResponse(success: true, message: 'Punch Out Successful');
  }
}

final punchOutApiServiceProvider = Provider<PunchOutApiService>((ref) {
  return PunchOutApiService(ref.watch(dioProvider));
});
