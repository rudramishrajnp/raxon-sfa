import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/product_model.dart';
import '../../data/models/dcr_report_model.dart';

class OrderBookingWidget extends StatefulWidget {
  final List<ProductModel> products;
  final List<OrderItemModel> orders;
  final ValueChanged<List<OrderItemModel>> onChanged;

  const OrderBookingWidget({
    super.key,
    required this.products,
    required this.orders,
    required this.onChanged,
  });

  @override
  State<OrderBookingWidget> createState() => _OrderBookingWidgetState();
}

class _OrderBookingWidgetState extends State<OrderBookingWidget> {
  late Map<String, OrderItemModel> _ordersMap;

  @override
  void initState() {
    super.initState();
    _ordersMap = {for (var o in widget.orders) o.productId: o};
  }

  void _updateQuantity(ProductModel product, int delta) {
    setState(() {
      final current = _ordersMap[product.id]?.quantity ?? 0;
      final newQuantity = current + delta;
      
      if (newQuantity < 0) return;

      if (newQuantity == 0) {
        _ordersMap.remove(product.id);
      } else {
        _ordersMap[product.id] = OrderItemModel(
          productId: product.id,
          productName: product.name,
          quantity: newQuantity,
          unitPrice: product.price,
          totalValue: product.price != null ? product.price! * newQuantity : null,
        );
      }
      widget.onChanged(_ordersMap.values.toList());
    });
  }

  @override
  Widget build(BuildContext context) {
    int totalItems = _ordersMap.values.fold(0, (sum, item) => sum + item.quantity);
    double totalValue = _ordersMap.values.fold(0.0, (sum, item) => sum + (item.totalValue ?? 0));

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(AppSizes.p16),
          color: AppColors.secondary.withOpacity(0.1),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Total Items: $totalItems', style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
                  AppSizes.gap4,
                  Text('Total Value: \$${totalValue.toStringAsFixed(2)}', style: AppTypography.bodyMedium.copyWith(color: AppColors.primary)),
                ],
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(AppSizes.p16),
            itemCount: widget.products.length,
            itemBuilder: (context, index) {
              final product = widget.products[index];
              final currentQuantity = _ordersMap[product.id]?.quantity ?? 0;

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
                            Text('Price: \$${product.price?.toStringAsFixed(2) ?? 'N/A'}', style: AppTypography.labelSmall.copyWith(color: AppColors.textSecondary)),
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
                            onPressed: () => _updateQuantity(product, 1),
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
