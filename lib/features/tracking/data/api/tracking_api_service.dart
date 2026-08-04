import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../models/gps_log_request.dart';

class TrackingApiService {
  final Dio _dio;

  TrackingApiService(this._dio);

  Future<void> syncGpsLogs(List<GpsLogRequest> logs) async {
    // In a real application:
    // await _dio.post('/tracking/sync', data: {'logs': logs.map((e) => e.toJson()).toList()});
    
    // Simulating a successful API call
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
  }
}

final trackingApiServiceProvider = Provider<TrackingApiService>((ref) {
  return TrackingApiService(ref.watch(dioProvider));
});
