import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/analytics_models.dart';
import '../../data/repositories/analytics_repository.dart';

final executiveKpisProvider = FutureProvider.autoDispose<ExecutiveKpiModel>((ref) async {
  final repo = ref.watch(analyticsRepositoryProvider);
  return repo.getExecutiveKpis();
});

final reportConfigsProvider = FutureProvider.autoDispose<List<ReportConfigModel>>((ref) async {
  final repo = ref.watch(analyticsRepositoryProvider);
  return repo.getReportConfigs();
});
