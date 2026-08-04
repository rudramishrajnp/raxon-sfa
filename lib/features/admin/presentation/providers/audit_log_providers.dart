import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/audit_log_models.dart';
import '../../data/repositories/audit_log_repository.dart';

final auditLogsProvider = FutureProvider.autoDispose<List<AuditLogModel>>((ref) async {
  final repo = ref.watch(auditLogRepositoryProvider);
  return repo.getAuditLogs();
});

final loginHistoryProvider = FutureProvider.autoDispose<List<LoginHistoryModel>>((ref) async {
  final repo = ref.watch(auditLogRepositoryProvider);
  return repo.getLoginHistory();
});

final deviceHistoryProvider = FutureProvider.autoDispose<List<DeviceHistoryModel>>((ref) async {
  final repo = ref.watch(auditLogRepositoryProvider);
  return repo.getDeviceHistory();
});
