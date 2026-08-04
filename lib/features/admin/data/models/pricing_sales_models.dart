class ProductPricingModel {
  final String id;
  final String productId;
  final String productName;
  final double mrp;
  final double ptr;
  final double pts;
  final double distributorPrice;
  final double sampleCost;
  final double schemePrice;
  final DateTime effectiveFrom;
  final DateTime? effectiveTo;

  ProductPricingModel({
    required this.id,
    required this.productId,
    required this.productName,
    required this.mrp,
    required this.ptr,
    required this.pts,
    required this.distributorPrice,
    required this.sampleCost,
    required this.schemePrice,
    required this.effectiveFrom,
    this.effectiveTo,
  });
}

class BatchModel {
  final String id;
  final String productId;
  final String productName;
  final String batchNumber;
  final DateTime manufacturingDate;
  final DateTime expiryDate;
  final double batchMrp;
  final double batchPtr;
  final double batchPts;
  final String status; // Active, Expired, Recalled

  BatchModel({
    required this.id,
    required this.productId,
    required this.productName,
    required this.batchNumber,
    required this.manufacturingDate,
    required this.expiryDate,
    required this.batchMrp,
    required this.batchPtr,
    required this.batchPts,
    required this.status,
  });
}

class PrimarySalesInvoiceModel {
  final String id;
  final String invoiceNumber;
  final DateTime invoiceDate;
  final String distributorId;
  final String distributorName;
  final String stockistId;
  final String stockistName;
  final String productId;
  final String productName;
  final String batchNumber;
  final int quantity;
  final int freeQuantity;
  final double rate;
  final double discount;
  final double tax;
  final double netAmount;
  final String hq;
  final String region;

  PrimarySalesInvoiceModel({
    required this.id,
    required this.invoiceNumber,
    required this.invoiceDate,
    required this.distributorId,
    required this.distributorName,
    required this.stockistId,
    required this.stockistName,
    required this.productId,
    required this.productName,
    required this.batchNumber,
    required this.quantity,
    required this.freeQuantity,
    required this.rate,
    required this.discount,
    required this.tax,
    required this.netAmount,
    required this.hq,
    required this.region,
  });
}

class ImportHistoryModel {
  final String id;
  final DateTime importDate;
  final String importedBy;
  final String fileName;
  final int totalRecords;
  final int successfulRecords;
  final int failedRecords;
  final Duration processingTime;

  ImportHistoryModel({
    required this.id,
    required this.importDate,
    required this.importedBy,
    required this.fileName,
    required this.totalRecords,
    required this.successfulRecords,
    required this.failedRecords,
    required this.processingTime,
  });
}

class ImportValidationResultModel {
  final bool isValid;
  final List<String> errors;
  final List<Map<String, dynamic>> validRows;

  ImportValidationResultModel({
    required this.isValid,
    required this.errors,
    required this.validRows,
  });
}
