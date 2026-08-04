import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/admin_providers.dart';
import '../../data/repositories/admin_repository.dart';

class UserDetailsScreen extends ConsumerWidget {
  final String userId;

  const UserDetailsScreen({super.key, required this.userId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userDetailsProvider(userId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('User Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // Edit user
            },
          ),
        ],
      ),
      body: userAsync.when(
        data: (user) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: CircleAvatar(
                    radius: 50,
                    child: Text(user.name.substring(0, 1), style: const TextStyle(fontSize: 40)),
                  ),
                ),
                const SizedBox(height: 16),
                Center(
                  child: Text(
                    user.name,
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                ),
                Center(
                  child: Text(
                    user.designation,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.grey),
                  ),
                ),
                const SizedBox(height: 32),
                _buildInfoRow('Employee Code', user.employeeCode),
                _buildInfoRow('Mobile', user.mobileNumber),
                _buildInfoRow('Email', user.email),
                _buildInfoRow('Department', user.department),
                _buildInfoRow('Reporting Manager', user.reportingManagerName ?? 'N/A'),
                _buildInfoRow('Joining Date', DateFormat('dd MMM yyyy').format(user.joiningDate)),
                _buildInfoRow('HQ', user.hq),
                _buildInfoRow('Region', user.region),
                _buildInfoRow('Status', user.status),
                _buildInfoRow('Device Binding', user.deviceId?.isNotEmpty == true ? 'Bound' : 'Not Bound'),
                const SizedBox(height: 32),
                const Text('Actions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    ElevatedButton.icon(
                      icon: const Icon(Icons.lock_reset),
                      label: const Text('Reset Password'),
                      onPressed: () {
                        ref.read(adminRepositoryProvider).resetPassword(user.id);
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Password reset initiated')));
                      },
                    ),
                    ElevatedButton.icon(
                      icon: const Icon(Icons.logout),
                      label: const Text('Force Logout'),
                      onPressed: () {
                        ref.read(adminRepositoryProvider).forceLogout(user.id);
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('User force logged out')));
                      },
                    ),
                    ElevatedButton.icon(
                      icon: const Icon(Icons.phonelink_erase),
                      label: const Text('Reset Device Binding'),
                      onPressed: () {
                        ref.read(adminRepositoryProvider).resetDeviceBinding(user.id);
                        ref.invalidate(userDetailsProvider(userId));
                      },
                    ),
                    ElevatedButton.icon(
                      icon: Icon(user.status == 'Active' ? Icons.block : Icons.check_circle),
                      label: Text(user.status == 'Active' ? 'Deactivate Account' : 'Activate Account'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: user.status == 'Active' ? Colors.red : Colors.green,
                        foregroundColor: Colors.white,
                      ),
                      onPressed: () {
                        final newStatus = user.status == 'Active' ? 'Inactive' : 'Active';
                        ref.read(adminRepositoryProvider).changeUserStatus(user.id, newStatus);
                        ref.invalidate(userDetailsProvider(userId));
                        ref.invalidate(adminUsersProvider);
                      },
                    ),
                  ],
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(value),
          ),
        ],
      ),
    );
  }
}
