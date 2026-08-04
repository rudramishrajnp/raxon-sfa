import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/pricing_sales_models.dart';
import '../../data/repositories/pricing_sales_repository.dart';

final productPricingProvider = FutureProvider.autoDispose<List<ProductPricingModel>>((ref) async {
  final repo = ref.watch(pricingSalesRepositoryProvider);
  return repo.getProductPricing();
});

final batchesProvider = FutureProvider.autoDispose<List<BatchModel>>((ref) async {
  final repo = ref.watch(pricingSalesRepositoryProvider);
  return repo.getBatches();
});

final primarySalesProvider = FutureProvider.autoDispose<List<PrimarySalesInvoiceModel>>((ref) async {
  final repo = ref.watch(pricingSalesRepositoryProvider);
  return repo.getPrimarySales();
});

final importHistoryProvider = FutureProvider.autoDispose<List<ImportHistoryModel>>((ref) async {
  final repo = ref.watch(pricingSalesRepositoryProvider);
  return repo.getImportHistory();
});
