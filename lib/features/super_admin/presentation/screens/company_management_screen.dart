import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/super_admin_providers.dart';

class CompanyManagementScreen extends ConsumerWidget {
  const CompanyManagementScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final companiesAsync = ref.watch(companiesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Company Management'),
        actions: [
          IconButton(icon: const Icon(Icons.add), onPressed: () {}), // Add company
        ],
      ),
      body: companiesAsync.when(
        data: (companies) {
          if (companies.isEmpty) return const Center(child: Text('No companies found.'));
          return ListView.builder(
            itemCount: companies.length,
            itemBuilder: (context, index) {
              final company = companies[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: Colors.blueGrey,
                    child: Text(company.name.substring(0, 1).toUpperCase()),
                  ),
                  title: Text(company.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Divisions: ${company.divisions.join(', ')}\nCreated: ${DateFormat('dd-MMM-yyyy').format(company.createdAt)}'),
                  isThreeLine: true,
                  trailing: Switch(
                    value: company.isActive,
                    onChanged: (val) {
                      // Toggle active state
                    },
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
