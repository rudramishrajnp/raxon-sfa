abstract class DcrCheckInState {}

class DcrCheckInInitial extends DcrCheckInState {}

class DcrCheckInLoading extends DcrCheckInState {}

class DcrCheckInSuccess extends DcrCheckInState {
  final String message;
  DcrCheckInSuccess(this.message);
}

class DcrCheckInError extends DcrCheckInState {
  final String message;
  DcrCheckInError(this.message);
}

class DcrLocationError extends DcrCheckInState {
  final String message;
  DcrLocationError(this.message);
}
