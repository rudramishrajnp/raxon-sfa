class PunchInResponse {
  final bool success;
  final String message;

  PunchInResponse({required this.success, required this.message});

  factory PunchInResponse.fromJson(Map<String, dynamic> json) {
    return PunchInResponse(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String? ?? '',
    );
  }
}
