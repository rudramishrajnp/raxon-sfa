import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:convert';
import '../services/logger_service.dart';

enum ConflictStrategy { serverWins, clientWins, latestWins, manualReview }

class ConflictResolutionEngine {
  final LoggerService _logger;
  
  // Could be fetched from secure storage or settings provider
  ConflictStrategy _strategy = ConflictStrategy.serverWins;

  ConflictResolutionEngine(this._logger);

  void setStrategy(ConflictStrategy strategy) {
    _strategy = strategy;
  }

  Map<String, dynamic> resolveConflict(Map<String, dynamic> localData, Map<String, dynamic> remoteData) {
    _logger.info('Conflict detected for entity. Using strategy: $_strategy');
    
    switch (_strategy) {
      case ConflictStrategy.serverWins:
        return remoteData;
      case ConflictStrategy.clientWins:
        return localData;
      case ConflictStrategy.latestWins:
        // Attempt to parse 'updatedAt' field
        final localDateStr = localData['updatedAt'];
        final remoteDateStr = remoteData['updatedAt'];
        
        if (localDateStr != null && remoteDateStr != null) {
          try {
            final localDate = DateTime.parse(localDateStr);
            final remoteDate = DateTime.parse(remoteDateStr);
            return localDate.isAfter(remoteDate) ? localData : remoteData;
          } catch (e) {
            _logger.warning('Failed to parse dates for latestWins strategy. Defaulting to serverWins.');
            return remoteData;
          }
        }
        return remoteData; // Default if dates missing
      case ConflictStrategy.manualReview:
        // In manual review, we might flag the record in DB for the user to resolve later.
        // For now, default to local data so it's not lost, and flag it.
        final merged = Map<String, dynamic>.from(localData);
        merged['_conflict_flag'] = true;
        merged['_remote_data'] = remoteData;
        return merged;
    }
  }
}

final conflictResolutionEngineProvider = Provider<ConflictResolutionEngine>((ref) {
  return ConflictResolutionEngine(ref.watch(loggerServiceProvider));
});
