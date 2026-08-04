import 'package:flutter/material.dart';

class MTPSettingsScreen extends StatelessWidget {
  const MTPSettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('MTP Configuration')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildField('Submission Deadline (Day of Month)', '25'),
          _buildField('Approval Deadline (Day of Month)', '28'),
          _buildField('Auto Lock Date (Day of Month)', '1'),
          _buildField('Grace Period (Days)', '2'),
          _buildField('Deviation Rules (Max Allowed/Month)', '4'),
          _buildField('Core Doctor Visit Frequency Rule', '2 visits/month'),
          const SizedBox(height: 24),
          ElevatedButton(onPressed: () {}, child: const Text('Save Settings')),
        ],
      ),
    );
  }

  Widget _buildField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        initialValue: value,
        decoration: InputDecoration(labelText: label, border: const OutlineInputBorder()),
      ),
    );
  }
}
