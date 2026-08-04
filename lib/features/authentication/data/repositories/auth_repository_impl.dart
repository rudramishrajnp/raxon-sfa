import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/error/api_exceptions.dart';
import '../../../../core/services/device_info_service.dart';
import '../../../../core/storage/local_storage_service.dart';
import '../../../../core/network/token_manager.dart';
import '../../domain/repositories/auth_repository.dart';
import '../api/auth_api_service.dart';
import '../models/login_request.dart';
import '../models/user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthApiService _apiService;
  final TokenManager _tokenManager;
  final LocalStorageService _localStorage;
  final DeviceInfoService _deviceInfo;

  AuthRepositoryImpl(
    this._apiService,
    this._tokenManager,
    this._localStorage,
    this._deviceInfo,
  );

  @override
  Future<UserModel> login({
    required String userId,
    required String password,
    required bool rememberMe,
  }) async {
    try {
      final deviceId = await _deviceInfo.getDeviceId();
      final deviceModel = await _deviceInfo.getDeviceModel();
      
      final request = LoginRequest(
        userId: userId,
        password: password,
        deviceId: deviceId,
        deviceModel: deviceModel,
      );

      final response = await _apiService.login(request);
      
      await _tokenManager.saveTokens(response.accessToken, response.refreshToken);

      await _localStorage.saveRememberMe(rememberMe, userId);
      return response.user;
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    } catch (e) {
      throw ApiException('An unexpected error occurred during login.');
    }
  }

  @override
  Future<void> logout() async {
    try {
      await _apiService.logout();
    } catch (_) {
      // Ignore API errors on logout
    } finally {
      await _tokenManager.clearTokens();
      if (!_localStorage.getRememberMe()) {
        await _localStorage.saveRememberMe(false, null);
      }
    }
  }

  @override
  Future<bool> checkSession() async {
    return await _tokenManager.hasValidToken();
  }

  @override
  Future<UserModel> getCurrentUser() async {
    try {
      return await _apiService.me();
    } on DioException catch (e) {
      throw ApiException.fromDioError(e);
    } catch (e) {
      throw ApiException('Failed to fetch user profile.');
    }
  }
}

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(
    ref.watch(authApiServiceProvider),
    ref.watch(tokenManagerProvider),
    ref.watch(localStorageProvider),
    ref.watch(deviceInfoProvider),
  );
});
