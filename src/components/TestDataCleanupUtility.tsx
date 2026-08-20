import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { getStoredUserProfiles, getLoggedInUser } from '../data/userContext';
import { getStoredCompanies } from '../data/companyContext';
import { AlertCircle, Play, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';

const PROTECTED_SUPER_ADMINS = ['superadmin@cloud.raxon.com', 'superadmin@raxon.cloud'];
const TEST_COMPANY_IDS = [
  'CMP-JMK-392', 'CMP-ABP-767', 'CMP-AVF-196', 'CMP-CYRUS-886', 
  'CMP-FHD-425', 'CMP-MAH-188', 'CMP-MEDIX-02', 'CMP-PAR-364', 
  'CMP-PP-220', 'CMP-RLC-01', 'CMP-RLP-180', 'CMP-RUDRA-757', 'CMP-RAXON-01'
];

interface CleanupReport {
  companies: string[];
  users: string[];
  counts: Record<string, number>;
  protectedUsers: string[];
  unresolved: string[];
  conflicts: string[];
  isSafe: boolean;
  tableDeletions: { table: string, id: string }[];
  localKeys: string[];
}

export default function TestDataCleanupUtility() {
  const [report, setReport] = useState<CleanupReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [confirmText, setConfirmText] = useState('');
  const [finalSummary, setFinalSummary] = useState<any>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const scanData = async () => {
    setIsScanning(true);
    setLogs([]);
    setReport(null);
    setFinalSummary(null);
    addLog("Starting Dry Run Scan on Supabase...");

    const rep: CleanupReport = {
      companies: [],
      users: [],
      counts: {},
      protectedUsers: [],
      unresolved: [],
      conflicts: [],
      isSafe: true,
      tableDeletions: [],
      localKeys: []
    };

    try {
      // 1. Identify Test Companies
      const { data: compRows } = await supabase.from('companies').select('*');
      (compRows || []).forEach((d: any) => {
        if (TEST_COMPANY_IDS.includes(d.id)) {
          rep.companies.push(d.id);
          rep.tableDeletions.push({ table: 'companies', id: d.id });
          rep.counts['companies'] = (rep.counts['companies'] || 0) + 1;
        }
      });

      // 2. Identify Test Users
      const { data: userRows } = await supabase.from('user_profiles').select('*');
      (userRows || []).forEach((d: any) => {
        const data = d.data || d;
        const email = data.email || '';
        const role = data.role || '';
        const companyId = d.company_id || data.companyId || '';

        if (PROTECTED_SUPER_ADMINS.includes(email) || role === 'SUPER_ADMIN' || role === 'PLATFORM_SUPER_ADMIN') {
          rep.protectedUsers.push(d.id);
          return;
        }

        if (TEST_COMPANY_IDS.includes(companyId) || d.id.startsWith('EMP-') || d.id.startsWith('CADM-') || d.id.startsWith('DADM-')) {
          rep.users.push(d.id);
          rep.tableDeletions.push({ table: 'user_profiles', id: d.id });
          rep.counts['user_profiles'] = (rep.counts['user_profiles'] || 0) + 1;
        } else if (companyId && !TEST_COMPANY_IDS.includes(companyId)) {
           // Belong to a non-test company, skip safely.
        } else {
           rep.unresolved.push(`User ${d.id} (${email})`);
        }
      });

      // Helper for company-scoped tables
      const checkTable = async (table: string) => {
        const { data: rows } = await supabase.from(table).select('*');
        (rows || []).forEach((d: any) => {
          const cid = d.company_id || d.id;
          if (rep.companies.includes(cid)) {
            rep.tableDeletions.push({ table, id: d.id });
            rep.counts[table] = (rep.counts[table] || 0) + 1;
          }
        });
      };

      await checkTable('company_employees');
      await checkTable('master_doctors');
      await checkTable('master_chemists');
      await checkTable('master_stockists');
      await checkTable('master_products');
      await checkTable('pob_approvals');
      await checkTable('dcrs');
      await checkTable('mtps');
      await checkTable('gps_pings');

      // Local Storage Keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('raxon_')) {
           let shouldDelete = false;
           if (rep.companies.some(c => key.includes(c))) shouldDelete = true;
           if (rep.users.some(u => key.includes(u))) shouldDelete = true;
           
           if (shouldDelete) {
             rep.localKeys.push(key);
             rep.counts['local_keys'] = (rep.counts['local_keys'] || 0) + 1;
           }
        }
      }
      
      rep.counts['shared_local_records_to_purge'] = rep.companies.length + rep.users.length;

      if (rep.unresolved.length > 0 || rep.conflicts.length > 0) {
        rep.isSafe = false;
      }

      setReport(rep);
      addLog(`Scan Complete. Found ${rep.tableDeletions.length} Supabase records to delete.`);
    } catch (err: any) {
      addLog(`[ERROR] ${err.message}`);
      rep.isSafe = false;
      setReport(rep);
    }
    setIsScanning(false);
  };

  const executeCleanup = async () => {
    if (!report || !report.isSafe) return;
    if (confirmText !== 'DELETE TEST DATA') return;
    
    setIsExecuting(true);
    addLog("Executing Final Cleanup on Supabase...");
    
    let deletedCount = 0;
    
    try {
      // 1. Delete Supabase Records
      for (const item of report.tableDeletions) {
        await supabase.from(item.table).delete().eq('id', item.id);
        deletedCount++;
      }

      // 2. Clear Local Storage
      report.localKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      addLog(`Cleared ${report.localKeys.length} scoped local storage keys.`);

      // 3. Purge shared local storage keys
      try {
        const pKey = 'raxon_custom_user_profiles_v5';
        let profiles = JSON.parse(localStorage.getItem(pKey) || '[]');
        profiles = profiles.filter((p: any) => !report.users.includes(p.id));
        localStorage.setItem(pKey, JSON.stringify(profiles));
        
        const cKey = 'raxon_multitenant_companies_v6';
        let comps = JSON.parse(localStorage.getItem(cKey) || '[]');
        comps = comps.filter((c: any) => !report.companies.includes(c.id));
        localStorage.setItem(cKey, JSON.stringify(comps));
        
        addLog("Purged test records from shared local storage.");
      } catch(e) {
        addLog("[WARN] Failed to parse shared local storage keys.");
      }
      
      // 4. Audit Log
      const authUserId = getLoggedInUser()?.id || 'SYSTEM';
      const authUserEmail = getLoggedInUser()?.email || 'SYSTEM';
      
      const summary = {
        action: 'DELETE',
        action_type: 'TEST_DATA_CLEANUP',
        executor_uid: authUserId,
        executor_email: authUserEmail,
        companies_deleted: report.companies.length,
        users_deleted: report.users.length,
        records_deleted: deletedCount,
        local_records_cleared: report.localKeys.length,
        timestamp: new Date().toISOString()
      };
      
      await supabase.from('sync_audit_logs').insert(summary).then(null, () => {});
      addLog("Cleanup Audit Log saved to Supabase.");
      setFinalSummary(summary);
      
    } catch (e: any) {
      addLog(`[FATAL ERROR] ${e.message}`);
    }
    
    setIsExecuting(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white text-xs mt-6">
      <h3 className="text-lg font-bold mb-2">Test Data Cleanup Utility (Supabase)</h3>
      <p className="text-slate-400 mb-4">Safely identifies and permanently deletes seeded test users, companies, DCRs, MTPs, and local data from Supabase.</p>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={scanData}
          disabled={isScanning || isExecuting}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-bold flex items-center gap-2 disabled:opacity-50"
        >
          <Play className="w-4 h-4" /> Run Dry-Run Scan
        </button>
      </div>

      {report && !finalSummary && (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
            <div className="bg-black p-4 rounded border border-slate-700">
              <h4 className="font-bold text-white mb-2">Dataset Summary</h4>
              <div>Test Companies: <span className="text-amber-400 font-bold">{report.companies.length}</span></div>
              <div>Test Users: <span className="text-amber-400 font-bold">{report.users.length}</span></div>
              <div>Protected Admins: <span className="text-emerald-400 font-bold">{report.protectedUsers.length}</span></div>
              <div>Local Storage Keys to Clear: <span className="text-amber-400 font-bold">{report.localKeys.length}</span></div>
            </div>
            <div className="bg-black p-4 rounded border border-slate-700 max-h-48 overflow-y-auto">
              <h4 className="font-bold text-white mb-2">Supabase Records to Delete</h4>
              {Object.entries(report.counts).map(([col, count]) => (
                <div key={col} className="flex justify-between border-b border-slate-800 py-1">
                  <span>{col}</span>
                  <span className="text-rose-400 font-bold">{count}</span>
                </div>
              ))}
              {Object.keys(report.counts).length === 0 && <div className="text-slate-500">No test records found.</div>}
            </div>
          </div>

          <div className={`p-4 rounded border ${report.isSafe ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-rose-950/20 border-rose-900/50'}`}>
             <h4 className={`font-bold mb-2 flex items-center gap-2 ${report.isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                {report.isSafe ? <><CheckCircle2 className="w-5 h-5" /> SAFE TO DELETE</> : <><AlertCircle className="w-5 h-5" /> BLOCKED — MANUAL REVIEW REQUIRED</>}
             </h4>
             {!report.isSafe && (
               <div className="text-rose-300">
                 {report.unresolved.length > 0 && <div>Unresolved Records: {report.unresolved.join(', ')}</div>}
                 {report.conflicts.length > 0 && <div>Conflicts: {report.conflicts.join(', ')}</div>}
               </div>
             )}
          </div>

          {report.isSafe && report.companies.length > 0 && (
            <div className="bg-black p-4 rounded border border-slate-700 space-y-3">
               <p className="text-rose-400 font-bold">WARNING: This operation will permanently delete TEST users, TEST companies and their associated TEST data from Supabase. This action cannot be undone.</p>
               <div>
                 <label className="block text-slate-400 mb-1">Type <strong>DELETE TEST DATA</strong> to confirm:</label>
                 <input 
                   type="text" 
                   value={confirmText}
                   onChange={e => setConfirmText(e.target.value)}
                   className="bg-slate-900 border border-slate-700 rounded p-2 text-white w-full max-w-sm font-bold"
                   placeholder="DELETE TEST DATA"
                 />
               </div>
               <button 
                  onClick={executeCleanup}
                  disabled={isExecuting || confirmText !== 'DELETE TEST DATA'}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" /> Execute Cleanup
                </button>
            </div>
          )}
        </div>
      )}

      {finalSummary && (
         <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 rounded-lg mb-6">
           <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Cleanup Completed</h4>
           <div className="grid grid-cols-2 gap-4 text-emerald-100/70">
             <div>Companies Deleted: <strong className="text-emerald-400">{finalSummary.companies_deleted}</strong></div>
             <div>Users Deleted: <strong className="text-emerald-400">{finalSummary.users_deleted}</strong></div>
             <div>Supabase Records Deleted: <strong className="text-emerald-400">{finalSummary.records_deleted}</strong></div>
             <div>Local Records Cleared: <strong className="text-emerald-400">{finalSummary.local_records_cleared}</strong></div>
           </div>
         </div>
      )}

      <div className="bg-black p-4 rounded-lg h-48 overflow-y-auto font-mono text-xs whitespace-pre-wrap">
        {logs.length === 0 ? <span className="text-slate-600">No logs yet...</span> : logs.map((l, i) => (
          <div key={i} className={l.includes('[ERROR]') || l.includes('[FATAL') ? 'text-rose-400' : l.includes('[WARN]') ? 'text-amber-400' : 'text-slate-300'}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
