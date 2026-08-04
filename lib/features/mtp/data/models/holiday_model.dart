class HolidayModel {
  final DateTime date;
  final String name;
  final String type; // National, Regional, Company
  final String? regionId;

  HolidayModel({
    required this.date,
    required this.name,
    required this.type,
    this.regionId,
  });

  factory HolidayModel.fromJson(Map<String, dynamic> json) => HolidayModel(
        date: DateTime.parse(json['date'] as String),
        name: json['name'] as String,
        type: json['type'] as String,
        regionId: json['regionId'] as String?,
      );
}
