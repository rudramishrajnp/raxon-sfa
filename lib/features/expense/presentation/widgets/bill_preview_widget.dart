import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../data/models/expense_bill_model.dart';

class BillPreviewWidget extends StatelessWidget {
  final ExpenseBillModel bill;
  final VoidCallback onDelete;
  final VoidCallback onView;

  const BillPreviewWidget({
    super.key,
    required this.bill,
    required this.onDelete,
    required this.onView,
  });

  @override
  Widget build(BuildContext context) {
    final isPdf = bill.fileType.toLowerCase() == 'pdf';

    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: AppSizes.p12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSizes.radius8),
        side: BorderSide(color: Colors.grey.shade300),
      ),
      child: ListTile(
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: isPdf ? Colors.red.withOpacity(0.1) : Colors.blue.withOpacity(0.1),
            borderRadius: BorderRadius.circular(AppSizes.radius8),
          ),
          child: Icon(
            isPdf ? Icons.picture_as_pdf : Icons.image,
            color: isPdf ? Colors.red : Colors.blue,
          ),
        ),
        title: Text(bill.fileName, style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
        subtitle: Text('${(bill.fileSize / 1024).toStringAsFixed(1)} KB • ${bill.fileType.toUpperCase()}', style: AppTypography.bodySmall),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(Icons.visibility, color: AppColors.primary),
              onPressed: onView,
            ),
            IconButton(
              icon: const Icon(Icons.delete_outline, color: AppColors.error),
              onPressed: onDelete,
            ),
          ],
        ),
      ),
    );
  }
}
