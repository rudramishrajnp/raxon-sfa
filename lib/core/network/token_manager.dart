import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../storage/secure_storage_service.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class TokenManager {
  final SecureStorageService _secureStorage;

  TokenManager(this._secureStorage);

  Future<String?> getAccessToken() async {
    return await _secureStorage.getToken();
  }

  Future<String?> getRefreshToken() async {
    return await _secureStorage.getRefreshToken();
  }

  Future<void> saveTokens(String accessToken, String refreshToken) async {
    await _secureStorage.saveToken(accessToken);
    await _secureStorage.saveRefreshToken(refreshToken);
  }

  Future<void> clearTokens() async {
    await _secureStorage.clearAll();
  }

  Future<bool> hasValidToken() async {
    final token = await getAccessToken();
    if (token == null || token.isEmpty) return false;

    try {
      return !JwtDecoder.isExpired(token);
    } catch (e) {
      return false; // Invalid token format
    }
  }
}

final tokenManagerProvider = Provider<TokenManager>((ref) {
  return TokenManager(ref.watch(secureStorageProvider));
});
