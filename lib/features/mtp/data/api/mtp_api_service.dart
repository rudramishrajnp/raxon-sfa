import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../models/mtp_models.dart';

class MtpApiService {
  final Dio _dio;

  MtpApiService(this._dio);

  Future<MtpModel?> getMtp(String employeeId, int month, int year) async {
    final response = await _dio.get('/mtp/current', queryParameters: {
      'month': month,
      'year': year,
    });
    if (response.data != null && response.data['mtp'] != null) {
      return MtpModel.fromJson(response.data['mtp']);
    }
    return null;
  }

  Future<void> saveDraft(MtpModel mtp) async {
    final data = {
      'month': mtp.month,
      'year': mtp.year,
      'dailyPlans': mtp.days.map((d) => {
        'date': d.date.toIso8601String().split('T')[0],
        'workType': d.workType,
        'locationType': d.locationType,
        'doctorIds': d.doctors.map((doc) => doc.doctorId).toList(),
        'chemistIds': [],
      }).toList(),
    };
    await _dio.post('/mtp/draft', data: data);
  }

  Future<void> updateMtp(MtpModel mtp) async {
    final data = {
      'mtpId': mtp.id,
      'month': mtp.month,
      'year': mtp.year,
      'dailyPlans': mtp.days.map((d) => {
        'date': d.date.toIso8601String().split('T')[0],
        'workType': d.workType,
        'locationType': d.locationType,
        'doctorIds': d.doctors.map((doc) => doc.doctorId).toList(),
        'chemistIds': [],
      }).toList(),
    };
    await _dio.put('/mtp/update', data: data);
  }

  Future<void> submitMtp(MtpModel mtp) async {
    await _dio.post('/mtp/submit', data: {'mtpId': mtp.id});
  }
}

final mtpApiServiceProvider = Provider<MtpApiService>((ref) {
  return MtpApiService(ref.watch(dioProvider));
});
