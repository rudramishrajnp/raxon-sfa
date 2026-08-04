import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/customer_model.dart';
import '../../../../core/services/map_navigation_service.dart';

class CustomerListWidget extends ConsumerWidget {
  final List<CustomerModel> customers;

  const CustomerListWidget({super.key, required this.customers});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (customers.isEmpty) {
      return const Center(child: Padding(
        padding: EdgeInsets.all(AppSizes.p32),
        child: Text('No customers found.'),
      ));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(AppSizes.p16),
      itemCount: customers.length,
      itemBuilder: (context, index) {
        final customer = customers[index];
        final isCompleted = customer.callStatus == 'COMPLETED';

        return Card(
          margin: const EdgeInsets.only(bottom: AppSizes.p16),
          elevation: 0,
          color: AppColors.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSizes.radius12),
            side: BorderSide(
              color: isCompleted ? AppColors.success.withOpacity(0.5) : Colors.transparent,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(AppSizes.p16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        customer.name,
                        style: AppTypography.titleMedium.copyWith(fontWeight: FontWeight.bold),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: AppSizes.p8, vertical: AppSizes.p4),
                      decoration: BoxDecoration(
                        color: _getTypeColor(customer.type),
                        borderRadius: BorderRadius.circular(AppSizes.radius8),
                      ),
                      child: Text(
                        customer.type,
                        style: AppTypography.labelSmall.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                if (customer.specialty != null) ...[
                  AppSizes.gap4,
                  Text(
                    '${customer.specialty} | Class: ${customer.classification ?? 'N/A'}',
                    style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
                  ),
                ],
                AppSizes.gap16,
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.location_on_outlined, size: 16, color: AppColors.grey500),
                    AppSizes.gap8,
                    Expanded(
                      child: Text(
                        customer.address ?? 'Address not available',
                        style: AppTypography.bodySmall,
                      ),
                    ),
                  ],
                ),
                AppSizes.gap8,
                Row(
                  children: [
                    const Icon(Icons.route_outlined, size: 16, color: AppColors.grey500),
                    AppSizes.gap8,
                    Text(
                      customer.distanceFromCurrentLocation != null
                          ? '${customer.distanceFromCurrentLocation!.toStringAsFixed(1)} km away'
                          : 'Distance unknown',
                      style: AppTypography.bodySmall,
                    ),
                  ],
                ),
                if (customer.visitFrequencyStatus != null) ...[
                  AppSizes.gap8,
                  Row(
                    children: [
                      const Icon(Icons.calendar_today_outlined, size: 16, color: AppColors.grey500),
                      AppSizes.gap8,
                      Text(
                        'Frequency: ${customer.visitFrequencyStatus}',
                        style: AppTypography.bodySmall,
                      ),
                    ],
                  ),
                ],
                const Divider(height: 32),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(
                          isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
                          color: isCompleted ? AppColors.success : AppColors.grey500,
                          size: 20,
                        ),
                        AppSizes.gap8,
                        Text(
                          customer.callStatus ?? 'PENDING',
                          style: AppTypography.labelMedium.copyWith(
                            color: isCompleted ? AppColors.success : AppColors.textPrimary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        if (!isCompleted) ...[
                          TextButton.icon(
                            onPressed: () {
                              context.push('/check-in', extra: customer);
                            },
                            icon: const Icon(Icons.location_on, size: 18),
                            label: const Text('Check-In'),
                            style: TextButton.styleFrom(
                              foregroundColor: AppColors.primary,
                            ),
                          ),
                          AppSizes.gap8,
                        ],
                        if (customer.latitude != null && customer.longitude != null)
                          TextButton.icon(
                            onPressed: () {
                              ref.read(mapNavigationServiceProvider).navigateTo(customer.latitude!, customer.longitude!);
                            },
                            icon: const Icon(Icons.navigation, size: 18),
                            label: const Text('Navigate'),
                            style: TextButton.styleFrom(
                              foregroundColor: AppColors.primary,
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Color _getTypeColor(String type) {
    if (type.toLowerCase() == 'doctor') {
      return Colors.blue.shade600;
    } else if (type.toLowerCase() == 'chemist') {
      return Colors.green.shade600;
    }
    return AppColors.grey600;
  }
}
