class GpsLogRequest {
  final String eventName;
  final double latitude;
  final double longitude;
  final double accuracy;
  final DateTime timestamp;
  final String deviceId;

  GpsLogRequest({
    required this.eventName,
    required this.latitude,
    required this.longitude,
    required this.accuracy,
    required this.timestamp,
    required this.deviceId,
  });

  Map<String, dynamic> toJson() {
    return {
      'eventName': eventName,
      'latitude': latitude,
      'longitude': longitude,
      'accuracy': accuracy,
      'timestamp': timestamp.toIso8601String(),
      'deviceId': deviceId,
    };
  }

  factory GpsLogRequest.fromJson(Map<String, dynamic> json) {
    return GpsLogRequest(
      eventName: json['eventName'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      accuracy: (json['accuracy'] as num).toDouble(),
      timestamp: DateTime.parse(json['timestamp'] as String),
      deviceId: json['deviceId'] as String,
    );
  }
}
