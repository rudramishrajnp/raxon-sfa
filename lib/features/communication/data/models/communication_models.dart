class NotificationModel {
  final String id;
  final String title;
  final String body;
  final String type; // broadcast, chat, system, alert
  final String senderName;
  final DateTime createdAt;
  final bool isRead;
  final String? attachmentUrl;
  final String? route;
  final String priority;

  NotificationModel({
    required this.id,
    required this.title,
    required this.body,
    required this.type,
    required this.senderName,
    required this.createdAt,
    this.isRead = false,
    this.attachmentUrl,
    this.route,
    this.priority = 'normal',
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] as String,
      title: json['title'] as String,
      body: json['body'] as String,
      type: json['type'] as String,
      senderName: json['senderName'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      isRead: json['isRead'] as bool? ?? false,
      attachmentUrl: json['attachmentUrl'] as String?,
      route: json['route'] as String?,
      priority: json['priority'] as String? ?? 'normal',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'body': body,
        'type': type,
        'senderName': senderName,
        'createdAt': createdAt.toIso8601String(),
        'isRead': isRead,
        'attachmentUrl': attachmentUrl,
        'route': route,
        'priority': priority,
      };

  NotificationModel copyWith({
    bool? isRead,
  }) {
    return NotificationModel(
      id: id,
      title: title,
      body: body,
      type: type,
      senderName: senderName,
      createdAt: createdAt,
      isRead: isRead ?? this.isRead,
      attachmentUrl: attachmentUrl,
      route: route,
      priority: priority,
    );
  }
}

class ChatMessageModel {
  final String id;
  final String roomId;
  final String senderId;
  final String text;
  final String type; // text, image, document, voice
  final DateTime timestamp;
  final bool isRead;
  final String? attachmentUrl;

  ChatMessageModel({
    required this.id,
    required this.roomId,
    required this.senderId,
    required this.text,
    required this.type,
    required this.timestamp,
    this.isRead = false,
    this.attachmentUrl,
  });

  factory ChatMessageModel.fromJson(Map<String, dynamic> json) {
    return ChatMessageModel(
      id: json['id'] as String,
      roomId: json['roomId'] as String,
      senderId: json['senderId'] as String,
      text: json['text'] as String,
      type: json['type'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
      isRead: json['isRead'] as bool? ?? false,
      attachmentUrl: json['attachmentUrl'] as String?,
    );
  }
}

class ChatRoomModel {
  final String id;
  final String name;
  final String type; // one_to_one, group, territory, regional
  final String? lastMessage;
  final DateTime? lastMessageTime;
  final int unreadCount;
  final bool isArchived;

  ChatRoomModel({
    required this.id,
    required this.name,
    required this.type,
    this.lastMessage,
    this.lastMessageTime,
    this.unreadCount = 0,
    this.isArchived = false,
  });
}
