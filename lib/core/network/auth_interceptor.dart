import 'dart:async';
import 'package:dio/dio.dart';
import 'token_manager.dart';

class AuthInterceptor extends Interceptor {
  final Dio _dio;
  final Dio _refreshDio;
  final TokenManager _tokenManager;
  
  bool _isRefreshing = false;
  final _requestsQueue = <Completer<Response>>[];
  final _originalRequests = <RequestOptions>[];

  AuthInterceptor(this._dio, this._refreshDio, this._tokenManager);

  @override
  Future<void> onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _tokenManager.getAccessToken();
    
    // Don't add auth header for login or refresh endpoints
    if (token != null && token.isNotEmpty && !options.path.contains('/auth/login') && !options.path.contains('/auth/refresh')) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    
    return handler.next(options);
  }

  @override
  Future<void> onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401 && !err.requestOptions.path.contains('/auth/login') && !err.requestOptions.path.contains('/auth/refresh')) {
      
      final refreshToken = await _tokenManager.getRefreshToken();
      
      if (refreshToken == null || refreshToken.isEmpty) {
        return handler.next(err);
      }

      if (_isRefreshing) {
        final completer = Completer<Response>();
        _requestsQueue.add(completer);
        _originalRequests.add(err.requestOptions);
        
        try {
          final response = await completer.future;
          return handler.resolve(response);
        } on DioException catch (e) {
          return handler.next(e);
        }
      } else {
        _isRefreshing = true;
        
        try {
          final response = await _refreshDio.post('/auth/refresh', data: {
            'refreshToken': refreshToken,
          });
          
          final newAccessToken = response.data['accessToken'];
          final newRefreshToken = response.data['refreshToken'] ?? refreshToken;
          
          await _tokenManager.saveTokens(newAccessToken, newRefreshToken);
          
          // Retry the queued requests
          for (var i = 0; i < _requestsQueue.length; i++) {
            final options = _originalRequests[i];
            options.headers['Authorization'] = 'Bearer $newAccessToken';
            _dio.fetch(options).then((res) {
              _requestsQueue[i].complete(res);
            }).catchError((e) {
              _requestsQueue[i].completeError(e);
            });
          }
          
          _requestsQueue.clear();
          _originalRequests.clear();
          _isRefreshing = false;
          
          // Retry the original failed request
          final options = err.requestOptions;
          options.headers['Authorization'] = 'Bearer $newAccessToken';
          
          final retryResponse = await _dio.fetch(options);
          return handler.resolve(retryResponse);
          
        } catch (e) {
          _isRefreshing = false;
          _requestsQueue.forEach((completer) => completer.completeError(err));
          _requestsQueue.clear();
          _originalRequests.clear();
          await _tokenManager.clearTokens();
          // Force logout mechanism here
          return handler.next(err);
        }
      }
    }
    
    return handler.next(err);
  }
}
