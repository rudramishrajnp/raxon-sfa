class UserModel {
  final String id;
  final String name;
  final String role;
  final String email;
  final String territory;

  UserModel({
    required this.id,
    required this.name,
    required this.role,
    required this.email,
    required this.territory,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      role: json['role'] as String? ?? '',
      email: json['email'] as String? ?? '',
      territory: json['territory'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'role': role,
      'email': email,
      'territory': territory,
    };
  }
}
