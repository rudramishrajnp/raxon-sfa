class OverrideRequestModel {
  final int? id;
  final String employeeId;
  final String customerId;
  final String reason;
  final String? note;
  final String? photoPath; // Typically would be a URL after upload or base64
  final double latitude;
  final double longitude;
  final DateTime timestamp;

  OverrideRequestModel({
    this.id,
    required this.employeeId,
    required this.customerId,
    required this.reason,
    this.note,
    this.photoPath,
    required this.latitude,
    required this.longitude,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'employeeId': employeeId,
        'customerId': customerId,
        'reason': reason,
        'note': note,
        'photoPath': photoPath,
        'latitude': latitude,
        'longitude': longitude,
        'timestamp': timestamp.toIso8601String(),
      };
}
