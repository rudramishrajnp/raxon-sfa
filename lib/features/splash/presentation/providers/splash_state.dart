import '../../../../core/services/startup_service.dart';

abstract class SplashState {}

class SplashStateInitial extends SplashState {}

class SplashStateLoading extends SplashState {
  final String message;
  SplashStateLoading(this.message);
}

class SplashStateCompleted extends SplashState {
  final StartupResult result;
  SplashStateCompleted(this.result);
}

class SplashStateError extends SplashState {
  final String errorMessage;
  SplashStateError(this.errorMessage);
}
