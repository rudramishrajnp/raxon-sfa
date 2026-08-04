class MtpDoctorModel {
  final String doctorId;
  final String doctorName;
  final String specialty;

  MtpDoctorModel({
    required this.doctorId,
    required this.doctorName,
    required this.specialty,
  });

  Map<String, dynamic> toJson() => {
        'doctorId': doctorId,
        'doctorName': doctorName,
        'specialty': specialty,
      };

  factory MtpDoctorModel.fromJson(Map<String, dynamic> json) => MtpDoctorModel(
        doctorId: json['doctorId'] as String,
        doctorName: json['doctorName'] as String,
        specialty: json['specialty'] as String,
      );
}

class MtpDayModel {
  final DateTime date;
  final String workType;
  final String locationType;
  final String? notes;
  final List<MtpDoctorModel> doctors;

  MtpDayModel({
    required this.date,
    required this.workType,
    required this.locationType,
    this.notes,
    this.doctors = const [],
  });

  Map<String, dynamic> toJson() => {
        'date': date.toIso8601String(),
        'workType': workType,
        'locationType': locationType,
        'notes': notes,
        'doctors': doctors.map((d) => d.toJson()).toList(),
      };

  factory MtpDayModel.fromJson(Map<String, dynamic> json) => MtpDayModel(
        date: DateTime.parse(json['date'] as String),
        workType: json['workType'] as String,
        locationType: json['locationType'] as String,
        notes: json['notes'] as String?,
        doctors: (json['doctors'] as List<dynamic>?)
                ?.map((e) => MtpDoctorModel.fromJson(e as Map<String, dynamic>))
                .toList() ??
            [],
      );
}

class MtpModel {
  final String? id;
  final String employeeId;
  final int month;
  final int year;
  final String status; // DRAFT, PENDING, APPROVED, REJECTED
  final List<MtpDayModel> days;

  MtpModel({
    this.id,
    required this.employeeId,
    required this.month,
    required this.year,
    this.status = 'DRAFT',
    this.days = const [],
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'employeeId': employeeId,
        'month': month,
        'year': year,
        'status': status,
        'days': days.map((d) => d.toJson()).toList(),
      };

  factory MtpModel.fromJson(Map<String, dynamic> json) => MtpModel(
        id: json['id'] as String?,
        employeeId: json['employeeId'] as String,
        month: json['month'] as int,
        year: json['year'] as int,
        status: json['status'] as String? ?? 'DRAFT',
        days: (json['days'] as List<dynamic>?)
                ?.map((e) => MtpDayModel.fromJson(e as Map<String, dynamic>))
                .toList() ??
            [],
      );
}
