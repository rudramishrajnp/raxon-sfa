class TeamMemberLocationModel {
  final String id;
  final String name;
  final String employeeCode;
  final String hq;
  final String territory;
  final String currentStatus;
  final DateTime lastActivityTime;
  final DateTime lastGpsTime;
  final int? batteryLevel;
  final bool isOnline;
  final double gpsAccuracy;
  final double? latitude;
  final double? longitude;
  final String? address;
  final double? speed;

  TeamMemberLocationModel({
    required this.id,
    required this.name,
    required this.employeeCode,
    required this.hq,
    required this.territory,
    required this.currentStatus,
    required this.lastActivityTime,
    required this.lastGpsTime,
    this.batteryLevel,
    required this.isOnline,
    required this.gpsAccuracy,
    this.latitude,
    this.longitude,
    this.address,
    this.speed,
  });
}

class TrackingEventModel {
  final DateTime timestamp;
  final String eventType;
  final String? customerName;
  final String? locationName;
  final double? latitude;
  final double? longitude;
  final String status;

  TrackingEventModel({
    required this.timestamp,
    required this.eventType,
    this.customerName,
    this.locationName,
    this.latitude,
    this.longitude,
    required this.status,
  });
}
