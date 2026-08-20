import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { getStoredUserProfiles, getLoggedInUser } from '../data/userContext';
import { Play, RefreshCw } from 'lucide-react';

export default function HistoricalBackfillUtility() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dryRunReport, setDryRunReport] = useState<any>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const processRecords = async (execute: boolean) => {
    setIsProcessing(true);
    setLogs([]);
    addLog(`Starting ${execute ? 'EXECUTE' : 'DRY RUN'} Historical Backfill to Supabase...`);

    try {
      const profiles = getStoredUserProfiles();
      const profileMap = new Map();
      profiles.forEach(p => profileMap.set(p.id, p));
      
      const employees = JSON.parse(localStorage.getItem('raxon_company_employees') || '[]');
      const employeeMap = new Map();
      employees.forEach((e: any) => {
        if (!employeeMap.has(e.id)) {
          employeeMap.set(e.id, []);
        }
        employeeMap.get(e.id).push(e);
      });

      // Metrics
      const metrics = {
        dcrs: { total: 0, alreadyScoped: 0, missingCompany: 0, missingDivision: 0, pending: 0, unresolved: 0, ambiguous: 0, conflicts: 0 },
        mtps: { total: 0, alreadyScoped: 0, missingCompany: 0, missingDivision: 0, pending: 0, unresolved: 0, ambiguous: 0, conflicts: 0 },
        writes: 0
      };

      const pendingUpdates: { type: string, id: string, updates: any }[] = [];

      const checkRecord = (record: any, type: 'dcrs' | 'mtps') => {
        metrics[type].total++;
        const data = record.data || record;
        let userId = data.userId || record.user_id;
        
        // For MTPs, userId might be extracted from id (userId_monthYear)
        if (!userId && type === 'mtps') {
          const parts = record.id.split('_');
          if (parts.length >= 2) userId = parts[0];
        }
        
        if (!userId) {
          metrics[type].unresolved++;
          addLog(`[ERROR] ${type} ${record.id} has no userId.`);
          return;
        }

        let user = profileMap.get(userId);
        if (!user) {
          const matchingEmployees = employeeMap.get(userId) || [];
          if (matchingEmployees.length === 1) {
            user = matchingEmployees[0];
          } else if (matchingEmployees.length > 1) {
            metrics[type].ambiguous++;
            addLog(`[AMBIGUOUS] ${type} ${record.id} - User ${userId} has multiple authoritative employee mappings.`);
            return;
          } else {
            metrics[type].unresolved++;
            addLog(`[WARN] ${type} ${record.id} - User ${userId} not found in authoritative profiles or employees.`);
            return;
          }
        }

        const authCompany = user.companyId || null;
        const authDivision = user.divisionId || null;

        if (!authCompany) {
          metrics[type].unresolved++;
          addLog(`[WARN] ${type} ${record.id} - User ${userId} has no companyId in profile.`);
          return;
        }

        const recordCompany = record.company_id || data.companyId;
        const recordDivision = record.division_id || data.divisionId;
        const hasCompany = !!recordCompany;
        const hasDivision = !!recordDivision;

        if (!hasCompany) metrics[type].missingCompany++;
        if (!hasDivision && authDivision) metrics[type].missingDivision++;

        if (hasCompany && recordCompany !== authCompany) {
          metrics[type].conflicts++;
          addLog(`[CONFLICT] ${type} ${record.id} - Document company ${recordCompany} != User company ${authCompany}`);
          return;
        }

        if (hasDivision && authDivision && recordDivision !== authDivision) {
          metrics[type].conflicts++;
          addLog(`[CONFLICT] ${type} ${record.id} - Document division ${recordDivision} != User division ${authDivision}`);
          return;
        }

        if (hasCompany && (hasDivision || !authDivision)) {
          metrics[type].alreadyScoped++;
          return;
        }

        metrics[type].pending++;
        pendingUpdates.push({
          type,
          id: record.id,
          updates: {
            ...(!hasCompany && { company_id: authCompany }),
            ...(!hasDivision && authDivision && { division_id: authDivision })
          }
        });
      };

      // Fetch DCRs
      addLog("Fetching DCRs from Supabase...");
      const { data: dcrRows } = await supabase.from('dcrs').select('*');
      (dcrRows || []).forEach(d => checkRecord(d, 'dcrs'));

      // Fetch MTPs
      addLog("Fetching MTPs from Supabase...");
      const { data: mtpRows } = await supabase.from('mtps').select('*');
      (mtpRows || []).forEach(m => checkRecord(m, 'mtps'));

      setDryRunReport(metrics);

      if (!execute) {
        addLog(`[DRY RUN] Complete. Found ${pendingUpdates.length} records requiring backfill.`);
      } else {
        if (pendingUpdates.length === 0) {
           addLog(`No records require backfill.`);
        } else {
           addLog(`Executing backfill for ${pendingUpdates.length} records...`);
           for (const update of pendingUpdates) {
             const table = update.type === 'dcrs' ? 'dcrs' : 'mtps';
             await supabase.from(table).update(update.updates).eq('id', update.id);
             
             const authUserId = getLoggedInUser()?.id || 'SYSTEM';
             const authUserEmail = getLoggedInUser()?.email || 'SYSTEM';
             
             await supabase.from('sync_audit_logs').insert({
               action: 'UPDATE',
               action_type: 'HISTORICAL_SCOPE_BACKFILL',
               entity_type: update.type,
               entity_id: update.id,
               executor_uid: authUserId,
               executor_email: authUserEmail,
               company_id: update.updates.company_id || null,
               division_id: update.updates.division_id || null,
               new_values: update.updates,
               timestamp: new Date().toISOString(),
               source: 'HistoricalBackfillUtility',
               migration_version: '1.0'
             }).then(null, () => {});
             
             metrics.writes++;
           }
           addLog(`[SUCCESS] Execute Backfill complete. Modified ${metrics.writes} records.`);
        }
      }
    } catch (e: any) {
      addLog(`[FATAL ERROR] ${e.message}`);
    }
    setIsProcessing(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white text-xs mt-6">
      <h3 className="text-lg font-bold mb-2">Historical DCR/MTP Backfill Utility (Supabase)</h3>
      <p className="text-slate-400 mb-4">Safely applies companyId and divisionId to historical DCRs and MTPs based on authoritative user mappings.</p>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => processRecords(false)}
          disabled={isProcessing}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-bold flex items-center gap-2 disabled:opacity-50"
        >
          <Play className="w-4 h-4" /> Run Dry-Run
        </button>
        <button 
          onClick={() => {
            if (confirm("WARNING: This will execute the backfill modifications on Supabase. Continue?")) {
              processRecords(true);
            }
          }}
          disabled={isProcessing || !dryRunReport}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded font-bold flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" /> Execute Backfill
        </button>
      </div>

      {dryRunReport && (
        <div className="grid grid-cols-2 gap-4 mb-6 text-slate-300">
          <div className="bg-black p-4 rounded border border-slate-700">
            <h4 className="font-bold text-white mb-2">DCR BACKFILL</h4>
            <div>Scanned: {dryRunReport.dcrs.total}</div>
            <div>Already Scoped: {dryRunReport.dcrs.alreadyScoped}</div>
            <div>Missing companyId: {dryRunReport.dcrs.missingCompany}</div>
            <div>Missing divisionId: {dryRunReport.dcrs.missingDivision}</div>
            <div className="text-amber-400 font-bold">Pending Backfill: {dryRunReport.dcrs.pending}</div>
            <div className="text-rose-400">Unresolved: {dryRunReport.dcrs.unresolved}</div>
            <div className="text-rose-400">Ambiguous: {dryRunReport.dcrs.ambiguous}</div>
            <div className="text-rose-400">Conflicts: {dryRunReport.dcrs.conflicts}</div>
          </div>
          <div className="bg-black p-4 rounded border border-slate-700">
            <h4 className="font-bold text-white mb-2">MTP BACKFILL</h4>
            <div>Scanned: {dryRunReport.mtps.total}</div>
            <div>Already Scoped: {dryRunReport.mtps.alreadyScoped}</div>
            <div>Missing companyId: {dryRunReport.mtps.missingCompany}</div>
            <div>Missing divisionId: {dryRunReport.mtps.missingDivision}</div>
            <div className="text-amber-400 font-bold">Pending Backfill: {dryRunReport.mtps.pending}</div>
            <div className="text-rose-400">Unresolved: {dryRunReport.mtps.unresolved}</div>
            <div className="text-rose-400">Ambiguous: {dryRunReport.mtps.ambiguous}</div>
            <div className="text-rose-400">Conflicts: {dryRunReport.mtps.conflicts}</div>
          </div>
        </div>
      )}

      <div className="bg-black p-4 rounded-lg h-64 overflow-y-auto font-mono text-xs whitespace-pre-wrap">
        {logs.length === 0 ? <span className="text-slate-600">No logs yet...</span> : logs.map((l, i) => (
          <div key={i} className={l.includes('[ERROR]') || l.includes('[FATAL') ? 'text-rose-400' : l.includes('[WARN]') || l.includes('[CONFLICT]') ? 'text-amber-400' : l.includes('[SUCCESS]') ? 'text-emerald-400' : 'text-slate-300'}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
