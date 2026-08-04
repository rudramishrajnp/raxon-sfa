import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:raxon_sfa/core/services/logger_service.dart';

class ImportMappingWizard extends ConsumerStatefulWidget {
  const ImportMappingWizard({super.key});

  @override
  ConsumerState<ImportMappingWizard> createState() => _ImportMappingWizardState();
}

class _ImportMappingWizardState extends ConsumerState<ImportMappingWizard> {
  int _currentStep = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Import Mapping Wizard'),
      ),
      body: Stepper(
        currentStep: _currentStep,
        onStepContinue: () {
          if (_currentStep < 2) {
            setState(() => _currentStep += 1);
          } else {
            _finishImport();
          }
        },
        onStepCancel: () {
          if (_currentStep > 0) {
            setState(() => _currentStep -= 1);
          } else {
            context.pop();
          }
        },
        steps: [
          Step(
            title: const Text('Map Fields'),
            content: Column(
              children: [
                _buildMappingRow('Invoice Number', 'Invoice No.'),
                _buildMappingRow('Invoice Date', 'Date'),
                _buildMappingRow('Product', 'Item Name'),
                _buildMappingRow('Batch', 'Batch ID'),
                _buildMappingRow('Quantity', 'Qty'),
              ],
            ),
            isActive: _currentStep >= 0,
          ),
          Step(
            title: const Text('Validate Data'),
            content: const Column(
              children: [
                Text('Running validation engine...', style: TextStyle(fontStyle: FontStyle.italic)),
                SizedBox(height: 16),
                Card(
                  color: Colors.greenAccent,
                  child: ListTile(
                    leading: Icon(Icons.check_circle, color: Colors.green),
                    title: Text('1495 Records Validated Successfully'),
                  ),
                ),
                Card(
                  color: Colors.redAccent,
                  child: ListTile(
                    leading: Icon(Icons.error, color: Colors.red),
                    title: Text('5 Records Failed Validation'),
                    subtitle: Text('Row 42: Invalid Batch\nRow 105: Product Not Found'),
                  ),
                ),
              ],
            ),
            isActive: _currentStep >= 1,
          ),
          Step(
            title: const Text('Confirm Import'),
            content: const Text('Are you sure you want to import 1495 valid records? The 5 failed records will be skipped.'),
            isActive: _currentStep >= 2,
          ),
        ],
      ),
    );
  }

  Widget _buildMappingRow(String systemField, String fileColumn) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Expanded(child: Text(systemField, style: const TextStyle(fontWeight: FontWeight.bold))),
          const Icon(Icons.arrow_forward),
          Expanded(
            child: DropdownButtonFormField<String>(
              value: fileColumn,
              items: [
                DropdownMenuItem(value: fileColumn, child: Text(fileColumn)),
              ],
              onChanged: (_) {},
              decoration: const InputDecoration(border: OutlineInputBorder(), isDense: true),
            ),
          ),
        ],
      ),
    );
  }

  void _finishImport() {
    ref.read(loggerServiceProvider).logAudit(
      action: 'IMPORT_PRIMARY_SALES',
      entityType: 'Sales',
      entityId: 'import_batch_123',
      userId: 'Admin',
    );
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Import Successful')));
    context.go('/admin/sales/dashboard');
  }
}
