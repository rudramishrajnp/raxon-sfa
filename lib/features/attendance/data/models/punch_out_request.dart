class PunchOutRequest {
  final String employeeId;
  final DateTime date;
  final DateTime punchOutTime;
  final double latitude;
  final double longitude;
  final double accuracy;
  final String deviceId;
  final int batteryPercentage;
  final String networkType;
  final bool managerOverride;

  PunchOutRequest({
    required this.employeeId,
    required this.date,
    required this.punchOutTime,
    required this.latitude,
    required this.longitude,
    required this.accuracy,
    required this.deviceId,
    required this.batteryPercentage,
    required this.networkType,
    this.managerOverride = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'gps': {
        'latitude': latitude,
        'longitude': longitude,
        'accuracy': accuracy,
        'batteryPercentage': batteryPercentage,
        'timestamp': punchOutTime.toUtc().toIso8601String(),
      }
    };
  }
}
