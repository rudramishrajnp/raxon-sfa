import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/dcr_review_models.dart';

class DcrReviewApiService {
  Future<List<DcrSubmissionModel>> getDcrSubmissions(String managerId, {Map<String, dynamic>? filters}) async {
    // Simulate network delay
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);

    return [
      DcrSubmissionModel(
        id: 'DCR-001',
        employeeId: 'EMP-001',
        employeeName: 'Rajesh Kumar',
        employeeCode: 'RK001',
        hq: 'Mumbai',
        territory: 'Andheri',
        date: DateTime.now(),
        doctorName: 'Dr. Anil Sharma',
        chemistName: 'Apollo Pharmacy',
        callStatus: 'Completed',
        syncStatus: 'Synced',
        isJointWork: false,
        isDeviation: true,
        deviationReason: 'Doctor requested urgent visit.',
        checkInTime: DateTime.now().subtract(const Duration(hours: 2)),
        checkOutTime: DateTime.now().subtract(const Duration(hours: 1, minutes: 45)),
        visitDurationMinutes: 15,
        checkInDistance: 12.5,
        checkOutDistance: 15.0,
        gpsAccuracy: 8.5,
        outsideGeofence: false,
        gpsOverrideUsed: false,
        samplesGiven: 'Sample A - 2 units',
        ordersBooked: '10 strips of Med X',
        prescriptionDetails: 'Rx Med X, Med Y',
        doctorFeedback: 'Positive response to new product.',
        competitorActivity: 'Competitor Z launching similar drug.',
        reviewStatus: 'Pending',
        clinicLat: 19.1136,
        clinicLng: 72.8697,
        checkInLat: 19.1137,
        checkInLng: 72.8698,
        checkOutLat: 19.1138,
        checkOutLng: 72.8699,
        auditTrail: [
          DcrAuditLogModel(action: 'Submitted', byUser: 'Rajesh Kumar', timestamp: DateTime.now().subtract(const Duration(hours: 1))),
        ]
      ),
      DcrSubmissionModel(
        id: 'DCR-002',
        employeeId: 'EMP-002',
        employeeName: 'Sunita Patel',
        employeeCode: 'SP002',
        hq: 'Pune',
        territory: 'Shivaji Nagar',
        date: DateTime.now(),
        doctorName: 'Dr. Vivek Desai',
        chemistName: 'Wellness Chemist',
        callStatus: 'Completed',
        syncStatus: 'Synced',
        isJointWork: true,
        jointManagerName: 'Amit Singh',
        isDeviation: false,
        checkInTime: DateTime.now().subtract(const Duration(hours: 4)),
        checkOutTime: DateTime.now().subtract(const Duration(hours: 3, minutes: 30)),
        visitDurationMinutes: 30,
        checkInDistance: 250.0,
        checkOutDistance: 300.0,
        gpsAccuracy: 45.0,
        outsideGeofence: true,
        gpsOverrideUsed: true,
        samplesGiven: 'None',
        ordersBooked: 'None',
        doctorFeedback: 'Discussed new clinical trials.',
        reviewStatus: 'Pending',
        clinicLat: 18.5204,
        clinicLng: 73.8567,
        checkInLat: 18.5224,
        checkInLng: 73.8587,
        checkOutLat: 18.5234,
        checkOutLng: 73.8597,
        auditTrail: [
          DcrAuditLogModel(action: 'Submitted', byUser: 'Sunita Patel', timestamp: DateTime.now().subtract(const Duration(hours: 2))),
        ]
      ),
    ];
  }

  Future<void> updateDcrStatus(String dcrId, String managerId, String action, String? remarks) async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
    // Simulate successful API call
  }
}

final dcrReviewApiServiceProvider = Provider((ref) => DcrReviewApiService());
