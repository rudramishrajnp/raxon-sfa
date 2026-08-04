import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../shared_widgets/buttons/app_button.dart';
import '../providers/secondary_sales_review_provider.dart';
import '../../data/models/secondary_sales_review_models.dart';
import '../widgets/sales_approval_dialog.dart';

class SecondarySalesDetailsScreen extends ConsumerStatefulWidget {
  final SalesReviewModel sales;

  const SecondarySalesDetailsScreen({super.key, required this.sales});

  @override
  ConsumerState<SecondarySalesDetailsScreen> createState() => _SecondarySalesDetailsScreenState();
}

class _SecondarySalesDetailsScreenState extends ConsumerState<SecondarySalesDetailsScreen> {
  late SalesReviewModel _sales;

  @override
  void initState() {
    super.initState();
    _sales = widget.sales;
  }

  void _showActionDialog(String action) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => SalesApprovalDialog(
        actionType: action,
        onConfirm: (remarks) async {
          final success = await ref.read(secondarySalesReviewNotifierProvider.notifier).submitAction(_sales.id, action, remarks, _sales);
          if (success && mounted) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Sales $action successful')));
            Navigator.pop(context); // Go back to list
          } else if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to process action')));
          }
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Sales Details', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: AppColors.onPrimary),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildHeader(),
            AppSizes.gap24,
            _buildProductsList(),
            AppSizes.gap24,
            _buildAuditTrail(),
            AppSizes.gap32, // Space for bottom buttons
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomActions(),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: AppColors.grey300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(_sales.stockistName, style: AppTypography.headlineMedium),
              _buildStatusBadge(_sales.status),
            ],
          ),
          AppSizes.gap8,
          Text('${_sales.hq} | ${_sales.territory}', style: AppTypography.bodyMedium),
          const Divider(height: AppSizes.p24),
          _buildInfoRow('MR Name', _sales.employeeName),
          AppSizes.gap8,
          _buildInfoRow('Employee Code', _sales.employeeCode),
          if (_sales.retailerName != null) ...[
            AppSizes.gap8,
            _buildInfoRow('Retailer', _sales.retailerName!),
          ],
          AppSizes.gap8,
          _buildInfoRow('Date', DateFormat('dd MMM yyyy').format(_sales.date)),
          const Divider(height: AppSizes.p24),
          _buildInfoRow('Total Sales Qty', '${_sales.totalSalesQuantity}', isBold: true),
          AppSizes.gap8,
          _buildInfoRow('Total Sales Value', '₹${_sales.totalSalesValue}', isBold: true, color: AppColors.success),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color = AppColors.primary;
    if (status == 'Approved') color = AppColors.success;
    if (status == 'Rejected' || status == 'Returned') color = AppColors.error;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: color),
      ),
      child: Text(
        status,
        style: AppTypography.bodySmall.copyWith(color: color, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildProductsList() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Product Details', style: AppTypography.headlineSmall),
        AppSizes.gap16,
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _sales.products.length,
          separatorBuilder: (context, index) => AppSizes.gap16,
          itemBuilder: (context, index) {
            final product = _sales.products[index];
            return Container(
              padding: const EdgeInsets.all(AppSizes.p16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(AppSizes.radius12),
                border: Border.all(color: AppColors.grey300),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(product.productName, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
                  const Divider(height: AppSizes.p16),
                  _buildProductStatRow('Opening Stock', '${product.openingStock}', 'Purchase Qty', '${product.purchaseQuantity}'),
                  AppSizes.gap8,
                  _buildProductStatRow('Sales Qty', '${product.salesQuantity}', 'Closing Stock', '${product.closingStock}'),
                  AppSizes.gap8,
                  _buildProductStatRow('Damage Qty', '${product.damageQuantity}', 'Return Qty', '${product.returnQuantity}'),
                  const Divider(height: AppSizes.p16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Sales Value', style: AppTypography.bodySmall.copyWith(color: AppColors.grey700)),
                      Text('₹${product.salesValue}', style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold, color: AppColors.success)),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildProductStatRow(String l1, String v1, String l2, String v2) {
    return Row(
      children: [
        Expanded(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(l1, style: AppTypography.bodySmall.copyWith(color: AppColors.grey600)),
              Text(v1, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.bold)),
            ],
          ),
        ),
        AppSizes.gap16,
        Expanded(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(l2, style: AppTypography.bodySmall.copyWith(color: AppColors.grey600)),
              Text(v2, style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAuditTrail() {
    if (_sales.auditTrail.isEmpty) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        border: Border.all(color: AppColors.grey300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Audit Trail', style: AppTypography.headlineSmall),
          AppSizes.gap16,
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _sales.auditTrail.length,
            itemBuilder: (context, index) {
              final log = _sales.auditTrail[index];
              return Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(DateFormat('dd MMM').format(log.timestamp), style: AppTypography.bodySmall),
                    AppSizes.gap8,
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('${log.action} by ${log.byUser}', style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
                          if (log.remarks != null) Text(log.remarks!, style: AppTypography.bodySmall),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isBold = false, Color? color}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTypography.bodyMedium.copyWith(color: AppColors.grey700)),
        Text(value, style: AppTypography.bodyMedium.copyWith(fontWeight: isBold ? FontWeight.bold : FontWeight.normal, color: color)),
      ],
    );
  }

  Widget _buildBottomActions() {
    if (_sales.status == 'Approved' || _sales.status == 'Rejected') {
      return const SizedBox.shrink();
    }

    return Container(
      padding: const EdgeInsets.all(AppSizes.p16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5)),
        ],
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    text: 'Return',
                    onPressed: () => _showActionDialog('Return for Correction'),
                    type: AppButtonType.secondary,
                  ),
                ),
                AppSizes.gap16,
                Expanded(
                  child: AppButton(
                    text: 'Reject',
                    onPressed: () => _showActionDialog('Reject'),
                    type: AppButtonType.secondary,
                  ),
                ),
              ],
            ),
            AppSizes.gap16,
            SizedBox(
              width: double.infinity,
              child: AppButton(
                text: 'Approve Sales',
                onPressed: () => _showActionDialog('Approve'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
