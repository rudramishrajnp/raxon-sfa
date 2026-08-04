import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/admin_models.dart';

abstract class AdminRepository {
  Future<List<AdminUserModel>> getUsers();
  Future<AdminUserModel> getUserDetails(String id);
  Future<void> createUser(AdminUserModel user);
  Future<void> updateUser(AdminUserModel user);
  Future<void> changeUserStatus(String id, String status);
  Future<void> resetPassword(String id);
  Future<void> forceLogout(String id);
  Future<void> resetDeviceBinding(String id);
  
  Future<List<TerritoryModel>> getTerritories();
  Future<void> createTerritory(TerritoryModel territory);
  Future<void> updateTerritory(TerritoryModel territory);
  Future<void> assignTerritory(String userId, String territoryId);
}

class AdminRepositoryImpl implements AdminRepository {
  final List<AdminUserModel> _mockUsers = [
    AdminUserModel(
      id: 'u1',
      employeeCode: 'EMP-101',
      name: 'John Doe',
      mobileNumber: '+1234567890',
      email: 'john@example.com',
      designation: 'MR',
      department: 'Sales',
      hq: 'HQ1',
      exHq: 'ExHQ1',
      zone: 'North',
      region: 'Delhi',
      state: 'Delhi',
      joiningDate: DateTime(2023, 1, 15),
      status: 'Active',
      reportingManagerName: 'Jane Smith (AM)',
      deviceId: 'dev_12345',
    ),
    AdminUserModel(
      id: 'u2',
      employeeCode: 'EMP-102',
      name: 'Jane Smith',
      mobileNumber: '+1987654321',
      email: 'jane@example.com',
      designation: 'AM',
      department: 'Sales',
      hq: 'HQ1',
      exHq: 'ExHQ1',
      zone: 'North',
      region: 'Delhi',
      state: 'Delhi',
      joiningDate: DateTime(2022, 5, 10),
      status: 'Active',
      deviceId: 'dev_67890',
    ),
  ];

  final List<TerritoryModel> _mockTerritories = [
    TerritoryModel(id: 't1', name: 'North Zone', code: 'ZN-01', type: 'Zone', status: 'Active'),
    TerritoryModel(id: 't2', name: 'Delhi Region', code: 'RG-01', type: 'Region', parentId: 't1', status: 'Active'),
    TerritoryModel(id: 't3', name: 'Central Delhi', code: 'AR-01', type: 'Area', parentId: 't2', status: 'Active'),
  ];

  @override
  Future<List<AdminUserModel>> getUsers() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return _mockUsers.toList();
  }

  @override
  Future<AdminUserModel> getUserDetails(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _mockUsers.firstWhere((u) => u.id == id);
  }

  @override
  Future<void> createUser(AdminUserModel user) async {
    await Future.delayed(const Duration(milliseconds: 500));
    _mockUsers.add(user);
  }

  @override
  Future<void> updateUser(AdminUserModel user) async {
    await Future.delayed(const Duration(milliseconds: 500));
    final index = _mockUsers.indexWhere((u) => u.id == user.id);
    if (index != -1) {
      _mockUsers[index] = user;
    }
  }

  @override
  Future<void> changeUserStatus(String id, String status) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final index = _mockUsers.indexWhere((u) => u.id == id);
    if (index != -1) {
      _mockUsers[index] = _mockUsers[index].copyWith(status: status);
    }
  }

  @override
  Future<void> resetPassword(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
  }

  @override
  Future<void> forceLogout(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
  }

  @override
  Future<void> resetDeviceBinding(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final index = _mockUsers.indexWhere((u) => u.id == id);
    if (index != -1) {
      _mockUsers[index] = _mockUsers[index].copyWith(deviceId: ''); // empty device id
    }
  }

  @override
  Future<List<TerritoryModel>> getTerritories() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return _mockTerritories.toList();
  }

  @override
  Future<void> createTerritory(TerritoryModel territory) async {
    await Future.delayed(const Duration(milliseconds: 500));
    _mockTerritories.add(territory);
  }

  @override
  Future<void> updateTerritory(TerritoryModel territory) async {
    await Future.delayed(const Duration(milliseconds: 500));
    final index = _mockTerritories.indexWhere((t) => t.id == territory.id);
    if (index != -1) {
      _mockTerritories[index] = territory;
    }
  }

  @override
  Future<void> assignTerritory(String userId, String territoryId) async {
    await Future.delayed(const Duration(milliseconds: 500));
  }
}

final adminRepositoryProvider = Provider<AdminRepository>((ref) {
  return AdminRepositoryImpl();
});
