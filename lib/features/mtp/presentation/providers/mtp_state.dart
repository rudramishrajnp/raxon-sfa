import '../../data/models/mtp_models.dart';

abstract class MtpState {}

class MtpInitial extends MtpState {}

class MtpLoading extends MtpState {
  final String message;
  MtpLoading(this.message);
}

class MtpLoaded extends MtpState {
  final MtpModel mtp;
  final int currentMonth;
  final int currentYear;
  
  MtpLoaded({
    required this.mtp,
    required this.currentMonth,
    required this.currentYear,
  });

  MtpLoaded copyWith({
    MtpModel? mtp,
    int? currentMonth,
    int? currentYear,
  }) {
    return MtpLoaded(
      mtp: mtp ?? this.mtp,
      currentMonth: currentMonth ?? this.currentMonth,
      currentYear: currentYear ?? this.currentYear,
    );
  }
}

class MtpError extends MtpState {
  final String message;
  MtpError(this.message);
}

class MtpSaved extends MtpState {
  final String message;
  MtpSaved(this.message);
}

class MtpSubmitted extends MtpState {}
