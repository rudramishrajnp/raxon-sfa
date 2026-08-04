import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/app_constants.dart';
import 'token_manager.dart';
import '../services/connectivity_service.dart';
import 'auth_interceptor.dart';
import 'retry_interceptor.dart';

class DioClient {
  final Dio _dio;

  DioClient(
    this._dio,
    TokenManager tokenManager,
    ConnectivityService connectivityService,
  ) {
    _dio.options = BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: const Duration(milliseconds: AppConstants.connectionTimeout),
      receiveTimeout: const Duration(milliseconds: AppConstants.receiveTimeout),
      sendTimeout: const Duration(milliseconds: AppConstants.receiveTimeout),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );

    // Separate dio instance for token refresh to avoid interceptor loop
    final refreshDio = Dio(
      BaseOptions(
        baseUrl: AppConstants.baseUrl,
        connectTimeout: const Duration(milliseconds: AppConstants.connectionTimeout),
        receiveTimeout: const Duration(milliseconds: AppConstants.receiveTimeout),
      ),
    );

    _dio.interceptors.addAll([
      AuthInterceptor(_dio, refreshDio, tokenManager),
      RetryInterceptor(
        dio: _dio,
        connectivityService: connectivityService,
      ),
      if (kDebugMode)
        LogInterceptor(
          requestHeader: true,
          requestBody: true,
          responseHeader: true,
          responseBody: true,
        ),
    ]);
  }

  Dio get dio => _dio;
}

final dioProvider = Provider<Dio>((ref) {
  final tokenManager = ref.watch(tokenManagerProvider);
  final connectivityService = ref.watch(connectivityServiceProvider);
  final client = DioClient(Dio(), tokenManager, connectivityService);
  return client.dio;
});
