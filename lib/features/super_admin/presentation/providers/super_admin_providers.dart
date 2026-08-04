import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/super_admin_models.dart';
import '../../data/repositories/super_admin_repository.dart';

final companiesProvider = FutureProvider.autoDispose<List<CompanyModel>>((ref) async {
  return ref.watch(superAdminRepositoryProvider).getCompanies();
});

final rolesProvider = FutureProvider.autoDispose<List<RoleModel>>((ref) async {
  return ref.watch(superAdminRepositoryProvider).getRoles();
});

final featureTogglesProvider = FutureProvider.autoDispose<List<FeatureToggleModel>>((ref) async {
  return ref.watch(superAdminRepositoryProvider).getFeatureToggles();
});

final globalSettingsProvider = FutureProvider.autoDispose<GlobalSettingsModel>((ref) async {
  return ref.watch(superAdminRepositoryProvider).getGlobalSettings();
});

final licenseProvider = FutureProvider.autoDispose<LicenseModel>((ref) async {
  return ref.watch(superAdminRepositoryProvider).getLicenseDetails();
});

final backupHistoryProvider = FutureProvider.autoDispose<List<BackupModel>>((ref) async {
  return ref.watch(superAdminRepositoryProvider).getBackupHistory();
});
