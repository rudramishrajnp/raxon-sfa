class DcrCheckInModel {
  final int? id;
  final String employeeId;
  final String customerId;
  final DateTime date;
  final DateTime checkInTime;
  final double latitude;
  final double longitude;
  final double accuracy;
  final double distance;
  final String? deviceId;
  final bool isInternetAvailable;
  final int? batteryPercentage;
  final String? callId;

  DcrCheckInModel({
    this.id,
    required this.employeeId,
    required this.customerId,
    required this.date,
    required this.checkInTime,
    required this.latitude,
    required this.longitude,
    required this.accuracy,
    required this.distance,
    this.deviceId,
    required this.isInternetAvailable,
    this.batteryPercentage,
    this.callId,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'employeeId': employeeId,
        'customerId': customerId,
        'date': date.toIso8601String(),
        'checkInTime': checkInTime.toIso8601String(),
        'latitude': latitude,
        'longitude': longitude,
        'accuracy': accuracy,
        'distance': distance,
        'deviceId': deviceId,
        'isInternetAvailable': isInternetAvailable,
        'batteryPercentage': batteryPercentage,
        'callId': callId,
      };
}

