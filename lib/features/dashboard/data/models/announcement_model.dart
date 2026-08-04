class AnnouncementModel {
  final String id;
  final String title;
  final DateTime date;
  final String priority; // High, Normal, Low
  final bool isRead;

  AnnouncementModel({
    required this.id,
    required this.title,
    required this.date,
    required this.priority,
    required this.isRead,
  });

  factory AnnouncementModel.fromJson(Map<String, dynamic> json) {
    return AnnouncementModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      date: json['date'] != null ? DateTime.parse(json['date']) : DateTime.now(),
      priority: json['priority'] as String? ?? 'Normal',
      isRead: json['isRead'] as bool? ?? false,
    );
  }
}
