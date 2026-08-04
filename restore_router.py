import re

content = """import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/authentication/presentation/screens/splash_screen.dart';
import 'package:raxon/features/sync_center/presentation/screens/sync_center_screen.dart';
import '../../features/authentication/presentation/screens/login_screen.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/manager_dashboard/presentation/screens/manager_dashboard_screen.dart';
import '../../features/attendance/presentation/screens/punch_in_screen.dart';
import '../../features/mtp/presentation/screens/mtp_screen.dart';
import '../../features/mtp/presentation/screens/mtp_approval_screen.dart';
import '../../features/mtp/presentation/screens/mtp_locked_screen.dart';
import '../../features/work_plan/presentation/screens/work_plan_screen.dart';
import '../../features/dcr/presentation/screens/add_customer_screen.dart';
import '../../features/dcr/presentation/screens/dcr_check_in_screen.dart';
import '../../features/dcr/presentation/screens/dcr_report_screen.dart';
import '../../features/dcr/presentation/screens/dcr_check_out_screen.dart';
import '../../features/dcr/presentation/screens/dcr_summary_screen.dart';
import '../../features/secondary_sales/presentation/screens/closing_stock_screen.dart';
import '../../features/secondary_sales/presentation/screens/secondary_sales_screen.dart';
import '../../features/expense/presentation/screens/expense_home_screen.dart';
import '../../features/expense/presentation/screens/daily_expense_entry_screen.dart';
import '../../features/expense/presentation/screens/bill_upload_screen.dart';
import '../../features/expense/presentation/screens/manager_review_screen.dart';
import '../../features/expense/presentation/screens/finance_review_screen.dart';
import '../../features/expense/presentation/screens/payment_status_screen.dart';
import '../../features/dcr/data/models/customer_model.dart';
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
    ]
  );
});
"""

with open('lib/core/routes/app_router.dart', 'w') as f:
    f.write(content)
