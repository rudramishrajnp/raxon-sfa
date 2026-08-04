import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/logger_service.dart';
import '../storage/local_storage_service.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print("Handling a background message: ${message.messageId}");
}

class FirebaseMessagingService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotificationsPlugin = FlutterLocalNotificationsPlugin();
  final LoggerService _logger;
  final LocalStorageService _localStorage;

  FirebaseMessagingService(this._logger, this._localStorage);

  Future<void> initialize() async {
    try {
      // await Firebase.initializeApp();
      
      FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

      // Request permissions
      NotificationSettings settings = await _messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
        provisional: false,
      );

      _logger.info('User granted permission: ${settings.authorizationStatus}');

      // Initialize local notifications for foreground display
      const androidInitialize = AndroidInitializationSettings('@mipmap/ic_launcher');
      const darwinInitialize = DarwinInitializationSettings(
        requestAlertPermission: true,
        requestBadgePermission: true,
        requestSoundPermission: true,
      );
      const initializationSettings = InitializationSettings(
        android: androidInitialize,
        iOS: darwinInitialize,
      );
      
      await _localNotificationsPlugin.initialize(
        initializationSettings,
        onDidReceiveNotificationResponse: _onNotificationTapped,
      );

      // Create high importance channel for Android
      const AndroidNotificationChannel channel = AndroidNotificationChannel(
        'high_importance_channel', 
        'High Importance Notifications', 
        description: 'This channel is used for important notifications.', 
        importance: Importance.high,
      );

      await _localNotificationsPlugin
          .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
          ?.createNotificationChannel(channel);

      _setupMessageHandlers(channel);

      // Get initial token
      final token = await _messaging.getToken();
      if (token != null) {
        _logger.info('FCM Token: $token');
        await _saveToken(token);
      }

      // Listen for token refresh
      _messaging.onTokenRefresh.listen((newToken) {
        _logger.info('FCM Token refreshed: $newToken');
        _saveToken(newToken);
      });

    } catch (e) {
      _logger.error('Failed to initialize Firebase Messaging', e);
    }
  }

  void _setupMessageHandlers(AndroidNotificationChannel channel) {
    // Foreground messages
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      _logger.info('Received foreground message: ${message.messageId}');
      
      if (_shouldMuteNotification()) {
        _logger.info('Notification muted due to Off-Duty Mode.');
        // Still save it to local DB but don't show prompt
        return;
      }

      RemoteNotification? notification = message.notification;
      AndroidNotification? android = message.notification?.android;

      if (notification != null && android != null) {
        _localNotificationsPlugin.show(
          notification.hashCode,
          notification.title,
          notification.body,
          NotificationDetails(
            android: AndroidNotificationDetails(
              channel.id,
              channel.name,
              channelDescription: channel.description,
              icon: '@mipmap/ic_launcher',
              importance: Importance.high,
              priority: Priority.high,
            ),
            iOS: const DarwinNotificationDetails(
              presentAlert: true,
              presentBadge: true,
              presentSound: true,
            ),
          ),
          payload: message.data['route'],
        );
      }
    });

    // Handle background/terminated message open
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      _logger.info('Message opened from background state: ${message.messageId}');
      _handleNavigation(message.data['route']);
    });
  }

  bool _shouldMuteNotification() {
    // Logic for Part 9 - Off-Duty Mode
    // Check local storage for "is_off_duty" or "leave_approved"
    // Return false if it's an emergency alert
    final isOffDuty = _localStorage.getBool('is_off_duty') ?? false;
    return isOffDuty;
  }

  Future<void> _saveToken(String token) async {
    await _localStorage.saveString('fcm_token', token);
    // Trigger sync to backend
  }

  void _onNotificationTapped(NotificationResponse response) {
    if (response.payload != null) {
      _handleNavigation(response.payload!);
    }
  }

  void _handleNavigation(String? route) {
    // Navigate via global router or broadcast event
  }

  Future<void> subscribeToTopic(String topic) async {
    await _messaging.subscribeToTopic(topic);
    _logger.info('Subscribed to topic: $topic');
  }

  Future<void> unsubscribeFromTopic(String topic) async {
    await _messaging.unsubscribeFromTopic(topic);
    _logger.info('Unsubscribed from topic: $topic');
  }
}

final firebaseMessagingProvider = Provider<FirebaseMessagingService>((ref) {
  return FirebaseMessagingService(
    ref.watch(loggerServiceProvider),
    ref.watch(localStorageProvider),
  );
});
