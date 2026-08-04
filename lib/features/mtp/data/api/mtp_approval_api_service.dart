import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../models/mtp_approval_request.dart';
import '../models/mtp_audit_model.dart';

class MtpApprovalApiService {
  final Dio _dio;

  MtpApprovalApiService(this._dio);

  Future<void> processApprovalAction(MtpApprovalRequest request) async {
    final data = {
      'mtpId': request.mtpId,
      'remarks': request.remarks,
    };
    if (request.action.toUpperCase() == 'APPROVED') {
      await _dio.post('/mtp/approve', data: data);
    } else {
      await _dio.post('/mtp/reject', data: data);
    }
  }

  Future<List<MtpAuditModel>> getAuditLogs(String mtpId) async {
    // There is no explicit audit logs endpoint in the provided backend code,
    // so we return an empty list or fetch from an existing endpoint if available.
    return [];
  }
}

final mtpApprovalApiServiceProvider = Provider<MtpApprovalApiService>((ref) {
  return MtpApprovalApiService(ref.watch(dioProvider));
});
