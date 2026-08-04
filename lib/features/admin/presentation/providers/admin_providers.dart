import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/admin_models.dart';
import '../../data/repositories/admin_repository.dart';

class AdminUsersNotifier extends StateNotifier<AsyncValue<List<AdminUserModel>>> {
  final AdminRepository _repository;

  AdminUsersNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadUsers();
  }

  Future<void> loadUsers() async {
    state = const AsyncValue.loading();
    try {
      final users = await _repository.getUsers();
      state = AsyncValue.data(users);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> searchUsers(String query) async {
    // In real app, fetch from repository. For mock, just filtering state if we have all data.
    // Simplifying for mock.
  }
}

final adminUsersProvider = StateNotifierProvider<AdminUsersNotifier, AsyncValue<List<AdminUserModel>>>((ref) {
  return AdminUsersNotifier(ref.watch(adminRepositoryProvider));
});

final userDetailsProvider = FutureProvider.family<AdminUserModel, String>((ref, id) async {
  final repo = ref.watch(adminRepositoryProvider);
  return repo.getUserDetails(id);
});

class TerritoriesNotifier extends StateNotifier<AsyncValue<List<TerritoryModel>>> {
  final AdminRepository _repository;

  TerritoriesNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadTerritories();
  }

  Future<void> loadTerritories() async {
    state = const AsyncValue.loading();
    try {
      final territories = await _repository.getTerritories();
      state = AsyncValue.data(territories);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final territoriesProvider = StateNotifierProvider<TerritoriesNotifier, AsyncValue<List<TerritoryModel>>>((ref) {
  return TerritoriesNotifier(ref.watch(adminRepositoryProvider));
});
