import '../../data/models/dcr_checkout_model.dart';
import '../../data/models/dcr_report_model.dart';

abstract class DcrSubmissionState {}

class DcrSubmissionInitial extends DcrSubmissionState {}

class DcrSubmissionLoading extends DcrSubmissionState {}

class DcrSubmissionLoaded extends DcrSubmissionState {
  final DcrCheckOutModel checkOut;
  final DcrReportModel report;

  DcrSubmissionLoaded({
    required this.checkOut,
    required this.report,
  });
}

class DcrSubmissionSuccess extends DcrSubmissionState {
  final String message;
  DcrSubmissionSuccess(this.message);
}

class DcrSubmissionError extends DcrSubmissionState {
  final String message;
  DcrSubmissionError(this.message);
}
