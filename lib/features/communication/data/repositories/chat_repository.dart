import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../models/communication_models.dart';

abstract class ChatRepository {
  Future<List<ChatRoomModel>> getChatRooms();
  Future<List<ChatMessageModel>> getMessages(String roomId);
  Future<void> sendMessage(ChatMessageModel message);
}

class ChatRepositoryImpl implements ChatRepository {
  final Dio _dio;

  ChatRepositoryImpl(this._dio);

  final List<ChatRoomModel> _mockRooms = [
    ChatRoomModel(
      id: 'r1',
      name: 'North Region Team',
      type: 'regional',
      lastMessage: 'Let us hit the targets!',
      lastMessageTime: DateTime.now().subtract(const Duration(minutes: 5)),
      unreadCount: 3,
    ),
    ChatRoomModel(
      id: 'r2',
      name: 'John Doe (AM)',
      type: 'one_to_one',
      lastMessage: 'Have you visited Dr. Smith?',
      lastMessageTime: DateTime.now().subtract(const Duration(hours: 2)),
      unreadCount: 0,
    ),
  ];

  final Map<String, List<ChatMessageModel>> _mockMessages = {
    'r1': [],
    'r2': [],
  };

  @override
  Future<List<ChatRoomModel>> getChatRooms() async {
    try {
      final response = await _dio.get('/chat/groups');
      if (response.data != null && response.data is List) {
        final list = response.data as List;
        return list.map((item) {
          return ChatRoomModel(
            id: item['id']?.toString() ?? 'r1',
            name: item['name'] ?? 'Group Chat',
            type: item['type'] ?? 'group',
            lastMessage: item['last_message'],
            lastMessageTime: item['updated_at'] != null ? DateTime.tryParse(item['updated_at'].toString()) : DateTime.now(),
            unreadCount: item['unread_count'] ?? 0,
          );
        }).toList();
      }
    } catch (_) {}
    return _mockRooms;
  }

  @override
  Future<List<ChatMessageModel>> getMessages(String roomId) async {
    try {
      final response = await _dio.get('/chat/messages/$roomId');
      if (response.data != null && response.data is List) {
        final list = response.data as List;
        return list.map((item) {
          return ChatMessageModel(
            id: item['id']?.toString() ?? 'msg1',
            roomId: roomId,
            senderId: item['sender_id']?.toString() ?? 'user1',
            type: 'text',
            text: item['message'] ?? item['content'] ?? '',
            timestamp: item['created_at'] != null ? DateTime.tryParse(item['created_at'].toString()) ?? DateTime.now() : DateTime.now(),
          );
        }).toList();
      }
    } catch (_) {}
    return _mockMessages[roomId] ?? [];
  }

  @override
  Future<void> sendMessage(ChatMessageModel message) async {
    try {
      await _dio.post('/chat/message', data: {
        'groupId': message.roomId,
        'message': message.text,
      });
    } catch (_) {}
    if (!_mockMessages.containsKey(message.roomId)) {
      _mockMessages[message.roomId] = [];
    }
    _mockMessages[message.roomId]!.add(message);
  }
}

final chatRepositoryProvider = Provider<ChatRepository>((ref) {
  return ChatRepositoryImpl(ref.watch(dioProvider));
});
