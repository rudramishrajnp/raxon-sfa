import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/secondary_sales_review_models.dart';

class SecondarySalesReviewApiService {
  Future<List<SalesReviewModel>> getSalesReviews(String managerId, {Map<String, dynamic>? filters}) async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
    return [
      SalesReviewModel(
        id: 'SAL-001',
        employeeId: 'EMP-001',
        employeeName: 'Rajesh Kumar',
        employeeCode: 'RK001',
        hq: 'Mumbai',
        territory: 'Andheri West',
        stockistName: 'ABC Pharma',
        retailerName: 'HealthPlus Pharmacy',
        date: DateTime.now().subtract(const Duration(days: 1)),
        products: [
          ProductSalesReviewModel(
            productId: 'P-001',
            productName: 'Paracetamol 500mg',
            openingStock: 100,
            purchaseQuantity: 50,
            salesQuantity: 80,
            closingStock: 70,
            damageQuantity: 0,
            returnQuantity: 0,
            salesValue: 8000.0,
            closingStockValue: 7000.0,
          ),
          ProductSalesReviewModel(
            productId: 'P-002',
            productName: 'Amoxicillin 250mg',
            openingStock: 50,
            purchaseQuantity: 20,
            salesQuantity: 30,
            closingStock: 40,
            damageQuantity: 0,
            returnQuantity: 0,
            salesValue: 4500.0,
            closingStockValue: 6000.0,
          ),
        ],
        totalSalesQuantity: 110,
        totalSalesValue: 12500.0,
        totalClosingStockValue: 13000.0,
        status: 'Pending',
        syncStatus: 'Synced',
        auditTrail: [
          SalesAuditLogModel(action: 'Submitted', byUser: 'Rajesh Kumar', timestamp: DateTime.now().subtract(const Duration(days: 1))),
        ],
      ),
    ];
  }

  Future<SalesAnalyticsSummary> getAnalyticsSummary(String managerId) async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
    return SalesAnalyticsSummary(
      totalSalesQuantity: 4520,
      totalSalesValue: 450000.0,
      closingStockValue: 125000.0,
      bestSellingProduct: 'Paracetamol 500mg',
      slowMovingProduct: 'Vitamin C Syrup',
      highestPerformingMr: 'Sunita Patel',
      lowestPerformingTerritory: 'Borivali East',
    );
  }

  Future<List<SalesExceptionReport>> getExceptionReports(String managerId) async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
    return [
      SalesExceptionReport(type: 'Low Stock', description: 'Stock for Amoxicillin below 10 units', relatedEntity: 'ABC Pharma'),
      SalesExceptionReport(type: 'Negative Growth', description: 'Sales dropped by 15% this week', relatedEntity: 'Rajesh Kumar'),
      SalesExceptionReport(type: 'Zero Sales', description: 'No sales for 3 days', relatedEntity: 'HealthPlus Pharmacy'),
    ];
  }

  Future<void> updateSalesStatus(String salesId, String managerId, String action, String? remarks) async {
    // Replaced mock delay with Dio
    // await _dio.post(path, data: data);
  }
}

final secondarySalesReviewApiServiceProvider = Provider((ref) => SecondarySalesReviewApiService());
