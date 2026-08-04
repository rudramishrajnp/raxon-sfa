import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/models/dcr_report_model.dart';
import '../../data/models/product_model.dart';

class DcrReportApiService {
  final Dio _dio;

  DcrReportApiService(this._dio);

  Future<List<ProductModel>> getActiveProducts() async {
    // Stub
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
    return [
      ProductModel(id: 'P1', name: 'Raxon 500', strength: '500mg', pack: '10x10', availableStock: 100, price: 120.0),
      ProductModel(id: 'P2', name: 'Raxon Cold', strength: '10mg', pack: '10x10', availableStock: 50, price: 80.0),
      ProductModel(id: 'P3', name: 'Raxon D3', strength: '60K IU', pack: '4', availableStock: 200, price: 250.0),
    ];
  }

  Future<void> submitDcrReport(DcrReportModel report) async {
    // await _dio.post('/dcr/report', data: report.toJson());
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
  }
}

final dcrReportApiServiceProvider = Provider<DcrReportApiService>((ref) {
  return DcrReportApiService(ref.watch(dioProvider));
});
