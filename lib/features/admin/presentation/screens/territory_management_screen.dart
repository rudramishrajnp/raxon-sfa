import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/admin_providers.dart';

class TerritoryManagementScreen extends ConsumerWidget {
  const TerritoryManagementScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final territoriesAsync = ref.watch(territoriesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Territories'),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_tree),
            tooltip: 'Hierarchy View',
            onPressed: () => context.push('/admin/hierarchy'),
          ),
        ],
      ),
      body: territoriesAsync.when(
        data: (territories) {
          if (territories.isEmpty) return const Center(child: Text('No territories found.'));
          return ListView.builder(
            itemCount: territories.length,
            itemBuilder: (context, index) {
              final t = territories[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  title: Text(t.name),
                  subtitle: Text('${t.code} • ${t.type}'),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: t.status == 'Active' ? Colors.green.shade100 : Colors.red.shade100,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      t.status,
                      style: TextStyle(
                        color: t.status == 'Active' ? Colors.green.shade900 : Colors.red.shade900,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  onTap: () {
                    _showTerritoryOptions(context, t.name);
                  },
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Add territory
        },
        child: const Icon(Icons.add_location_alt),
      ),
    );
  }

  void _showTerritoryOptions(BuildContext context, String territoryName) {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(title: Text('Options for $territoryName', style: const TextStyle(fontWeight: FontWeight.bold))),
              ListTile(
                leading: const Icon(Icons.edit),
                title: const Text('Edit Territory'),
                onTap: () => Navigator.pop(context),
              ),
              ListTile(
                leading: const Icon(Icons.merge_type),
                title: const Text('Merge Territory'),
                onTap: () => Navigator.pop(context),
              ),
              ListTile(
                leading: const Icon(Icons.call_split),
                title: const Text('Split Territory'),
                onTap: () => Navigator.pop(context),
              ),
              ListTile(
                leading: const Icon(Icons.person_add),
                title: const Text('Assign Territory'),
                onTap: () => Navigator.pop(context),
              ),
            ],
          ),
        );
      },
    );
  }
}
