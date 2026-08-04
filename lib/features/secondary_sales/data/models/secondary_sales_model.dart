import 'secondary_sales_product_model.dart';

class SecondarySalesModel {
  final String id;
  final String customerId;
  final String customerName;
  final String customerType;
  final String entryType;
  final DateTime entryDate;
  
  final double totalSalesValue;
  final double totalStockValue;
  final int totalSalesQty;
  final int totalClosingStock;
  
  final String status;
  final String? managerRemarks;
  
  final List<SecondarySalesProductModel> products;

  SecondarySalesModel({
    required this.id,
    required this.customerId,
    required this.customerName,
    required this.customerType,
    required this.entryType,
    required this.entryDate,
    required this.totalSalesValue,
    required this.totalStockValue,
    required this.totalSalesQty,
    required this.totalClosingStock,
    this.status = 'Pending',
    this.managerRemarks,
    this.products = const [],
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'customerId': customerId,
        'customerName': customerName,
        'customerType': customerType,
        'entryType': entryType,
        'entryDate': entryDate.toIso8601String(),
        'totalSalesValue': totalSalesValue,
        'totalStockValue': totalStockValue,
        'totalSalesQty': totalSalesQty,
        'totalClosingStock': totalClosingStock,
        'status': status,
        'managerRemarks': managerRemarks,
        'products': products.map((p) => p.toJson()).toList(),
      };
}
