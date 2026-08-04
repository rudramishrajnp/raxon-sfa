import 'package:drift/drift.dart';

@DataClassName('SecondarySalesEntry')
class SecondarySalesTable extends Table {
  TextColumn get id => text()();
  TextColumn get customerId => text()();
  TextColumn get customerName => text()();
  TextColumn get customerType => text()(); // Stockist or Retailer
  TextColumn get entryType => text()(); // Weekly or Monthly
  DateTimeColumn get entryDate => dateTime()();
  RealColumn get totalSalesValue => real().withDefault(const Constant(0.0))();
  RealColumn get totalStockValue => real().withDefault(const Constant(0.0))();
  IntColumn get totalSalesQty => integer().withDefault(const Constant(0))();
  IntColumn get totalClosingStock => integer().withDefault(const Constant(0))();
  
  // Manager Review
  TextColumn get status => text().withDefault(const Constant('Pending'))(); // Pending, Approved, Rejected
  TextColumn get managerRemarks => text().nullable()();
  
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {id};
}
