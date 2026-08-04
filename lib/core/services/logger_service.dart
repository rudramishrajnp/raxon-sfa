import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:logger/logger.dart';

class LoggerService {
  final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: 0,
      errorMethodCount: 5,
      lineLength: 100,
      colors: true,
      printEmojis: true,
      printTime: true,
    ),
  );

  void debug(String message) => _logger.d(message);
  
  void info(String message) => _logger.i(message);
  
  void warning(String message) => _logger.w(message);
  
  void error(String message, [dynamic error, StackTrace? stackTrace]) => _logger.e(message, error: error, stackTrace: stackTrace);

  void severe(String message) => _logger.e(message);

  void logSync({
    required String module,
    required String operation,
    required Duration duration,
    required String status,
    String? failureReason,
    int? retryCount,
  }) {
    final log = StringBuffer()
      ..writeln('🔄 SYNC LOG:')
      ..writeln('  Module: $module')
      ..writeln('  Operation: $operation')
      ..writeln('  Duration: ${duration.inMilliseconds}ms')
      ..writeln('  Status: $status');
    
    if (failureReason != null) {
      log.writeln('  Failure Reason: $failureReason');
    }
    if (retryCount != null) {
      log.writeln('  Retry Count: $retryCount');
    }
    _logger.i(log.toString());
  }
  void logAudit({
    required String action,
    required String entityType,
    required String entityId,
    required String userId,
    Map<String, dynamic>? details,
  }) {
    final log = StringBuffer()
      ..writeln('📋 AUDIT LOG:')
      ..writeln('  Action: $action')
      ..writeln('  Entity: $entityType ($entityId)')
      ..writeln('  User: $userId');
      
    if (details != null) {
      log.writeln('  Details: $details');
    }
    
    _logger.i(log.toString());
  }
}

final loggerServiceProvider = Provider<LoggerService>((ref) {
  return LoggerService();
});
