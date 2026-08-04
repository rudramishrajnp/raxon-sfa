import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../models/communication_models.dart';

abstract class NotificationRepository {
  Future<List<NotificationModel>> getNotifications();
  Future<void> markAsRead(String id);
  Future<void> markAllAsRead();
  Future<void> deleteNotification(String id);
  Future<int> getUnreadCount();
}

class NotificationRepositoryImpl implements NotificationRepository {
  final Dio _dio;

  NotificationRepositoryImpl(this._dio);

  final List<NotificationModel> _mockData = [
    NotificationModel(
      id: '1',
      title: 'Company Announcement',
      body: 'Quarterly Townhall meeting scheduled for tomorrow at 10 AM.',
      type: 'broadcast',
      senderName: 'HR Department',
      createdAt: DateTime.now().subtract(const Duration(hours: 1)),
      priority: 'high',
    ),
    NotificationModel(
      id: '2',
      title: 'Expense Approved',
      body: 'Your expense claim #EXP-123 has been approved by Finance.',
      type: 'system',
      senderName: 'Finance System',
      createdAt: DateTime.now().subtract(const Duration(hours: 4)),
    ),
  ];

  @override
  Future<List<NotificationModel>> getNotifications() async {
    try {
      final response = await _dio.get('/notifications');
      if (response.data != null && response.data is List) {
        final list = response.data as List;
        return list.map((item) {
          return NotificationModel(
            id: item['id']?.toString() ?? DateTime.now().toString(),
            title: item['title'] ?? 'Notification',
            body: item['body'] ?? '',
            type: item['type'] ?? 'system',
            senderName: item['sender_name'] ?? 'System',
            createdAt: item['created_at'] != null ? DateTime.tryParse(item['created_at'].toString()) ?? DateTime.now() : DateTime.now(),
            priority: item['priority'] ?? 'normal',
            isRead: item['is_read'] ?? false,
          );
        }).toList();
      }
    } catch (_) {}
    _mockData.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return _mockData.toList();
  }

  @override
  Future<void> markAsRead(String id) async {
    try {
      await _dio.post('/notifications/read', data: {'notificationId': id});
    } catch (_) {}
    final index = _mockData.indexWhere((n) => n.id == id);
    if (index != -1) {
      _mockData[index] = _mockData[index].copyWith(isRead: true);
    }
  }

  @override
  Future<void> markAllAsRead() async {
    for (int i = 0; i < _mockData.length; i++) {
      markAsRead(_mockData[i].id);
    }
  }

  @override
  Future<void> deleteNotification(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _mockData.removeWhere((n) => n.id == id);
  }

  @override
  Future<int> getUnreadCount() async {
    try {
      final response = await _dio.get('/notifications/unread-count');
      if (response.data != null && response.data['count'] != null) {
        return (response.data['count'] as num).toInt();
      }
    } catch (_) {}
    return _mockData.where((n) => !n.isRead).length;
  }
}

final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  return NotificationRepositoryImpl(ref.watch(dioProvider));
});
