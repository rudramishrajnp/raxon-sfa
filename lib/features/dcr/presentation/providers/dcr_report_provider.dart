import '../../data/repositories/dcr_report_repository_impl.dart';
import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/dcr_report_repository.dart';
import '../../domain/validators/dcr_report_validator.dart';
import '../../data/models/dcr_report_model.dart';
import '../../data/models/product_model.dart';
import 'dcr_report_state.dart';

class DcrReportNotifier extends StateNotifier<DcrReportState> {
  final DcrReportRepository _repository;
  final String _checkInId;
  final String _customerId;
  Timer? _draftTimer;

  DcrReportNotifier(this._repository, this._checkInId, this._customerId) : super(DcrReportInitial());

  Future<void> loadReport() async {
    state = DcrReportLoading();
    try {
      final products = await _repository.getActiveProducts();
      final draft = await _repository.getDraft(_checkInId, _customerId);
      
      state = DcrReportLoaded(
        report: draft ?? DcrReportModel(checkInId: _checkInId, customerId: _customerId),
        availableProducts: products,
      );
      
      _startDraftTimer();
    } catch (e) {
      state = DcrReportError('Failed to load report data: ${e.toString()}');
    }
  }

  void _startDraftTimer() {
    _draftTimer?.cancel();
    _draftTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      if (state is DcrReportLoaded) {
        _repository.saveDraft((state as DcrReportLoaded).report);
      }
    });
  }

  @override
  void dispose() {
    _draftTimer?.cancel();
    super.dispose();
  }

  void updateSamples(List<SampleItemModel> samples) {
    if (state is DcrReportLoaded) {
      final currentState = state as DcrReportLoaded;
      state = currentState.copyWith(report: currentState.report.copyWith(samples: samples));
      _repository.saveDraft((state as DcrReportLoaded).report);
    }
  }

  void updatePrescription(PrescriptionModel prescription) {
    if (state is DcrReportLoaded) {
      final currentState = state as DcrReportLoaded;
      state = currentState.copyWith(report: currentState.report.copyWith(prescription: prescription));
      _repository.saveDraft((state as DcrReportLoaded).report);
    }
  }

  void updateOrders(List<OrderItemModel> orders) {
    if (state is DcrReportLoaded) {
      final currentState = state as DcrReportLoaded;
      state = currentState.copyWith(report: currentState.report.copyWith(orders: orders));
      _repository.saveDraft((state as DcrReportLoaded).report);
    }
  }

  void updateSummary(CallSummaryModel summary) {
    if (state is DcrReportLoaded) {
      final currentState = state as DcrReportLoaded;
      state = currentState.copyWith(report: currentState.report.copyWith(summary: summary));
      _repository.saveDraft((state as DcrReportLoaded).report);
    }
  }

  Future<void> submitReport() async {
    if (state is! DcrReportLoaded) return;
    
    final currentState = state as DcrReportLoaded;
    final report = currentState.report;
    
    final validator = DcrReportValidator();
    final error = validator.validateReport(report);
    
    if (error != null) {
      state = DcrReportError(error);
      await Future.delayed(const Duration(milliseconds: 100));
      state = currentState; // Reset state back to loaded to allow fixing
      return;
    }

    state = DcrReportLoading();
    try {
      await _repository.submitReport(report);
      state = DcrReportSuccess('DCR Report submitted successfully.');
    } catch (e) {
      state = DcrReportError('Failed to submit report: ${e.toString()}');
      await Future.delayed(const Duration(milliseconds: 100));
      state = currentState;
    }
  }
}

final dcrReportNotifierProvider = StateNotifierProvider.family<DcrReportNotifier, DcrReportState, Map<String, String>>((ref, params) {
  return DcrReportNotifier(
    ref.watch(dcrReportRepositoryProvider),
    params['checkInId']!,
    params['customerId']!,
  );
});

extension on DcrReportModel {
  DcrReportModel copyWith({
    String? checkInId,
    String? customerId,
    List<SampleItemModel>? samples,
    PrescriptionModel? prescription,
    List<OrderItemModel>? orders,
    CallSummaryModel? summary,
    bool? isDraft,
  }) {
    return DcrReportModel(
      checkInId: checkInId ?? this.checkInId,
      customerId: customerId ?? this.customerId,
      samples: samples ?? this.samples,
      prescription: prescription ?? this.prescription,
      orders: orders ?? this.orders,
      summary: summary ?? this.summary,
      isDraft: isDraft ?? this.isDraft,
    );
  }
}
