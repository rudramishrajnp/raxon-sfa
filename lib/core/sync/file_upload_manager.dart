import 'package:universal_io/io.dart';
import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/logger_service.dart';

class FileUploadManager {
  final LoggerService _logger;
  final Dio _dio;

  // Ideally, persistent storage should be used for the upload queue.
  // For demonstration, an in-memory queue is kept here.
  final List<String> _pendingUploads = [];
  bool _isUploading = false;

  FileUploadManager(this._logger, this._dio);

  void enqueueUpload(String filePath) {
    if (!_pendingUploads.contains(filePath)) {
      _pendingUploads.add(filePath);
      _logger.info('Enqueued file for upload: $filePath');
      _processQueue();
    }
  }

  Future<void> _processQueue() async {
    if (_isUploading || _pendingUploads.isEmpty) return;

    _isUploading = true;
    _logger.info('Processing file upload queue...');

    try {
      final fileToUpload = _pendingUploads.first;

      if (kIsWeb) {
        await Future.delayed(const Duration(milliseconds: 500));
        _logger.info('Successfully uploaded file on web: $fileToUpload');
        _pendingUploads.removeAt(0);
      } else {
        final file = File(fileToUpload);

        if (await file.exists()) {
          final formData = FormData.fromMap({
            'file': await MultipartFile.fromFile(fileToUpload),
          });

          // Simulate upload
          // await _dio.post('/upload', data: formData);
          await Future.delayed(const Duration(milliseconds: 500));
          
          _logger.info('Successfully uploaded file: $fileToUpload');
          _pendingUploads.removeAt(0);
        } else {
          _logger.warning('File not found, removing from queue: $fileToUpload');
          _pendingUploads.removeAt(0);
        }
      }
    } catch (e) {
      _logger.severe('File upload failed: $e');
      // Exponential backoff logic would go here
    } finally {
      _isUploading = false;
      if (_pendingUploads.isNotEmpty) {
        // Delay before next attempt to prevent tight loop on failure
        Future.delayed(const Duration(seconds: 5), _processQueue);
      }
    }
  }
}

final fileUploadManagerProvider = Provider<FileUploadManager>((ref) {
  return FileUploadManager(
    ref.watch(loggerServiceProvider),
    Dio(), // Placeholder for ref.watch(dioProvider)
  );
});
