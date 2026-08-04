import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/expense_approval_models.dart';

class BillPreviewScreen extends StatelessWidget {
  final ExpenseBillModel bill;

  const BillPreviewScreen({super.key, required this.bill});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(bill.description, style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
        backgroundColor: AppColors.primary,
        iconTheme: const IconThemeData(color: AppColors.onPrimary),
        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Downloading bill...')));
            },
          ),
        ],
      ),
      body: Center(
        child: bill.type == 'image'
            ? InteractiveViewer(
                panEnabled: true, // Set it to false
                boundaryMargin: const EdgeInsets.all(100),
                minScale: 0.5,
                maxScale: 2,
                child: Image.network(
                  bill.url,
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) => const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.broken_image, size: 64, color: AppColors.grey500),
                      SizedBox(height: 16),
                      Text('Failed to load image preview'),
                    ],
                  ),
                ),
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.picture_as_pdf, size: 100, color: AppColors.primary),
                  const SizedBox(height: 24),
                  Text('PDF Preview Not Supported Offline', style: AppTypography.headlineMedium),
                  const SizedBox(height: 8),
                  Text('Please download the file to view it.', style: AppTypography.bodyMedium),
                ],
              ),
      ),
    );
  }
}
