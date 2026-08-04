import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AnalyticsDashboard extends StatelessWidget {
  const AnalyticsDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Enterprise Analytics'),
      ),
      body: GridView.count(
        crossAxisCount: 2,
        padding: const EdgeInsets.all(16),
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        children: [
          _buildCard(
            context,
            icon: Icons.dashboard,
            title: 'Executive Dashboard',
            onTap: () => context.push('/admin/analytics/executive'),
          ),
          _buildCard(
            context,
            icon: Icons.access_time,
            title: 'Attendance Analytics',
            onTap: () {}, // Future expansion
          ),
          _buildCard(
            context,
            icon: Icons.map,
            title: 'Map Analytics (Geofencing)',
            onTap: () {}, // Future expansion
          ),
          _buildCard(
            context,
            icon: Icons.pie_chart,
            title: 'Sales & Expense',
            onTap: () {}, // Future expansion
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
}
