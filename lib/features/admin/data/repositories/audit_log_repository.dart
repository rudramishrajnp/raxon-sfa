import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/audit_log_models.dart';

abstract class AuditLogRepository {
  Future<List<AuditLogModel>> getAuditLogs();
  Future<List<LoginHistoryModel>> getLoginHistory();
  Future<List<DeviceHistoryModel>> getDeviceHistory();
}

class AuditLogRepositoryImpl implements AuditLogRepository {
  @override
  Future<List<AuditLogModel>> getAuditLogs() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return [
      AuditLogModel(
        id: 'a1',
        action: 'UPDATE_PRICING',
        entityType: 'ProductPricing',
        entityId: 'p1',
        userId: 'u1',
        userName: 'Admin User',
        timestamp: DateTime.now().subtract(const Duration(hours: 1)),
        details: 'Updated MRP to 120.0',
      ),
    ];
  }

  @override
  Future<List<LoginHistoryModel>> getLoginHistory() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return [
      LoginHistoryModel(
        id: 'l1',
        userId: 'u2',
        userName: 'John Doe',
        loginTime: DateTime.now().subtract(const Duration(hours: 2)),
        ipAddress: '192.168.1.5',
        deviceName: 'Samsung S21',
        isSuccess: true,
      ),
    ];
  }

  @override
  Future<List<DeviceHistoryModel>> getDeviceHistory() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return [
      DeviceHistoryModel(
        id: 'd1',
        userId: 'u2',
        userName: 'John Doe',
        deviceId: 'DEV-998877',
        deviceModel: 'Samsung S21',
        osVersion: 'Android 13',
        lastSync: DateTime.now().subtract(const Duration(minutes: 15)),
      ),
    ];
  }
}

final auditLogRepositoryProvider = Provider<AuditLogRepository>((ref) {
  return AuditLogRepositoryImpl();
});
