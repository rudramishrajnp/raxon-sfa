import 'dart:convert';
import 'package:drift/drift.dart' as drift;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/work_plan_repository.dart';
import '../api/work_plan_api_service.dart';
import '../../data/models/customer_model.dart';
import '../../data/models/deviation_model.dart';
import '../../data/models/joint_work_model.dart';
import '../../data/models/work_plan_summary_model.dart';
import '../../../../core/services/notification_service.dart';

class WorkPlanRepositoryImpl implements WorkPlanRepository {
  final WorkPlanApiService _apiService;
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;
  final NotificationService _notificationService;

  WorkPlanRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
    this._notificationService,
  );

  Future<void> _syncMasterData() async {
    final isConnected = await _connectivityService.isConnected();
    if (!isConnected) return;

    try {
      final doctors = await _apiService.fetchMasterDoctors();
      final chemists = await _apiService.fetchMasterChemists();

      final allCustomers = [...doctors, ...chemists];
      final companions = allCustomers.map((c) => CustomerTableCompanion.insert(
        id: c.id,
        name: c.name,
        type: c.type,
        classification: drift.Value(c.classification),
        status: const drift.Value('APPROVED'),
      )).toList();

      await _db.customerDao.insertCustomers(companions);
    } catch (e) {
      // Ignore sync error
    }
  }

  @override
  Future<WorkPlanSummaryModel> getTodaySummary(String employeeId) async {
    await _syncMasterData();
    
    final today = DateTime.now();
    final dateStr = "${today.year}-${today.month.toString().padLeft(2, '0')}-${today.day.toString().padLeft(2, '0')}";
    
    Map<String, dynamic>? todayPlan;
    String mtpStatus = 'DRAFT';

    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        final mtpData = await _apiService.fetchTodayMtpPlan(today);
        if (mtpData['mtp'] != null) {
          mtpStatus = mtpData['mtp']['status'] ?? 'DRAFT';
          final plans = mtpData['mtp']['dailyPlans'] as List?;
          if (plans != null) {
            todayPlan = plans.firstWhere((p) => (p['date'] as String).startsWith(dateStr), orElse: () => null);
          }
        }
      } catch (e) {
        // Fallback to local
      }
    }

    if (todayPlan == null) {
      final localMtps = await _db.mtpDao.getAllMtps();
      if (localMtps.isNotEmpty) {
        mtpStatus = localMtps.last.status;
      }
    }

    return WorkPlanSummaryModel(
      date: today,
      employeeName: 'Current User',
      employeeCode: employeeId,
      approvedRoute: 'N/A',
      hq: 'HQ',
      workType: todayPlan?['workType'] ?? 'Field Work',
      locationType: todayPlan?['locationType'] ?? 'Ex-HQ',
      plannedDoctorCount: (todayPlan?['doctorIds'] as List?)?.length ?? 0,
      plannedChemistCount: (todayPlan?['chemistIds'] as List?)?.length ?? 0,
      completedCalls: 0,
      pendingCalls: (todayPlan?['doctorIds'] as List?)?.length ?? 0,
      mtpStatus: mtpStatus,
    );
  }

  @override
  Future<List<CustomerModel>> getTodayCustomers(String employeeId) async {
    final today = DateTime.now();
    final dateStr = "${today.year}-${today.month.toString().padLeft(2, '0')}-${today.day.toString().padLeft(2, '0')}";
    
    final isConnected = await _connectivityService.isConnected();
    List<dynamic> doctorIds = [];
    List<dynamic> chemistIds = [];

    if (isConnected) {
      try {
        final mtpData = await _apiService.fetchTodayMtpPlan(today);
        if (mtpData['mtp'] != null) {
          final plans = mtpData['mtp']['dailyPlans'] as List?;
          if (plans != null) {
            final todayPlan = plans.firstWhere((p) => (p['date'] as String).startsWith(dateStr), orElse: () => null);
            if (todayPlan != null) {
              doctorIds = todayPlan['doctorIds'] ?? [];
              chemistIds = todayPlan['chemistIds'] ?? [];
            }
          }
        }
      } catch (e) {
        // Fallback to local
      }
    }

    final allLocalCustomers = await _db.customerDao.getAllCustomers();
    
    // Filter local customers matching today's plan
    final todayCustomers = allLocalCustomers.where((c) {
      if (c.type.toLowerCase() == 'doctor' && doctorIds.contains(c.id)) return true;
      if (c.type.toLowerCase() == 'chemist' && chemistIds.contains(c.id)) return true;
      return false;
    }).map((c) => CustomerModel(
      id: c.id,
      name: c.name,
      type: c.type,
      classification: c.classification,
      address: c.address,
      latitude: c.latitude,
      longitude: c.longitude,
      callStatus: 'PENDING',
    )).toList();

    return todayCustomers.isEmpty ? _getMockCustomers() : todayCustomers;
  }
  
  List<CustomerModel> _getMockCustomers() {
    return [
      CustomerModel(
        id: 'C1',
        name: 'Dr. Jane Smith',
        type: 'Doctor',
        specialty: 'Cardiologist',
        classification: 'A',
        address: '123 Heart Center',
        latitude: 37.7749,
        longitude: -122.4194,
        callStatus: 'COMPLETED',
        visitFrequencyStatus: '2/4',
        distanceFromCurrentLocation: 1.2,
      ),
      CustomerModel(
        id: 'C2',
        name: 'Dr. Albert Einstein',
        type: 'Doctor',
        specialty: 'Physician',
        classification: 'B',
        address: '456 Science Ave',
        latitude: 37.7849,
        longitude: -122.4094,
        callStatus: 'PENDING',
        visitFrequencyStatus: '0/2',
        distanceFromCurrentLocation: 3.4,
      ),
    ];
  }

  @override
  Future<List<CustomerModel>> searchAllCustomers(String query) async {
    final results = await _db.customerDao.searchCustomers(query);
    return results.map((c) => CustomerModel(
      id: c.id,
      name: c.name,
      type: c.type,
      classification: c.classification,
      address: c.address,
    )).toList();
  }

  @override
  Future<void> logDeviation(DeviationModel deviation) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        await _apiService.submitDeviation(deviation);
      } catch (e) {
        await _syncManager.enqueueOperation('Deviation', deviation.customerId ?? 'unknown', 'CREATE', jsonEncode(deviation.toJson()));
      }
    } else {
      await _syncManager.enqueueOperation('Deviation', deviation.customerId ?? 'unknown', 'CREATE', jsonEncode(deviation.toJson()));
    }
    await _notificationService.sendLocalNotification(title: 'Deviation Logged', body: 'MTP deviation has been recorded and managers notified.');
  }

  @override
  Future<void> submitJointWork(JointWorkModel jointWork) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        await _apiService.submitJointWork(jointWork);
      } catch (e) {
        await _syncManager.enqueueOperation('JointWork', jointWork.managerId, 'CREATE', jsonEncode(jointWork.toJson()));
      }
    } else {
      await _syncManager.enqueueOperation('JointWork', jointWork.managerId, 'CREATE', jsonEncode(jointWork.toJson()));
    }
    await _notificationService.sendLocalNotification(title: 'Joint Work', body: 'Joint work with ${jointWork.managerName} submitted.');
  }

  @override
  Future<CustomerModel> addCustomer(CustomerModel customer) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        await _apiService.addCustomer(customer);
      } catch (e) {
        await _syncManager.enqueueOperation('Customer', customer.id, 'CREATE', jsonEncode(customer.toJson()));
      }
    } else {
      await _syncManager.enqueueOperation('Customer', customer.id, 'CREATE', jsonEncode(customer.toJson()));
    }
    await _notificationService.sendLocalNotification(title: 'New Customer Submitted', body: 'Customer ${customer.name} submitted for approval.');
    return customer;
  }
}

final workPlanRepositoryProvider = Provider<WorkPlanRepository>((ref) {
  return WorkPlanRepositoryImpl(
    ref.watch(workPlanApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
    ref.watch(notificationServiceProvider),
  );
});
