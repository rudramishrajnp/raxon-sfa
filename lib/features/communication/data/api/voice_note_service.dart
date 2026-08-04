import 'package:flutter_riverpod/flutter_riverpod.dart';

class VoiceNoteService {
  bool _isRecording = false;

  bool get isRecording => _isRecording;

  Future<void> startRecording() async {
    _isRecording = true;
    // Implementation for starting audio recording
  }

  Future<String?> stopRecording() async {
    _isRecording = false;
    // Implementation for stopping and returning local path
    return '/local/path/to/voice_note.m4a';
  }

  Future<String?> uploadVoiceNote(String localPath) async {
    await Future.delayed(const Duration(seconds: 1));
    return 'https://example.com/uploads/voice_${DateTime.now().millisecondsSinceEpoch}.m4a';
  }
}

final voiceNoteServiceProvider = Provider<VoiceNoteService>((ref) {
  return VoiceNoteService();
});
