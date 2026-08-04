import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/models/secondary_sales_model.dart';

class SecondarySalesApiService {
  final Dio _dio;
  SecondarySalesApiService(this._dio);

  Future<void> submitSecondarySales(SecondarySalesModel sales) async {
    final data = sales.toJson();
    await _dio.post('/sales/add', data: data);
  }
}

final secondarySalesApiServiceProvider = Provider<SecondarySalesApiService>((ref) {
  return SecondarySalesApiService(ref.watch(dioProvider));
});
