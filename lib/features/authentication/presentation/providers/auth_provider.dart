import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/error/api_exceptions.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../data/repositories/auth_repository_impl.dart';
import 'auth_state.dart';

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  AuthNotifier(this._repository) : super(AuthStateInitial());

  Future<void> login(String userId, String password, bool rememberMe) async {
    state = AuthStateLoading();
    try {
      final user = await _repository.login(
        userId: userId,
        password: password,
        rememberMe: rememberMe,
      );
      state = AuthStateAuthenticated(user);
    } on ApiException catch (e) {
      state = AuthStateError(e.message);
    } catch (e) {
      state = AuthStateError('An unexpected error occurred.');
    }
  }

  Future<void> logout() async {
    state = AuthStateLoading();
    await _repository.logout();
    state = AuthStateUnauthenticated();
  }

  Future<void> checkSession() async {
    final isValid = await _repository.checkSession();
    if (isValid) {
      try {
        final user = await _repository.getCurrentUser();
        state = AuthStateAuthenticated(user);
      } catch (e) {
        state = AuthStateUnauthenticated();
      }
    } else {
      state = AuthStateUnauthenticated();
    }
  }
}

final authNotifierProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.watch(authRepositoryProvider));
});
