import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/models/expense_model.dart';

class ExpenseApiService {
  final Dio _dio;

  ExpenseApiService(this._dio);

  Future<void> submitExpense(ExpenseModel expense) async {
    // await _dio.post('/expenses', data: expense.toJson());
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
  }
}

final expenseApiServiceProvider = Provider<ExpenseApiService>((ref) {
  return ExpenseApiService(ref.watch(dioProvider));
});
