import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/product_model.dart';
import '../../data/models/dcr_report_model.dart';

class ProductSamplingWidget extends StatefulWidget {
  final List<ProductModel> products;
  final List<SampleItemModel> samples;
  final ValueChanged<List<SampleItemModel>> onChanged;

  const ProductSamplingWidget({
    super.key,
    required this.products,
    required this.samples,
    required this.onChanged,
  });

  @override
  State<ProductSamplingWidget> createState() => _ProductSamplingWidgetState();
}

class _ProductSamplingWidgetState extends State<ProductSamplingWidget> {
  late Map<String, SampleItemModel> _samplesMap;

  @override
  void initState() {
    super.initState();
    _samplesMap = {for (var s in widget.samples) s.productId: s};
  }

  void _updateQuantity(ProductModel product, int delta) {
    setState(() {
      final current = _samplesMap[product.id]?.quantity ?? 0;
      final newQuantity = current + delta;
      
      if (newQuantity < 0) return;
      if (newQuantity > product.availableStock) return;

      if (newQuantity == 0) {
        _samplesMap.remove(product.id);
      } else {
        _samplesMap[product.id] = SampleItemModel(
          productId: product.id,
          productName: product.name,
          quantity: newQuantity,
          maxStock: product.availableStock,
        );
      }
      widget.onChanged(_samplesMap.values.toList());
    });
  }

  @override
  Widget build(BuildContext context) {
    int totalSamples = _samplesMap.values.fold(0, (sum, item) => sum + item.quantity);

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(AppSizes.p16),
          color: AppColors.primary.withOpacity(0.1),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Total Samples Distributed:', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
              Text('$totalSamples', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold, color: AppColors.primary)),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(AppSizes.p16),
            itemCount: widget.products.length,
            itemBuilder: (context, index) {
              final product = widget.products[index];
              final currentQuantity = _samplesMap[product.id]?.quantity ?? 0;

              return Card(
                margin: const EdgeInsets.only(bottom: AppSizes.p12),
                child: Padding(
                  padding: const EdgeInsets.all(AppSizes.p12),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(product.name, style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
                            AppSizes.gap4,
                            Text('${product.strength ?? ''} | ${product.pack ?? ''}', style: AppTypography.bodySmall),
                            AppSizes.gap4,
                            Text('Stock: ${product.availableStock}', style: AppTypography.labelSmall.copyWith(color: AppColors.textSecondary)),
                          ],
                        ),
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove_circle_outline),
                            color: AppColors.primary,
                            onPressed: currentQuantity > 0 ? () => _updateQuantity(product, -1) : null,
                          ),
                          Container(
                            width: 40,
                            alignment: Alignment.center,
                            child: Text('$currentQuantity', style: AppTypography.titleMedium),
                          ),
                          IconButton(
                            icon: const Icon(Icons.add_circle_outline),
                            color: AppColors.primary,
                            onPressed: currentQuantity < product.availableStock ? () => _updateQuantity(product, 1) : null,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
