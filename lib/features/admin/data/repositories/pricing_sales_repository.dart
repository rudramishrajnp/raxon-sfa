import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/pricing_sales_models.dart';

abstract class PricingSalesRepository {
  Future<List<ProductPricingModel>> getProductPricing();
  Future<void> updateProductPricing(ProductPricingModel pricing);

  Future<List<BatchModel>> getBatches();
  Future<void> addBatch(BatchModel batch);
  Future<void> updateBatchStatus(String batchId, String status);

  Future<List<PrimarySalesInvoiceModel>> getPrimarySales();
  
  Future<List<ImportHistoryModel>> getImportHistory();
  Future<void> recordImportHistory(ImportHistoryModel history);
}

class PricingSalesRepositoryImpl implements PricingSalesRepository {
  final List<ProductPricingModel> _mockPricing = [
    ProductPricingModel(
      id: 'pr1',
      productId: 'p1',
      productName: 'Raxocillin 500mg',
      mrp: 120.0,
      ptr: 80.0,
      pts: 70.0,
      distributorPrice: 65.0,
      sampleCost: 10.0,
      schemePrice: 75.0,
      effectiveFrom: DateTime(2023, 1, 1),
    ),
  ];

  final List<BatchModel> _mockBatches = [
    BatchModel(
      id: 'b1',
      productId: 'p1',
      productName: 'Raxocillin 500mg',
      batchNumber: 'RX2301A',
      manufacturingDate: DateTime(2023, 1, 10),
      expiryDate: DateTime(2025, 12, 31),
      batchMrp: 120.0,
      batchPtr: 80.0,
      batchPts: 70.0,
      status: 'Active',
    ),
  ];

  final List<PrimarySalesInvoiceModel> _mockSales = [
    PrimarySalesInvoiceModel(
      id: 'inv1',
      invoiceNumber: 'INV-2023-001',
      invoiceDate: DateTime.now().subtract(const Duration(days: 5)),
      distributorId: 'd1',
      distributorName: 'Super Distributor Pvt Ltd',
      stockistId: 's1',
      stockistName: 'City Stockist',
      productId: 'p1',
      productName: 'Raxocillin 500mg',
      batchNumber: 'RX2301A',
      quantity: 1000,
      freeQuantity: 100,
      rate: 65.0,
      discount: 5.0,
      tax: 12.0,
      netAmount: 72800.0,
      hq: 'HQ-1',
      region: 'North',
    ),
  ];

  final List<ImportHistoryModel> _mockHistory = [
    ImportHistoryModel(
      id: 'ih1',
      importDate: DateTime.now().subtract(const Duration(days: 2)),
      importedBy: 'Admin User',
      fileName: 'sales_q1.xlsx',
      totalRecords: 1500,
      successfulRecords: 1495,
      failedRecords: 5,
      processingTime: const Duration(seconds: 45),
    ),
  ];

  @override
  Future<List<ProductPricingModel>> getProductPricing() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return _mockPricing.toList();
  }

  @override
  Future<void> updateProductPricing(ProductPricingModel pricing) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final index = _mockPricing.indexWhere((p) => p.id == pricing.id);
    if (index != -1) {
      _mockPricing[index] = pricing;
    }
  }

  @override
  Future<List<BatchModel>> getBatches() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return _mockBatches.toList();
  }

  @override
  Future<void> addBatch(BatchModel batch) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _mockBatches.add(batch);
  }

  @override
  Future<void> updateBatchStatus(String batchId, String status) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final index = _mockBatches.indexWhere((b) => b.id == batchId);
    if (index != -1) {
      _mockBatches[index] = BatchModel(
        id: _mockBatches[index].id,
        productId: _mockBatches[index].productId,
        productName: _mockBatches[index].productName,
        batchNumber: _mockBatches[index].batchNumber,
        manufacturingDate: _mockBatches[index].manufacturingDate,
        expiryDate: _mockBatches[index].expiryDate,
        batchMrp: _mockBatches[index].batchMrp,
        batchPtr: _mockBatches[index].batchPtr,
        batchPts: _mockBatches[index].batchPts,
        status: status,
      );
    }
  }

  @override
  Future<List<PrimarySalesInvoiceModel>> getPrimarySales() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return _mockSales.toList();
  }

  @override
  Future<List<ImportHistoryModel>> getImportHistory() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _mockHistory.toList();
  }

  @override
  Future<void> recordImportHistory(ImportHistoryModel history) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _mockHistory.add(history);
  }
}

final pricingSalesRepositoryProvider = Provider<PricingSalesRepository>((ref) {
  return PricingSalesRepositoryImpl();
});
