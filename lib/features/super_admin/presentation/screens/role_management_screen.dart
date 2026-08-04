import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/super_admin_providers.dart';

class RoleManagementScreen extends ConsumerWidget {
  const RoleManagementScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rolesAsync = ref.watch(rolesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dynamic RBAC'),
        actions: [
          IconButton(icon: const Icon(Icons.add), onPressed: () {}), // Add role
        ],
      ),
      body: rolesAsync.when(
        data: (roles) {
          if (roles.isEmpty) return const Center(child: Text('No roles found.'));
          return ListView.builder(
            itemCount: roles.length,
            itemBuilder: (context, index) {
              final role = roles[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ExpansionTile(
                  leading: const Icon(Icons.admin_panel_settings),
                  title: Text(role.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                  children: [
                    for (final entry in role.permissions.entries)
                      ListTile(
                        title: Text(entry.key, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        subtitle: Text(entry.value.join(', ')),
                        dense: true,
                      ),
                    ButtonBar(
                      children: [
                        TextButton.icon(onPressed: () {}, icon: const Icon(Icons.copy), label: const Text('Clone')),
                        TextButton.icon(onPressed: () {}, icon: const Icon(Icons.edit), label: const Text('Edit')),
                      ],
                    ),
                  ],
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
