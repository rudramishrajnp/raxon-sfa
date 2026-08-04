import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/expense_approval_models.dart';

class ExpenseApprovalApiService {
  Future<List<ExpenseSubmissionModel>> getExpenseSubmissions(String managerId, {Map<String, dynamic>? filters}) async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data); // Simulate network

    return [
      ExpenseSubmissionModel(
        id: 'EXP-001',
        claimNumber: 'CLM-202310-001',
        employeeId: 'EMP-001',
        employeeName: 'Rajesh Kumar',
        employeeCode: 'RK001',
        hq: 'Mumbai',
        date: DateTime.now().subtract(const Duration(days: 1)),
        dcrReference: 'DCR-001',
        mtpReference: 'MTP-Oct-001',
        taAmount: 1500.0,
        daAmount: 500.0,
        miscAmount: 200.0,
        claimedAmount: 2200.0,
        expenseCategories: ['Travel', 'Food', 'Stationery'],
        uploadedBills: [
          ExpenseBillModel(id: 'B001', url: 'https://via.placeholder.com/600x800.png?text=Taxi+Receipt', type: 'image', description: 'Taxi Receipt'),
          ExpenseBillModel(id: 'B002', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', description: 'Hotel Bill'),
        ],
        status: 'Pending Approval',
        hasHighExpenseFlag: true,
        configuredLimit: 1500.0,
        employeeJustification: 'Had to take premium cab due to heavy rain and strike.',
        expenseLat: 19.1136,
        expenseLng: 72.8697,
        expenseTime: DateTime.now().subtract(const Duration(days: 1, hours: 5)),
        distanceFromRoute: 500.0,
        isSuspiciousLocation: true,
        syncStatus: 'Synced',
        auditTrail: [
          ExpenseAuditLogModel(action: 'Submitted', byUser: 'Rajesh Kumar', timestamp: DateTime.now().subtract(const Duration(days: 1, hours: 2))),
        ],
      ),
      ExpenseSubmissionModel(
        id: 'EXP-002',
        claimNumber: 'CLM-202310-002',
        employeeId: 'EMP-002',
        employeeName: 'Sunita Patel',
        employeeCode: 'SP002',
        hq: 'Pune',
        date: DateTime.now().subtract(const Duration(days: 2)),
        dcrReference: 'DCR-002',
        mtpReference: 'MTP-Oct-002',
        taAmount: 300.0,
        daAmount: 400.0,
        miscAmount: 0.0,
        claimedAmount: 700.0,
        expenseCategories: ['Travel', 'Food'],
        uploadedBills: [
          ExpenseBillModel(id: 'B003', url: 'https://via.placeholder.com/600x800.png?text=Bus+Ticket', type: 'image', description: 'Bus Ticket'),
        ],
        status: 'Partially Approved',
        approvedAmount: 600.0,
        hasHighExpenseFlag: false,
        expenseLat: 18.5204,
        expenseLng: 73.8567,
        expenseTime: DateTime.now().subtract(const Duration(days: 2, hours: 4)),
        distanceFromRoute: 50.0,
        isSuspiciousLocation: false,
        syncStatus: 'Synced',
        auditTrail: [
          ExpenseAuditLogModel(action: 'Submitted', byUser: 'Sunita Patel', timestamp: DateTime.now().subtract(const Duration(days: 2, hours: 3))),
          ExpenseAuditLogModel(action: 'Partially Approved', byUser: 'Amit Singh', timestamp: DateTime.now().subtract(const Duration(days: 1)), remarks: 'Deducted 100 from DA due to policy limits.', adjustmentAmount: -100.0),
        ],
      ),
    ];
  }

  Future<void> updateExpenseStatus(String expenseId, String managerId, String action, String? remarks, double? adjustedAmount) async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data); // Simulate API call
  }
}

final expenseApprovalApiServiceProvider = Provider((ref) => ExpenseApprovalApiService());
