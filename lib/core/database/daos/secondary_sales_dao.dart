import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/secondary_sales_table.dart';
import '../tables/secondary_sales_product_table.dart';

part 'secondary_sales_dao.g.dart';

@DriftAccessor(tables: [SecondarySalesTable, SecondarySalesProductTable])
class SecondarySalesDao extends DatabaseAccessor<AppDatabase> with _$SecondarySalesDaoMixin {
  SecondarySalesDao(AppDatabase db) : super(db);

  Future<int> insertSecondarySales(SecondarySalesTableCompanion entry) {
    return into(secondarySalesTable).insert(entry);
  }

  Future<List<SecondarySalesEntry>> getAllSecondarySales() {
    return select(secondarySalesTable).get();
  }
}
