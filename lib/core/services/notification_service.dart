import 'package:flutter_riverpod/flutter_riverpod.dart';

class NotificationService {
  Future<void> sendLocalNotification({required String title, required String body}) async {
    // Stub for local notifications using flutter_local_notifications
    print('NOTIFICATION: $title - $body');
  }

  Future<void> syncPushNotificationToken() async {
    // Stub for Firebase Cloud Messaging token sync
  }
}

final notificationServiceProvider = Provider<NotificationService>((ref) {
  return NotificationService();
});
