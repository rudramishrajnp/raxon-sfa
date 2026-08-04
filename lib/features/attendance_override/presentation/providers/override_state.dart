import '../../data/models/override_models.dart';

abstract class OverrideState {}

class OverrideInitial extends OverrideState {}
class OverrideLoading extends OverrideState {}
class OverrideLoaded extends OverrideState {
  final List<OverrideRequestModel> pendingRequests;
  final OverrideSystemConfig? config;

  OverrideLoaded({
    required this.pendingRequests,
    this.config,
  });
}
class OverrideError extends OverrideState {
  final String message;
  OverrideError(this.message);
}
