import 'dart:async';
import 'package:dio/dio.dart';
import '../services/connectivity_service.dart';
import 'dart:math' as math;

class RetryInterceptor extends Interceptor {
  final Dio dio;
  final ConnectivityService connectivityService;
  final int maxRetries;
  final Duration initialDelay;

  RetryInterceptor({
    required this.dio,
    required this.connectivityService,
    this.maxRetries = 3,
    this.initialDelay = const Duration(seconds: 1),
  });

  @override
  Future<void> onError(DioException err, ErrorInterceptorHandler handler) async {
    if (_shouldRetry(err)) {
      var retryCount = err.requestOptions.extra['retryCount'] ?? 0;
      
      if (retryCount < maxRetries) {
        final isConnected = await connectivityService.isConnected();
        if (isConnected) {
          retryCount++;
          
          final delay = initialDelay * math.pow(2, retryCount - 1); // Exponential backoff
          await Future.delayed(delay);
          
          err.requestOptions.extra['retryCount'] = retryCount;
          
          try {
            final response = await dio.fetch(err.requestOptions);
            return handler.resolve(response);
          } on DioException catch (e) {
            return super.onError(e, handler);
          }
        }
      }
    }
    return super.onError(err, handler);
  }

  bool _shouldRetry(DioException err) {
    if (err.type == DioExceptionType.connectionTimeout ||
        err.type == DioExceptionType.sendTimeout ||
        err.type == DioExceptionType.receiveTimeout ||
        err.type == DioExceptionType.connectionError) {
      return true;
    }
    
    // Also retry on 500, 502, 503, 504
    if (err.response != null) {
      final statusCode = err.response!.statusCode;
      if (statusCode != null && (statusCode == 500 || statusCode == 502 || statusCode == 503 || statusCode == 504)) {
        return true;
      }
    }
    
    return false;
  }
}
