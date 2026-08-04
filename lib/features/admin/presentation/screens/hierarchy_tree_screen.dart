import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/admin_providers.dart';

class HierarchyTreeScreen extends ConsumerWidget {
  const HierarchyTreeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hierarchy View'),
        actions: [
          IconButton(
            icon: const Icon(Icons.list),
            onPressed: () {
              // Switch to list view
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Company Hierarchy', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildTreeNode('Company: RAXON', [
              _buildTreeNode('Zone: North', [
                _buildTreeNode('Region: Delhi', [
                  _buildTreeNode('Area: Central Delhi', [
                    _buildTreeNode('HQ: CP', [
                      _buildTreeNode('Territory: CP-1 (John Doe - MR)', []),
                      _buildTreeNode('Territory: CP-2 (Vacant)', []),
                    ]),
                  ]),
                ]),
              ]),
              _buildTreeNode('Zone: South', []),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _buildTreeNode(String title, List<Widget> children) {
    if (children.isEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 4.0),
        child: Row(
          children: [
            const Icon(Icons.horizontal_rule, size: 16, color: Colors.grey),
            const SizedBox(width: 8),
            Text(title, style: const TextStyle(fontSize: 14)),
          ],
        ),
      );
    }

    return Theme(
      data: ThemeData().copyWith(dividerColor: Colors.transparent),
      child: ExpansionTile(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        initiallyExpanded: true,
        childrenPadding: const EdgeInsets.only(left: 16),
        children: children,
      ),
    );
  }
}
