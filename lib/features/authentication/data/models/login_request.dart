class LoginRequest {
  final String userId;
  final String password;
  final String deviceId;
  final String deviceModel;

  LoginRequest({
    required this.userId,
    required this.password,
    required this.deviceId,
    required this.deviceModel,
  });

  Map<String, dynamic> toJson() {
    return {
      'email': userId,
      'password': password,
      'deviceId': deviceId,
      'deviceName': deviceModel,
    };
  }
}
