import React, { useState } from 'react';
import { getStoredUserProfiles, saveStoredUserProfiles, UserProfile } from '../data/userContext';
import { supabase } from '../supabaseClient';
import { getLoggedInUser } from '../data/userContext';
import { Play, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function MigrationUtility() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isDryRun, setIsDryRun] = useState(true);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const runMigration = async (execute: boolean) => {
    setIsMigrating(true);
    setLogs([]);
    setIsDryRun(!execute);
    addLog(`Starting ${execute ? 'EXECUTE' : 'DRY RUN'} Migration to Supabase...`);

    const profiles = getStoredUserProfiles();
    addLog(`Found ${profiles.length} total local profiles.`);

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    if (execute) {
      addLog('Running server-side Company Admin auth reconciliation...');
      try {
        const reconRes = await fetch('/api/auth/reconcile-company-admins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const reconData = await reconRes.json();
        addLog(`Server reconciliation status: ${reconData.status || 'OK'}. Processed: ${reconData.processed || 0}, Created: ${reconData.created || 0}`);
      } catch (reconErr: any) {
        addLog(`Server reconciliation notice: ${reconErr.message}`);
      }
    }

    for (const p of profiles) {
      if (p.role === 'SUPER_ADMIN' || p.role === 'PLATFORM_SUPER_ADMIN') {
        addLog(`Skipping Super Admin: ${p.email}`);
        skipCount++;
        continue;
      }

      addLog(`--- Processing User: ${p.name} (${p.id}) ---`);
      
      if (!p.email || !p.email.includes('@')) {
         addLog(`[WARN] Invalid email: ${p.email}. Skipping.`);
         failCount++;
         continue;
      }

      try {
        if (!execute) {
          addLog(`[DRY RUN] Would upsert user to Supabase user_profiles for ${p.email}`);
          addLog(`[DRY RUN] Would set company_id: ${p.companyId}, role: ${p.role}`);
          successCount++;
        } else {
          addLog(`Upserting Supabase user_profiles for ${p.email}...`);
          
          const profileData = {
            ...p,
            id: p.id,
            originalEmployeeId: p.id
          };
          delete (profileData as any).password;

          const { error: profileErr } = await supabase.from('user_profiles').upsert({
            id: p.id,
            company_id: p.companyId || '',
            role: p.role || 'MR',
            email: p.email,
            name: p.name,
            phone: p.phone || '',
            status: p.status || 'Active',
            data: profileData,
            updated_at: new Date().toISOString()
          });

          if (profileErr) {
            throw profileErr;
          }

          const authUserId = getLoggedInUser()?.id || 'SYSTEM';
          const authUserEmail = getLoggedInUser()?.email || 'SYSTEM';

          await supabase.from('sync_audit_logs').insert({
            action: 'CREATE',
            action_type: 'USER_MIGRATION',
            entity_type: 'user_profiles',
            entity_id: p.id,
            executor_uid: authUserId,
            executor_email: authUserEmail,
            company_id: profileData.companyId || null,
            division_id: profileData.divisionId || null,
            new_values: profileData,
            timestamp: new Date().toISOString(),
            source: 'MigrationUtility',
            migration_version: '1.0'
          }).then(null, () => {});
          
          addLog(`Completed Supabase migration for ${p.name}`);
          successCount++;
        }
      } catch (err: any) {
        addLog(`[ERROR] Failed migrating ${p.email}: ${err.message}`);
        failCount++;
      }
    }

    addLog('==================================');
    addLog(`Migration Finished. Success: ${successCount}, Skipped: ${skipCount}, Failed: ${failCount}`);
    setIsMigrating(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white text-xs">
      <h3 className="text-lg font-bold mb-2">Seeded User Migration Utility</h3>
      <p className="text-slate-400 mb-4">Migrates local mock users (EMP-*) into secure Supabase records and sets up their authoritative user profiles.</p>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => runMigration(false)}
          disabled={isMigrating}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-bold flex items-center gap-2 disabled:opacity-50"
        >
          <Play className="w-4 h-4" /> Run Dry-Run
        </button>
        <button 
          onClick={() => {
            if (confirm("WARNING: This will sync all user profiles to Supabase. Continue?")) {
              runMigration(true);
            }
          }}
          disabled={isMigrating}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded font-bold flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" /> Execute Migration
        </button>
      </div>

      <div className="bg-black p-4 rounded-lg h-64 overflow-y-auto font-mono text-xs whitespace-pre-wrap">
        {logs.length === 0 ? <span className="text-slate-600">No logs yet...</span> : logs.map((l, i) => (
          <div key={i} className={l.includes('[ERROR]') ? 'text-rose-400' : l.includes('[WARN]') ? 'text-amber-400' : (l.includes('Success') || l.includes('Completed')) ? 'text-emerald-400' : 'text-slate-300'}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
