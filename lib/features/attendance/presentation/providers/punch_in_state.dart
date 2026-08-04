abstract class PunchInState {}

class PunchInInitial extends PunchInState {}

class PunchInLoading extends PunchInState {
  final String message;
  PunchInLoading(this.message);
}

class PunchInSuccess extends PunchInState {}

class PunchInError extends PunchInState {
  final String message;
  PunchInError(this.message);
}
