import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'connection/connection.dart';
import '../constants/app_constants.dart';

import 'tables/sync_queue_table.dart';
import 'tables/attendance_table.dart';
import 'tables/customer_table.dart';
import 'tables/dcr_checkin_table.dart';
import 'tables/dcr_checkout_table.dart';
import 'tables/dcr_report_table.dart';
import 'tables/dcr_submission_table.dart';
import 'tables/deviation_table.dart';
import 'tables/expense_approval_table.dart';
import 'tables/expense_audit_table.dart';
import 'tables/expense_bill_table.dart';
import 'tables/expense_payment_table.dart';
import 'tables/expense_table.dart';
import 'tables/gps_log_table.dart';
import 'tables/holiday_table.dart';
import 'tables/joint_work_table.dart';
import 'tables/misc_expense_table.dart';
import 'tables/mtp_audit_table.dart';
import 'tables/mtp_settings_table.dart';
import 'tables/mtp_tables.dart';
import 'tables/override_request_table.dart';
import 'tables/product_table.dart';
import 'tables/secondary_sales_product_table.dart';
import 'tables/secondary_sales_table.dart';

import 'daos/attendance_dao.dart';
import 'daos/sync_queue_dao.dart';
import 'daos/customer_dao.dart';
import 'daos/dcr_dao.dart';
import 'daos/expense_dao.dart';
import 'daos/mtp_dao.dart';
import 'daos/secondary_sales_dao.dart';

part 'app_database.g.dart';

@DriftDatabase(
  tables: [
    SyncQueueTable,
    AttendanceTable,
    CustomerTable,
    DcrCheckInTable,
    DcrCheckOutTable,
    DcrReportTable,
    DcrSubmissionTable,
    DeviationTable,
    ExpenseApprovalTable,
    ExpenseAuditTable,
    ExpenseBillTable,
    ExpensePaymentTable,
    ExpenseTable,
    GpsLogTable,
    HolidayTable,
    JointWorkTable,
    MiscExpenseTable,
    MtpAuditTable,
    MtpSettingsTable,
    MtpTable,
    MtpDayTable,
    MtpDoctorTable,
    OverrideRequestTable,
    ProductTable,
    SecondarySalesProductTable,
    SecondarySalesTable,
  ],
  daos: [
    AttendanceDao,
    SyncQueueDao,
    CustomerDao,
    DcrDao,
    ExpenseDao,
    MtpDao,
    SecondarySalesDao,
  ]
)
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(openConnection());

  @override
  int get schemaVersion => 1;

  @override
  MigrationStrategy get migration => MigrationStrategy(
    onCreate: (Migrator m) async {
      await m.createAll();
    },
    onUpgrade: (Migrator m, int from, int to) async {
      // Handle migrations
    },
  );
}

final databaseProvider = Provider<AppDatabase>((ref) {
  return AppDatabase();
});
