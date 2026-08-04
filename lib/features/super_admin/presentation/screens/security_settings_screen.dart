import 'package:flutter/material.dart';

class SecuritySettingsScreen extends StatelessWidget {
  const SecuritySettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Security Configuration')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildField('JWT Expiry (minutes)', '60'),
          _buildField('Refresh Token Expiry (days)', '7'),
          _buildField('Session Timeout (minutes of inactivity)', '30'),
          _buildField('Password Policy', 'Min 8 chars, 1 Uppercase, 1 Number'),
          _buildField('Device Binding Rules', 'Max 2 devices per user'),
          _buildField('IP Restrictions', '0.0.0.0/0 (Allow All)'),
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
