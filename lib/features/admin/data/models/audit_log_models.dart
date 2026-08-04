class AuditLogModel {
  final String id;
  final String action;
  final String entityType;
  final String entityId;
  final String userId;
  final String userName;
  final DateTime timestamp;
  final String details;

  AuditLogModel({
    required this.id,
    required this.action,
    required this.entityType,
    required this.entityId,
    required this.userId,
    required this.userName,
    required this.timestamp,
    required this.details,
  });
}

class LoginHistoryModel {
  final String id;
  final String userId;
  final String userName;
  final DateTime loginTime;
  final DateTime? logoutTime;
  final String ipAddress;
  final String deviceName;
  final bool isSuccess;

  LoginHistoryModel({
    required this.id,
    required this.userId,
    required this.userName,
    required this.loginTime,
    this.logoutTime,
    required this.ipAddress,
    required this.deviceName,
    required this.isSuccess,
  });
}

class DeviceHistoryModel {
  final String id;
  final String userId;
  final String userName;
  final String deviceId;
  final String deviceModel;
  final String osVersion;
  final DateTime lastSync;

  DeviceHistoryModel({
    required this.id,
    required this.userId,
    required this.userName,
    required this.deviceId,
    required this.deviceModel,
    required this.osVersion,
    required this.lastSync,
  });
}
