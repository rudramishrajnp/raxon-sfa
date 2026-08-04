import '../../data/models/dcr_report_model.dart';
import '../../data/models/product_model.dart';

abstract class DcrReportRepository {
  Future<List<ProductModel>> getActiveProducts();
  Future<void> saveDraft(DcrReportModel draft);
  Future<DcrReportModel?> getDraft(String checkInId, String customerId);
  Future<void> submitReport(DcrReportModel report);
}
