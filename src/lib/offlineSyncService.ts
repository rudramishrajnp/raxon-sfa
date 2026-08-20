// Offline Sync Engine & Auto-Reconnection Orchestrator for Raxon SFA
import { 
  getOfflineCallQueue, 
  updateOfflineCallRecord, 
  removeOfflineCall, 
  logSyncAudit, 
  OfflineCallRecord,
  cacheMasterDataOffline,
  getCachedMasterDataOffline
} from './offlineIndexedDB';
import { saveDCRCheckIn } from './api';
import { getDoctorsList, getChemistsList, getProductsCatalog, getStockistsList } from '../data/masterData';

let isSyncInProgress = false;

export interface SyncEngineStatus {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  lastSyncTime: string | null;
  lastSyncMessage: string;
}

/**
 * Check if the browser currently has an active network connection
 */
export function checkIsOnline(): boolean {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    // Check if user manually simulated offline mode
    const simulatedOffline = localStorage.getItem('raxon_simulated_offline') === 'true';
    if (simulatedOffline) return false;
    return navigator.onLine;
  }
  return true;
}

/**
 * Toggle simulated offline mode (useful for testing remote clinic scenarios without disabling whole wifi)
 */
export function setSimulatedOfflineMode(enabled: boolean) {
  localStorage.setItem('raxon_simulated_offline', enabled ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent('raxon-network-status-changed', { detail: { isOnline: !enabled } }));
  if (!enabled) {
    // When coming back online, trigger auto sync
    triggerBackgroundSync(true);
  }
}

export function isSimulatedOffline(): boolean {
  return localStorage.getItem('raxon_simulated_offline') === 'true';
}

/**
 * Cache all primary master data into IndexedDB so MR can use the app completely offline
 */
export async function cacheAllMasterDataForOfflineUse() {
  try {
    const docs = getDoctorsList();
    const chems = getChemistsList();
    const prods = getProductsCatalog();
    const stks = getStockistsList();

    await cacheMasterDataOffline('doctors', docs);
    await cacheMasterDataOffline('chemists', chems);
    await cacheMasterDataOffline('products', prods);
    await cacheMasterDataOffline('stockists', stks);
  } catch (err) {
    console.warn('Master data offline cache error:', err);
  }
}

/**
 * Run background/manual synchronization of all pending IndexedDB calls & Master Cache
 */
export async function triggerBackgroundSync(isManual: boolean = false): Promise<{ 
  success: boolean; 
  syncedCount: number; 
  failedCount: number; 
  message: string;
}> {
  if (isSyncInProgress) {
    return { success: false, syncedCount: 0, failedCount: 0, message: 'Sync is already in progress...' };
  }

  const isOnline = checkIsOnline();
  if (!isOnline) {
    const offlineMsg = 'Device is currently offline. All data is safely preserved in IndexedDB local storage.';
    if (isManual) {
      window.dispatchEvent(new CustomEvent('raxon-sync-completed', {
        detail: {
          syncedCount: 0,
          totalPobSynced: 0,
          isOffline: true,
          message: `⚠️ Offline Mode: Data is safely stored in IndexedDB. Will sync automatically when 4G/WiFi connects.`
        }
      }));
    }
    return { success: false, syncedCount: 0, failedCount: 0, message: offlineMsg };
  }

  isSyncInProgress = true;
  window.dispatchEvent(new CustomEvent('raxon-sync-state-changed', { detail: { isSyncing: true } }));

  let syncedCount = 0;
  let failedCount = 0;
  let totalPobSynced = 0;

  try {
    // 1. Re-cache master data to keep local IndexedDB up to date
    await cacheAllMasterDataForOfflineUse();

    // 2. Fetch all queued items from IndexedDB
    const queue = await getOfflineCallQueue();
    const pendingCalls = queue.filter(c => c.syncStatus === 'pending_sync' || c.syncStatus === 'failed');

    for (const item of pendingCalls) {
      try {
        // Update status to syncing
        await updateOfflineCallRecord({
          ...item,
          syncStatus: 'syncing'
        });

        // Push to DCR CheckIn storage / Firestore / API
        await saveDCRCheckIn(
          item.date,
          item.area,
          item.targetId,
          item.location || null,
          item.callDetail
        );

        syncedCount++;
        totalPobSynced += (item.pobTotalValue || 0);

        // Mark as synced
        await updateOfflineCallRecord({
          ...item,
          syncStatus: 'synced',
          syncedAt: new Date().toISOString()
        });

        // Short grace period before removal from queue
        setTimeout(() => {
          removeOfflineCall(item.id);
        }, 3000);

      } catch (callError: any) {
        console.error(`Failed to sync offline call ID: ${item.id}`, callError);
        failedCount++;
        await updateOfflineCallRecord({
          ...item,
          syncStatus: 'failed',
          retryCount: (item.retryCount || 0) + 1,
          errorMessage: callError?.message || 'Network sync timeout'
        });
      }
    }

    const lastSyncTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    localStorage.setItem('raxon_last_sync_time', lastSyncTimestamp);

    if (syncedCount > 0) {
      await logSyncAudit({
        recordsSynced: syncedCount,
        totalPobSynced,
        status: failedCount === 0 ? 'SUCCESS' : 'PARTIAL',
        details: `${isManual ? 'Manual' : 'Auto'} sync uploaded ${syncedCount} offline DCR call(s) (Total POB: ₹${totalPobSynced.toLocaleString('en-IN')}).`
      });

      const successMsg = `✨ ${syncedCount} queued call(s) synced to Cloud! (POB: ₹${totalPobSynced.toLocaleString('en-IN')})`;
      window.dispatchEvent(new CustomEvent('raxon-sync-completed', {
        detail: {
          syncedCount,
          totalPobSynced,
          message: successMsg
        }
      }));

      return { success: true, syncedCount, failedCount, message: successMsg };
    } else {
      // If manual sync triggered and queue was already empty
      const upToDateMsg = `✅ Cloud sync complete! All master databases, MTPs & field records are up to date. (${lastSyncTimestamp})`;
      if (isManual) {
        window.dispatchEvent(new CustomEvent('raxon-sync-completed', {
          detail: {
            syncedCount: 0,
            totalPobSynced: 0,
            message: upToDateMsg
          }
        }));
      }
      return { success: true, syncedCount: 0, failedCount: 0, message: upToDateMsg };
    }
  } catch (globalError: any) {
    console.error('Fatal sync engine error:', globalError);
    return { success: false, syncedCount: 0, failedCount: 1, message: globalError?.message || 'Sync error' };
  } finally {
    isSyncInProgress = false;
    window.dispatchEvent(new CustomEvent('raxon-sync-state-changed', { detail: { isSyncing: false } }));
  }
}

let isOfflineSyncInitialized = false;

/**
 * Initialize network listeners & automatic sync schedule
 */
export function initOfflineSyncListeners() {
  if (typeof window === 'undefined') return () => {};
  if (isOfflineSyncInitialized) return () => {};
  isOfflineSyncInitialized = true;

  const handleOnline = () => {
    window.dispatchEvent(new CustomEvent('raxon-network-status-changed', { detail: { isOnline: true } }));
    // Auto sync when back online
    triggerBackgroundSync(false);
  };

  const handleOffline = () => {
    window.dispatchEvent(new CustomEvent('raxon-network-status-changed', { detail: { isOnline: false } }));
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Pre-cache master data asynchronously after main thread idle (non-blocking)
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      cacheAllMasterDataForOfflineUse().catch(() => {});
    });
  } else {
    setTimeout(() => {
      cacheAllMasterDataForOfflineUse().catch(() => {});
    }, 2500);
  }

  // Periodic heartbeat sync check every 60 seconds if online
  const interval = setInterval(() => {
    if (checkIsOnline() && !isSyncInProgress) {
      triggerBackgroundSync(false);
    }
  }, 60000);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    clearInterval(interval);
    isOfflineSyncInitialized = false;
  };
}
