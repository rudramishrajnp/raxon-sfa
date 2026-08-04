import 'package:dio/dio.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() => message;

  factory ApiException.fromDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return ApiException('Connection timed out. Please check your internet connection.');
      case DioExceptionType.badResponse:
        return _handleResponseError(error.response);
      case DioExceptionType.connectionError:
        return ApiException('No internet connection. You are offline.');
      case DioExceptionType.cancel:
        return ApiException('Request was cancelled.');
      default:
        return ApiException('An unexpected error occurred. Please try again.');
    }
  }

  static ApiException _handleResponseError(Response? response) {
    if (response == null) return ApiException('Unknown server error occurred.');
    
    final statusCode = response.statusCode;
    String errorMessage = 'Server error occurred.';

    if (response.data is Map<String, dynamic> && response.data['message'] != null) {
      errorMessage = response.data['message'];
    }

    switch (statusCode) {
      case 400:
        return ApiException(errorMessage, statusCode: 400);
      case 401:
        return ApiException(errorMessage.isNotEmpty ? errorMessage : 'Unauthorized. Invalid credentials or expired token.', statusCode: 401);
      case 403:
        return ApiException('Forbidden. You do not have permission.', statusCode: 403);
      case 404:
        return ApiException('Resource not found.', statusCode: 404);
      case 500:
        return ApiException('Internal server error. Please try again later.', statusCode: 500);
      default:
        return ApiException(errorMessage, statusCode: statusCode);
    }
  }
}
