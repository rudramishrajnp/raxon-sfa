class CustomerModel {
  final String id;
  final String name;
  final String type; // 'Doctor' or 'Chemist'
  final String? specialty;
  final String? qualification;
  final String? mobile;
  final String? address;
  final double? latitude;
  final double? longitude;
  final String? area;
  final String? city;
  final String? state;
  final String? pincode;
  final String? classification; // 'A', 'B', 'C'
  final String status; // 'APPROVED', 'PENDING'
  final String? visitFrequencyStatus; 
  final String? callStatus; // 'COMPLETED', 'PENDING'
  final double? distanceFromCurrentLocation; 

  CustomerModel({
    required this.id,
    required this.name,
    required this.type,
    this.specialty,
    this.qualification,
    this.mobile,
    this.address,
    this.latitude,
    this.longitude,
    this.area,
    this.city,
    this.state,
    this.pincode,
    this.classification,
    this.status = 'APPROVED',
    this.visitFrequencyStatus,
    this.callStatus = 'PENDING',
    this.distanceFromCurrentLocation,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'type': type,
        'specialty': specialty,
        'qualification': qualification,
        'mobile': mobile,
        'address': address,
        'latitude': latitude,
        'longitude': longitude,
        'area': area,
        'city': city,
        'state': state,
        'pincode': pincode,
        'classification': classification,
        'status': status,
        'visitFrequencyStatus': visitFrequencyStatus,
        'callStatus': callStatus,
      };

  factory CustomerModel.fromJson(Map<String, dynamic> json) => CustomerModel(
        id: json['id'] as String,
        name: json['name'] as String,
        type: json['type'] as String,
        specialty: json['specialty'] as String?,
        qualification: json['qualification'] as String?,
        mobile: json['mobile'] as String?,
        address: json['address'] as String?,
        latitude: json['latitude'] as double?,
        longitude: json['longitude'] as double?,
        area: json['area'] as String?,
        city: json['city'] as String?,
        state: json['state'] as String?,
        pincode: json['pincode'] as String?,
        classification: json['classification'] as String?,
        status: json['status'] as String? ?? 'APPROVED',
        visitFrequencyStatus: json['visitFrequencyStatus'] as String?,
        callStatus: json['callStatus'] as String? ?? 'PENDING',
      );
}
