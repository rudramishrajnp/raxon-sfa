class DoctorMasterModel {
  final String id;
  final String code;
  final String name;
  final String qualification;
  final String speciality;
  final String clinicName;
  final String hospitalName;
  final String address;
  final String area;
  final String city;
  final String district;
  final String state;
  final String pinCode;
  final double? latitude;
  final double? longitude;
  final String contactNumber;
  final String email;
  final int visitFrequency;
  final String doctorClass;
  final String preferredVisitDays;
  final String approvalStatus;

  DoctorMasterModel({
    required this.id,
    required this.code,
    required this.name,
    required this.qualification,
    required this.speciality,
    required this.clinicName,
    required this.hospitalName,
    required this.address,
    required this.area,
    required this.city,
    required this.district,
    required this.state,
    required this.pinCode,
    this.latitude,
    this.longitude,
    required this.contactNumber,
    required this.email,
    required this.visitFrequency,
    required this.doctorClass,
    required this.preferredVisitDays,
    required this.approvalStatus,
  });

  DoctorMasterModel copyWith({
    String? approvalStatus,
  }) {
    return DoctorMasterModel(
      id: id,
      code: code,
      name: name,
      qualification: qualification,
      speciality: speciality,
      clinicName: clinicName,
      hospitalName: hospitalName,
      address: address,
      area: area,
      city: city,
      district: district,
      state: state,
      pinCode: pinCode,
      latitude: latitude,
      longitude: longitude,
      contactNumber: contactNumber,
      email: email,
      visitFrequency: visitFrequency,
      doctorClass: doctorClass,
      preferredVisitDays: preferredVisitDays,
      approvalStatus: approvalStatus ?? this.approvalStatus,
    );
  }
}

class ChemistMasterModel {
  final String id;
  final String code;
  final String name;
  final String gstNumber;
  final String drugLicenseNumber;
  final String ownerName;
  final String contact;
  final String address;
  final String area;
  final String city;
  final String hq;
  final double? latitude;
  final double? longitude;
  final String approvalStatus;

  ChemistMasterModel({
    required this.id,
    required this.code,
    required this.name,
    required this.gstNumber,
    required this.drugLicenseNumber,
    required this.ownerName,
    required this.contact,
    required this.address,
    required this.area,
    required this.city,
    required this.hq,
    this.latitude,
    this.longitude,
    required this.approvalStatus,
  });

  ChemistMasterModel copyWith({
    String? approvalStatus,
  }) {
    return ChemistMasterModel(
      id: id,
      code: code,
      name: name,
      gstNumber: gstNumber,
      drugLicenseNumber: drugLicenseNumber,
      ownerName: ownerName,
      contact: contact,
      address: address,
      area: area,
      city: city,
      hq: hq,
      latitude: latitude,
      longitude: longitude,
      approvalStatus: approvalStatus ?? this.approvalStatus,
    );
  }
}

class ProductMasterModel {
  final String id;
  final String brandName;
  final String genericName;
  final String saltComposition;
  final String strength;
  final String dosageForm;
  final String packSize;
  final double mrp;
  final double ptr;
  final double pts;
  final String hsnCode;
  final double gst;
  final bool sampleAvailable;
  final String samplePack;
  final DateTime launchDate;
  final String status;

  ProductMasterModel({
    required this.id,
    required this.brandName,
    required this.genericName,
    required this.saltComposition,
    required this.strength,
    required this.dosageForm,
    required this.packSize,
    required this.mrp,
    required this.ptr,
    required this.pts,
    required this.hsnCode,
    required this.gst,
    required this.sampleAvailable,
    required this.samplePack,
    required this.launchDate,
    required this.status,
  });
}
