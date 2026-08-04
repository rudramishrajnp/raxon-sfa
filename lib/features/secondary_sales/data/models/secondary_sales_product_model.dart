class SecondarySalesProductModel {
  final String id;
  final String salesId;
  final String productId;
  final String productName;
  final String pack;
  final String strength;
  final String unit;
  
  final int openingStock;
  final int purchaseQty;
  final int salesQty;
  final int closingStock;
  final int freeQty;
  final int returnedQty;
  final int damageQty;
  
  final double unitPrice;

  SecondarySalesProductModel({
    required this.id,
    required this.salesId,
    required this.productId,
    required this.productName,
    required this.pack,
    required this.strength,
    required this.unit,
    required this.openingStock,
    required this.purchaseQty,
    required this.salesQty,
    required this.closingStock,
    required this.freeQty,
    required this.returnedQty,
    required this.damageQty,
    required this.unitPrice,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'salesId': salesId,
        'productId': productId,
        'productName': productName,
        'pack': pack,
        'strength': strength,
        'unit': unit,
        'openingStock': openingStock,
        'purchaseQty': purchaseQty,
        'salesQty': salesQty,
        'closingStock': closingStock,
        'freeQty': freeQty,
        'returnedQty': returnedQty,
        'damageQty': damageQty,
        'unitPrice': unitPrice,
      };
      
  SecondarySalesProductModel copyWith({
    int? openingStock,
    int? purchaseQty,
    int? salesQty,
    int? freeQty,
    int? returnedQty,
    int? damageQty,
  }) {
    final newOpening = openingStock ?? this.openingStock;
    final newPurchase = purchaseQty ?? this.purchaseQty;
    final newSales = salesQty ?? this.salesQty;
    final newFree = freeQty ?? this.freeQty;
    final newReturned = returnedQty ?? this.returnedQty;
    final newDamage = damageQty ?? this.damageQty;
    
    // Auto calculation: Closing Stock = Opening + Purchase - Sales - Damage - Return
    final newClosing = newOpening + newPurchase - newSales - newDamage - newReturned;
    
    return SecondarySalesProductModel(
      id: id,
      salesId: salesId,
      productId: productId,
      productName: productName,
      pack: pack,
      strength: strength,
      unit: unit,
      openingStock: newOpening,
      purchaseQty: newPurchase,
      salesQty: newSales,
      closingStock: newClosing,
      freeQty: newFree,
      returnedQty: newReturned,
      damageQty: newDamage,
      unitPrice: unitPrice,
    );
  }
}
