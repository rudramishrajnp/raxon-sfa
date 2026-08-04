import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:raxon_sfa/core/services/logger_service.dart';

class NotificationComposerScreen extends ConsumerStatefulWidget {
  const NotificationComposerScreen({super.key});

  @override
  ConsumerState<NotificationComposerScreen> createState() => _NotificationComposerScreenState();
}

class _NotificationComposerScreenState extends ConsumerState<NotificationComposerScreen> {
  final _formKey = GlobalKey<FormState>();
  String _category = 'Announcement';
  String _audience = 'All Users';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Compose Notification'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            DropdownButtonFormField<String>(
              value: _category,
              decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
              items: ['Announcement', 'HR Circular', 'Promotional Scheme', 'Meeting Notice', 'Emergency Alert']
                  .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                  .toList(),
              onChanged: (val) => setState(() => _category = val!),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _audience,
              decoration: const InputDecoration(labelText: 'Target Audience', border: OutlineInputBorder()),
              items: ['All Users', 'MR', 'AM', 'RM', 'Specific Zone', 'Specific Region']
                  .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                  .toList(),
              onChanged: (val) => setState(() => _audience = val!),
            ),
            const SizedBox(height: 16),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Title', border: OutlineInputBorder()),
              validator: (val) => val == null || val.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              maxLines: 6,
              decoration: const InputDecoration(labelText: 'Message Body', border: OutlineInputBorder()),
              validator: (val) => val == null || val.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            const Text('Attachments', style: TextStyle(fontWeight: FontWeight.bold)),
            Row(
              children: [
                IconButton(icon: const Icon(Icons.image), onPressed: () {}),
                IconButton(icon: const Icon(Icons.picture_as_pdf), onPressed: () {}),
                IconButton(icon: const Icon(Icons.link), onPressed: () {}),
              ],
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  ref.read(loggerServiceProvider).logAudit(
                    action: 'CREATE_BROADCAST',
                    entityType: 'Broadcast',
                    entityId: 'broadcast_new',
                    userId: 'Admin',
                  );
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Message sent/scheduled.')));
                  Navigator.pop(context);
                }
              },
              child: const Text('Send Broadcast'),
            ),
          ],
        ),
      ),
    );
  }
}
