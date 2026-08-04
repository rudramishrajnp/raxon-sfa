class JointWorkModel {
  final int? id;
  final DateTime date;
  final String managerId;
  final String managerName;

  JointWorkModel({
    this.id,
    required this.date,
    required this.managerId,
    required this.managerName,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'date': date.toIso8601String(),
        'managerId': managerId,
        'managerName': managerName,
      };
}
