import '../../data/models/user_model.dart';

abstract class AuthState {}

class AuthStateInitial extends AuthState {}

class AuthStateLoading extends AuthState {}

class AuthStateAuthenticated extends AuthState {
  final UserModel user;
  AuthStateAuthenticated(this.user);
}

class AuthStateUnauthenticated extends AuthState {}

class AuthStateError extends AuthState {
  final String message;
  AuthStateError(this.message);
}
