class CompanyModel {
  final String id;
  final String name;
  final String logoUrl;
  final String themeColor;
  final bool isActive;
  final List<String> divisions;
  final DateTime createdAt;

  CompanyModel({
    required this.id,
    required this.name,
    required this.logoUrl,
    required this.themeColor,
    required this.isActive,
    required this.divisions,
    required this.createdAt,
  });
}

class RoleModel {
  final String id;
  final String name;
  final Map<String, List<String>> permissions; // e.g., {'Attendance': ['View', 'Create', 'Update']}

  RoleModel({
    required this.id,
    required this.name,
    required this.permissions,
  });
}

class FeatureToggleModel {
  final String featureName;
  final String status; // ON, OFF, Mandatory, Optional, Hidden

  FeatureToggleModel({
    required this.featureName,
    required this.status,
  });
}

class GlobalSettingsModel {
  final String defaultLanguage;
  final String timeZone;
  final String currency;
  final String dateFormat;
  final String workingHours;
  final String autoLogoutTime;

  GlobalSettingsModel({
    required this.defaultLanguage,
    required this.timeZone,
    required this.currency,
    required this.dateFormat,
    required this.workingHours,
    required this.autoLogoutTime,
  });
}

class LicenseModel {
  final String licenseKey;
  final String plan;
  final DateTime expiryDate;
  final int activeUsers;
  final int maxUsers;
  final double storageUsage;

  LicenseModel({
    required this.licenseKey,
    required this.plan,
    required this.expiryDate,
    required this.activeUsers,
    required this.maxUsers,
    required this.storageUsage,
  });
}

class BackupModel {
  final String id;
  final DateTime backupTime;
  final String size;
  final String status;

  BackupModel({
    required this.id,
    required this.backupTime,
    required this.size,
    required this.status,
  });
}
