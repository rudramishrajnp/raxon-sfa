import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/communication_providers.dart';
import '../../data/repositories/notification_repository.dart';

class NotificationCenterScreen extends ConsumerWidget {
  const NotificationCenterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notificationsAsync = ref.watch(notificationsProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notification Center'),
        actions: [
          IconButton(
            icon: const Icon(Icons.done_all),
            tooltip: 'Mark all as read',
            onPressed: () async {
              await ref.read(notificationRepositoryProvider).markAllAsRead();
              ref.invalidate(notificationsProvider);
              ref.invalidate(unreadNotificationCountProvider);
            },
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            tooltip: 'Filter',
            onPressed: () {
              // Filter logic
            },
          ),
        ],
      ),
      body: notificationsAsync.when(
        data: (notifications) {
          if (notifications.isEmpty) {
            return const Center(child: Text('No notifications.'));
          }
          return ListView.builder(
            itemCount: notifications.length,
            itemBuilder: (context, index) {
              final notif = notifications[index];
              final isHighPriority = notif.priority == 'high';
              return Dismissible(
                key: Key(notif.id),
                direction: DismissDirection.endToStart,
                background: Container(
                  color: Colors.red,
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.only(right: 16),
                  child: const Icon(Icons.delete, color: Colors.white),
                ),
                onDismissed: (_) async {
                  await ref.read(notificationRepositoryProvider).deleteNotification(notif.id);
                  ref.invalidate(notificationsProvider);
                  ref.invalidate(unreadNotificationCountProvider);
                },
                child: ListTile(
                  tileColor: notif.isRead ? null : theme.colorScheme.primaryContainer.withOpacity(0.3),
                  leading: CircleAvatar(
                    backgroundColor: isHighPriority ? Colors.red.shade100 : theme.colorScheme.secondaryContainer,
                    child: Icon(
                      _getIconForType(notif.type),
                      color: isHighPriority ? Colors.red : theme.colorScheme.onSecondaryContainer,
                    ),
                  ),
                  title: Text(
                    notif.title,
                    style: TextStyle(fontWeight: notif.isRead ? FontWeight.normal : FontWeight.bold),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(notif.body, maxLines: 2, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 4),
                      Text(
                        '${notif.senderName} • ${DateFormat('MMM dd, hh:mm a').format(notif.createdAt)}',
                        style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey),
                      ),
                    ],
                  ),
                  trailing: notif.attachmentUrl != null
                      ? const Icon(Icons.attachment, size: 16)
                      : null,
                  onTap: () async {
                    if (!notif.isRead) {
                      await ref.read(notificationRepositoryProvider).markAsRead(notif.id);
                      ref.invalidate(notificationsProvider);
                      ref.invalidate(unreadNotificationCountProvider);
                    }
                    // Navigate if route exists
                  },
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }

  IconData _getIconForType(String type) {
    switch (type) {
      case 'broadcast':
        return Icons.campaign;
      case 'chat':
        return Icons.chat;
      case 'system':
        return Icons.settings;
      case 'alert':
        return Icons.warning;
      default:
        return Icons.notifications;
    }
  }
}
