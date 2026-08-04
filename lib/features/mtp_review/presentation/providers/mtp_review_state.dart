import '../../data/models/mtp_review_models.dart';

abstract class MtpReviewState {}

class MtpReviewInitial extends MtpReviewState {}
class MtpReviewLoading extends MtpReviewState {}
class MtpReviewLoaded extends MtpReviewState {
  final List<MtpSubmissionModel> submissions;
  final bool isOfflineData;
  
  MtpReviewLoaded({
    required this.submissions,
    this.isOfflineData = false,
  });
}
class MtpReviewError extends MtpReviewState {
  final String message;
  MtpReviewError(this.message);
}
