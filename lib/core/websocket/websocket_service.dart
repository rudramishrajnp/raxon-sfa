import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../services/logger_service.dart';
import '../network/token_manager.dart';

class WebSocketService {
  final LoggerService _logger;
  final TokenManager _tokenManager;
  IO.Socket? _socket;
  bool _isConnected = false;

  final _messageController = StreamController<Map<String, dynamic>>.broadcast();
  final _typingController = StreamController<Map<String, dynamic>>.broadcast();
  final _presenceController = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get onMessage => _messageController.stream;
  Stream<Map<String, dynamic>> get onTyping => _typingController.stream;
  Stream<Map<String, dynamic>> get onPresence => _presenceController.stream;

  WebSocketService(this._logger, this._tokenManager);

  bool get isConnected => _isConnected;

  Future<void> connect(String baseUrl) async {
    if (_socket != null && _socket!.connected) return;

    final token = await _tokenManager.getAccessToken();
    if (token == null) {
      _logger.warning('Cannot connect WebSocket: No auth token');
      return;
    }

    _socket = IO.io(baseUrl, IO.OptionBuilder()
        .setTransports(['websocket'])
        .enableAutoConnect()
        .enableReconnection()
        .setExtraHeaders({'Authorization': 'Bearer $token'})
        .build()
    );

    _socket!.onConnect((_) {
      _isConnected = true;
      _logger.info('WebSocket Connected');
    });

    _socket!.onDisconnect((_) {
      _isConnected = false;
      _logger.info('WebSocket Disconnected');
    });

    _socket!.onError((error) {
      _logger.error('WebSocket Error', error);
    });

    // Chat Events
    _socket!.on('new_message', (data) {
      _messageController.add(data);
    });

    _socket!.on('typing', (data) {
      _typingController.add(data);
    });

    _socket!.on('presence', (data) {
      _presenceController.add(data);
    });
  }

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
    _isConnected = false;
  }

  void sendMessage(String roomId, String message, {String? type = 'text', String? attachmentUrl}) {
    if (_isConnected) {
      _socket!.emit('send_message', {
        'roomId': roomId,
        'message': message,
        'type': type,
        'attachmentUrl': attachmentUrl,
        'timestamp': DateTime.now().toIso8601String(),
      });
    } else {
      // Add to offline queue
    }
  }

  void sendTypingEvent(String roomId, bool isTyping) {
    if (_isConnected) {
      _socket!.emit('typing_event', {
        'roomId': roomId,
        'isTyping': isTyping,
      });
    }
  }

  void markAsRead(String messageId, String roomId) {
    if (_isConnected) {
      _socket!.emit('mark_read', {
        'messageId': messageId,
        'roomId': roomId,
      });
    }
  }

  void dispose() {
    disconnect();
    _messageController.close();
    _typingController.close();
    _presenceController.close();
  }
}

final webSocketServiceProvider = Provider<WebSocketService>((ref) {
  return WebSocketService(
    ref.watch(loggerServiceProvider),
    ref.watch(tokenManagerProvider),
  );
});
