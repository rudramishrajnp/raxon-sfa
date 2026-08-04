import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/holiday_broadcast_models.dart';

abstract class HolidayBroadcastRepository {
  Future<List<HolidayModel>> getHolidays();
  Future<void> addHoliday(HolidayModel holiday);
  Future<void> updateHoliday(HolidayModel holiday);
  Future<void> deleteHoliday(String id);

  Future<List<BroadcastMessageModel>> getBroadcasts();
  Future<void> createBroadcast(BroadcastMessageModel broadcast);
  
  Future<DeliveryTrackingModel?> getDeliveryTracking(String broadcastId);

  Future<List<NotificationTemplateModel>> getTemplates();
}

class HolidayBroadcastRepositoryImpl implements HolidayBroadcastRepository {
  final List<HolidayModel> _mockHolidays = [
    HolidayModel(
      id: 'h1',
      name: 'Diwali',
      type: 'Festival',
      date: DateTime(2023, 11, 12),
      status: 'Active',
      description: 'Festival of lights',
    ),
  ];

  final List<BroadcastMessageModel> _mockBroadcasts = [
    BroadcastMessageModel(
      id: 'b1',
      title: 'Monthly Sales Meeting',
      body: 'Please join the monthly sales meeting tomorrow at 10 AM.',
      category: 'Meeting Notice',
      targetAudience: 'All MRs',
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
      createdBy: 'Admin User',
    ),
  ];

  final List<NotificationTemplateModel> _mockTemplates = [
    NotificationTemplateModel(
      id: 't1',
      name: 'Meeting Reminder',
      titleTemplate: 'Reminder: {Meeting Name}',
      bodyTemplate: 'Please do not forget to attend the {Meeting Name} at {Time}.',
      category: 'Meeting',
    ),
  ];

  final Map<String, DeliveryTrackingModel> _mockTracking = {
    'b1': DeliveryTrackingModel(
      broadcastId: 'b1',
      totalSent: 150,
      totalDelivered: 145,
      totalRead: 130,
      totalAcknowledged: 100,
      totalFailed: 5,
    ),
  };

  @override
  Future<List<HolidayModel>> getHolidays() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _mockHolidays.toList();
  }

  @override
  Future<void> addHoliday(HolidayModel holiday) async {
    await Future.delayed(const Duration(milliseconds: 200));
    _mockHolidays.add(holiday);
  }

  @override
  Future<void> updateHoliday(HolidayModel holiday) async {
    await Future.delayed(const Duration(milliseconds: 200));
    final index = _mockHolidays.indexWhere((h) => h.id == holiday.id);
    if (index != -1) {
      _mockHolidays[index] = holiday;
    }
  }

  @override
  Future<void> deleteHoliday(String id) async {
    await Future.delayed(const Duration(milliseconds: 200));
    _mockHolidays.removeWhere((h) => h.id == id);
  }

  @override
  Future<List<BroadcastMessageModel>> getBroadcasts() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _mockBroadcasts.toList();
  }

  @override
  Future<void> createBroadcast(BroadcastMessageModel broadcast) async {
    await Future.delayed(const Duration(milliseconds: 200));
    _mockBroadcasts.add(broadcast);
    _mockTracking[broadcast.id] = DeliveryTrackingModel(
      broadcastId: broadcast.id,
      totalSent: 0,
      totalDelivered: 0,
      totalRead: 0,
      totalAcknowledged: 0,
      totalFailed: 0,
    );
  }

  @override
  Future<DeliveryTrackingModel?> getDeliveryTracking(String broadcastId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _mockTracking[broadcastId];
  }

  @override
  Future<List<NotificationTemplateModel>> getTemplates() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _mockTemplates.toList();
  }
}

final holidayBroadcastRepositoryProvider = Provider<HolidayBroadcastRepository>((ref) {
  return HolidayBroadcastRepositoryImpl();
});
