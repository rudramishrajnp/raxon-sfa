import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/communication_models.dart';
import '../../data/repositories/notification_repository.dart';
import '../../data/repositories/chat_repository.dart';

final notificationsProvider = FutureProvider.autoDispose<List<NotificationModel>>((ref) async {
  final repo = ref.watch(notificationRepositoryProvider);
  return repo.getNotifications();
});

final unreadNotificationCountProvider = FutureProvider.autoDispose<int>((ref) async {
  final repo = ref.watch(notificationRepositoryProvider);
  return repo.getUnreadCount();
});

class ChatRoomsNotifier extends StateNotifier<AsyncValue<List<ChatRoomModel>>> {
  final ChatRepository _repository;

  ChatRoomsNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadRooms();
  }

  Future<void> loadRooms() async {
    try {
      final rooms = await _repository.getChatRooms();
      state = AsyncValue.data(rooms);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final chatRoomsProvider = StateNotifierProvider<ChatRoomsNotifier, AsyncValue<List<ChatRoomModel>>>((ref) {
  return ChatRoomsNotifier(ref.watch(chatRepositoryProvider));
});

class ChatMessagesNotifier extends StateNotifier<AsyncValue<List<ChatMessageModel>>> {
  final ChatRepository _repository;
  final String _roomId;

  ChatMessagesNotifier(this._repository, this._roomId) : super(const AsyncValue.loading()) {
    loadMessages();
  }

  Future<void> loadMessages() async {
    try {
      final msgs = await _repository.getMessages(_roomId);
      state = AsyncValue.data(msgs);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> sendMessage(ChatMessageModel message) async {
    try {
      await _repository.sendMessage(message);
      // Optimistic update
      if (state.hasValue) {
        state = AsyncValue.data([...state.value!, message]);
      } else {
        state = AsyncValue.data([message]);
      }
    } catch (e) {
      // Handle error
    }
  }
}

final chatMessagesProvider = StateNotifierProvider.family<ChatMessagesNotifier, AsyncValue<List<ChatMessageModel>>, String>((ref, roomId) {
  return ChatMessagesNotifier(ref.watch(chatRepositoryProvider), roomId);
});
