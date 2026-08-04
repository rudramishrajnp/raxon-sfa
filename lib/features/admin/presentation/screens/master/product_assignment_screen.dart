import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ProductAssignmentScreen extends ConsumerWidget {
  const ProductAssignmentScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Product Assignment'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Assign Products to Levels',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: 'Assignment Level', border: OutlineInputBorder()),
              items: const [
                DropdownMenuItem(value: 'Company', child: Text('Company Level')),
                DropdownMenuItem(value: 'Division', child: Text('Division Level')),
                DropdownMenuItem(value: 'Region', child: Text('Region Level')),
                DropdownMenuItem(value: 'HQ', child: Text('HQ Level')),
                DropdownMenuItem(value: 'MR', child: Text('MR Level')),
              ],
              onChanged: (_) {},
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: 'Select Entity', border: OutlineInputBorder()),
              items: const [
                DropdownMenuItem(value: 'Entity1', child: Text('Entity 1')),
                DropdownMenuItem(value: 'Entity2', child: Text('Entity 2')),
              ],
              onChanged: (_) {},
            ),
            const SizedBox(height: 32),
            const Text(
              'Select Products to Assign',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Card(
              child: ListView(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  CheckboxListTile(
                    title: const Text('Raxocillin (Amoxicillin)'),
                    value: true,
                    onChanged: (val) {},
                  ),
                  CheckboxListTile(
                    title: const Text('Raxoprazole (Pantoprazole)'),
                    value: false,
                    onChanged: (val) {},
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16)),
              child: const Text('Save Assignment'),
            ),
          ],
        ),
      ),
    );
  }
}
