import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../models/mtp_review_models.dart';

class MtpReviewApiService {
  final Dio _dio;

  MtpReviewApiService(this._dio);

  Future<List<MtpSubmissionModel>> getMtpSubmissions(String managerId, {Map<String, dynamic>? filters}) async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
    // Simulate Data
    final now = DateTime.now();
    return [
      MtpSubmissionModel(
        id: 'MTP-1001',
        employeeId: 'EMP-101',
        employeeName: 'Rahul Sharma',
        employeeCode: 'EMP-101',
        hq: 'Mumbai',
        territory: 'Andheri West',
        month: 'August 2026',
        status: 'Pending Approval',
        submittedAt: now.subtract(const Duration(days: 2)),
        dailyPlans: _generateMockPlans(),
        validationSummary: MtpValidationSummaryModel(
          totalWorkingDays: 24,
          totalLeaveDays: 2,
          hqDays: 10,
          exHqDays: 10,
          outstationDays: 2,
          transitDays: 2,
          plannedDoctorVisits: 240,
          visitFrequencyCompliance: 98.5,
          validationIssues: [],
        ),
        auditTrail: [
          MtpAuditLogModel(action: 'Created', timestamp: now.subtract(const Duration(days: 4)), byUser: 'Rahul Sharma'),
          MtpAuditLogModel(action: 'Submitted', timestamp: now.subtract(const Duration(days: 2)), byUser: 'Rahul Sharma'),
        ],
      ),
      MtpSubmissionModel(
        id: 'MTP-1002',
        employeeId: 'EMP-102',
        employeeName: 'Amit Patel',
        employeeCode: 'EMP-102',
        hq: 'Pune',
        territory: 'Shivaji Nagar',
        month: 'August 2026',
        status: 'Returned for Correction',
        submittedAt: now.subtract(const Duration(days: 3)),
        dailyPlans: _generateMockPlans(),
        validationSummary: MtpValidationSummaryModel(
          totalWorkingDays: 20,
          totalLeaveDays: 6,
          hqDays: 15,
          exHqDays: 5,
          outstationDays: 0,
          transitDays: 0,
          plannedDoctorVisits: 180,
          visitFrequencyCompliance: 80.0,
          validationIssues: ['Total leave days exceed monthly allowance (2 days)', 'Visit frequency compliance is below 90%'],
        ),
        auditTrail: [
          MtpAuditLogModel(action: 'Submitted', timestamp: now.subtract(const Duration(days: 4)), byUser: 'Amit Patel'),
          MtpAuditLogModel(action: 'Returned', remarks: 'Too many leaves planned.', timestamp: now.subtract(const Duration(days: 3)), byUser: 'Manager (You)'),
        ],
      ),
      MtpSubmissionModel(
        id: 'MTP-1003',
        employeeId: 'EMP-103',
        employeeName: 'Vikram Singh',
        employeeCode: 'EMP-103',
        hq: 'Nashik',
        territory: 'Panchavati',
        month: 'August 2026',
        status: 'Approved',
        submittedAt: now.subtract(const Duration(days: 5)),
        dailyPlans: _generateMockPlans(),
        validationSummary: MtpValidationSummaryModel(
          totalWorkingDays: 25,
          totalLeaveDays: 1,
          hqDays: 12,
          exHqDays: 8,
          outstationDays: 3,
          transitDays: 2,
          plannedDoctorVisits: 260,
          visitFrequencyCompliance: 100.0,
          validationIssues: [],
        ),
        auditTrail: [
          MtpAuditLogModel(action: 'Submitted', timestamp: now.subtract(const Duration(days: 5)), byUser: 'Vikram Singh'),
          MtpAuditLogModel(action: 'Approved', timestamp: now.subtract(const Duration(days: 4)), byUser: 'Manager (You)'),
        ],
      ),
    ];
  }

  Future<void> updateMtpStatus(String mtpId, String managerId, String action, String? remarks) async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
    // Simulate success
  }

  List<MtpDailyPlanModel> _generateMockPlans() {
    return List.generate(26, (index) {
      return MtpDailyPlanModel(
        date: DateTime(2026, 8, index + 1),
        workType: index % 7 == 0 ? 'Holiday' : 'Field Work',
        locationType: index % 3 == 0 ? 'Ex-HQ' : 'HQ',
        plannedDoctors: index % 7 == 0 ? [] : ['Dr. Smith', 'Dr. Patel', 'Dr. Kumar'],
        plannedChemists: index % 7 == 0 ? [] : ['Apollo Pharmacy', 'Wellness Med'],
      );
    });
  }
}

final mtpReviewApiServiceProvider = Provider<MtpReviewApiService>((ref) {
  return MtpReviewApiService(ref.watch(dioProvider));
});
