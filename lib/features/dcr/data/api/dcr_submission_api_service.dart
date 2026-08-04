import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/models/dcr_submission_model.dart';

class DcrSubmissionApiService {
  final Dio _dio;

  DcrSubmissionApiService(this._dio);

  Future<void> submitFinalDcr(DcrSubmissionModel submission) async {
    await _dio.post('/dcr/submit', data: {
      'date': submission.submissionTime.toIso8601String().split('T')[0]
    });
  }
}

final dcrSubmissionApiServiceProvider = Provider<DcrSubmissionApiService>((ref) {
  return DcrSubmissionApiService(ref.watch(dioProvider));
});
