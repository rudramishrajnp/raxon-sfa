import 'package:universal_io/io.dart';

class FileValidationService {
  static const int maxFileSizeBytes = 5 * 1024 * 1024; // 5 MB
  static const List<String> supportedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];

  String? validateFile(File file, String extension) {
    if (!supportedExtensions.contains(extension.toLowerCase())) {
      return 'Unsupported file type: $extension. Allowed: JPG, PNG, PDF.';
    }

    if (file.lengthSync() > maxFileSizeBytes) {
      return 'File exceeds maximum size of 5MB.';
    }

    return null;
  }
}
