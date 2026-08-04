import 'package:drift/drift.dart';

@DataClassName('MtpAuditEntry')
class MtpAuditTable extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get mtpId => text()();
  TextColumn get actionBy => text()(); // Employee ID of person taking action
  TextColumn get actionByName => text()(); 
  TextColumn get previousStatus => text()();
  TextColumn get newStatus => text()();
  TextColumn get remarks => text().nullable()();
  DateTimeColumn get actionDate => dateTime().withDefault(currentDateAndTime)();
  IntColumn get syncStatus => integer().withDefault(const Constant(0))();
}
