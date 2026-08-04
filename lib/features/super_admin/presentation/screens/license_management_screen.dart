import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/super_admin_providers.dart';

class LicenseManagementScreen extends ConsumerWidget {
  const LicenseManagementScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final licenseAsync = ref.watch(licenseProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('License Management'),
      ),
      body: licenseAsync.when(
        data: (license) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('License Key: ${license.licenseKey}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const Divider(),
                      ListTile(
                        title: const Text('Plan'),
                        trailing: Text(license.plan, style: const TextStyle(fontWeight: FontWeight.bold)),
                      ),
                      ListTile(
                        title: const Text('Expiry Date'),
                        trailing: Text(DateFormat('dd-MMM-yyyy').format(license.expiryDate), style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.red)),
                      ),
                      ListTile(
                        title: const Text('Active Users'),
                        trailing: Text('${license.activeUsers} / ${license.maxUsers}', style: const TextStyle(fontWeight: FontWeight.bold)),
                      ),
                      ListTile(
                        title: const Text('Storage Usage'),
                        trailing: Text('${license.storageUsage} GB', style: const TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.upgrade),
                label: const Text('Upgrade Plan'),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
