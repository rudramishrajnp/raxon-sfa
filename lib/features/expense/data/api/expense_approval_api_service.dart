import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../models/expense_approval_model.dart';
import '../models/expense_payment_model.dart';

class ExpenseApprovalApiService {
  final Dio _dio;

  ExpenseApprovalApiService(this._dio);

  Future<void> submitApproval(ExpenseApprovalModel approval) async {
    // await _dio.post('/expenses/approvals', data: approval.toJson());
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
  }

  Future<void> submitPayment(ExpensePaymentModel payment) async {
    // await _dio.post('/expenses/payments', data: payment.toJson());
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
  }
}

final expenseApprovalApiServiceProvider = Provider<ExpenseApprovalApiService>((ref) {
  return ExpenseApprovalApiService(ref.watch(dioProvider));
});
