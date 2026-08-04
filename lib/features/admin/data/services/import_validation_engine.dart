import 'package:universal_io/io.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/pricing_sales_models.dart';
import 'package:intl/intl.dart';

class ImportValidationEngine {
  // Simplified validation engine for the mock implementation
  Future<ImportValidationResultModel> validatePrimarySalesFile(File file) async {
    // In a real app, we would parse CSV/Excel here.
    // Simulating parsing and validation...
    await Future.delayed(const Duration(seconds: 2));

    List<String> errors = [];
    List<Map<String, dynamic>> validRows = [];

    // Simulate dummy parsed rows
    final dummyRows = [
      {'Invoice Number': 'INV001', 'Product': 'Raxocillin', 'Batch': 'B001', 'Quantity': '100', 'Net Amount': '15000'},
      {'Invoice Number': 'INV002', 'Product': 'UnknownProd', 'Batch': 'B002', 'Quantity': '50', 'Net Amount': '0'}, // Missing Product error
      {'Invoice Number': 'INV003', 'Product': 'Raxoprazole', 'Batch': 'INVALID', 'Quantity': '-10', 'Net Amount': '-500'}, // Invalid batch/qty
    ];

    for (var i = 0; i < dummyRows.length; i++) {
      var row = dummyRows[i];
      if (row['Product'] == 'UnknownProd') {
        errors.add('Row ${i + 1}: Missing or invalid Product ID.');
      } else if (int.tryParse(row['Quantity'] ?? '') == null || int.parse(row['Quantity']!) < 0) {
        errors.add('Row ${i + 1}: Incorrect Quantity.');
      } else if (row['Batch'] == 'INVALID') {
        errors.add('Row ${i + 1}: Invalid Batch Number.');
      } else {
        validRows.add(row);
      }
    }

    return ImportValidationResultModel(
      isValid: errors.isEmpty,
      errors: errors,
      validRows: validRows,
    );
  }

  List<String> validateBatch(BatchModel batch) {
    List<String> errors = [];
    if (batch.batchPtr > batch.batchMrp) {
      errors.add('PTR cannot be greater than MRP.');
    }
    if (batch.batchPts > batch.batchPtr) {
      errors.add('PTS cannot be greater than PTR.');
    }
    if (batch.expiryDate.isBefore(DateTime.now())) {
      errors.add('Cannot create an expired batch.');
    }
    if (batch.manufacturingDate.isAfter(batch.expiryDate)) {
      errors.add('Manufacturing date must be before expiry date.');
    }
    return errors;
  }
}

final importValidationEngineProvider = Provider<ImportValidationEngine>((ref) {
  return ImportValidationEngine();
});
