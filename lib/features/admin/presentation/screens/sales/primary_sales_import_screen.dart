import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class PrimarySalesImportScreen extends ConsumerWidget {
  const PrimarySalesImportScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Primary Sales Import'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.upload_file, size: 80, color: Colors.blue),
              const SizedBox(height: 24),
              const Text(
                'Import Primary Sales Data',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'Upload CSV or Excel files from your ERP system to import primary sales invoices.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 32),
              ElevatedButton.icon(
                icon: const Icon(Icons.folder_open),
                label: const Text('Select File'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                ),
                onPressed: () {
                  // Simulate file selection and navigate to mapping wizard
                  context.push('/admin/sales/import_mapping');
                },
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () {
                  context.push('/admin/sales/import_history');
                },
                child: const Text('View Import History'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
