import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/master_data_providers.dart';

class ChemistMasterScreen extends ConsumerWidget {
  const ChemistMasterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final chemistsAsync = ref.watch(chemistsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chemist Master'),
        actions: [
          IconButton(icon: const Icon(Icons.search), onPressed: () {}),
        ],
      ),
      body: chemistsAsync.when(
        data: (chemists) {
          if (chemists.isEmpty) return const Center(child: Text('No chemists found.'));
          return ListView.builder(
            itemCount: chemists.length,
            itemBuilder: (context, index) {
              final chem = chemists[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: const CircleAvatar(child: Icon(Icons.local_pharmacy)),
                  title: Text(chem.name),
                  subtitle: Text('DL: ${chem.drugLicenseNumber}\n${chem.area}, ${chem.city}'),
                  isThreeLine: true,
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(chem.approvalStatus).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      chem.approvalStatus,
                      style: TextStyle(
                        color: _getStatusColor(chem.approvalStatus),
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.add),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Approved': return Colors.green;
      case 'Pending': return Colors.orange;
      case 'Rejected': return Colors.red;
      case 'Suspended': return Colors.grey;
      default: return Colors.black;
    }
  }
}
