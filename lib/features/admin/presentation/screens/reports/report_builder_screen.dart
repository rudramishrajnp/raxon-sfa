import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:raxon_sfa/features/admin/data/services/scheduled_report_service.dart';
import 'package:raxon_sfa/features/admin/data/models/analytics_models.dart';

class ReportBuilderScreen extends ConsumerStatefulWidget {
  const ReportBuilderScreen({super.key});

  @override
  ConsumerState<ReportBuilderScreen> createState() => _ReportBuilderScreenState();
}

class _ReportBuilderScreenState extends ConsumerState<ReportBuilderScreen> {
  final _formKey = GlobalKey<FormState>();
  String _reportName = '';
  String _reportType = 'Attendance';
  String _schedule = 'Daily';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Report Builder'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              decoration: const InputDecoration(labelText: 'Report Name', border: OutlineInputBorder()),
              onChanged: (val) => _reportName = val,
              validator: (val) => val == null || val.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _reportType,
              decoration: const InputDecoration(labelText: 'Report Type', border: OutlineInputBorder()),
              items: ['Attendance', 'MTP', 'DCR', 'Expense', 'Sales']
                  .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                  .toList(),
              onChanged: (val) => setState(() => _reportType = val!),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _schedule,
              decoration: const InputDecoration(labelText: 'Schedule', border: OutlineInputBorder()),
              items: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']
                  .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                  .toList(),
              onChanged: (val) => setState(() => _schedule = val!),
            ),
            const SizedBox(height: 16),
            const Text('Filters & Columns Selection will go here...', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () async {
                if (_formKey.currentState!.validate()) {
                  final config = ReportConfigModel(
                    id: 'new_id',
                    name: _reportName,
                    type: _reportType,
                    columns: [],
                    schedule: _schedule,
                    emailRecipients: [],
                  );
                  await ref.read(scheduledReportServiceProvider).scheduleReport(config);
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Report Scheduled!')));
                    Navigator.pop(context);
                  }
                }
              },
              child: const Text('Save & Schedule Report'),
            ),
          ],
        ),
      ),
    );
  }
}
