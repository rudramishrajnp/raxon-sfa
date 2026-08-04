import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/secondary_sales_provider.dart';
import '../providers/secondary_sales_state.dart';
import '../widgets/product_entry_widget.dart';
import '../widgets/summary_widget.dart';

class SecondarySalesScreen extends ConsumerStatefulWidget {
  final String customerId;
  final String customerName;
  final String customerType; // 'Stockist' or 'Retailer'
  final String entryType; // 'Weekly' or 'Monthly'

  const SecondarySalesScreen({
    super.key,
    required this.customerId,
    required this.customerName,
    required this.customerType,
    required this.entryType,
  });

  @override
  ConsumerState<SecondarySalesScreen> createState() => _SecondarySalesScreenState();
}

class _SecondarySalesScreenState extends ConsumerState<SecondarySalesScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(secondarySalesNotifierProvider.notifier).initialize(
        widget.customerId,
        widget.customerName,
        widget.customerType,
        widget.entryType,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(secondarySalesNotifierProvider, (previous, next) {
      if (next is SecondarySalesSuccess) {
        AppFeedback.showSuccessDialog(
          context,
          title: 'Success',
          message: next.message,
          onOk: () {
            context.pop(); // Close dialog
            context.pop(); // Go back to previous screen
          },
        );
      } else if (next is SecondarySalesError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      }
    });

    final state = ref.watch(secondarySalesNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.entryType} Sales & Stock'),
      ),
      body: SafeArea(child: _buildBody(state)),
    );
  }

  Widget _buildBody(SecondarySalesState state) {
    if (state is SecondarySalesLoading || state is SecondarySalesInitial) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state is SecondarySalesLoaded || state is SecondarySalesError) {
      // Re-use loaded state if we get an error so we don't lose the UI
      SecondarySalesLoaded? loadedState;
      if (state is SecondarySalesLoaded) {
        loadedState = state;
      } else {
        // Fallback to previous state if it was loaded.
        // We know riverpod notifier in our implementation re-emits loaded after error, 
        // but just in case.
        return const Center(child: CircularProgressIndicator());
      }
      
      final products = loadedState.products;

      return Column(
        children: [
          _buildHeader(),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: AppSizes.p16, vertical: AppSizes.p8),
              itemCount: products.length,
              itemBuilder: (context, index) {
                return ProductEntryWidget(
                  product: products[index],
                  onUpdate: ref.read(secondarySalesNotifierProvider.notifier).updateProduct,
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(AppSizes.p16),
            child: Column(
              children: [
                SummaryWidget(
                  totalProducts: products.length,
                  totalSalesQty: loadedState.totalSalesQty,
                  totalSalesValue: loadedState.totalSalesValue,
                  totalClosingStock: loadedState.totalClosingStock,
                ),
                AppSizes.gap16,
                AppButton(
                  text: 'Submit Entry',
                  onPressed: () => ref.read(secondarySalesNotifierProvider.notifier).submit(),
                ),
              ],
            ),
          ),
        ],
      );
    }
    
    return const SizedBox.shrink();
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSizes.p16),
      color: AppColors.primary.withOpacity(0.05),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(widget.customerName, style: AppTypography.titleLarge.copyWith(fontWeight: FontWeight.bold)),
          AppSizes.gap4,
          Row(
            children: [
              Chip(
                label: Text(widget.customerType),
                backgroundColor: AppColors.primary.withOpacity(0.1),
                labelStyle: const TextStyle(color: AppColors.primary),
                visualDensity: VisualDensity.compact,
                side: BorderSide.none,
              ),
              AppSizes.gap8,
              Chip(
                label: Text(widget.entryType),
                backgroundColor: Colors.orange.withOpacity(0.1),
                labelStyle: const TextStyle(color: Colors.orange),
                visualDensity: VisualDensity.compact,
                side: BorderSide.none,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
