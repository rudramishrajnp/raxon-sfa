class TeamMemberStatusModel {
  final String id;
  final String name;
  final String hq;
  final String currentStatus;
  final DateTime lastGpsUpdateTime;
  final String lastActivity;
  final int? batteryLevel;
  final bool isOnline;
  final String syncStatus;

  TeamMemberStatusModel({
    required this.id,
    required this.name,
    required this.hq,
    required this.currentStatus,
    required this.lastGpsUpdateTime,
    required this.lastActivity,
    this.batteryLevel,
    required this.isOnline,
    required this.syncStatus,
  });

  factory TeamMemberStatusModel.fromJson(Map<String, dynamic> json) {
    return TeamMemberStatusModel(
      id: json['id'] as String,
      name: json['name'] as String,
      hq: json['hq'] as String,
      currentStatus: json['currentStatus'] as String,
      lastGpsUpdateTime: DateTime.parse(json['lastGpsUpdateTime']),
      lastActivity: json['lastActivity'] as String,
      batteryLevel: json['batteryLevel'] as int?,
      isOnline: json['isOnline'] as bool,
      syncStatus: json['syncStatus'] as String,
    );
  }
}
