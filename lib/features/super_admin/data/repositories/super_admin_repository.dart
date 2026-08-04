import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/super_admin_models.dart';

abstract class SuperAdminRepository {
  Future<List<CompanyModel>> getCompanies();
  Future<List<RoleModel>> getRoles();
  Future<List<FeatureToggleModel>> getFeatureToggles();
  Future<GlobalSettingsModel> getGlobalSettings();
  Future<LicenseModel> getLicenseDetails();
  Future<List<BackupModel>> getBackupHistory();
}

class SuperAdminRepositoryImpl implements SuperAdminRepository {
  @override
  Future<List<CompanyModel>> getCompanies() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return [
      CompanyModel(
        id: 'c1',
        name: 'Raxon Pharmaceuticals',
        logoUrl: '',
        themeColor: '#0055ff',
        isActive: true,
        divisions: ['Cardio', 'Derma', 'General'],
        createdAt: DateTime.now().subtract(const Duration(days: 365)),
      ),
    ];
  }

  @override
  Future<List<RoleModel>> getRoles() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return [
      RoleModel(id: 'r1', name: 'Super Admin', permissions: {'All': ['Full Access']}),
      RoleModel(id: 'r2', name: 'Admin', permissions: {'Attendance': ['View', 'Update']}),
      RoleModel(id: 'r3', name: 'MR', permissions: {'DCR': ['View', 'Create']}),
    ];
  }

  @override
  Future<List<FeatureToggleModel>> getFeatureToggles() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return [
      FeatureToggleModel(featureName: 'Attendance', status: 'Mandatory'),
      FeatureToggleModel(featureName: 'GPS', status: 'Mandatory'),
      FeatureToggleModel(featureName: 'DCR', status: 'ON'),
      FeatureToggleModel(featureName: 'Primary Sales', status: 'OFF'),
    ];
  }

  @override
  Future<GlobalSettingsModel> getGlobalSettings() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return GlobalSettingsModel(
      defaultLanguage: 'English',
      timeZone: 'Asia/Kolkata',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      workingHours: '09:00 AM - 06:00 PM',
      autoLogoutTime: '30 mins',
    );
  }

  @override
  Future<LicenseModel> getLicenseDetails() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return LicenseModel(
      licenseKey: 'RAXON-ENTERPRISE-2026',
      plan: 'Enterprise',
      expiryDate: DateTime(2027, 12, 31),
      activeUsers: 250,
      maxUsers: 500,
      storageUsage: 45.5, // GB
    );
  }

  @override
  Future<List<BackupModel>> getBackupHistory() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return [
      BackupModel(
        id: 'b1',
        backupTime: DateTime.now().subtract(const Duration(hours: 12)),
        size: '1.2 GB',
        status: 'Success',
      ),
    ];
  }
}

final superAdminRepositoryProvider = Provider<SuperAdminRepository>((ref) {
  return SuperAdminRepositoryImpl();
});
