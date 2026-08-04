import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/secondary_sales_product_model.dart';

class ProductEntryWidget extends StatelessWidget {
  final SecondarySalesProductModel product;
  final Function(String, {int? openingStock, int? purchaseQty, int? salesQty, int? freeQty, int? returnedQty, int? damageQty}) onUpdate;

  const ProductEntryWidget({
    super.key,
    required this.product,
    required this.onUpdate,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: AppSizes.p16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSizes.radius12),
        side: BorderSide(color: Colors.grey.shade300),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(product.productName, style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
            AppSizes.gap4,
            Text('${product.pack} | ${product.strength} | ${product.unit} | ₹${product.unitPrice}', style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary)),
            AppSizes.gap16,
            
            _buildNumberField('Opening Stock', product.openingStock, (v) => onUpdate(product.productId, openingStock: v)),
            AppSizes.gap12,
            _buildNumberField('Purchase Qty', product.purchaseQty, (v) => onUpdate(product.productId, purchaseQty: v)),
            AppSizes.gap12,
            _buildNumberField('Sales Qty', product.salesQty, (v) => onUpdate(product.productId, salesQty: v)),
            AppSizes.gap12,
            _buildNumberField('Free Qty', product.freeQty, (v) => onUpdate(product.productId, freeQty: v)),
            AppSizes.gap12,
            _buildNumberField('Returned Qty', product.returnedQty, (v) => onUpdate(product.productId, returnedQty: v)),
            AppSizes.gap12,
            _buildNumberField('Damage Qty', product.damageQty, (v) => onUpdate(product.productId, damageQty: v)),
            AppSizes.gap16,
            
            Container(
              padding: const EdgeInsets.all(AppSizes.p12),
              decoration: BoxDecoration(
                color: product.closingStock < 0 ? AppColors.error.withOpacity(0.1) : AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppSizes.radius8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Closing Stock', style: AppTypography.labelLarge.copyWith(fontWeight: FontWeight.bold)),
                  Text(
                    '${product.closingStock}',
                    style: AppTypography.titleMedium.copyWith(
                      fontWeight: FontWeight.bold,
                      color: product.closingStock < 0 ? AppColors.error : AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNumberField(String label, int value, Function(int) onChanged) {
    return Row(
      children: [
        Expanded(
          flex: 3,
          child: Text(label, style: AppTypography.bodyMedium),
        ),
        Expanded(
          flex: 2,
          child: TextFormField(
            initialValue: value == 0 ? '' : value.toString(),
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              isDense: true,
              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              border: OutlineInputBorder(),
            ),
            onChanged: (val) {
              final parsed = int.tryParse(val) ?? 0;
              onChanged(parsed);
            },
          ),
        ),
      ],
    );
  }
}
