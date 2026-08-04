class DcrCheckOutModel {
  final String checkInId;
  final String customerId;
  final String customerName;
  final DateTime checkInTime;
  final DateTime checkOutTime;
  final int visitDurationMinutes;
  final double latitude;
  final double longitude;
  final double accuracy;
  final double distance;
  final String callStatus;
  final String? doctorMood;
  final String? productInterest;
  final String? competitorActivity;
  final String? newOpportunity;
  final String? complaint;
  final bool followUpRequired;
  final String? nextVisitNotes;
  final String? remarks;
  final bool isInternetAvailable;

  DcrCheckOutModel({
    required this.checkInId,
    required this.customerId,
    required this.customerName,
    required this.checkInTime,
    required this.checkOutTime,
    required this.visitDurationMinutes,
    required this.latitude,
    required this.longitude,
    required this.accuracy,
    required this.distance,
    required this.callStatus,
    this.doctorMood,
    this.productInterest,
    this.competitorActivity,
    this.newOpportunity,
    this.complaint,
    this.followUpRequired = false,
    this.nextVisitNotes,
    this.remarks,
    required this.isInternetAvailable,
  });

  Map<String, dynamic> toJson() => {
        'checkInId': checkInId,
        'customerId': customerId,
        'customerName': customerName,
        'checkInTime': checkInTime.toIso8601String(),
        'checkOutTime': checkOutTime.toIso8601String(),
        'visitDurationMinutes': visitDurationMinutes,
        'latitude': latitude,
        'longitude': longitude,
        'accuracy': accuracy,
        'distance': distance,
        'callStatus': callStatus,
        'doctorMood': doctorMood,
        'productInterest': productInterest,
        'competitorActivity': competitorActivity,
        'newOpportunity': newOpportunity,
        'complaint': complaint,
        'followUpRequired': followUpRequired,
        'nextVisitNotes': nextVisitNotes,
        'remarks': remarks,
        'isInternetAvailable': isInternetAvailable,
      };
}
