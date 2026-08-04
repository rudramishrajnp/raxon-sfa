import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/dashboard_repository.dart';
import '../models/dashboard_summary_model.dart';
import '../models/announcement_model.dart';
import '../../../../core/network/dio_client.dart';

class DashboardRepositoryImpl implements DashboardRepository {
  // ignore: unused_field
  final DioClient _dioClient;

  DashboardRepositoryImpl(this._dioClient);

  @override
  Future<DashboardSummaryModel> getDashboardSummary() async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));

    // Mock API Response
    return DashboardSummaryModel(
      isPunchedIn: true,
      punchInTime: DateTime.now().subtract(const Duration(hours: 3, minutes: 15)),
      workingDuration: const Duration(hours: 3, minutes: 15),
      mtpStatus: 'Approved',
      routeName: 'Downtown Metro Area',
      targetCalls: 12,
      completedCalls: 5,
      plannedDoctors: 10,
      visitedDoctors: 4,
      pendingDoctors: 6,
      samplesGiven: 12,
      ordersBooked: 24500.50,
      expensesToday: 450.00,
    );
  }

  @override
  Future<List<AnnouncementModel>> getLatestAnnouncements() async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 800));

    return [
      AnnouncementModel(
        id: '1',
        title: 'New Product Launch: Raxon-D3 Registration starting tomorrow.',
        date: DateTime.now().subtract(const Duration(days: 1)),
        priority: 'High',
        isRead: false,
      ),
      AnnouncementModel(
        id: '2',
        title: 'Submit your Q3 Expense Reports by Friday.',
        date: DateTime.now().subtract(const Duration(days: 2)),
        priority: 'Normal',
        isRead: true,
      ),
    ];
  }
  
  @override
  Future<void> punchIn() async {
    await Future.delayed(const Duration(seconds: 1));
  }
  
  @override
  Future<void> punchOut() async {
    await Future.delayed(const Duration(seconds: 1));
  }
}

final dashboardRepositoryProvider = Provider<DashboardRepository>((ref) {
  // Utilizing the Dio implementation created earlier
  return DashboardRepositoryImpl(ref.watch(dioProvider) as DioClient);
});
