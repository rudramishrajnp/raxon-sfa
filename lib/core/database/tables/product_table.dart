import 'package:drift/drift.dart';

@DataClassName('ProductEntry')
class ProductTable extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get strength => text().nullable()();
  TextColumn get pack => text().nullable()();
  IntColumn get availableStock => integer().withDefault(const Constant(0))();
  RealColumn get price => real().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
