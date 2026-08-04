class AdminUserModel {
  final String id;
  final String employeeCode;
  final String name;
  final String mobileNumber;
  final String email;
  final String designation; // MR, AM, RM, Admin, Finance Admin, HR Admin, Super Admin
  final String department;
  final String hq;
  final String exHq;
  final String zone;
  final String region;
  final String state;
  final String? reportingManagerId;
  final String? reportingManagerName;
  final DateTime joiningDate;
  final String status; // Active, Inactive, Locked
  final String? profilePhotoUrl;
  final DateTime? lastLogin;
  final String? deviceId; // for device binding

  AdminUserModel({
    required this.id,
    required this.employeeCode,
    required this.name,
    required this.mobileNumber,
    required this.email,
    required this.designation,
    required this.department,
    required this.hq,
    required this.exHq,
    required this.zone,
    required this.region,
    required this.state,
    this.reportingManagerId,
    this.reportingManagerName,
    required this.joiningDate,
    required this.status,
    this.profilePhotoUrl,
    this.lastLogin,
    this.deviceId,
  });

  AdminUserModel copyWith({
    String? status,
    String? deviceId,
  }) {
    return AdminUserModel(
      id: id,
      employeeCode: employeeCode,
      name: name,
      mobileNumber: mobileNumber,
      email: email,
      designation: designation,
      department: department,
      hq: hq,
      exHq: exHq,
      zone: zone,
      region: region,
      state: state,
      reportingManagerId: reportingManagerId,
      reportingManagerName: reportingManagerName,
      joiningDate: joiningDate,
      status: status ?? this.status,
      profilePhotoUrl: profilePhotoUrl,
      lastLogin: lastLogin,
      deviceId: deviceId ?? this.deviceId,
    );
  }
}

class TerritoryModel {
  final String id;
  final String name;
  final String code;
  final String type; // Zone, Region, Area, HQ, Territory
  final String? parentId;
  final String status;

  TerritoryModel({
    required this.id,
    required this.name,
    required this.code,
    required this.type,
    this.parentId,
    required this.status,
  });
}
