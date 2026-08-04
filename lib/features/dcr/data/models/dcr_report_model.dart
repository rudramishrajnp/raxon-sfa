class SampleItemModel {
  final String productId;
  final String productName;
  final int quantity;
  final int maxStock;

  SampleItemModel({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.maxStock,
  });

  Map<String, dynamic> toJson() => {
        'productId': productId,
        'productName': productName,
        'quantity': quantity,
        'maxStock': maxStock,
      };

  factory SampleItemModel.fromJson(Map<String, dynamic> json) => SampleItemModel(
        productId: json['productId'] as String,
        productName: json['productName'] as String,
        quantity: json['quantity'] as int,
        maxStock: json['maxStock'] as int,
      );
}

class PrescriptionModel {
  final String doctorType; // 'Prescriber', 'Non-Prescriber'
  final List<String> promotedBrands;
  final int? estimatedVolume;
  final String? frequency;
  final String? remarks;

  PrescriptionModel({
    required this.doctorType,
    required this.promotedBrands,
    this.estimatedVolume,
    this.frequency,
    this.remarks,
  });

  Map<String, dynamic> toJson() => {
        'doctorType': doctorType,
        'promotedBrands': promotedBrands,
        'estimatedVolume': estimatedVolume,
        'frequency': frequency,
        'remarks': remarks,
      };

  factory PrescriptionModel.fromJson(Map<String, dynamic> json) => PrescriptionModel(
        doctorType: json['doctorType'] as String,
        promotedBrands: (json['promotedBrands'] as List<dynamic>?)?.map((e) => e as String).toList() ?? [],
        estimatedVolume: json['estimatedVolume'] as int?,
        frequency: json['frequency'] as String?,
        remarks: json['remarks'] as String?,
      );
}

class OrderItemModel {
  final String productId;
  final String productName;
  final int quantity;
  final double? unitPrice;
  final double? totalValue;
  final String? remarks;

  OrderItemModel({
    required this.productId,
    required this.productName,
    required this.quantity,
    this.unitPrice,
    this.totalValue,
    this.remarks,
  });

  Map<String, dynamic> toJson() => {
        'productId': productId,
        'productName': productName,
        'quantity': quantity,
        'unitPrice': unitPrice,
        'totalValue': totalValue,
        'remarks': remarks,
      };

  factory OrderItemModel.fromJson(Map<String, dynamic> json) => OrderItemModel(
        productId: json['productId'] as String,
        productName: json['productName'] as String,
        quantity: json['quantity'] as int,
        unitPrice: json['unitPrice'] != null ? (json['unitPrice'] as num).toDouble() : null,
        totalValue: json['totalValue'] != null ? (json['totalValue'] as num).toDouble() : null,
        remarks: json['remarks'] as String?,
      );
}

class CallSummaryModel {
  final String? doctorFeedback;
  final String? competitorActivity;
  final String? marketFeedback;
  final DateTime? nextFollowUpDate;
  final String? remarks;

  CallSummaryModel({
    this.doctorFeedback,
    this.competitorActivity,
    this.marketFeedback,
    this.nextFollowUpDate,
    this.remarks,
  });

  Map<String, dynamic> toJson() => {
        'doctorFeedback': doctorFeedback,
        'competitorActivity': competitorActivity,
        'marketFeedback': marketFeedback,
        'nextFollowUpDate': nextFollowUpDate?.toIso8601String(),
        'remarks': remarks,
      };

  factory CallSummaryModel.fromJson(Map<String, dynamic> json) => CallSummaryModel(
        doctorFeedback: json['doctorFeedback'] as String?,
        competitorActivity: json['competitorActivity'] as String?,
        marketFeedback: json['marketFeedback'] as String?,
        nextFollowUpDate: json['nextFollowUpDate'] != null ? DateTime.parse(json['nextFollowUpDate'] as String) : null,
        remarks: json['remarks'] as String?,
      );
}

class DcrReportModel {
  final String checkInId;
  final String customerId;
  final List<SampleItemModel> samples;
  final PrescriptionModel? prescription;
  final List<OrderItemModel> orders;
  final CallSummaryModel? summary;
  final bool isDraft;

  DcrReportModel({
    required this.checkInId,
    required this.customerId,
    this.samples = const [],
    this.prescription,
    this.orders = const [],
    this.summary,
    this.isDraft = true,
  });

  Map<String, dynamic> toJson() => {
        'checkInId': checkInId,
        'customerId': customerId,
        'samples': samples.map((e) => e.toJson()).toList(),
        'prescription': prescription?.toJson(),
        'orders': orders.map((e) => e.toJson()).toList(),
        'summary': summary?.toJson(),
        'isDraft': isDraft,
      };

  factory DcrReportModel.fromJson(Map<String, dynamic> json) => DcrReportModel(
        checkInId: json['checkInId'] as String,
        customerId: json['customerId'] as String,
        samples: (json['samples'] as List<dynamic>?)?.map((e) => SampleItemModel.fromJson(e as Map<String, dynamic>)).toList() ?? [],
        prescription: json['prescription'] != null ? PrescriptionModel.fromJson(json['prescription'] as Map<String, dynamic>) : null,
        orders: (json['orders'] as List<dynamic>?)?.map((e) => OrderItemModel.fromJson(e as Map<String, dynamic>)).toList() ?? [],
        summary: json['summary'] != null ? CallSummaryModel.fromJson(json['summary'] as Map<String, dynamic>) : null,
        isDraft: json['isDraft'] as bool? ?? true,
      );
}
