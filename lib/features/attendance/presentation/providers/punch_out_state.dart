import '../../data/models/end_of_day_summary_model.dart';

abstract class PunchOutState {}

class PunchOutInitial extends PunchOutState {}

class PunchOutLoading extends PunchOutState {
  final String message;
  PunchOutLoading(this.message);
}

class PunchOutSummaryLoaded extends PunchOutState {
  final EndOfDaySummaryModel summary;
  PunchOutSummaryLoaded(this.summary);
}

class PunchOutSuccess extends PunchOutState {}

class PunchOutError extends PunchOutState {
  final String message;
  PunchOutError(this.message);
}
