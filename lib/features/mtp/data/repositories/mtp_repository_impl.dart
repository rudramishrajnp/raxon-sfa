import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:drift/drift.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/mtp_repository.dart';
import '../api/mtp_api_service.dart';
import '../models/mtp_models.dart';

class MtpRepositoryImpl implements MtpRepository {
  final MtpApiService _apiService;
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;

  MtpRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
  );

  @override
  Future<MtpModel?> getMtpForMonth(String employeeId, int month, int year) async {
    // Attempt to query local database for draft or saved MTP
    final result = await (_db.select(_db.mtpTable)
          ..where((t) => t.employeeId.equals(employeeId))
          ..where((t) => t.month.equals(month))
          ..where((t) => t.year.equals(year)))
        .getSingleOrNull();

    if (result != null) {
      // In a full implementation, you would also query MtpDayTable and MtpDoctorTable
      // to rebuild the full MtpModel.
      return MtpModel(
        id: result.id.toString(),
        employeeId: result.employeeId,
        month: result.month,
        year: result.year,
        status: result.status,
        days: [], // This would be populated from related tables
      );
    }
    
    // Fallback to API if not in local DB
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        final remoteMtp = await _apiService.getMtp(employeeId, month, year);
        if (remoteMtp != null) {
          // Save to local database
          await _saveMtpToLocal(remoteMtp);
          return remoteMtp;
        }
      } catch (e) {
        // Ignored
      }
    }
    
    return null;
  }

  @override
  Future<void> saveDraft(MtpModel mtp) async {
    mtp = MtpModel(
      id: mtp.id,
      employeeId: mtp.employeeId,
      month: mtp.month,
      year: mtp.year,
      status: 'DRAFT',
      days: mtp.days,
    );
    await _saveMtpToLocal(mtp);

    final isConnected = await _connectivityService.isConnected();
    final operation = mtp.id == null ? 'SAVE_DRAFT' : 'UPDATE_DRAFT';
    final payload = mtp.toJson();
    payload['updated_at'] = DateTime.now().toUtc().toIso8601String();

    if (isConnected) {
      try {
        if (mtp.id == null || mtp.id!.isEmpty) {
          await _apiService.saveDraft(mtp);
        } else {
          await _apiService.updateMtp(mtp);
        }
      } catch (e) {
        await _syncManager.enqueueOperation(
          'MTP',
          '${mtp.employeeId}_${mtp.month}_${mtp.year}',
          operation,
          jsonEncode(payload),
        );
      }
    } else {
      await _syncManager.enqueueOperation(
        'MTP',
        '${mtp.employeeId}_${mtp.month}_${mtp.year}',
        operation,
        jsonEncode(payload),
      );
    }
  }

  @override
  Future<void> submitMtp(MtpModel mtp) async {
    final mtpToSubmit = MtpModel(
      id: mtp.id,
      employeeId: mtp.employeeId,
      month: mtp.month,
      year: mtp.year,
      status: 'PENDING',
      days: mtp.days,
    );
    
    // Update local DB status
    await _saveMtpToLocal(mtpToSubmit);

    final payload = mtpToSubmit.toJson();
    payload['updated_at'] = DateTime.now().toUtc().toIso8601String();

    // Sync
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        await _apiService.submitMtp(mtpToSubmit);
      } catch (e) {
        await _syncManager.enqueueOperation(
          'MTP',
          '${mtpToSubmit.employeeId}_${mtpToSubmit.month}_${mtpToSubmit.year}',
          'SUBMIT',
          jsonEncode(payload),
        );
      }
    } else {
      await _syncManager.enqueueOperation(
        'MTP',
        '${mtpToSubmit.employeeId}_${mtpToSubmit.month}_${mtpToSubmit.year}',
        'SUBMIT',
        jsonEncode(payload),
      );
    }
  }

  Future<void> _saveMtpToLocal(MtpModel mtp) async {
    await _db.into(_db.mtpTable).insertOnConflictUpdate(
      MtpTableCompanion.insert(
        id: mtp.id != null ? Value(int.tryParse(mtp.id!) ?? 0) : const Value.absent(),
        employeeId: mtp.employeeId,
        month: mtp.month,
        year: mtp.year,
        status: Value(mtp.status),
      ),
    );
    // Also save days and doctors in related tables here in a real impl
  }
}

final mtpRepositoryProvider = Provider<MtpRepository>((ref) {
  return MtpRepositoryImpl(
    ref.watch(mtpApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
  );
});
