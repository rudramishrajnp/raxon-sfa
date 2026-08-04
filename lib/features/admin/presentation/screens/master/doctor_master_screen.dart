import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/master_data_providers.dart';
import 'package:raxon_sfa/core/services/logger_service.dart';

class DoctorMasterScreen extends ConsumerWidget {
  const DoctorMasterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final doctorsAsync = ref.watch(doctorsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Doctor Master'),
        actions: [
          IconButton(icon: const Icon(Icons.search), onPressed: () {}),
          IconButton(icon: const Icon(Icons.filter_list), onPressed: () {}),
        ],
      ),
      body: doctorsAsync.when(
        data: (doctors) {
          if (doctors.isEmpty) return const Center(child: Text('No doctors found.'));
          return ListView.builder(
            itemCount: doctors.length,
            itemBuilder: (context, index) {
              final doc = doctors[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: const CircleAvatar(child: Icon(Icons.person)),
                  title: Text(doc.name),
                  subtitle: Text('${doc.speciality} • ${doc.clinicName}\n${doc.area}, ${doc.city}'),
                  isThreeLine: true,
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(doc.approvalStatus).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      doc.approvalStatus,
                      style: TextStyle(
                        color: _getStatusColor(doc.approvalStatus),
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  onTap: () {
                    // Show options
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
          ref.read(loggerServiceProvider).logAudit(
            action: 'CREATE_DOCTOR_INIT',
            entityType: 'Doctor',
            entityId: '',
            userId: 'Admin',
          );
        },
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
