import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../core/services/file_picker_service.dart';
import '../../../../shared_widgets/feedback/app_feedback.dart';
import '../providers/bill_upload_provider.dart';
import '../providers/bill_upload_state.dart';
import '../widgets/bill_preview_widget.dart';

class BillUploadScreen extends ConsumerStatefulWidget {
  final String expenseId;

  const BillUploadScreen({super.key, required this.expenseId});

  @override
  ConsumerState<BillUploadScreen> createState() => _BillUploadScreenState();
}

class _BillUploadScreenState extends ConsumerState<BillUploadScreen> {
  void _showPickerOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(AppSizes.radius16))),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt, color: AppColors.primary),
              title: const Text('Take Photo'),
              onTap: () async {
                Navigator.pop(ctx);
                final file = await ref.read(filePickerServiceProvider).pickImageFromCamera();
                if (file != null) {
                  ref.read(billUploadNotifierProvider(widget.expenseId).notifier).addBill(file, 'jpg');
                } else {
                  if (mounted) AppFeedback.showSnackBar(context, 'No image captured.');
                }
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library, color: AppColors.primary),
              title: const Text('Choose from Gallery'),
              onTap: () async {
                Navigator.pop(ctx);
                final file = await ref.read(filePickerServiceProvider).pickImageFromGallery();
                if (file != null) {
                  ref.read(billUploadNotifierProvider(widget.expenseId).notifier).addBill(file, 'jpg');
                } else {
                  if (mounted) AppFeedback.showSnackBar(context, 'No image selected.');
                }
              },
            ),
            ListTile(
              leading: const Icon(Icons.picture_as_pdf, color: AppColors.primary),
              title: const Text('Upload PDF'),
              onTap: () async {
                Navigator.pop(ctx);
                final file = await ref.read(filePickerServiceProvider).pickPdfFile();
                if (file != null) {
                  ref.read(billUploadNotifierProvider(widget.expenseId).notifier).addBill(file, 'pdf');
                } else {
                  if (mounted) AppFeedback.showSnackBar(context, 'No PDF selected.');
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(billUploadNotifierProvider(widget.expenseId), (previous, next) {
      if (next is BillUploadError) {
        AppFeedback.showSnackBar(context, next.message, isError: true);
      } else if (next is BillUploadSuccess) {
        AppFeedback.showSnackBar(context, next.message);
      }
    });

    final state = ref.watch(billUploadNotifierProvider(widget.expenseId));

    return Scaffold(
      appBar: AppBar(title: const Text('Upload Bills')),
      body: SafeArea(
        child: _buildBody(state),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showPickerOptions(context),
        icon: const Icon(Icons.add),
        label: const Text('Add Bill'),
      ),
    );
  }

  Widget _buildBody(BillUploadState state) {
    if (state is BillUploadInitial || state is BillUploadLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state is BillUploadLoaded) {
      final bills = state.bills;
      if (bills.isEmpty) {
        return Center(
          child: Padding(
            padding: const EdgeInsets.all(AppSizes.p24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.receipt_long, size: 64, color: Colors.grey.shade400),
                AppSizes.gap16,
                Text('No bills uploaded yet.', style: AppTypography.titleMedium),
                AppSizes.gap8,
                Text(
                  'Tap "Add Bill" to upload images or PDFs of your receipts.',
                  textAlign: TextAlign.center,
                  style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        );
      }

      return ListView.builder(
        padding: const EdgeInsets.all(AppSizes.p16),
        itemCount: bills.length,
        itemBuilder: (context, index) {
          final bill = bills[index];
          return BillPreviewWidget(
            bill: bill,
            onDelete: () => ref.read(billUploadNotifierProvider(widget.expenseId).notifier).removeBill(bill.id),
            onView: () {
              AppFeedback.showSnackBar(context, 'Preview not implemented in this demo.');
            },
          );
        },
      );
    }
    
    return const SizedBox.shrink();
  }
}
