import 'package:dio/dio.dart';
import '../error/api_exceptions.dart';

abstract class BaseApiService {
  final Dio dio;

  BaseApiService(this.dio);

  Future<T> get<T>(String path, {Map<String, dynamic>? queryParameters, required T Function(dynamic data) fromJson}) async {
    try {
      final response = await dio.get(path, queryParameters: queryParameters);
      return fromJson(response.data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    } catch (e) {
      throw ApiException('Unexpected error occurred: $e');
    }
  }

  Future<T> post<T>(String path, {dynamic data, required T Function(dynamic data) fromJson}) async {
    try {
      final response = await dio.post(path, data: data);
      return fromJson(response.data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    } catch (e) {
      throw ApiException('Unexpected error occurred: $e');
    }
  }

  Future<void> postVoid(String path, {dynamic data}) async {
    try {
      await dio.post(path, data: data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    } catch (e) {
      throw ApiException('Unexpected error occurred: $e');
    }
  }

  Future<T> put<T>(String path, {dynamic data, required T Function(dynamic data) fromJson}) async {
    try {
      final response = await dio.put(path, data: data);
      return fromJson(response.data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    } catch (e) {
      throw ApiException('Unexpected error occurred: $e');
    }
  }

  Future<void> putVoid(String path, {dynamic data}) async {
    try {
      await dio.put(path, data: data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    } catch (e) {
      throw ApiException('Unexpected error occurred: $e');
    }
  }

  Future<void> delete(String path, {dynamic data}) async {
    try {
      await dio.delete(path, data: data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    } catch (e) {
      throw ApiException('Unexpected error occurred: $e');
    }
  }

  Future<T> postMultipart<T>(String path, {required FormData data, required T Function(dynamic data) fromJson}) async {
    try {
      final response = await dio.post(path, data: data);
      return fromJson(response.data);
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    } catch (e) {
      throw ApiException('Unexpected error occurred: $e');
    }
  }
}
