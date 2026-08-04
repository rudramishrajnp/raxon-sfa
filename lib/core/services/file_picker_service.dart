import 'package:universal_io/io.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
// import 'package:image_picker/image_picker.dart';
// import 'package:file_picker/file_picker.dart';

class FilePickerService {
  Future<File?> pickImageFromCamera() async {
    // Stub implementation to avoid compilation errors if image_picker is not installed
    // final picker = ImagePicker();
    // final picked = await picker.pickImage(source: ImageSource.camera);
    // return picked != null ? File(picked.path) : null;
    return null;
  }

  Future<File?> pickImageFromGallery() async {
    // final picker = ImagePicker();
    // final picked = await picker.pickImage(source: ImageSource.gallery);
    // return picked != null ? File(picked.path) : null;
    return null;
  }

  Future<File?> pickPdfFile() async {
    // final result = await FilePicker.platform.pickFiles(
    //   type: FileType.custom,
    //   allowedExtensions: ['pdf'],
    // );
    // return result != null && result.files.single.path != null ? File(result.files.single.path!) : null;
    return null;
  }
}

final filePickerServiceProvider = Provider<FilePickerService>((ref) {
  return FilePickerService();
});
