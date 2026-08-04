import '../../data/models/secondary_sales_model.dart';
import '../../data/models/secondary_sales_product_model.dart';

class SecondarySalesValidator {
  String? validateEntry(SecondarySalesProductModel product) {
    if (product.openingStock < 0) return 'Opening stock cannot be negative.';
    if (product.purchaseQty < 0) return 'Purchase quantity cannot be negative.';
    if (product.salesQty < 0) return 'Sales quantity cannot be negative.';
    if (product.freeQty < 0) return 'Free quantity cannot be negative.';
    if (product.returnedQty < 0) return 'Returned quantity cannot be negative.';
    if (product.damageQty < 0) return 'Damage quantity cannot be negative.';
    if (product.closingStock < 0) return 'Closing stock cannot be negative. Check your quantities.';
    
    return null;
  }

  String? validateSubmission(SecondarySalesModel model) {
    if (model.customerId.isEmpty) return 'Customer selection is required.';
    if (model.products.isEmpty) return 'No products added.';
    
    for (var p in model.products) {
      final error = validateEntry(p);
      if (error != null) {
        return '${p.productName}: $error';
      }
    }
    
    return null;
  }
}
