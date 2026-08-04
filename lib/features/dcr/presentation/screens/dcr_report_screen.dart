import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/dcr_report_provider.dart';
import '../providers/dcr_report_state.dart';
import '../widgets/product_sampling_widget.dart';
import '../widgets/prescription_details_widget.dart';
import '../widgets/order_booking_widget.dart';
import '../widgets/call_summary_widget.dart';

class DcrReportScreen extends ConsumerStatefulWidget {
  final String checkInId;
  final String customerId;

  const DcrReportScreen({
    super.key,
    required this.checkInId,
    required this.customerId,
  });

  @override
  ConsumerState<DcrReportScreen> createState() => _DcrReportScreenState();
}

class _DcrReportScreenState extends ConsumerState<DcrReportScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    Future.microtask(() => 
      ref.read(dcrReportNotifierProvider({'checkInId': widget.checkInId, 'customerId': widget.customerId}).notifier).loadReport()
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _submitReport() {
    ref.read(dcrReportNotifierProvider({'checkInId': widget.checkInId, 'customerId': widget.customerId}).notifier).submitReport();
  }

  @override
  Widget build(BuildContext context) {
    final provider = dcrReportNotifierProvider({'checkInId': widget.checkInId, 'customerId': widget.customerId});
    
    ref.listen<DcrReportState>(provider, (previous, next) {
      if (next is DcrReportSuccess) {
        AppFeedback.showSuccessDialog(
          context,
          title: 'Success',
          message: next.message,
          onOk: () {
            context.pop();
            context.pushReplacement('/dcr-checkout', extra: {
              'checkInId': widget.checkInId,
              'customerId': widget.customerId,
              'customerName': 'Dr. Customer (Placeholder)', // Note: Should pass actual customer info
              'targetLat': 0.0, // Should pass actual customer info
              'targetLng': 0.0,
            });
          },
        );
      } else if (next is DcrReportError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      }
    });

    final state = ref.watch(provider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('DCR Report'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          tabs: const [
            Tab(text: 'Sampling'),
            Tab(text: 'Prescription'),
            Tab(text: 'Orders'),
            Tab(text: 'Summary'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.check),
            onPressed: state is DcrReportLoaded ? _submitReport : null,
            tooltip: 'Submit Report',
          ),
        ],
      ),
      body: _buildBody(state),
    );
  }

  Widget _buildBody(DcrReportState state) {
    if (state is DcrReportLoading || state is DcrReportInitial) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state is DcrReportLoaded) {
      return TabBarView(
        controller: _tabController,
        children: [
          ProductSamplingWidget(
            products: state.availableProducts,
            samples: state.report.samples,
            onChanged: (samples) {
              ref.read(dcrReportNotifierProvider({'checkInId': widget.checkInId, 'customerId': widget.customerId}).notifier).updateSamples(samples);
            },
          ),
          PrescriptionDetailsWidget(
            prescription: state.report.prescription,
            onChanged: (prescription) {
              ref.read(dcrReportNotifierProvider({'checkInId': widget.checkInId, 'customerId': widget.customerId}).notifier).updatePrescription(prescription);
            },
          ),
          OrderBookingWidget(
            products: state.availableProducts,
            orders: state.report.orders,
            onChanged: (orders) {
              ref.read(dcrReportNotifierProvider({'checkInId': widget.checkInId, 'customerId': widget.customerId}).notifier).updateOrders(orders);
            },
          ),
          CallSummaryWidget(
            summary: state.report.summary,
            onChanged: (summary) {
              ref.read(dcrReportNotifierProvider({'checkInId': widget.checkInId, 'customerId': widget.customerId}).notifier).updateSummary(summary);
            },
          ),
        ],
      );
    }

    return const SizedBox.shrink();
  }
}
