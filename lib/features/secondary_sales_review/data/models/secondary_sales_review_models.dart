class SalesReviewModel {
  final String id;
  final String employeeId;
  final String employeeName;
  final String employeeCode;
  final String hq;
  final String territory;
  
  final String stockistName;
  final String? retailerName;
  final DateTime date;
  
  final List<ProductSalesReviewModel> products;
  final double totalSalesQuantity;
  final double totalSalesValue;
  final double totalClosingStockValue;
  
  final String status; // 'Pending', 'Approved', 'Rejected', 'Returned'
  final String syncStatus;
  
  final List<SalesAuditLogModel> auditTrail;

  SalesReviewModel({
    required this.id,
    required this.employeeId,
    required this.employeeName,
    required this.employeeCode,
    required this.hq,
    required this.territory,
    required this.stockistName,
    this.retailerName,
    required this.date,
    required this.products,
    required this.totalSalesQuantity,
    required this.totalSalesValue,
    required this.totalClosingStockValue,
    required this.status,
    required this.syncStatus,
    this.auditTrail = const [],
  });
}

class ProductSalesReviewModel {
  final String productId;
  final String productName;
  final double openingStock;
  final double purchaseQuantity;
  final double salesQuantity;
  final double closingStock;
  final double damageQuantity;
  final double returnQuantity;
  final double salesValue;
  final double closingStockValue;

  ProductSalesReviewModel({
    required this.productId,
    required this.productName,
    required this.openingStock,
    required this.purchaseQuantity,
    required this.salesQuantity,
    required this.closingStock,
    required this.damageQuantity,
    required this.returnQuantity,
    required this.salesValue,
    required this.closingStockValue,
  });
}

class SalesAnalyticsSummary {
  final double totalSalesQuantity;
  final double totalSalesValue;
  final double closingStockValue;
  final String bestSellingProduct;
  final String slowMovingProduct;
  final String highestPerformingMr;
  final String lowestPerformingTerritory;

  SalesAnalyticsSummary({
    required this.totalSalesQuantity,
    required this.totalSalesValue,
    required this.closingStockValue,
    required this.bestSellingProduct,
    required this.slowMovingProduct,
    required this.highestPerformingMr,
    required this.lowestPerformingTerritory,
  });
}

class SalesAuditLogModel {
  final String action;
  final String byUser;
  final DateTime timestamp;
  final String? remarks;

  SalesAuditLogModel({
    required this.action,
    required this.byUser,
    required this.timestamp,
    this.remarks,
  });
}

class SalesExceptionReport {
  final String type; // 'Negative Growth', 'Zero Sales', 'Low Stock', 'Overstock', 'Duplicate'
  final String description;
  final String relatedEntity; // MR, Product, Stockist

  SalesExceptionReport({
    required this.type,
    required this.description,
    required this.relatedEntity,
  });
}
