import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/super_admin_providers.dart';

class GlobalSettingsScreen extends ConsumerWidget {
  const GlobalSettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settingsAsync = ref.watch(globalSettingsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Global Settings'),
        actions: [
          IconButton(icon: const Icon(Icons.save), onPressed: () {}), // Save settings
        ],
      ),
      body: settingsAsync.when(
        data: (settings) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _buildSettingField('Default Language', settings.defaultLanguage),
              _buildSettingField('Time Zone', settings.timeZone),
              _buildSettingField('Currency', settings.currency),
              _buildSettingField('Date Format', settings.dateFormat),
              _buildSettingField('Working Hours', settings.workingHours),
              _buildSettingField('Auto Logout Time', settings.autoLogoutTime),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }

  Widget _buildSettingField(String label, String initialValue) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextFormField(
        initialValue: initialValue,
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
        ),
      ),
    );
  }
}
