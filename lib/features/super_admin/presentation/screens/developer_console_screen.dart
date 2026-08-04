import 'package:flutter/material.dart';

class DeveloperConsoleScreen extends StatefulWidget {
  const DeveloperConsoleScreen({super.key});

  @override
  State<DeveloperConsoleScreen> createState() => _DeveloperConsoleScreenState();
}

class _DeveloperConsoleScreenState extends State<DeveloperConsoleScreen> {
  bool _debugMode = false;
  bool _apiLogs = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Developer Console'),
        backgroundColor: Colors.black87,
        foregroundColor: Colors.green,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          SwitchListTile(
            title: const Text('Enable Debug Mode'),
            value: _debugMode,
            onChanged: (val) => setState(() => _debugMode = val),
            activeColor: Colors.green,
          ),
          SwitchListTile(
            title: const Text('Enable API Logs'),
            value: _apiLogs,
            onChanged: (val) => setState(() => _apiLogs = val),
            activeColor: Colors.green,
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.error_outline),
            title: const Text('View Error Logs'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.speed),
            title: const Text('Performance Logs'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.monitor_heart),
            title: const Text('System Health'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {},
          ),
        ],
      ),
    );
  }
}
