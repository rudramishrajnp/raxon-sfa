import 'package:drift/drift.dart';

@DataClassName('CustomerEntry')
class CustomerTable extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get type => text()(); // Doctor, Chemist
  TextColumn get specialty => text().nullable()();
  TextColumn get qualification => text().nullable()();
  TextColumn get mobile => text().nullable()();
  TextColumn get address => text().nullable()();
  RealColumn get latitude => real().nullable()();
  RealColumn get longitude => real().nullable()();
  TextColumn get area => text().nullable()();
  TextColumn get city => text().nullable()();
  TextColumn get state => text().nullable()();
  TextColumn get pincode => text().nullable()();
  TextColumn get classification => text().nullable()(); // A, B, C
  TextColumn get status => text().withDefault(const Constant('APPROVED'))(); // APPROVED, PENDING
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {id};
}
