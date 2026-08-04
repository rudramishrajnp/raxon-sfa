import '../../data/models/secondary_sales_product_model.dart';
import '../../data/models/secondary_sales_model.dart';

abstract class SecondarySalesState {}

class SecondarySalesInitial extends SecondarySalesState {}

class SecondarySalesLoading extends SecondarySalesState {}

class SecondarySalesLoaded extends SecondarySalesState {
  final List<SecondarySalesProductModel> products;
  final String customerId;
  final String customerName;
  final String customerType;
  final String entryType;
  
  final double totalSalesValue;
  final double totalStockValue;
  final int totalSalesQty;
  final int totalClosingStock;

  SecondarySalesLoaded({
    required this.products,
    required this.customerId,
    required this.customerName,
    required this.customerType,
    required this.entryType,
    required this.totalSalesValue,
    required this.totalStockValue,
    required this.totalSalesQty,
    required this.totalClosingStock,
  });
}

class SecondarySalesSuccess extends SecondarySalesState {
  final String message;
  SecondarySalesSuccess(this.message);
}

class SecondarySalesError extends SecondarySalesState {
  final String message;
  SecondarySalesError(this.message);
}
