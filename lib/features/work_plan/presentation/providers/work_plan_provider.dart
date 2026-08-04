import '../../data/repositories/work_plan_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/work_plan_repository.dart';
import '../../data/models/deviation_model.dart';
import '../../data/models/joint_work_model.dart';
import '../../data/models/customer_model.dart';
import 'work_plan_state.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../authentication/presentation/providers/auth_state.dart';

class WorkPlanNotifier extends StateNotifier<WorkPlanState> {
  final WorkPlanRepository _repository;
  final Ref _ref;

  WorkPlanNotifier(this._repository, this._ref) : super(WorkPlanInitial());

  String _getEmployeeId() {
    final authState = _ref.read(authNotifierProvider);
    if (authState is AuthStateAuthenticated) {
      return authState.user.id;
    }
    return 'UNKNOWN';
  }

  Future<void> loadTodayWorkPlan() async {
    state = WorkPlanLoading();
    try {
      final employeeId = _getEmployeeId();
      final summary = await _repository.getTodaySummary(employeeId);
      final customers = await _repository.getTodayCustomers(employeeId);
      
      state = WorkPlanLoaded(
        summary: summary,
        allCustomers: customers,
        filteredCustomers: customers,
      );
    } catch (e) {
      state = WorkPlanError("Failed to load today's work plan.");
    }
  }

  void filterCustomers(String query, String type, String callStatus) {
    if (state is! WorkPlanLoaded) return;
    
    final currentState = state as WorkPlanLoaded;
    var filtered = currentState.allCustomers.where((c) {
      bool matchesQuery = query.isEmpty || 
          c.name.toLowerCase().contains(query.toLowerCase()) || 
          (c.specialty?.toLowerCase().contains(query.toLowerCase()) ?? false) ||
          (c.city?.toLowerCase().contains(query.toLowerCase()) ?? false);
      
      bool matchesType = type == 'All' || c.type == type;
      bool matchesStatus = callStatus == 'All' || c.callStatus == callStatus;
      
      return matchesQuery && matchesType && matchesStatus;
    }).toList();

    state = currentState.copyWith(filteredCustomers: filtered);
  }

  Future<void> submitDeviation(String customerId, String reason, String? remarks) async {
    final prevState = state;
    try {
      final deviation = DeviationModel(
        employeeId: _getEmployeeId(),
        customerId: customerId,
        reason: reason,
        remarks: remarks,
        deviationDate: DateTime.now(),
      );
      await _repository.logDeviation(deviation);
      state = WorkPlanActionSuccess('Deviation logged successfully.');
      await Future.delayed(const Duration(milliseconds: 100));
      await loadTodayWorkPlan();
    } catch (e) {
      state = WorkPlanError('Failed to submit deviation.');
      await Future.delayed(const Duration(milliseconds: 100));
      state = prevState;
    }
  }

  Future<void> submitJointWork(String managerId, String managerName) async {
    final prevState = state;
    try {
      final jointWork = JointWorkModel(
        date: DateTime.now(),
        managerId: managerId,
        managerName: managerName,
      );
      await _repository.submitJointWork(jointWork);
      state = WorkPlanActionSuccess('Joint work submitted successfully.');
      await Future.delayed(const Duration(milliseconds: 100));
      await loadTodayWorkPlan();
    } catch (e) {
      state = WorkPlanError('Failed to submit joint work.');
      await Future.delayed(const Duration(milliseconds: 100));
      state = prevState;
    }
  }

  Future<List<CustomerModel>> searchUnplannedCustomers(String query) async {
    if (query.isEmpty) return [];
    return await _repository.searchAllCustomers(query);
  }
}

final workPlanNotifierProvider = StateNotifierProvider<WorkPlanNotifier, WorkPlanState>((ref) {
  return WorkPlanNotifier(
    ref.watch(workPlanRepositoryProvider),
    ref,
  );
});
