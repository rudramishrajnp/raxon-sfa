import '../../data/repositories/expense_bill_repository_impl.dart';
import 'package:universal_io/io.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/file_validation_service.dart';
import '../../../../core/services/image_compression_service.dart';
import '../../domain/repositories/expense_bill_repository.dart';
import '../../data/models/expense_bill_model.dart';
import 'bill_upload_state.dart';

class BillUploadNotifier extends StateNotifier<BillUploadState> {
  final ExpenseBillRepository _repository;
  final ImageCompressionService _compressionService;
  final FileValidationService _validationService;
  final String _expenseId;

  BillUploadNotifier(
    this._repository,
    this._compressionService,
    this._validationService,
    this._expenseId,
  ) : super(BillUploadInitial()) {
    _loadBills();
  }

  Future<void> _loadBills() async {
    state = BillUploadLoading();
    try {
      final bills = await _repository.getBillsForExpense(_expenseId);
      state = BillUploadLoaded(bills);
    } catch (e) {
      state = BillUploadError('Failed to load bills.');
    }
  }

  Future<void> addBill(File file, String extension) async {
    final validationError = _validationService.validateFile(file, extension);
    if (validationError != null) {
      _emitError(validationError);
      return;
    }

    state = BillUploadLoading();
    try {
      File processedFile = file;
      if (['jpg', 'jpeg', 'png'].contains(extension.toLowerCase())) {
        processedFile = await _compressionService.compressImage(file);
      } else if (extension.toLowerCase() == 'pdf') {
        processedFile = await _compressionService.optimizePdf(file);
      }

      final newBill = await _repository.saveBillLocally(_expenseId, processedFile, extension);
      await _repository.queueBillForUpload(newBill);

      await _loadBills();
    } catch (e) {
      _emitError('Failed to process bill: $e');
    }
  }

  Future<void> removeBill(String billId) async {
    state = BillUploadLoading();
    try {
      await _repository.deleteBill(billId);
      await _loadBills();
    } catch (e) {
      _emitError('Failed to delete bill.');
    }
  }

  void _emitError(String message) {
    final currentBills = state is BillUploadLoaded ? (state as BillUploadLoaded).bills : <ExpenseBillModel>[];
    state = BillUploadError(message);
    Future.delayed(const Duration(milliseconds: 100), () {
      if (mounted) state = BillUploadLoaded(currentBills);
    });
  }
}

// Ensure the provider is registered globally with the necessary dependencies
final fileValidationServiceProvider = Provider((ref) => FileValidationService());

final billUploadNotifierProvider = StateNotifierProvider.family<BillUploadNotifier, BillUploadState, String>((ref, expenseId) {
  return BillUploadNotifier(
    ref.watch(expenseBillRepositoryProvider),
    ref.watch(imageCompressionServiceProvider),
    ref.watch(fileValidationServiceProvider),
    expenseId,
  );
});
