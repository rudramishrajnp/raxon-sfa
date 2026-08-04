import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/models/dcr_checkin_model.dart';
import '../../data/models/override_request_model.dart';

class DcrApiService {
  final Dio _dio;

  DcrApiService(this._dio);

  Future<String> submitCheckIn(DcrCheckInModel checkIn) async {
    final dateStr = checkIn.date.toIso8601String().split('T')[0];
    String? dcrId;

    try {
      final res = await _dio.get('/dcr/current', queryParameters: {'date': dateStr});
      if (res.data != null && res.data['dcr'] != null) {
        dcrId = res.data['dcr']['id'];
      }
    } catch (e) {
      // Ignore error, try to create draft
    }

    if (dcrId == null) {
      final draftRes = await _dio.post('/dcr/draft', data: {
        'date': dateStr,
        'workType': 'Field Work', 
        'doctorCalls': []
      });
      dcrId = draftRes.data['dcrId'];
    }

    final payload = {
      'dcrId': dcrId,
      'doctorId': checkIn.customerId,
      'lat': checkIn.latitude,
      'lng': checkIn.longitude,
      'timestamp': checkIn.checkInTime.toIso8601String(),
    };

    final checkInRes = await _dio.post('/dcr/check-in', data: payload);
    return checkInRes.data['callId'];
  }

  Future<void> submitOverrideRequest(OverrideRequestModel request) async {
    // In a real implementation this would post to an override endpoint.
  }
}

final dcrApiServiceProvider = Provider<DcrApiService>((ref) {
  return DcrApiService(ref.watch(dioProvider));
});

