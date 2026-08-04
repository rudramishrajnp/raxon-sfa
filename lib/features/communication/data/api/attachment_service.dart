import 'package:universal_io/io.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AttachmentService {
  Future<String?> uploadImage(File file) async {
    // Simulate upload delay
    await Future.delayed(const Duration(seconds: 1));
    return 'https://example.com/uploads/image_${DateTime.now().millisecondsSinceEpoch}.jpg';
  }

  Future<String?> uploadDocument(File file) async {
    // Simulate upload delay
    await Future.delayed(const Duration(seconds: 1));
    return 'https://example.com/uploads/doc_${DateTime.now().millisecondsSinceEpoch}.pdf';
  }
}

final attachmentServiceProvider = Provider<AttachmentService>((ref) {
  return AttachmentService();
});
