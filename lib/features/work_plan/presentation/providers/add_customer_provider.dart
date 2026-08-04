import '../../data/repositories/work_plan_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/work_plan_repository.dart';
import '../../data/models/customer_model.dart';

class AddCustomerNotifier extends StateNotifier<AsyncValue<void>> {
  final WorkPlanRepository _repository;

  AddCustomerNotifier(this._repository) : super(const AsyncValue.data(null));

  Future<void> submitNewCustomer(CustomerModel customer) async {
    state = const AsyncValue.loading();
    try {
      await _repository.addCustomer(customer);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final addCustomerNotifierProvider = StateNotifierProvider<AddCustomerNotifier, AsyncValue<void>>((ref) {
  return AddCustomerNotifier(ref.watch(workPlanRepositoryProvider));
});
