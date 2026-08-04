import '../../data/repositories/secondary_sales_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../../domain/repositories/secondary_sales_repository.dart';
import '../../domain/validators/secondary_sales_validator.dart';
import '../../data/models/secondary_sales_model.dart';
import '../../data/models/secondary_sales_product_model.dart';
import 'secondary_sales_state.dart';

class SecondarySalesNotifier extends StateNotifier<SecondarySalesState> {
  final SecondarySalesRepository _repository;

  SecondarySalesNotifier(this._repository) : super(SecondarySalesInitial());

  Future<void> initialize(String customerId, String customerName, String customerType, String entryType) async {
    state = SecondarySalesLoading();
    try {
      final products = await _repository.getProductsForCustomer(customerId);
      _emitLoaded(products, customerId, customerName, customerType, entryType);
    } catch (e) {
      state = SecondarySalesError('Failed to load products: ${e.toString()}');
    }
  }

  void updateProduct(String productId, {
    int? openingStock,
    int? purchaseQty,
    int? salesQty,
    int? freeQty,
    int? returnedQty,
    int? damageQty,
  }) {
    if (state is! SecondarySalesLoaded) return;
    
    final currentState = state as SecondarySalesLoaded;
    final updatedProducts = currentState.products.map((p) {
      if (p.productId == productId) {
        return p.copyWith(
          openingStock: openingStock,
          purchaseQty: purchaseQty,
          salesQty: salesQty,
          freeQty: freeQty,
          returnedQty: returnedQty,
          damageQty: damageQty,
        );
      }
      return p;
    }).toList();
    
    _emitLoaded(
      updatedProducts, 
      currentState.customerId, 
      currentState.customerName, 
      currentState.customerType, 
      currentState.entryType
    );
  }

  void _emitLoaded(List<SecondarySalesProductModel> products, String customerId, String customerName, String customerType, String entryType) {
    double totalSalesValue = 0;
    double totalStockValue = 0;
    int totalSalesQty = 0;
    int totalClosingStock = 0;

    for (var p in products) {
      totalSalesValue += p.salesQty * p.unitPrice;
      totalStockValue += p.closingStock * p.unitPrice;
      totalSalesQty += p.salesQty;
      totalClosingStock += p.closingStock;
    }

    state = SecondarySalesLoaded(
      products: products,
      customerId: customerId,
      customerName: customerName,
      customerType: customerType,
      entryType: entryType,
      totalSalesValue: totalSalesValue,
      totalStockValue: totalStockValue,
      totalSalesQty: totalSalesQty,
      totalClosingStock: totalClosingStock,
    );
  }

  Future<void> submit() async {
    if (state is! SecondarySalesLoaded) return;
    final currentState = state as SecondarySalesLoaded;

    final model = SecondarySalesModel(
      id: const Uuid().v4(),
      customerId: currentState.customerId,
      customerName: currentState.customerName,
      customerType: currentState.customerType,
      entryType: currentState.entryType,
      entryDate: DateTime.now(),
      totalSalesValue: currentState.totalSalesValue,
      totalStockValue: currentState.totalStockValue,
      totalSalesQty: currentState.totalSalesQty,
      totalClosingStock: currentState.totalClosingStock,
      products: currentState.products,
    );

    final validator = SecondarySalesValidator();
    final error = validator.validateSubmission(model);
    if (error != null) {
      // Re-emit loaded to clear previous error state if any and show new error via another channel, 
      // but standard approach is emitting Error then falling back. We'll emit error.
      state = SecondarySalesError(error);
      _emitLoaded(
        currentState.products,
        currentState.customerId,
        currentState.customerName,
        currentState.customerType,
        currentState.entryType
      );
      return;
    }

    state = SecondarySalesLoading();
    try {
      await _repository.saveSecondarySales(model);
      state = SecondarySalesSuccess('Secondary Sales & Closing Stock submitted successfully.');
    } catch (e) {
      state = SecondarySalesError('Failed to submit: ${e.toString()}');
      _emitLoaded(
        currentState.products,
        currentState.customerId,
        currentState.customerName,
        currentState.customerType,
        currentState.entryType
      );
    }
  }
}

final secondarySalesNotifierProvider = StateNotifierProvider<SecondarySalesNotifier, SecondarySalesState>((ref) {
  return SecondarySalesNotifier(ref.watch(secondarySalesRepositoryProvider));
});
