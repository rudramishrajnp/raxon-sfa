class PunchInRequest {
  final String employeeId;
  final DateTime date;
  final DateTime punchInTime;
  final double latitude;
  final double longitude;
  final double accuracy;
  final String deviceId;
  final int batteryPercentage;
  final String networkType;

  PunchInRequest({
    required this.employeeId,
    required this.date,
    required this.punchInTime,
    required this.latitude,
    required this.longitude,
    required this.accuracy,
    required this.deviceId,
    required this.batteryPercentage,
    required this.networkType,
  });

  Map<String, dynamic> toJson() {
    return {
      'gps': {
        'latitude': latitude,
        'longitude': longitude,
        'accuracy': accuracy,
        'batteryPercentage': batteryPercentage,
        'timestamp': punchInTime.toUtc().toIso8601String(),
      }
    };
  }
}
