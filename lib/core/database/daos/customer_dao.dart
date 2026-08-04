import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/customer_table.dart';

part 'customer_dao.g.dart';

@DriftAccessor(tables: [CustomerTable])
class CustomerDao extends DatabaseAccessor<AppDatabase> with _$CustomerDaoMixin {
  CustomerDao(AppDatabase db) : super(db);

  Future<int> insertCustomer(CustomerTableCompanion entry) {
    return into(customerTable).insertOnConflictUpdate(entry);
  }
  
  Future<void> insertCustomers(List<CustomerTableCompanion> entries) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(customerTable, entries);
    });
  }

  Future<List<CustomerEntry>> getAllCustomers() {
    return select(customerTable).get();
  }

  Future<List<CustomerEntry>> searchCustomers(String query) {
    return (select(customerTable)..where((t) => t.name.like('%$query%'))).get();
  }
}
