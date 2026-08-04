import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/sync_center_provider.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_typography.dart';
import 'package:go_router/go_router.dart';

class SyncStatusWidget extends ConsumerWidget {
  const SyncStatusWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(syncCenterProvider);
    
    return InkWell(
      onTap: () => context.push('/sync-center'),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: state.isSyncing ? AppColors.secondary.withOpacity(0.1) : (state.failed.isNotEmpty ? AppColors.error.withOpacity(0.1) : Colors.transparent),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (state.isSyncing)
              const SizedBox(
                width: 16, height: 16,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            else if (state.failed.isNotEmpty)
              const Icon(Icons.sync_problem, color: AppColors.error, size: 20)
            else if (state.pending.isNotEmpty)
              const Icon(Icons.sync, color: AppColors.warning, size: 20)
            else
              const Icon(Icons.cloud_done, color: AppColors.success, size: 20),
            
            const SizedBox(width: 8),
            
            Text(
              state.isSyncing 
                ? 'Syncing...' 
                : (state.failed.isNotEmpty ? '${state.failed.length} Failed' 
                : (state.pending.isNotEmpty ? '${state.pending.length} Pending' : 'Synced')),
              style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
