class HolidayModel {
  final String id;
  final String name;
  final String type; // National, Regional, State, Company, Festival, Optional
  final DateTime date;
  final String? applicableCompany;
  final String? applicableDivision;
  final String? applicableZone;
  final String? applicableRegion;
  final String? applicableHq;
  final String? description;
  final String status;

  HolidayModel({
    required this.id,
    required this.name,
    required this.type,
    required this.date,
    this.applicableCompany,
    this.applicableDivision,
    this.applicableZone,
    this.applicableRegion,
    this.applicableHq,
    this.description,
    required this.status,
  });
}

class BroadcastMessageModel {
  final String id;
  final String title;
  final String body;
  final String category; // Announcement, HR, Scheme, Notice, Alert
  final String targetAudience; // All, MR, AM, Specific HQ, etc.
  final DateTime? scheduledTime;
  final bool isRecurring;
  final String? priority;
  final DateTime createdAt;
  final String createdBy;

  BroadcastMessageModel({
    required this.id,
    required this.title,
    required this.body,
    required this.category,
    required this.targetAudience,
    this.scheduledTime,
    this.isRecurring = false,
    this.priority = 'Normal',
    required this.createdAt,
    required this.createdBy,
  });
}

class DeliveryTrackingModel {
  final String broadcastId;
  final int totalSent;
  final int totalDelivered;
  final int totalRead;
  final int totalAcknowledged;
  final int totalFailed;

  DeliveryTrackingModel({
    required this.broadcastId,
    required this.totalSent,
    required this.totalDelivered,
    required this.totalRead,
    required this.totalAcknowledged,
    required this.totalFailed,
  });
}

class NotificationTemplateModel {
  final String id;
  final String name;
  final String titleTemplate;
  final String bodyTemplate;
  final String category;

  NotificationTemplateModel({
    required this.id,
    required this.name,
    required this.titleTemplate,
    required this.bodyTemplate,
    required this.category,
  });
}
