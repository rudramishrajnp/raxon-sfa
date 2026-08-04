import '../../data/models/dcr_review_models.dart';

abstract class DcrReviewState {}

class DcrReviewInitial extends DcrReviewState {}
class DcrReviewLoading extends DcrReviewState {}
class DcrReviewLoaded extends DcrReviewState {
  final List<DcrSubmissionModel> submissions;
  final bool isOfflineData;
  
  DcrReviewLoaded({
    required this.submissions,
    this.isOfflineData = false,
  });
}
class DcrReviewError extends DcrReviewState {
  final String message;
  DcrReviewError(this.message);
}
