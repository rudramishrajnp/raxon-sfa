import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  CloudOff, 
  Zap,
  Clock,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { 
  checkIsOnline, 
  triggerBackgroundSync, 
  setSimulatedOfflineMode, 
  isSimulatedOffline,
  initOfflineSyncListeners 
} from '../lib/offlineSyncService';
import { getOfflineCallQueue, OfflineCallRecord, getSyncAuditLogs, SyncAuditLog } from '../lib/offlineIndexedDB';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState<boolean>(checkIsOnline());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [queue, setQueue] = useState<OfflineCallRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<SyncAuditLog[]>([]);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => localStorage.getItem('raxon_last_sync_time'));

  const refreshQueue = async () => {
    const q = await getOfflineCallQueue();
    setQueue(q);
    const logs = await getSyncAuditLogs();
    setAuditLogs(logs);
    setLastSyncTime(localStorage.getItem('raxon_last_sync_time'));
  };

  useEffect(() => {
    const cleanup = initOfflineSyncListeners();
    refreshQueue();

    const handleNetworkChange = (e: any) => {
      setIsOnline(e.detail?.isOnline ?? checkIsOnline());
      refreshQueue();
    };

    const handleSyncState = (e: any) => {
      setIsSyncing(e.detail?.isSyncing ?? false);
      refreshQueue();
    };

    const handleQueueChange = () => {
      refreshQueue();
    };

    const handleSyncCompleted = (e: any) => {
      if (e.detail?.message) {
        setSyncToast(e.detail.message);
        setTimeout(() => setSyncToast(null), 5000);
      }
      refreshQueue();
    };

    window.addEventListener('raxon-network-status-changed', handleNetworkChange);
    window.addEventListener('raxon-sync-state-changed', handleSyncState);
    window.addEventListener('raxon-offline-queue-changed', handleQueueChange);
    window.addEventListener('raxon-sync-completed', handleSyncCompleted);

    return () => {
      if (cleanup) cleanup();
      window.removeEventListener('raxon-network-status-changed', handleNetworkChange);
      window.removeEventListener('raxon-sync-state-changed', handleSyncState);
      window.removeEventListener('raxon-offline-queue-changed', handleQueueChange);
      window.removeEventListener('raxon-sync-completed', handleSyncCompleted);
    };
  }, []);

  const triggerSync = async () => {
    return await triggerBackgroundSync(true);
  };

  const toggleSimulateOffline = () => {
    const next = !isSimulatedOffline();
    setSimulatedOfflineMode(next);
    setIsOnline(!next);
  };

  return {
    isOnline,
    isSyncing,
    queue,
    pendingCount: queue.filter(q => q.syncStatus === 'pending_sync' || q.syncStatus === 'failed').length,
    auditLogs,
    syncToast,
    lastSyncTime,
    triggerSync,
    refreshQueue
  };
}

export function OfflineSyncStatusBar({ onOpenQueue }: { onOpenQueue?: () => void }) {
  const { 
    isOnline, 
    isSyncing, 
    pendingCount, 
    syncToast, 
    triggerSync, 
    lastSyncTime
  } = useOfflineSync();

  return (
    <div className="space-y-2">
      {/* Toast notification popup */}
      {syncToast && (
        <div className="bg-indigo-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between text-xs font-bold animate-fade-in border border-indigo-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncToast}</span>
          </div>
          <span className="text-3xs bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full font-extrabold uppercase shrink-0">
            IndexedDB Engine
          </span>
        </div>
      )}

      {/* Main Status Bar */}
      <div className={`p-3 rounded-xl border transition-all shadow-2xs ${
        !isOnline 
          ? 'bg-amber-500/10 border-amber-300 text-amber-950'
          : isSyncing
          ? 'bg-blue-500/10 border-blue-300 text-blue-950'
          : pendingCount > 0 
          ? 'bg-blue-500/10 border-blue-300 text-blue-950'
          : 'bg-emerald-500/10 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          {/* Status Left */}
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg flex items-center justify-center ${
              !isOnline ? 'bg-amber-500 text-white' : isSyncing ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {!isOnline ? (
                <WifiOff className="w-4 h-4" />
              ) : isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wifi className="w-4 h-4" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black">
                  {!isOnline 
                    ? 'Offline Remote Clinic Mode Active' 
                    : isSyncing 
                    ? 'Syncing Data with Cloud Server...'
                    : 'Cloud Connected (Online)'}
                </span>
                {lastSyncTime && isOnline && (
                  <span className="text-3xs text-gray-500 font-semibold hidden md:inline">
                    (Last synced at {lastSyncTime})
                  </span>
                )}
              </div>
              <p className="text-3xs font-semibold text-gray-600">
                {!isOnline 
                  ? 'All doctor/chemist calls are safely queued in IndexedDB. Zero data loss even if phone switches off.' 
                  : isSyncing
                  ? 'Transmitting queued doctor & chemist records to headquarters database...'
                  : pendingCount > 0 
                  ? `${pendingCount} offline call(s) ready in queue. Tap "Sync Now" to upload immediately.` 
                  : 'All field calls, doctor prescriptions & chemist POB orders are in real-time sync with Cloud.'}
              </p>
            </div>
          </div>

          {/* Action Right */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {pendingCount > 0 && (
              <button
                type="button"
                onClick={onOpenQueue}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-2xs font-extrabold flex items-center gap-1 transition-colors"
                title="View IndexedDB queue records"
              >
                <Database className="w-3 h-3 text-amber-700" />
                <span>{pendingCount} Queued</span>
              </button>
            )}

            <button
              type="button"
              onClick={triggerSync}
              disabled={isSyncing}
              className={`px-3 py-1 rounded-lg text-2xs font-extrabold flex items-center gap-1 shadow-xs transition-colors ${
                isSyncing 
                  ? 'bg-blue-600 text-white cursor-wait opacity-80' 
                  : isOnline
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
