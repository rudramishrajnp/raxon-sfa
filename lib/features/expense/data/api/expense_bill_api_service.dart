import 'package:universal_io/io.dart';
import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../models/expense_bill_model.dart';

class ExpenseBillApiService {
  final Dio _dio;

  ExpenseBillApiService(this._dio);

  Future<void> uploadBill(ExpenseBillModel bill, File file) async {
    if (kIsWeb) {
      return;
    }
    FormData formData = FormData.fromMap({
      'bill': await MultipartFile.fromFile(file.path, filename: bill.fileName),
      'expenseId': bill.expenseId,
    });
    await _dio.post('/expense/upload-bill', data: formData);
  }
}

final expenseBillApiServiceProvider = Provider<ExpenseBillApiService>((ref) {
  return ExpenseBillApiService(ref.watch(dioProvider));
});
