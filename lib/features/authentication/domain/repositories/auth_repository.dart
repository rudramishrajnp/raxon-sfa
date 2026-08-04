import '../../data/models/user_model.dart';

abstract class AuthRepository {
  Future<UserModel> login({
    required String userId,
    required String password,
    required bool rememberMe,
  });

  Future<void> logout();

  Future<bool> checkSession();

  Future<UserModel> getCurrentUser();
}
