import 'package:flutter/material.dart';

class SystemConfigurationScreen extends StatefulWidget {
  const SystemConfigurationScreen({super.key});

  @override
  State<SystemConfigurationScreen> createState() => _SystemConfigurationScreenState();
}

class _SystemConfigurationScreenState extends State<SystemConfigurationScreen> {
  bool _maintenanceMode = false;
  bool _forceUpdate = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('System Configuration')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildField('Current App Version', '1.0.5'),
          _buildField('Minimum Supported Version', '1.0.0'),
          _buildField('API Base URL', 'https://api.raxon.com/v1'),
          _buildField('Backup Frequency', 'Daily at 02:00 AM'),
          const Divider(),
          SwitchListTile(
            title: const Text('Force Update Required'),
            value: _forceUpdate,
            onChanged: (val) => setState(() => _forceUpdate = val),
          ),
          SwitchListTile(
            title: const Text('Maintenance Mode'),
            subtitle: const Text('Disables login for non-super admins'),
            value: _maintenanceMode,
            onChanged: (val) => setState(() => _maintenanceMode = val),
            activeColor: Colors.red,
          ),
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
