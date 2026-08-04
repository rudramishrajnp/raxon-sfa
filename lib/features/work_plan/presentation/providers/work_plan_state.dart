import '../../data/models/customer_model.dart';
import '../../data/models/work_plan_summary_model.dart';

abstract class WorkPlanState {}

class WorkPlanInitial extends WorkPlanState {}

class WorkPlanLoading extends WorkPlanState {}

class WorkPlanLoaded extends WorkPlanState {
  final WorkPlanSummaryModel summary;
  final List<CustomerModel> allCustomers;
  final List<CustomerModel> filteredCustomers;

  WorkPlanLoaded({
    required this.summary,
    required this.allCustomers,
    required this.filteredCustomers,
  });

  WorkPlanLoaded copyWith({
    WorkPlanSummaryModel? summary,
    List<CustomerModel>? allCustomers,
    List<CustomerModel>? filteredCustomers,
  }) {
    return WorkPlanLoaded(
      summary: summary ?? this.summary,
      allCustomers: allCustomers ?? this.allCustomers,
      filteredCustomers: filteredCustomers ?? this.filteredCustomers,
    );
  }
}

class WorkPlanError extends WorkPlanState {
  final String message;
  WorkPlanError(this.message);
}

class WorkPlanActionSuccess extends WorkPlanState {
  final String message;
  WorkPlanActionSuccess(this.message);
}
