import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final crossAxisCount = width > 1200 ? 5 : (width > 800 ? 4 : (width > 600 ? 3 : 2));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
      ),
      body: GridView.count(
        crossAxisCount: crossAxisCount,
        padding: const EdgeInsets.all(16),
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        children: [
          _buildCard(
            context,
            icon: Icons.people,
            title: 'User Management',
            onTap: () => context.push('/admin/users'),
          ),
          _buildCard(
            context,
            icon: Icons.account_tree,
            title: 'Hierarchy & Territories',
            onTap: () => context.push('/admin/territories'),
          ),
          _buildCard(
            context,
            icon: Icons.medical_services,
            title: 'Doctor Master',
            onTap: () => context.push('/admin/doctors'),
          ),
          _buildCard(
            context,
            icon: Icons.local_pharmacy,
            title: 'Chemist Master',
            onTap: () => context.push('/admin/chemists'),
          ),
          _buildCard(
            context,
            icon: Icons.medication,
            title: 'Product Master',
            onTap: () => context.push('/admin/products'),
          ),
          _buildCard(
            context,
            icon: Icons.assignment_turned_in,
            title: 'Product Assignment',
            onTap: () => context.push('/admin/product_assignment'),
          ),
          _buildCard(
            context,
            icon: Icons.fact_check,
            title: 'Pending Approvals',
            onTap: () => context.push('/admin/approvals'),
          ),
          _buildCard(
            context,
            icon: Icons.price_change,
            title: 'Pricing Matrix',
            onTap: () => context.push('/admin/pricing'),
          ),
          _buildCard(
            context,
            icon: Icons.inventory,
            title: 'Batch Management',
            onTap: () => context.push('/admin/batches'),
          ),
          _buildCard(
            context,
            icon: Icons.bar_chart,
            title: 'Sales Dashboard',
            onTap: () => context.push('/admin/sales/dashboard'),
          ),
          _buildCard(
            context,
            icon: Icons.upload_file,
            title: 'Import Primary Sales',
            onTap: () => context.push('/admin/sales/import'),
          ),
          _buildCard(
            context,
            icon: Icons.event,
            title: 'Holiday Management',
            onTap: () => context.push('/admin/holidays'),
          ),
          _buildCard(
            context,
            icon: Icons.calendar_month,
            title: 'Holiday Calendar',
            onTap: () => context.push('/admin/holidays/calendar'),
          ),
          _buildCard(
            context,
            icon: Icons.campaign,
            title: 'Broadcast Console',
            onTap: () => context.push('/admin/broadcast'),
          ),
          _buildCard(
            context,
            icon: Icons.analytics,
            title: 'Enterprise Analytics',
            onTap: () => context.push('/admin/analytics'),
          ),
          _buildCard(
            context,
            icon: Icons.assessment,
            title: 'Report Center',
            onTap: () => context.push('/admin/reports'),
          ),
          _buildCard(
            context,
            icon: Icons.security,
            title: 'Audit Logs',
            onTap: () => context.push('/admin/audit'),
          ),
          _buildCard(
            context,
            icon: Icons.import_export,
            title: 'Import/Export',
            onTap: () => _showImportExportOptions(context),
          ),
          _buildCard(
            context,
            icon: Icons.settings,
            title: 'System Settings',
            onTap: () {},
          ),
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
            Icon(icon, size: 48, color: Theme.of(context).primaryColor),
            const SizedBox(height: 16),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  void _showImportExportOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.file_upload),
                title: const Text('Import Users (CSV/Excel)'),
                onTap: () {
                  Navigator.pop(context);
                  // Call importExportService
                },
              ),
              ListTile(
                leading: const Icon(Icons.file_upload),
                title: const Text('Import Territories (CSV/Excel)'),
                onTap: () {
                  Navigator.pop(context);
                },
              ),
              ListTile(
                leading: const Icon(Icons.file_download),
                title: const Text('Export Users'),
                onTap: () {
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
