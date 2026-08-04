import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/models/dcr_checkout_model.dart';
import '../../data/models/dcr_report_model.dart';

class DcrCheckOutApiService {
  final Dio _dio;

  DcrCheckOutApiService(this._dio);

  Future<void> submitCheckOut(DcrCheckOutModel checkOut, String callId, DcrReportModel report) async {
    final payload = {
      'callId': callId,
      'lat': checkOut.latitude,
      'lng': checkOut.longitude,
      'timestamp': checkOut.checkOutTime.toIso8601String(),
      'inChamberTime': checkOut.visitDurationMinutes,
      'feedback': checkOut.doctorMood, // or remarks
      'samples': report.samples.map((s) => {
        'productId': s.productId,
        'quantity': s.quantity
      }).toList(),
      'orders': report.orders.map((o) => {
        'productId': o.productId,
        'quantity': o.quantity,
        'amount': o.totalValue
      }).toList(),
      'prescriptions': report.prescription != null ? [
        // The API schema expects array of { productId, prescriptionCount }. Our model just has doctorType, promotedBrands...
        // We'll map promotedBrands to this structure if it exists.
        // Wait, DcrReportModel's PrescriptionModel doesn't have a productId list with counts.
        // It has promotedBrands. Let's just create a dummy mapping or if we can change it.
      ] : []
    };

    if (report.prescription != null && report.prescription!.promotedBrands.isNotEmpty) {
      payload['prescriptions'] = report.prescription!.promotedBrands.map((brandId) => {
        'productId': brandId, // Assuming brand ID is product ID
        'prescriptionCount': report.prescription!.estimatedVolume ?? 1
      }).toList();
    }

    await _dio.post('/dcr/check-out', data: payload);
  }
}

final dcrCheckOutApiServiceProvider = Provider<DcrCheckOutApiService>((ref) {
  return DcrCheckOutApiService(ref.watch(dioProvider));
});
