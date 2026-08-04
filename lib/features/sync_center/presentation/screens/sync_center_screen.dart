import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/sync_center_provider.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_typography.dart';
import 'package:intl/intl.dart';

class SyncCenterScreen extends ConsumerWidget {
  const SyncCenterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(syncCenterProvider);
    final notifier = ref.read(syncCenterProvider.notifier);

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: Text('Sync Center', style: AppTypography.headlineSmall.copyWith(color: AppColors.onPrimary)),
          backgroundColor: AppColors.primary,
          iconTheme: const IconThemeData(color: AppColors.onPrimary),
          actions: [
            if (state.isSyncing)
              const Padding(
                padding: EdgeInsets.all(16.0),
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(color: AppColors.onPrimary, strokeWidth: 2),
                ),
              )
            else
              IconButton(
                icon: const Icon(Icons.sync),
                onPressed: () => notifier.startManualSync(),
              ),
          ],
          bottom: const TabBar(
            labelColor: AppColors.onPrimary,
            unselectedLabelColor: AppColors.grey300,
            indicatorColor: AppColors.secondary,
            tabs: [
              Tab(text: 'Pending'),
              Tab(text: 'Failed'),
              Tab(text: 'Completed'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildList(state.pending, 'No pending operations'),
            _buildList(state.failed, 'No failed operations'),
            _buildCompletedList(state.completed, notifier),
          ],
        ),
      ),
    );
  }

  Widget _buildList(List<dynamic> items, String emptyMessage) {
    if (items.isEmpty) {
      return Center(child: Text(emptyMessage, style: AppTypography.bodyMedium));
    }
    
    return ListView.builder(
      padding: const EdgeInsets.all(AppSizes.p16),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return Card(
          margin: const EdgeInsets.only(bottom: AppSizes.p12),
          child: ListTile(
            leading: const Icon(Icons.cloud_upload_outlined, color: AppColors.primary),
            title: Text('${item.entityType} - ${item.operation}', style: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold)),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Created: ${DateFormat('dd MMM yyyy, HH:mm').format(item.createdAt)}', style: AppTypography.bodySmall),
                if (item.errorMessage != null)
                  Text('Error: ${item.errorMessage}', style: AppTypography.bodySmall.copyWith(color: AppColors.error)),
              ],
            ),
            trailing: Text('Retries: ${item.retryCount}', style: AppTypography.bodySmall),
          ),
        );
      },
    );
  }

  Widget _buildCompletedList(List<dynamic> items, SyncCenterNotifier notifier) {
    if (items.isEmpty) {
      return Center(child: Text('No completed operations', style: AppTypography.bodyMedium));
    }

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(AppSizes.p16),
          child: Align(
            alignment: Alignment.centerRight,
            child: TextButton.icon(
              icon: const Icon(Icons.delete_sweep, color: AppColors.error),
              label: const Text('Clear Completed', style: TextStyle(color: AppColors.error)),
              onPressed: () => notifier.clearCompleted(),
            ),
          ),
        ),
        Expanded(child: _buildList(items, '')),
      ],
    );
  }
}
