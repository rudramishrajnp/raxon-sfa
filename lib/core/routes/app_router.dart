import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/super_admin/presentation/screens/geo_settings_screen.dart';
import '../../features/super_admin/presentation/screens/tada_matrix_screen.dart';
import '../../features/super_admin/presentation/screens/mtp_settings_screen.dart';
import '../../features/super_admin/presentation/screens/system_configuration_screen.dart';
import '../../features/super_admin/presentation/screens/security_settings_screen.dart';

import '../../features/super_admin/presentation/screens/super_admin_dashboard_screen.dart';
import '../../features/super_admin/presentation/screens/company_management_screen.dart';
import '../../features/super_admin/presentation/screens/role_management_screen.dart';
import '../../features/super_admin/presentation/screens/feature_toggle_screen.dart';
import '../../features/super_admin/presentation/screens/global_settings_screen.dart';
import '../../features/super_admin/presentation/screens/database_backup_screen.dart';
import '../../features/super_admin/presentation/screens/license_management_screen.dart';
import '../../features/super_admin/presentation/screens/developer_console_screen.dart';

import '../../features/admin/presentation/screens/analytics/executive_dashboard.dart';
import '../../features/admin/presentation/screens/analytics/analytics_dashboard.dart';
import '../../features/admin/presentation/screens/reports/report_center_screen.dart';
import '../../features/admin/presentation/screens/reports/report_builder_screen.dart';
import '../../features/admin/presentation/screens/audit/audit_log_dashboard.dart';
import '../../features/admin/presentation/screens/audit/login_history_screen.dart';
import '../../features/admin/presentation/screens/audit/device_history_screen.dart';

import '../../features/admin/presentation/screens/holiday/holiday_management_screen.dart';
import '../../features/admin/presentation/screens/holiday/holiday_calendar_screen.dart';
import '../../features/admin/presentation/screens/broadcast/broadcast_console_screen.dart';
import '../../features/admin/presentation/screens/broadcast/notification_composer_screen.dart';
import '../../features/admin/presentation/screens/broadcast/notification_template_screen.dart';
import '../../features/admin/presentation/screens/broadcast/broadcast_history_screen.dart';
import '../../features/admin/presentation/screens/broadcast/delivery_tracking_dashboard.dart';

import '../../features/admin/presentation/screens/pricing/product_pricing_screen.dart';
import '../../features/admin/presentation/screens/pricing/batch_management_screen.dart';
import '../../features/admin/presentation/screens/sales/primary_sales_dashboard.dart';
import '../../features/admin/presentation/screens/sales/primary_sales_import_screen.dart';
import '../../features/admin/presentation/screens/sales/import_mapping_wizard.dart';
import '../../features/admin/presentation/screens/sales/import_history_screen.dart';

import '../../features/admin/presentation/screens/master/doctor_master_screen.dart';
import '../../features/admin/presentation/screens/master/chemist_master_screen.dart';
import '../../features/admin/presentation/screens/master/product_master_screen.dart';
import '../../features/admin/presentation/screens/master/product_assignment_screen.dart';
import '../../features/admin/presentation/screens/approval/customer_approval_screen.dart';

import '../../features/admin/presentation/screens/admin_dashboard_screen.dart';
import '../../features/admin/presentation/screens/user_list_screen.dart';
import '../../features/admin/presentation/screens/user_details_screen.dart';
import '../../features/admin/presentation/screens/add_edit_user_screen.dart';
import '../../features/admin/presentation/screens/hierarchy_tree_screen.dart';
import '../../features/admin/presentation/screens/territory_management_screen.dart';

import '../../features/communication/presentation/screens/notification_center_screen.dart';
import '../../features/communication/presentation/screens/chat_list_screen.dart';
import '../../features/communication/presentation/screens/chat_detail_screen.dart';
import '../../features/communication/presentation/screens/broadcast_screen.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/splash/presentation/splash_screen.dart';
import '../../features/sync_center/presentation/screens/sync_center_screen.dart';
import '../../features/authentication/presentation/screens/login_screen.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/manager_dashboard/presentation/screens/manager_dashboard_screen.dart';
import '../../features/attendance/presentation/screens/punch_in_screen.dart';
import '../../features/mtp/presentation/screens/mtp_screen.dart';
import '../../features/mtp/presentation/screens/mtp_approval_screen.dart';
import '../../features/mtp/presentation/screens/mtp_locked_screen.dart';
import '../../features/work_plan/presentation/screens/work_plan_screen.dart';
import '../../features/work_plan/presentation/screens/add_customer_screen.dart';
import '../../features/dcr/presentation/screens/dcr_checkin_screen.dart';
import '../../features/dcr/presentation/screens/dcr_report_screen.dart';
import '../../features/dcr/presentation/screens/dcr_checkout_screen.dart';
import '../../features/dcr/presentation/screens/dcr_summary_screen.dart';
import '../../features/secondary_sales/presentation/screens/closing_stock_screen.dart';
import '../../features/secondary_sales/presentation/screens/secondary_sales_screen.dart';
import '../../features/expense/presentation/screens/expense_home_screen.dart';
import '../../features/expense/presentation/screens/daily_expense_entry_screen.dart';
import '../../features/expense/presentation/screens/bill_upload_screen.dart';
import '../../features/expense/presentation/screens/manager_review_screen.dart';
import '../../features/expense/presentation/screens/finance_review_screen.dart';
import '../../features/expense/presentation/screens/payment_status_screen.dart';
import '../../features/work_plan/data/models/customer_model.dart';
import '../../features/team_tracking/presentation/screens/team_tracking_screen.dart';
import '../../features/team_tracking/presentation/screens/team_route_screen.dart';
import '../../features/team_tracking/data/models/team_tracking_models.dart';
import '../../features/mtp_review/presentation/screens/mtp_review_list_screen.dart';
import '../../features/mtp_review/presentation/screens/mtp_review_details_screen.dart';
import '../../features/mtp_review/data/models/mtp_review_models.dart';
import '../../features/dcr_review/presentation/screens/dcr_review_list_screen.dart';
import '../../features/dcr_review/presentation/screens/dcr_review_details_screen.dart';
import '../../features/dcr_review/data/models/dcr_review_models.dart';
import '../../features/expense_approval/presentation/screens/expense_approval_list_screen.dart';
import '../../features/expense_approval/presentation/screens/expense_approval_details_screen.dart';
import '../../features/expense_approval/presentation/screens/bill_preview_screen.dart';
import '../../features/expense_approval/data/models/expense_approval_models.dart';
import '../../features/attendance_override/presentation/screens/manager_override_list_screen.dart';
import '../../features/attendance_override/presentation/screens/manager_override_review_screen.dart';
import '../../features/attendance_override/presentation/screens/override_request_screen.dart';
import '../../features/attendance_override/data/models/override_models.dart';
import '../../features/secondary_sales_review/presentation/screens/secondary_sales_review_dashboard.dart';
import '../../features/secondary_sales_review/presentation/screens/secondary_sales_details_screen.dart';
import '../../features/secondary_sales_review/data/models/secondary_sales_review_models.dart';
import '../../features/reports_analytics/presentation/screens/reports_dashboard_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(path: '/', builder: (context, state) => const SplashScreen()),
      GoRoute(path: '/sync-center', builder: (context, state) => const SyncCenterScreen()),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(path: '/dashboard', builder: (context, state) => const DashboardScreen()),
      GoRoute(path: '/manager-dashboard', builder: (context, state) => const ManagerDashboardScreen()),
      GoRoute(path: '/punch-in', builder: (context, state) => const PunchInScreen()),
      GoRoute(path: '/mtp', builder: (context, state) => const MtpScreen()),
      GoRoute(path: '/mtp-approval/:id', builder: (context, state) => MtpApprovalScreen(mtpId: state.pathParameters['id']!)),
      GoRoute(path: '/mtp-locked', builder: (context, state) => MtpLockedScreen(reason: state.extra as String? ?? 'Access restricted.')),
      GoRoute(path: '/work-plan', builder: (context, state) => const WorkPlanScreen()),
      GoRoute(path: '/add-customer', builder: (context, state) => const AddCustomerScreen()),
      GoRoute(path: '/check-in', builder: (context, state) => DcrCheckInScreen(customer: state.extra as CustomerModel)),
      GoRoute(path: '/dcr-report', builder: (context, state) => DcrReportScreen(checkInId: (state.extra as Map)['checkInId']!, customerId: (state.extra as Map)['customerId']!)),
      GoRoute(path: '/dcr-checkout', builder: (context, state) => DcrCheckOutScreen(checkInId: (state.extra as Map)['checkInId'], customerId: (state.extra as Map)['customerId'], customerName: (state.extra as Map)['customerName'], targetLat: (state.extra as Map)['targetLat'], targetLng: (state.extra as Map)['targetLng'])),
      GoRoute(path: '/dcr-summary', builder: (context, state) => DcrSummaryScreen(checkInId: (state.extra as Map)['checkInId'], customerId: (state.extra as Map)['customerId'], customerName: (state.extra as Map)['customerName'])),
      GoRoute(path: '/closing-stock', builder: (context, state) => const ClosingStockScreen()),
      GoRoute(path: '/secondary-sales-entry', builder: (context, state) => SecondarySalesScreen(customerId: (state.extra as Map)['customerId'], customerName: (state.extra as Map)['customerName'], customerType: (state.extra as Map)['customerType'], entryType: (state.extra as Map)['entryType'])),
      GoRoute(path: '/expense-home', builder: (context, state) => const ExpenseHomeScreen()),
      GoRoute(path: '/expense-entry', builder: (context, state) => const DailyExpenseEntryScreen()),
      GoRoute(path: '/bill-upload', builder: (context, state) => BillUploadScreen(expenseId: (state.extra as Map)['expenseId'])),
      GoRoute(path: '/manager-review', builder: (context, state) => ManagerReviewScreen(expenseId: (state.extra as Map)['expenseId'], claimAmount: (state.extra as Map)['claimAmount'])),
      GoRoute(path: '/finance-review', builder: (context, state) => FinanceReviewScreen(expenseId: (state.extra as Map)['expenseId'], approvedAmount: (state.extra as Map)['approvedAmount'])),
      GoRoute(path: '/payment-status', builder: (context, state) => PaymentStatusScreen(expenseId: (state.extra as Map)['expenseId'])),
      GoRoute(path: '/team-tracking', builder: (context, state) => const TeamTrackingScreen()),
      GoRoute(path: '/team-route', builder: (context, state) => TeamRouteScreen(member: state.extra as TeamMemberLocationModel)),
      GoRoute(path: '/mtp-review', builder: (context, state) => const MtpReviewListScreen()),
      GoRoute(path: '/mtp-review-details', builder: (context, state) => MtpReviewDetailsScreen(submission: state.extra as MtpSubmissionModel)),
      GoRoute(path: '/dcr-review', builder: (context, state) => const DcrReviewListScreen()),
      GoRoute(path: '/dcr-review-details', builder: (context, state) => DcrReviewDetailsScreen(submission: state.extra as DcrSubmissionModel)),
      GoRoute(path: '/expense-approval', builder: (context, state) => const ExpenseApprovalListScreen()),
      GoRoute(path: '/expense-details', builder: (context, state) => ExpenseApprovalDetailsScreen(submission: state.extra as ExpenseSubmissionModel)),
      GoRoute(path: '/bill-preview', builder: (context, state) => BillPreviewScreen(bill: state.extra as ExpenseBillModel)),
      GoRoute(path: '/manager-overrides', builder: (context, state) => const ManagerOverrideListScreen()),
      GoRoute(path: '/override-review', builder: (context, state) => ManagerOverrideReviewScreen(request: state.extra as OverrideRequestModel)),
      GoRoute(path: '/request-override', builder: (context, state) => const OverrideRequestScreen()),
      GoRoute(path: '/secondary-sales-review', builder: (context, state) => const SecondarySalesReviewDashboard()),
      GoRoute(path: '/secondary-sales-details', builder: (context, state) => SecondarySalesDetailsScreen(sales: state.extra as SalesReviewModel)),
      GoRoute(path: '/reports-analytics', builder: (context, state) => const ReportsDashboardScreen()),
      GoRoute(path: '/admin-dashboard', builder: (context, state) => const AdminDashboardScreen()),
      GoRoute(path: '/super-admin-dashboard', builder: (context, state) => const SuperAdminDashboardScreen()),
      GoRoute(path: '/admin/users', builder: (context, state) => const UserListScreen()),
      GoRoute(path: '/admin/territories', builder: (context, state) => const TerritoryManagementScreen()),
      GoRoute(path: '/admin/doctors', builder: (context, state) => const DoctorMasterScreen()),
      GoRoute(path: '/admin/chemists', builder: (context, state) => const ChemistMasterScreen()),
      GoRoute(path: '/admin/products', builder: (context, state) => const ProductMasterScreen()),
      GoRoute(path: '/admin/product_assignment', builder: (context, state) => const ProductAssignmentScreen()),
      GoRoute(path: '/admin/approvals', builder: (context, state) => const CustomerApprovalScreen()),
      GoRoute(path: '/admin/pricing', builder: (context, state) => const ProductPricingScreen()),
      GoRoute(path: '/admin/batches', builder: (context, state) => const BatchManagementScreen()),
      GoRoute(path: '/admin/sales/dashboard', builder: (context, state) => const PrimarySalesDashboardScreen()),
      GoRoute(path: '/admin/sales/import', builder: (context, state) => const PrimarySalesImportScreen()),
      GoRoute(path: '/admin/holidays', builder: (context, state) => const HolidayManagementScreen()),
      GoRoute(path: '/admin/holidays/calendar', builder: (context, state) => const HolidayCalendarScreen()),
      GoRoute(path: '/admin/broadcast', builder: (context, state) => const BroadcastConsoleScreen()),
      GoRoute(path: '/admin/analytics', builder: (context, state) => const AnalyticsDashboard()),
      GoRoute(path: '/admin/reports', builder: (context, state) => const ReportCenterScreen()),
      GoRoute(path: '/admin/audit', builder: (context, state) => const AuditLogDashboard()),
      GoRoute(path: '/super_admin/companies', builder: (context, state) => const CompanyManagementScreen()),
      GoRoute(path: '/super_admin/roles', builder: (context, state) => const RoleManagementScreen()),
      GoRoute(path: '/super_admin/features', builder: (context, state) => const FeatureToggleScreen()),
      GoRoute(path: '/super_admin/global_settings', builder: (context, state) => const GlobalSettingsScreen()),
      GoRoute(path: '/super_admin/system', builder: (context, state) => const SystemConfigurationScreen()),
      GoRoute(path: '/super_admin/geo', builder: (context, state) => const GeoSettingsScreen()),
      GoRoute(path: '/super_admin/tada', builder: (context, state) => const TADAMatrixScreen()),
      GoRoute(path: '/super_admin/mtp_settings', builder: (context, state) => const MTPSettingsScreen()),
      GoRoute(path: '/super_admin/security', builder: (context, state) => const SecuritySettingsScreen()),
      GoRoute(path: '/super_admin/backups', builder: (context, state) => const DatabaseBackupScreen()),
      GoRoute(path: '/super_admin/license', builder: (context, state) => const LicenseManagementScreen()),
      GoRoute(path: '/super_admin/developer', builder: (context, state) => const DeveloperConsoleScreen()),
    ]
  );
});
