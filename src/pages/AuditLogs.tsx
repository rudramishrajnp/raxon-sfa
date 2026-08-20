import React, { useState, useEffect } from 'react';
import { 
  HardDrive, ShieldAlert, ShieldCheck, Download, Search, Filter, CheckCircle2, AlertTriangle, 
  Clock, Smartphone, MapPin, UserCheck, Key, Lock, RefreshCw, Eye
} from 'lucide-react';
import { getActiveCompanyId, getActiveCompany } from '../data/companyContext';
import { getUsersByCompany } from '../data/userContext';

interface SecurityAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'Doctor Created' | 'Doctor Deleted' | 'Territory Reassigned' | 'Scheme Modified' | 'Fake GPS Detected' | 'Device Binding Reset' | 'DCR Submitted Offline' | 'Master Bulk Upload';
  severity: 'Info' | 'Warning' | 'Critical Security';
  details: string;
  ipAddress: string;
  deviceModel: string;
  location: string;
}

export default function AuditLogs() {
  const activeCompanyId = getActiveCompanyId();
  const company = getActiveCompany();

  const loadAuditLogs = (): SecurityAuditLog[] => {
    try {
      const saved = localStorage.getItem(`raxon_audit_trail_${activeCompanyId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'LOG-8801',
        timestamp: '2026-08-16 00:15:20',
        userId: 'MR-01',
        userName: 'Rahul Verma',
        userRole: 'MR',
        action: 'DCR Submitted Offline',
        severity: 'Info',
        details: 'Submitted 12 Doctor calls while in offline mode. Synced automatically upon reconnection.',
        ipAddress: '157.34.192.81',
        deviceModel: 'Samsung Galaxy A54 5G',
        location: 'Hazratganj, Lucknow'
      },
      {
        id: 'LOG-8802',
        timestamp: '2026-08-15 17:42:10',
        userId: 'MR-03',
        userName: 'Amit Singh',
        userRole: 'MR',
        action: 'Fake GPS Detected',
        severity: 'Critical Security',
        details: 'Mock location provider "FakeGPS Pro" intercepted during doctor call punch-in at 25.3176° N, 82.9739° E.',
        ipAddress: '103.224.45.12',
        deviceModel: 'Redmi Note 12 Pro',
        location: 'Varanasi Central'
      },
      {
        id: 'LOG-8803',
        timestamp: '2026-08-15 14:10:00',
        userId: 'ADMIN-01',
        userName: 'Company Admin',
        userRole: 'ADMIN',
        action: 'Territory Reassigned',
        severity: 'Warning',
        details: 'Reassigned Hazratganj Central patch from Rahul Verma to Amit Verma.',
        ipAddress: '14.139.228.18',
        deviceModel: 'MacBook Pro (Chrome 124)',
        location: 'Head Office, Mumbai'
      },
      {
        id: 'LOG-8804',
        timestamp: '2026-08-15 11:30:15',
        userId: 'ADMIN-01',
        userName: 'Company Admin',
        userRole: 'ADMIN',
        action: 'Master Bulk Upload',
        severity: 'Info',
        details: 'Imported 45 new Doctor master records via CSV batch import.',
        ipAddress: '14.139.228.18',
        deviceModel: 'MacBook Pro (Chrome 124)',
        location: 'Head Office, Mumbai'
      },
      {
        id: 'LOG-8805',
        timestamp: '2026-08-14 19:25:40',
        userId: 'MR-02',
        userName: 'Pooja Sharma',
        userRole: 'MR',
        action: 'Device Binding Reset',
        severity: 'Warning',
        details: 'User switched login device from OnePlus Nord to Vivo V29. Device UUID re-bound with Admin approval.',
        ipAddress: '49.36.120.90',
        deviceModel: 'Vivo V29 5G',
        location: 'Kanpur HQ'
      }
    ];
  };

  const [logs, setLogs] = useState<SecurityAuditLog[]>(loadAuditLogs);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<SecurityAuditLog | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(`raxon_audit_trail_${activeCompanyId}`, JSON.stringify(logs));
  }, [logs, activeCompanyId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportCsv = () => {
    const headers = ['Log ID', 'Timestamp', 'User', 'Role', 'Action', 'Severity', 'Details', 'Device Model', 'Location', 'IP Address'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.userName}"`,
      l.userRole,
      `"${l.action}"`,
      l.severity,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.deviceModel}"`,
      `"${l.location}"`,
      l.ipAddress
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `system_security_audit_${company.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Security audit log exported as CSV!');
  };

  const filteredLogs = logs.filter(l => {
    const matchSev = severityFilter === 'ALL' ? true : l.severity === severityFilter;
    const matchAct = actionFilter === 'ALL' ? true : l.action === actionFilter;
    const matchSearch = l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.deviceModel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSev && matchAct && matchSearch;
  });

  const criticalCount = logs.filter(l => l.severity === 'Critical Security').length;
  const warningCount = logs.filter(l => l.severity === 'Warning').length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-gray-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white text-xs ml-2">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">System Security, Compliance & Audit Trail</h1>
            <p className="text-xs text-gray-500">
              Tamper-proof system activity log, fake GPS detection, device binding audit, and administrative modification records.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-600" /> Export Audit Log CSV
        </button>
      </div>

      {/* Security Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Audit Events</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 mt-2">{logs.length} Logged Events</div>
          <div className="text-xs text-gray-500 mt-1">Immutable timestamped trail</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Critical Security Alerts</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl font-extrabold text-red-600 mt-2">{criticalCount} Incidents</div>
          <div className="text-xs text-red-700 font-bold mt-1">Fake GPS & Unauthorized Access</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">System Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-600 mt-2">{warningCount} Warnings</div>
          <div className="text-xs text-gray-500 mt-1">Device switch & role adjustments</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Device Binding Status</span>
            <Smartphone className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600 mt-2">100% Enforced</div>
          <div className="text-xs text-gray-500 mt-1">Single active device per rep</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
            <Filter className="w-4 h-4 text-gray-400" />
            <span>Severity:</span>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical Security">Critical Security Only</option>
              <option value="Warning">Warning Only</option>
              <option value="Info">Info Only</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
            <span>Action Type:</span>
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Actions</option>
              <option value="Fake GPS Detected">Fake GPS Detected</option>
              <option value="Device Binding Reset">Device Binding Reset</option>
              <option value="Territory Reassigned">Territory Reassigned</option>
              <option value="Master Bulk Upload">Master Bulk Upload</option>
              <option value="DCR Submitted Offline">DCR Submitted Offline</option>
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">User & Role</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Severity</th>
                <th className="px-5 py-3.5">Details</th>
                <th className="px-5 py-3.5">Device & Location</th>
                <th className="px-5 py-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No security audit logs found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-gray-900 font-semibold">{log.timestamp}</div>
                      <div className="text-[10px] text-gray-400">{log.id}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-gray-900">{log.userName}</div>
                      <div className="text-[10px] text-gray-500">{log.userRole} • {log.userId}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-gray-900">{log.action}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.severity === 'Critical Security' ? 'bg-red-100 text-red-800' :
                        log.severity === 'Warning' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="text-gray-700 truncate">{log.details}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-gray-900 font-medium">{log.deviceModel}</div>
                      <div className="text-[10px] text-gray-500">{log.location} ({log.ipAddress})</div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
                        title="View Full Audit Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-purple-600" /> Audit Log #{selectedLog.id}
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Action:</span>
                  <span className="font-bold text-gray-900">{selectedLog.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Timestamp:</span>
                  <span className="font-mono text-gray-900">{selectedLog.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">User:</span>
                  <span className="font-bold text-gray-900">{selectedLog.userName} ({selectedLog.userRole})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Device Model:</span>
                  <span className="text-gray-900">{selectedLog.deviceModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">IP & Location:</span>
                  <span className="text-gray-900">{selectedLog.location} ({selectedLog.ipAddress})</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-900 block mb-1">Full Technical Event Description:</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-mono text-3xs">
                  {selectedLog.details}
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
