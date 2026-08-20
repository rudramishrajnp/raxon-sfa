import React, { useState } from 'react';
import { 
  X, 
  Database, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Trash2, 
  Layers, 
  Pill, 
  DollarSign, 
  MapPin, 
  Calendar,
  ShieldCheck,
  Zap,
  HardDrive,
  Check
} from 'lucide-react';
import { Modal } from './Modal';
import { OfflineCallRecord, removeOfflineCall, clearSyncedCalls, SyncAuditLog } from '../lib/offlineIndexedDB';
import { triggerBackgroundSync, isSimulatedOffline, setSimulatedOfflineMode } from '../lib/offlineSyncService';

interface OfflineQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  queue: OfflineCallRecord[];
  auditLogs: SyncAuditLog[];
  isOnline: boolean;
  isSyncing: boolean;
  onRefresh: () => void;
}

export function OfflineQueueModal({
  isOpen,
  onClose,
  queue,
  auditLogs,
  isOnline,
  isSyncing,
  onRefresh
}: OfflineQueueModalProps) {
  const [activeTab, setActiveTab] = useState<'queue' | 'audit' | 'cache'>('queue');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSyncAll = async () => {
    const res = await triggerBackgroundSync(true);
    if (res.syncedCount > 0) {
      setActionMessage(`✨ Successfully synced ${res.syncedCount} call(s) to Cloud server!`);
    } else if (!isOnline) {
      setActionMessage(`⚠️ Device is offline. All records are safely preserved in IndexedDB.`);
    } else {
      setActionMessage(res.message || 'Cloud sync complete!');
    }
    onRefresh();
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleRemoveSingle = async (id: string) => {
    await removeOfflineCall(id);
    onRefresh();
  };

  const handleClearSynced = async () => {
    await clearSyncedCalls();
    onRefresh();
    setActionMessage('Cleaned up synced records from local cache.');
    setTimeout(() => setActionMessage(null), 3000);
  };

  const pendingCount = queue.filter(q => q.syncStatus === 'pending_sync' || q.syncStatus === 'failed').length;
  const totalQueuedPob = queue
    .filter(q => q.syncStatus === 'pending_sync' || q.syncStatus === 'failed')
    .reduce((acc, curr) => acc + (curr.pobTotalValue || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="IndexedDB Offline-First Architecture & Sync Center" maxWidth="max-w-2xl">
      <div className="space-y-4">
        {/* Header summary & network status */}
        <div className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
          !isOnline 
            ? 'bg-amber-50 border-amber-300' 
            : isSyncing
            ? 'bg-blue-50 border-blue-300'
            : 'bg-indigo-50/70 border-indigo-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl flex items-center justify-center ${
              !isOnline 
                ? 'bg-amber-500 text-white' 
                : isSyncing 
                ? 'bg-blue-600 text-white' 
                : 'bg-emerald-600 text-white'
            }`}>
              {!isOnline ? (
                <WifiOff className="w-5 h-5" />
              ) : isSyncing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Wifi className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="text-xs font-black text-gray-900 flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-md text-3xs font-extrabold ${
                  !isOnline ? 'bg-amber-200 text-amber-950' : isSyncing ? 'bg-blue-200 text-blue-950' : 'bg-emerald-200 text-emerald-950'
                }`}>
                  {!isOnline ? 'OFFLINE (Remote Patch)' : isSyncing ? 'SYNCING IN PROGRESS' : 'ONLINE (4G/5G Synced)'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-indigo-900 font-extrabold">{pendingCount} Calls in Local Queue</span>
                {totalQueuedPob > 0 && (
                  <span className="text-emerald-700 font-black text-3xs bg-emerald-100 px-1.5 py-0.5 rounded">
                    Queued POB: ₹{totalQueuedPob.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-3xs text-gray-600 font-semibold mt-1">
                IndexedDB Engine: <code className="text-2xs bg-white px-1.5 py-0.5 rounded border border-gray-200 text-indigo-900 font-mono">RaxonPharmaSFA_OfflineDB</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleSyncAll}
              disabled={isSyncing}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all ${
                isSyncing
                  ? 'bg-blue-600 text-white cursor-wait opacity-80'
                  : isOnline
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Now...' : 'Manual Sync Now'}</span>
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Queued Calls ({queue.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cache')}
            className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'cache'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Master Cache Status</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sync Audit Log ({auditLogs.length})</span>
          </button>
        </div>

        {/* Tab 1: Queued Calls */}
        {activeTab === 'queue' && (
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {queue.length === 0 ? (
              <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2 opacity-80" />
                <p className="text-sm font-extrabold text-gray-800">IndexedDB Queue is Clean & Fully Synced</p>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  All doctor & chemist DCR call reports, product samplings, and chemist POB orders are securely stored in the cloud database.
                </p>
              </div>
            ) : (
              queue.map(item => (
                <div 
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all ${
                    item.syncStatus === 'synced'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : item.syncStatus === 'syncing'
                      ? 'bg-blue-50/50 border-blue-300 animate-pulse'
                      : item.syncStatus === 'failed'
                      ? 'bg-red-50/50 border-red-200'
                      : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-3xs font-black px-2 py-0.5 rounded uppercase ${
                          item.callTargetType === 'doctor' ? 'bg-indigo-100 text-indigo-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {item.callTargetType === 'doctor' ? '👨‍⚕️ Doctor Call' : '💊 Chemist Call'}
                        </span>
                        <span className="text-xs font-black text-gray-900">{item.targetName}</span>
                        {item.specialtyOrCategory && (
                          <span className="text-3xs text-gray-500 font-semibold">({item.specialtyOrCategory})</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-3xs font-semibold text-gray-600 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>Area: {item.area}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{item.date}</span>
                        </span>
                        {item.pobTotalValue > 0 && (
                          <span className="text-emerald-700 font-black flex items-center gap-0.5">
                            <span>POB: ₹{item.pobTotalValue.toLocaleString('en-IN')}</span>
                          </span>
                        )}
                        {item.samplesGivenCount > 0 && (
                          <span className="text-purple-700 font-black">
                            Samples: {item.samplesGivenCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-3xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        item.syncStatus === 'synced'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.syncStatus === 'syncing'
                          ? 'bg-blue-100 text-blue-800'
                          : item.syncStatus === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.syncStatus === 'synced' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {item.syncStatus === 'syncing' && <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />}
                        {item.syncStatus === 'pending_sync' && <Clock className="w-3 h-3 text-amber-600" />}
                        {item.syncStatus === 'failed' && <AlertCircle className="w-3 h-3 text-red-600" />}
                        <span>
                          {item.syncStatus === 'synced' ? 'Synced' : item.syncStatus === 'syncing' ? 'Syncing...' : item.syncStatus === 'failed' ? 'Failed - Will Retry' : 'Safe in IndexedDB'}
                        </span>
                      </span>

                      {item.syncStatus !== 'syncing' && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSingle(item.id)}
                          className="p-1 hover:bg-gray-200 text-gray-400 hover:text-red-600 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {queue.some(q => q.syncStatus === 'synced') && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleClearSynced}
                  className="text-3xs text-gray-500 hover:text-indigo-700 font-bold underline"
                >
                  Clear successfully synced entries from local queue
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Master Cache Status */}
        {activeTab === 'cache' && (
          <div className="space-y-3 p-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">Doctors Master List</span>
                  <span className="text-3xs bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded">Cached Offline</span>
                </div>
                <p className="text-3xs text-gray-500 mt-1">
                  Doctors in all patches are stored in browser memory so you can select and punch calls even in zero mobile signal.
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">Chemists & Retailers</span>
                  <span className="text-3xs bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded">Cached Offline</span>
                </div>
                <p className="text-3xs text-gray-500 mt-1">
                  All chemist details and historical order rates are cached for offline POB booking.
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">Products, MRP & Schemes</span>
                  <span className="text-3xs bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded">Cached Offline</span>
                </div>
                <p className="text-3xs text-gray-500 mt-1">
                  Complete product portfolio, PTR, PTS, batch info, and sample allocations cached locally.
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">Stockists Directory</span>
                  <span className="text-3xs bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded">Cached Offline</span>
                </div>
                <p className="text-3xs text-gray-500 mt-1">
                  Authorized stockists mapped per patch for automatic POB delivery routing.
                </p>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-3xs text-indigo-950 leading-relaxed font-semibold">
              🛡️ <strong>Safety Guarantee:</strong> Raxon SFA uses HTML5 IndexedDB persistent database with transactional integrity. If your device battery dies or browser closes during an interior clinic visit, your call data and POB amounts remain 100% safe on device storage.
            </div>
          </div>
        )}

        {/* Tab 3: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Clock className="w-8 h-8 mx-auto text-gray-400 mb-1 opacity-70" />
                <p className="text-xs font-bold text-gray-600">No Sync Audits Recorded Yet</p>
                <p className="text-3xs text-gray-400 mt-0.5">Audits are created every time offline calls synchronize to the cloud.</p>
              </div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-900">{log.details}</span>
                    <span className={`text-3xs font-extrabold px-2 py-0.5 rounded ${
                      log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="text-3xs text-gray-500 font-semibold mt-1">
                    Timestamp: {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 rounded-b-xl flex items-center justify-between flex-wrap gap-2">
          <span className="text-3xs font-bold text-gray-500">
            Offline-first architecture protects field data across all interior routes.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
