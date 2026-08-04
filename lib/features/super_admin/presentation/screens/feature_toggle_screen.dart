import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/super_admin_providers.dart';

class FeatureToggleScreen extends ConsumerWidget {
  const FeatureToggleScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final featuresAsync = ref.watch(featureTogglesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Feature Toggles'),
      ),
      body: featuresAsync.when(
        data: (features) {
          if (features.isEmpty) return const Center(child: Text('No features found.'));
          return ListView.builder(
            itemCount: features.length,
            itemBuilder: (context, index) {
              final feature = features[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  title: Text(feature.featureName, style: const TextStyle(fontWeight: FontWeight.bold)),
                  trailing: DropdownButton<String>(
                    value: feature.status,
                    items: ['ON', 'OFF', 'Mandatory', 'Optional', 'Hidden']
                        .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                        .toList(),
                    onChanged: (val) {
                      // Update toggle
                    },
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
