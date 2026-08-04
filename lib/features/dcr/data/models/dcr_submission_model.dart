class DcrSubmissionModel {
  final String dcrId;
  final String checkInId;
  final String customerId;
  final String customerName;
  final DateTime submissionTime;
  final bool isJointWork;
  final List<String> taggedManagers;
  final bool isLocked;

  // Audit Trail
  final String createdBy;
  final String? deviceId;
  final String? appVersion;
  final double latitude;
  final double longitude;
  
  DcrSubmissionModel({
    required this.dcrId,
    required this.checkInId,
    required this.customerId,
    required this.customerName,
    required this.submissionTime,
    this.isJointWork = false,
    this.taggedManagers = const [],
    this.isLocked = true,
    required this.createdBy,
    this.deviceId,
    this.appVersion,
    required this.latitude,
    required this.longitude,
  });

  Map<String, dynamic> toJson() => {
        'dcrId': dcrId,
        'checkInId': checkInId,
        'customerId': customerId,
        'customerName': customerName,
        'submissionTime': submissionTime.toIso8601String(),
        'isJointWork': isJointWork,
        'taggedManagers': taggedManagers,
        'isLocked': isLocked,
        'createdBy': createdBy,
        'deviceId': deviceId,
        'appVersion': appVersion,
        'latitude': latitude,
        'longitude': longitude,
      };
}
