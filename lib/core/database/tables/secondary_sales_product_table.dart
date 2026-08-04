import 'package:drift/drift.dart';

@DataClassName('SecondarySalesProductEntry')
class SecondarySalesProductTable extends Table {
  TextColumn get id => text()();
  TextColumn get salesId => text()(); // FK to SecondarySalesTable
  TextColumn get productId => text()();
  TextColumn get productName => text()();
  TextColumn get pack => text()();
  TextColumn get strength => text()();
  TextColumn get unit => text()();
  
  IntColumn get openingStock => integer().withDefault(const Constant(0))();
  IntColumn get purchaseQty => integer().withDefault(const Constant(0))();
  IntColumn get salesQty => integer().withDefault(const Constant(0))();
  IntColumn get closingStock => integer().withDefault(const Constant(0))();
  IntColumn get freeQty => integer().withDefault(const Constant(0))();
  IntColumn get returnedQty => integer().withDefault(const Constant(0))();
  IntColumn get damageQty => integer().withDefault(const Constant(0))();
  
  RealColumn get unitPrice => real().withDefault(const Constant(0.0))();

  @override
  Set<Column> get primaryKey => {id};
}
