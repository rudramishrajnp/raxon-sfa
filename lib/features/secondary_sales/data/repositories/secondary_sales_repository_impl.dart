import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../../../core/sync/sync_manager.dart';
import '../../domain/repositories/secondary_sales_repository.dart';
import '../api/secondary_sales_api_service.dart';
import '../../data/models/secondary_sales_model.dart';
import '../../data/models/secondary_sales_product_model.dart';

class SecondarySalesRepositoryImpl implements SecondarySalesRepository {
  final SecondarySalesApiService _apiService;
  // ignore: unused_field
  final AppDatabase _db;
  final ConnectivityService _connectivityService;
  final SyncManager _syncManager;

  SecondarySalesRepositoryImpl(
    this._apiService,
    this._db,
    this._connectivityService,
    this._syncManager,
  );

  @override
  Future<void> saveSecondarySales(SecondarySalesModel sales) async {
    final isConnected = await _connectivityService.isConnected();
    if (isConnected) {
      try {
        await _apiService.submitSecondarySales(sales);
      } catch (e) {
        await _syncManager.enqueueOperation('SecondarySales', sales.id, 'CREATE', jsonEncode(sales.toJson()));
      }
    } else {
      await _syncManager.enqueueOperation('SecondarySales', sales.id, 'CREATE', jsonEncode(sales.toJson()));
    }
  }

  @override
  Future<List<SecondarySalesModel>> getRecentSales() async {
    // Stub: Returns recent local entries
    return [];
  }

  @override
  Future<List<SecondarySalesProductModel>> getProductsForCustomer(String customerId) async {
    // Stub: Returns products master data initialized for Secondary Sales
    return [
      SecondarySalesProductModel(
        id: 'P1',
        salesId: '',
        productId: 'PROD_1',
        productName: 'Amoxicillin 500mg',
        pack: '10x10',
        strength: '500mg',
        unit: 'Box',
        openingStock: 0,
        purchaseQty: 0,
        salesQty: 0,
        closingStock: 0,
        freeQty: 0,
        returnedQty: 0,
        damageQty: 0,
        unitPrice: 150.0,
      ),
      SecondarySalesProductModel(
        id: 'P2',
        salesId: '',
        productId: 'PROD_2',
        productName: 'Paracetamol 650mg',
        pack: '15x10',
        strength: '650mg',
        unit: 'Box',
        openingStock: 0,
        purchaseQty: 0,
        salesQty: 0,
        closingStock: 0,
        freeQty: 0,
        returnedQty: 0,
        damageQty: 0,
        unitPrice: 45.0,
      ),
    ];
  }
}

final secondarySalesRepositoryProvider = Provider<SecondarySalesRepository>((ref) {
  return SecondarySalesRepositoryImpl(
    ref.watch(secondarySalesApiServiceProvider),
    ref.watch(databaseProvider),
    ref.watch(connectivityServiceProvider),
    ref.watch(syncManagerProvider),
  );
});
