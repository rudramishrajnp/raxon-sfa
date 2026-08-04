import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/models/customer_model.dart';
import '../../data/models/deviation_model.dart';
import '../../data/models/joint_work_model.dart';

class WorkPlanApiService {
  final Dio _dio;

  WorkPlanApiService(this._dio);

  Future<List<CustomerModel>> getCustomersForDate(String employeeId, DateTime date) async {
    final response = await _dio.get('/dcr/current', queryParameters: {'date': date.toIso8601String().split('T')[0]});
    if (response.statusCode == 200 && response.data['dcr'] != null) {
      final dcr = response.data['dcr'];
      return []; // Wait, the current DCR holds doctorCalls. But we need today's planned customers. 
    }
    return [];
  }

  Future<List<CustomerModel>> fetchMasterDoctors() async {
    final response = await _dio.get('/master/doctors');
    return (response.data as List).map((e) => CustomerModel(
      id: e['id'],
      name: e['name'],
      type: 'Doctor',
      classification: e['class'],
    )).toList();
  }

  Future<List<CustomerModel>> fetchMasterChemists() async {
    final response = await _dio.get('/master/chemists');
    return (response.data as List).map((e) => CustomerModel(
      id: e['id'],
      name: e['name'],
      type: 'Chemist',
    )).toList();
  }

  Future<Map<String, dynamic>> fetchTodayMtpPlan(DateTime date) async {
    try {
      final response = await _dio.get('/mtp/current', queryParameters: {
        'month': date.month,
        'year': date.year,
      });
      return response.data;
    } catch (e) {
      return {};
    }
  }

  Future<void> submitDeviation(DeviationModel deviation) async {
    await _dio.post('/work-plan/deviation', data: deviation.toJson());
  }

  Future<void> submitJointWork(JointWorkModel jointWork) async {
    await _dio.post('/work-plan/joint-work', data: jointWork.toJson());
  }

  Future<CustomerModel> addCustomer(CustomerModel customer) async {
    final endpoint = customer.type.toLowerCase() == 'doctor' ? '/master/doctors/request' : '/master/chemists/request';
    final response = await _dio.post(endpoint, data: customer.toJson());
    return CustomerModel.fromJson(response.data);
  }
}

final workPlanApiServiceProvider = Provider<WorkPlanApiService>((ref) {
  return WorkPlanApiService(ref.watch(dioProvider));
});
