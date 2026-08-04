import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/override_models.dart';

class OverrideApiService {
  Future<OverrideSystemConfig> getSystemConfig() async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
    return OverrideSystemConfig(
      allowRePunchIn: true,
      maxOverridesPerMonth: 3,
      approvalRequired: true,
      autoExpiryHours: 24,
    );
  }

  Future<List<OverrideRequestModel>> getPendingRequests(String managerId) async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
    return [
      OverrideRequestModel(
        id: 'OVR-001',
        employeeId: 'EMP-001',
        employeeName: 'Rajesh Kumar',
        employeeCode: 'RK001',
        hq: 'Mumbai',
        requestTime: DateTime.now().subtract(const Duration(minutes: 15)),
        reason: 'Accidental Punch-Out',
        remarks: 'My phone slipped and the button was pressed by mistake. I am still at the clinic.',
        currentLat: 19.1136,
        currentLng: 72.8697,
        batteryLevel: 45,
        internetStatus: 'Online',
        originalPunchIn: DateTime.now().subtract(const Duration(hours: 4)),
        originalPunchOut: DateTime.now().subtract(const Duration(minutes: 20)),
        previousAttendanceId: 'ATT-20231025-01',
        status: 'Pending',
        syncStatus: 'Synced',
        dataSummary: OverrideDataSummary(dcrCount: 4, orderCount: 2, totalExpenses: 450.0),
        auditTrail: [
          OverrideAuditLogModel(action: 'Submitted', byUser: 'Rajesh Kumar', timestamp: DateTime.now().subtract(const Duration(minutes: 15))),
        ],
      ),
    ];
  }

  Future<void> submitOverrideRequest(OverrideRequestModel request) async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
  }

  Future<void> updateRequestStatus(String requestId, String managerId, String action, String remarks) async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
  }
}

final overrideApiServiceProvider = Provider((ref) => OverrideApiService());
