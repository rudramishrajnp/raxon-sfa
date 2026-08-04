import '../../data/models/secondary_sales_model.dart';
import '../../data/models/secondary_sales_product_model.dart';

abstract class SecondarySalesRepository {
  Future<void> saveSecondarySales(SecondarySalesModel sales);
  Future<List<SecondarySalesModel>> getRecentSales();
  Future<List<SecondarySalesProductModel>> getProductsForCustomer(String customerId);
}
