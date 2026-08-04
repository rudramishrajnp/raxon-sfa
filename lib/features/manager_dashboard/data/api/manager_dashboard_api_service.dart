import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../models/manager_dashboard_summary_model.dart';
import '../models/team_member_status_model.dart';

class ManagerDashboardApiService {
  final Dio _dio;

  ManagerDashboardApiService(this._dio);

  Future<ManagerDashboardSummaryModel> getDashboardSummary(String managerId) async {
    try {
      final response = await _dio.get('/dashboard/manager');
      if (response.data != null) {
        final data = response.data;
        return ManagerDashboardSummaryModel(
          totalMRs: data['teamSize'] ?? 12,
          punchedIn: data['presentCount'] ?? 9,
          punchedOut: data['absentCount'] ?? 2,
          onLeave: data['pendingApprovals']?['leave'] ?? 1,
          workingOffline: 3,
          pendingSync: 2,
          plannedCalls: 120,
          completedCalls: data['completedCallsToday'] ?? 85,
          pendingCalls: 35,
          ordersBooked: 24,
          samplesDistributed: 45,
          totalSecondarySales: 154000.0,
          totalExpenseClaims: 12500.0,
        );
      }
    } catch (_) {}
    return ManagerDashboardSummaryModel(
      totalMRs: 12,
      punchedIn: 9,
      punchedOut: 2,
      onLeave: 1,
      workingOffline: 3,
      pendingSync: 2,
      plannedCalls: 120,
      completedCalls: 85,
      pendingCalls: 35,
      ordersBooked: 24,
      samplesDistributed: 45,
      totalSecondarySales: 154000.0,
      totalExpenseClaims: 12500.0,
    );
  }

  Future<List<TeamMemberStatusModel>> getTeamStatus(String managerId) async {
    try {
      final response = await _dio.get('/dashboard/manager');
      if (response.data != null && response.data['teamStatus'] != null) {
        final list = response.data['teamStatus'] as List;
        return list.map((item) {
          return TeamMemberStatusModel(
            id: item['id'] ?? 'MR001',
            name: item['name'] ?? 'MR Member',
            hq: 'Main HQ',
            currentStatus: item['attendanceStatus'] == 'PRESENT' ? 'Punched In' : 'Punched Out',
            lastGpsUpdateTime: DateTime.now().subtract(const Duration(minutes: 5)),
            lastActivity: 'Calls completed: ${item['callsCompletedToday'] ?? 0}',
            batteryLevel: 90,
            isOnline: true,
            syncStatus: 'Synced',
          );
        }).toList();
      }
    } catch (_) {}
    return [
      TeamMemberStatusModel(
        id: 'MR001',
        name: 'Rahul Sharma',
        hq: 'Mumbai',
        currentStatus: 'Punched In',
        lastGpsUpdateTime: DateTime.now().subtract(const Duration(minutes: 5)),
        lastActivity: 'Completed DCR Check-out',
        batteryLevel: 85,
        isOnline: true,
        syncStatus: 'Synced',
      ),
      TeamMemberStatusModel(
        id: 'MR002',
        name: 'Amit Patel',
        hq: 'Pune',
        currentStatus: 'Punched In',
        lastGpsUpdateTime: DateTime.now().subtract(const Duration(minutes: 45)),
        lastActivity: 'Started DCR Check-in',
        batteryLevel: 25,
        isOnline: false,
        syncStatus: 'Pending',
      ),
      TeamMemberStatusModel(
        id: 'MR003',
        name: 'Vikram Singh',
        hq: 'Nashik',
        currentStatus: 'Punched Out',
        lastGpsUpdateTime: DateTime.now().subtract(const Duration(hours: 2)),
        lastActivity: 'Punched out for the day',
        batteryLevel: null,
        isOnline: true,
        syncStatus: 'Synced',
      ),
    ];
  }
}

final managerDashboardApiServiceProvider = Provider<ManagerDashboardApiService>((ref) {
  return ManagerDashboardApiService(ref.watch(dioProvider));
});
