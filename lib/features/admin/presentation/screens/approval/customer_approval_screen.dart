import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/master_data_providers.dart';
import 'package:raxon_sfa/core/services/logger_service.dart';

class CustomerApprovalScreen extends ConsumerWidget {
  const CustomerApprovalScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pendingAsync = ref.watch(pendingApprovalsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pending Approvals'),
      ),
      body: pendingAsync.when(
        data: (pendingData) {
          final doctors = pendingData['doctors'] as List;
          final chemists = pendingData['chemists'] as List;

          if (doctors.isEmpty && chemists.isEmpty) {
            return const Center(child: Text('No pending approvals.'));
          }

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              if (doctors.isNotEmpty) ...[
                const Text('Doctor Approvals', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                ...doctors.map((doc) => _buildApprovalCard(
                  context,
                  ref,
                  type: 'Doctor',
                  name: doc.name,
                  details: '${doc.speciality} • ${doc.area}',
                  id: doc.id,
                )),
                const SizedBox(height: 16),
              ],
              if (chemists.isNotEmpty) ...[
                const Text('Chemist Approvals', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                ...chemists.map((chem) => _buildApprovalCard(
                  context,
                  ref,
                  type: 'Chemist',
                  name: chem.name,
                  details: '${chem.drugLicenseNumber} • ${chem.area}',
                  id: chem.id,
                )),
              ],
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }

  Widget _buildApprovalCard(BuildContext context, WidgetRef ref, {required String type, required String name, required String details, required String id}) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ExpansionTile(
        title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(details),
        childrenPadding: const EdgeInsets.all(16),
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton.icon(
                icon: const Icon(Icons.check),
                label: const Text('Approve'),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: Colors.white),
                onPressed: () {
                  // Approve logic
                  ref.read(loggerServiceProvider).logAudit(
                    action: 'APPROVE_CUSTOMER',
                    entityType: type,
                    entityId: id,
                    userId: 'Admin',
                    details: {'status': 'Approved'},
                  );
                  ref.invalidate(pendingApprovalsProvider);
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Approved')));
                },
              ),
              ElevatedButton.icon(
                icon: const Icon(Icons.close),
                label: const Text('Reject'),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
                onPressed: () {
                  _showRejectDialog(context, ref, type, id);
                },
              ),
            ],
          ),
          const SizedBox(height: 8),
          TextButton.icon(
            icon: const Icon(Icons.edit_note),
            label: const Text('Return for Correction'),
            onPressed: () {
              // Return for correction logic
            },
          ),
        ],
      ),
    );
  }

  void _showRejectDialog(BuildContext context, WidgetRef ref, String type, String id) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Reject Reason'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(labelText: 'Mandatory Remarks'),
          maxLines: 3,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              if (controller.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Remarks are mandatory')));
                return;
              }
              Navigator.pop(context);
              ref.read(loggerServiceProvider).logAudit(
                action: 'REJECT_CUSTOMER',
                entityType: type,
                entityId: id,
                userId: 'Admin',
                details: {'status': 'Rejected', 'remarks': controller.text},
              );
              ref.invalidate(pendingApprovalsProvider);
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Rejected')));
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            child: const Text('Confirm Reject'),
          ),
        ],
      ),
    );
  }
}
