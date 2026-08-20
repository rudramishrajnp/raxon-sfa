import { getActiveCompanyId } from '../data/companyContext';
// Offline-First IndexedDB Caching & Queue Management for Raxon SFA
// Designed for field MRs working in remote clinics / low-connectivity interior patches

export interface OfflineCallRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  monthYear: string;
  area: string;
  callTargetType: 'doctor' | 'chemist';
  targetId: number;
  targetName: string;
  specialtyOrCategory?: string;
  pobTotalValue: number;
  orderedBrandsCount: number;
  samplesGivenCount: number;
  location?: { lat: number; lng: number } | null;
  callDetail: any;
  createdAt: string;
  syncStatus: 'pending_sync' | 'syncing' | 'synced' | 'failed';
  syncedAt?: string;
  errorMessage?: string;
  retryCount: number;
}

export interface SyncAuditLog {
  id: string;
  timestamp: string;
  recordsSynced: number;
  totalPobSynced: number;
  status: 'SUCCESS' | 'PARTIAL' | 'ERROR';
  details: string;
}

const getDbName = () => `RaxonPharmaSFA_OfflineDB_${getActiveCompanyId()}`;
const DB_VERSION = 1;
const STORE_CALLS = 'offlineCallQueue';
const STORE_CACHE = 'masterDataCache';
const STORE_AUDIT = 'syncAuditLogs';

// Helper to open IndexedDB
export function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(getDbName(), DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Call Queue Store
      if (!db.objectStoreNames.contains(STORE_CALLS)) {
        const callStore = db.createObjectStore(STORE_CALLS, { keyPath: 'id' });
        callStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        callStore.createIndex('date', 'date', { unique: false });
        callStore.createIndex('userId', 'userId', { unique: false });
      }

      // Master Data Cache Store
      if (!db.objectStoreNames.contains(STORE_CACHE)) {
        db.createObjectStore(STORE_CACHE, { keyPath: 'key' });
      }

      // Sync Audit Logs Store
      if (!db.objectStoreNames.contains(STORE_AUDIT)) {
        const auditStore = db.createObjectStore(STORE_AUDIT, { keyPath: 'id' });
        auditStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// ----------------------------------------------------
// CALL QUEUE OPERATIONS
// ----------------------------------------------------

/**
 * Queue a call in IndexedDB when offline or poor connection
 */
export async function enqueueOfflineCall(call: Omit<OfflineCallRecord, 'id' | 'syncStatus' | 'retryCount' | 'createdAt'>): Promise<OfflineCallRecord> {
  const newRecord: OfflineCallRecord = {
    ...call,
    id: `OFFLINE_CALL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    syncStatus: 'pending_sync',
    retryCount: 0
  };

  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_CALLS, 'readwrite');
      const store = tx.objectStore(STORE_CALLS);
      const req = store.put(newRecord);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB write fallback to localStorage:', err);
    // Fallback to localStorage
    const local = JSON.parse(localStorage.getItem(`raxon_offline_queue_backup_${getActiveCompanyId()}`) || '[]');
    local.push(newRecord);
    localStorage.setItem(`raxon_offline_queue_backup_${getActiveCompanyId()}`, JSON.stringify(local));
  }

  // Dispatch custom event for UI updates
  window.dispatchEvent(new CustomEvent('raxon-offline-queue-changed', { detail: { record: newRecord } }));
  return newRecord;
}

/**
 * Get all queued calls
 */
export async function getOfflineCallQueue(): Promise<OfflineCallRecord[]> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_CALLS, 'readonly');
      const store = tx.objectStore(STORE_CALLS);
      const req = store.getAll();
      req.onsuccess = () => {
        const records: OfflineCallRecord[] = req.result || [];
        // Combine with any localStorage backup
        try {
          const local: OfflineCallRecord[] = JSON.parse(localStorage.getItem(`raxon_offline_queue_backup_${getActiveCompanyId()}`) || '[]');
          const combined = [...records];
          local.forEach(l => {
            if (!combined.some(c => c.id === l.id)) {
              combined.push(l);
            }
          });
          resolve(combined);
        } catch {
          resolve(records);
        }
      };
      req.onerror = () => resolve(getFallbackQueue());
    });
  } catch {
    return getFallbackQueue();
  }
}

function getFallbackQueue(): OfflineCallRecord[] {
  try {
    return JSON.parse(localStorage.getItem(`raxon_offline_queue_backup_${getActiveCompanyId()}`) || '[]');
  } catch {
    return [];
  }
}

/**
 * Update record status in IndexedDB
 */
export async function updateOfflineCallRecord(record: OfflineCallRecord): Promise<void> {
  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_CALLS, 'readwrite');
      const store = tx.objectStore(STORE_CALLS);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Update offline record failed in IndexedDB:', e);
  }

  // Update in localStorage backup too
  try {
    const local: OfflineCallRecord[] = JSON.parse(localStorage.getItem(`raxon_offline_queue_backup_${getActiveCompanyId()}`) || '[]');
    const updated = local.map(r => r.id === record.id ? record : r);
    localStorage.setItem(`raxon_offline_queue_backup_${getActiveCompanyId()}`, JSON.stringify(updated));
  } catch {}

  window.dispatchEvent(new CustomEvent('raxon-offline-queue-changed'));
}

/**
 * Delete synced record from queue
 */
export async function removeOfflineCall(id: string): Promise<void> {
  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_CALLS, 'readwrite');
      const store = tx.objectStore(STORE_CALLS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Delete offline record error:', e);
  }

  try {
    const local: OfflineCallRecord[] = JSON.parse(localStorage.getItem(`raxon_offline_queue_backup_${getActiveCompanyId()}`) || '[]');
    const updated = local.filter(r => r.id !== id);
    localStorage.setItem(`raxon_offline_queue_backup_${getActiveCompanyId()}`, JSON.stringify(updated));
  } catch {}

  window.dispatchEvent(new CustomEvent('raxon-offline-queue-changed'));
}

/**
 * Clear all completed / synced calls
 */
export async function clearSyncedCalls(): Promise<void> {
  const queue = await getOfflineCallQueue();
  for (const item of queue) {
    if (item.syncStatus === 'synced') {
      await removeOfflineCall(item.id);
    }
  }
}

// ----------------------------------------------------
// CACHE MASTER DATA FOR OFFLINE BROWSING
// ----------------------------------------------------

export async function cacheMasterDataOffline(key: string, data: any): Promise<void> {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_CACHE, 'readwrite');
    tx.objectStore(STORE_CACHE).put({ key, data, updatedAt: new Date().toISOString() });
  } catch (e) {
    try {
      localStorage.setItem(`raxon_cached_${key}`, JSON.stringify(data));
    } catch {}
  }
}

export async function getCachedMasterDataOffline(key: string): Promise<any | null> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_CACHE, 'readonly');
      const req = tx.objectStore(STORE_CACHE).get(key);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    try {
      const saved = localStorage.getItem(`raxon_cached_${key}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
}

// ----------------------------------------------------
// SYNC AUDIT LOGS
// ----------------------------------------------------

export async function logSyncAudit(log: Omit<SyncAuditLog, 'id' | 'timestamp'>): Promise<void> {
  const newAudit: SyncAuditLog = {
    ...log,
    id: `AUDIT_${Date.now()}`,
    timestamp: new Date().toISOString()
  };

  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_AUDIT, 'readwrite');
    tx.objectStore(STORE_AUDIT).put(newAudit);
  } catch {}

  try {
    const list = JSON.parse(localStorage.getItem(`raxon_sync_audit_logs_${getActiveCompanyId()}`) || '[]');
    list.unshift(newAudit);
    if (list.length > 50) list.pop();
    localStorage.setItem(`raxon_sync_audit_logs_${getActiveCompanyId()}`, JSON.stringify(list));
  } catch {}
}

export async function getSyncAuditLogs(): Promise<SyncAuditLog[]> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_AUDIT, 'readonly');
      const req = tx.objectStore(STORE_AUDIT).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    try {
      return JSON.parse(localStorage.getItem(`raxon_sync_audit_logs_${getActiveCompanyId()}`) || '[]');
    } catch {
      return [];
    }
  }
}
