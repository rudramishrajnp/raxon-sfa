class PunchOutResponse {
  final bool success;
  final String message;

  PunchOutResponse({required this.success, required this.message});

  factory PunchOutResponse.fromJson(Map<String, dynamic> json) {
    return PunchOutResponse(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String? ?? '',
    );
  }
}
