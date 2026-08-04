import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class SuperAdminDashboardScreen extends StatelessWidget {
  const SuperAdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final crossAxisCount = width > 1200 ? 5 : (width > 800 ? 4 : (width > 600 ? 3 : 2));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Master Control Center'),
        backgroundColor: Colors.indigo.shade900,
        foregroundColor: Colors.white,
      ),
      body: GridView.count(
        crossAxisCount: crossAxisCount,
        padding: const EdgeInsets.all(16),
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        children: [
          _buildCard(context, icon: Icons.business, title: 'Company Management', onTap: () => context.push('/super_admin/companies')),
          _buildCard(context, icon: Icons.manage_accounts, title: 'Dynamic RBAC', onTap: () => context.push('/super_admin/roles')),
          _buildCard(context, icon: Icons.toggle_on, title: 'Feature Toggles', onTap: () => context.push('/super_admin/features')),
          _buildCard(context, icon: Icons.settings_applications, title: 'Global Settings', onTap: () => context.push('/super_admin/global_settings'),),
          _buildCard(context, icon: Icons.settings, title: 'System Configuration', onTap: () => context.push('/super_admin/system')),
          _buildCard(context, icon: Icons.map, title: 'Geo Settings', onTap: () => context.push('/super_admin/geo')),
          _buildCard(context, icon: Icons.attach_money, title: 'TA/DA Matrix', onTap: () => context.push('/super_admin/tada')),
          _buildCard(context, icon: Icons.rule, title: 'MTP Settings', onTap: () => context.push('/super_admin/mtp_settings')),
          _buildCard(context, icon: Icons.security, title: 'Security & Auth', onTap: () => context.push('/super_admin/security')),
          _buildCard(context, icon: Icons.storage, title: 'Database & Backups', onTap: () => context.push('/super_admin/backups')),
          _buildCard(context, icon: Icons.workspace_premium, title: 'License Management', onTap: () => context.push('/super_admin/license')),
          _buildCard(context, icon: Icons.developer_mode, title: 'Developer Console', onTap: () => context.push('/super_admin/developer')),
        ],
      ),
    );
  }

  Widget _buildCard(BuildContext context, {required IconData icon, required String title, required VoidCallback onTap}) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 48, color: Colors.indigo.shade900),
            const SizedBox(height: 16),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
