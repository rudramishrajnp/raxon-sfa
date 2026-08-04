import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/dcr_report_repository.dart';
import '../api/dcr_report_api_service.dart';
import '../../data/models/dcr_report_model.dart';
import '../../data/models/product_model.dart';
import 'package:drift/drift.dart';

class DcrReportRepositoryImpl implements DcrReportRepository {
  final DcrReportApiService _apiService;
  // ignore: unused_field
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;

  // In-memory mock for Drafts since Drift is stubbed
  static final Map<String, DcrReportModel> _drafts = {};

  DcrReportRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
  );

  @override
  Future<List<ProductModel>> getActiveProducts() async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        final products = await _apiService.getActiveProducts();
        return products;
      } catch (_) {}
    }
    return [
      ProductModel(id: 'P1', name: 'Raxon 500 (Offline)', strength: '500mg', pack: '10x10', availableStock: 100, price: 120.0),
      ProductModel(id: 'P2', name: 'Raxon Cold (Offline)', strength: '10mg', pack: '10x10', availableStock: 50, price: 80.0),
    ];
  }

  @override
  Future<void> saveDraft(DcrReportModel draft) async {
    final companion = DcrReportTableCompanion.insert(
      checkInId: draft.checkInId,
      customerId: draft.customerId,
      samplingData: Value(jsonEncode(draft.samples.map((e) => e.toJson()).toList())),
      prescriptionData: draft.prescription != null ? Value(jsonEncode(draft.prescription!.toJson())) : const Value.absent(),
      orderData: Value(jsonEncode(draft.orders.map((e) => e.toJson()).toList())),
      summaryData: draft.summary != null ? Value(jsonEncode(draft.summary!.toJson())) : const Value.absent(),
      isDraft: Value(draft.isDraft),
    );
    await _db.into(_db.dcrReportTable).insertOnConflictUpdate(companion);
  }

  @override
  Future<DcrReportModel?> getDraft(String checkInId, String customerId) async {
    final entry = await (_db.select(_db.dcrReportTable)..where((t) => t.checkInId.equals(checkInId))).getSingleOrNull();
    if (entry == null) {
      return DcrReportModel(checkInId: checkInId, customerId: customerId);
    }
    
    return DcrReportModel(
      checkInId: entry.checkInId,
      customerId: entry.customerId,
      samples: entry.samplingData != null ? (jsonDecode(entry.samplingData!) as List).map((e) => SampleItemModel.fromJson(e)).toList() : [],
      prescription: entry.prescriptionData != null ? PrescriptionModel.fromJson(jsonDecode(entry.prescriptionData!)) : null,
      orders: entry.orderData != null ? (jsonDecode(entry.orderData!) as List).map((e) => OrderItemModel.fromJson(e)).toList() : [],
      summary: entry.summaryData != null ? CallSummaryModel.fromJson(jsonDecode(entry.summaryData!)) : null,
      isDraft: entry.isDraft,
    );
  }

  @override
  Future<void> submitReport(DcrReportModel report) async {
    final finalReport = DcrReportModel(
      checkInId: report.checkInId,
      customerId: report.customerId,
      samples: report.samples,
      prescription: report.prescription,
      orders: report.orders,
      summary: report.summary,
      isDraft: false,
    );
    
    await saveDraft(finalReport); // save non-draft state

    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        await _apiService.submitDcrReport(finalReport);
        _drafts.remove('${finalReport.checkInId}_${finalReport.customerId}');
      } catch (e) {
        await _syncManager.enqueueOperation('DcrReport', finalReport.checkInId, 'CREATE', jsonEncode(finalReport.toJson()));
      }
    } else {
      await _syncManager.enqueueOperation('DcrReport', finalReport.checkInId, 'CREATE', jsonEncode(finalReport.toJson()));
    }
  }
}

final dcrReportRepositoryProvider = Provider<DcrReportRepository>((ref) {
  return DcrReportRepositoryImpl(
    ref.watch(dcrReportApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
  );
});
