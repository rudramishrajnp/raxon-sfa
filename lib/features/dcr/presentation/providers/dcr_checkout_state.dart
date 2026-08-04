import '../../data/models/dcr_report_model.dart';

abstract class DcrCheckOutState {}

class DcrCheckOutInitial extends DcrCheckOutState {}

class DcrCheckOutLoading extends DcrCheckOutState {}

class DcrCheckOutLoaded extends DcrCheckOutState {
  final DateTime checkInTime;
  final DcrReportModel? report;

  DcrCheckOutLoaded({
    required this.checkInTime,
    this.report,
  });
}

class DcrCheckOutSuccess extends DcrCheckOutState {
  final String message;
  DcrCheckOutSuccess(this.message);
}

class DcrCheckOutError extends DcrCheckOutState {
  final String message;
  DcrCheckOutError(this.message);
}

class DcrCheckOutLocationError extends DcrCheckOutState {
  final String message;
  DcrCheckOutLocationError(this.message);
}
