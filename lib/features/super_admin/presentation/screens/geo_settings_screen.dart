import 'package:flutter/material.dart';

class GeoSettingsScreen extends StatelessWidget {
  const GeoSettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Geo Settings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildField('Default Geofence Radius (meters)', '100'),
          _buildField('GPS Accuracy Minimum (meters)', '50'),
          _buildField('Breadcrumb Sync Interval (mins)', '15'),
          _buildField('Movement Distance Trigger (meters)', '500'),
          _buildField('Location Timeout (seconds)', '30'),
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
        keyboardType: TextInputType.number,
        decoration: InputDecoration(labelText: label, border: const OutlineInputBorder()),
      ),
    );
  }
}
