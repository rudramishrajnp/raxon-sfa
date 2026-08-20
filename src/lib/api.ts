import { getActiveCompanyId } from '../data/companyContext';
import { supabase } from '../supabaseClient';
import { getLoggedInUser, getStoredUserProfiles, getCurrentlyActiveUserProfile } from '../data/userContext';

/**
 * Gets the current active user from session or falls back to a safe empty object
 */
export const getActiveUser = () => {
  const user = getLoggedInUser();
  if (user) return user;
  
  // Fallback for non-authenticated states (should not happen in real usage)
  return {
    id: 'anonymous',
    name: 'Anonymous',
    role: 'MR' as any,
    managerId: null
  };
};

// Helper for local storage key
const getMtpKey = (userId: string, monthYear: string) => `raxon_mtp_${userId}_${monthYear}_${getActiveCompanyId()}`;
const getDcrKey = (userId: string, date: string) => `raxon_dcr_${userId}_${date}_${getActiveCompanyId()}`;

let isApiSupabaseSyncInitialized = false;

export function initApiFirestoreSync() {
  if (isApiSupabaseSyncInitialized) return;
  isApiSupabaseSyncInitialized = true;

  try {
    const activeCompanyId = getActiveCompanyId();

    // 1. Initial Fetch for DCRs
    supabase
      .from('dcrs')
      .select('*')
      .eq('company_id', activeCompanyId)
      .then(({ data, error }) => {
        if (!error && data) {
          data.forEach((row: any) => {
            if (row && row.user_id && row.call_date) {
              const dcrKey = `raxon_dcr_${row.user_id}_${row.call_date}_${activeCompanyId}`;
              const dcrObj = {
                userId: row.user_id,
                date: row.call_date,
                area: row.area,
                checkIns: row.calls || [],
                totalPob: row.total_pob || 0,
                lastUpdated: row.updated_at
              };
              localStorage.setItem(dcrKey, JSON.stringify(dcrObj));
            }
          });
          window.dispatchEvent(new CustomEvent('raxon-dcr-updated'));
        }
      });

    // 2. Initial Fetch for MTPs
    supabase
      .from('mtps')
      .select('*')
      .eq('company_id', activeCompanyId)
      .then(({ data, error }) => {
        if (!error && data) {
          const pendingList: any[] = [];
          data.forEach((row: any) => {
            if (row && row.user_id && row.month_year) {
              const mtpKey = `raxon_mtp_${row.user_id}_${row.month_year}_${activeCompanyId}`;
              const mtpObj = {
                id: row.id,
                userId: row.user_id,
                userName: row.user_name,
                managerId: row.manager_id,
                monthYear: row.month_year,
                status: row.status,
                plans: row.days || {},
                submittedAt: row.updated_at
              };
              localStorage.setItem(mtpKey, JSON.stringify(mtpObj));
              if (row.status === 'submitted') {
                pendingList.push(mtpObj);
              }
            }
          });
          if (pendingList.length > 0) {
            localStorage.setItem(`raxon_pending_mtps_${activeCompanyId}`, JSON.stringify(pendingList));
          }
          window.dispatchEvent(new CustomEvent('raxon-mtp-updated'));
        }
      });

    // 3. Supabase Realtime Subscription for DCRs
    supabase
      .channel('public:dcrs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dcrs' }, (payload) => {
        const row = payload.new as any;
        if (row && row.company_id === activeCompanyId && row.user_id && row.call_date) {
          const dcrKey = `raxon_dcr_${row.user_id}_${row.call_date}_${activeCompanyId}`;
          const dcrObj = {
            userId: row.user_id,
            date: row.call_date,
            area: row.area,
            checkIns: row.calls || [],
            totalPob: row.total_pob || 0,
            lastUpdated: row.updated_at
          };
          localStorage.setItem(dcrKey, JSON.stringify(dcrObj));
          window.dispatchEvent(new CustomEvent('raxon-dcr-updated'));
        }
      })
      .subscribe();

    // 4. Supabase Realtime Subscription for MTPs
    supabase
      .channel('public:mtps')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mtps' }, (payload) => {
        const row = payload.new as any;
        if (row && row.company_id === activeCompanyId && row.user_id && row.month_year) {
          const mtpKey = `raxon_mtp_${row.user_id}_${row.month_year}_${activeCompanyId}`;
          const mtpObj = {
            id: row.id,
            userId: row.user_id,
            userName: row.user_name,
            managerId: row.manager_id,
            monthYear: row.month_year,
            status: row.status,
            plans: row.days || {},
            submittedAt: row.updated_at
          };
          localStorage.setItem(mtpKey, JSON.stringify(mtpObj));

          const pendingKey = `raxon_pending_mtps_${activeCompanyId}`;
          const pendingList = JSON.parse(localStorage.getItem(pendingKey) || '[]');
          const existingIdx = pendingList.findIndex((m: any) => m.id === mtpObj.id);
          if (row.status === 'submitted') {
            if (existingIdx >= 0) {
              pendingList[existingIdx] = mtpObj;
            } else {
              pendingList.push(mtpObj);
            }
          } else {
            if (existingIdx >= 0) {
              pendingList.splice(existingIdx, 1);
            }
          }
          localStorage.setItem(pendingKey, JSON.stringify(pendingList));
          window.dispatchEvent(new CustomEvent('raxon-mtp-updated'));
        }
      })
      .subscribe();

  } catch (err) {
    console.warn('Supabase api sync init error:', err);
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => initApiFirestoreSync(), 300);
}

// MTP Functions
export const submitMTP = async (monthYear: string, plans: Record<string, string>) => {
  const authProfile = getCurrentlyActiveUserProfile();
  if (!authProfile || !authProfile.companyId || !authProfile.reportingToId) {
    console.error("Missing authoritative profile, companyId, or managerId. Aborting MTP submit.");
    return;
  }

  const mtpId = `${authProfile.id}_${monthYear}`;
  const mtpData = {
    id: mtpId,
    userId: authProfile.id,
    userName: authProfile.name,
    managerId: authProfile.reportingToId,
    monthYear,
    plans,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  };

  // Always save locally first so user data is 100% safe
  try {
    localStorage.setItem(getMtpKey(authProfile.id, monthYear), JSON.stringify(mtpData));
    
    // Save to pending approvals for manager view
    const pendingKey = `raxon_pending_mtps_${authProfile.companyId}${authProfile.divisionId ? '_' + authProfile.divisionId : ''}`;
    const pendingList = JSON.parse(localStorage.getItem(pendingKey) || '[]');
    const existingIdx = pendingList.findIndex((m: any) => m.id === mtpData.id);
    if (existingIdx >= 0) {
      pendingList[existingIdx] = mtpData;
    } else {
      pendingList.push(mtpData);
    }
    localStorage.setItem(pendingKey, JSON.stringify(pendingList));
  } catch (e) {
    console.error("Local storage error:", e);
  }

  // Supabase persistence
  try {
    const { error } = await supabase.from('mtps').upsert({
      id: mtpId,
      company_id: authProfile.companyId,
      user_id: authProfile.id,
      user_name: authProfile.name,
      manager_id: authProfile.reportingToId,
      month_year: monthYear,
      status: 'submitted',
      days: plans,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.warn("Supabase MTP submit error:", error);
    }
  } catch (supabaseError: any) {
    console.warn("Supabase sync notice (local backup saved):", supabaseError);
  }

  return { success: true };
};

export const getMTP = async (monthYear: string) => {
  const user = getActiveUser();
  // Check local storage first
  try {
    const local = localStorage.getItem(getMtpKey(user.id, monthYear));
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed) return parsed;
    }
  } catch (e) {
    console.warn("Local storage read error:", e);
  }

  // Check Supabase
  try {
    const mtpId = `${user.id}_${monthYear}`;
    const { data, error } = await supabase
      .from('mtps')
      .select('*')
      .eq('id', mtpId)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        userId: data.user_id,
        userName: data.user_name,
        managerId: data.manager_id,
        monthYear: data.month_year,
        status: data.status,
        plans: data.days || {},
        submittedAt: data.updated_at
      };
    }
  } catch (error) {
    console.warn("Supabase getMTP error:", error);
  }

  return null;
};

// DCR Functions
export const saveDCRCheckIn = async (
  date: string, 
  area: string, 
  doctorId: number, 
  location?: {lat: number, lng: number} | null,
  callDetail?: any
) => {
  const checkIn = {
    doctorId,
    timestamp: new Date().toISOString(),
    status: 'visited',
    location: location || null,
    ...(callDetail || {})
  };

  const authProfile = getCurrentlyActiveUserProfile();
  if (!authProfile || !authProfile.companyId) {
    console.error("Missing authoritative profile or companyId. Aborting DCR save.");
    return;
  }

  // Local storage save
  const dcrKey = getDcrKey(authProfile.id, date);
  let localData: any = null;
  try {
    const existing = localStorage.getItem(dcrKey);
    if (existing) {
      localData = JSON.parse(existing);
      const checkIns = localData.checkIns || [];
      const filtered = checkIns.filter((c: any) => c.doctorId !== doctorId);
      filtered.push(checkIn);
      localData.checkIns = filtered;
      localData.lastUpdated = new Date().toISOString();
    } else {
      localData = {
        userId: authProfile.id,
        date,
        area,
        checkIns: [checkIn],
        createdAt: new Date().toISOString()
      };
    }
    localStorage.setItem(dcrKey, JSON.stringify(localData));

    // Also notify any listening components of DCR update
    window.dispatchEvent(new CustomEvent('raxon-dcr-updated', { detail: { date, checkIn } }));
  } catch (e) {
    console.warn("DCR local save error:", e);
  }

  // Supabase save
  try {
    const dcrId = `${authProfile.id}_${date}`;
    const callsList = localData?.checkIns || [checkIn];
    const totalPob = callsList.reduce((sum: number, c: any) => sum + (c.pobTotalValue || 0), 0);

    const { error } = await supabase.from('dcrs').upsert({
      id: dcrId,
      company_id: authProfile.companyId,
      user_id: authProfile.id,
      call_date: date,
      area: area,
      calls: callsList,
      total_pob: totalPob,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.warn("Supabase DCR save notice:", error);
    }
  } catch (supabaseError) {
    console.warn("DCR Supabase sync notice:", supabaseError);
  }
};

export const getDCR = async (date: string) => {
  const user = getActiveUser();
  // Check local first
  try {
    const local = localStorage.getItem(getDcrKey(user.id, date));
    if (local) return JSON.parse(local);
  } catch (e) {
    console.warn("DCR local read error:", e);
  }

  // Check Supabase
  try {
    const dcrId = `${user.id}_${date}`;
    const { data, error } = await supabase
      .from('dcrs')
      .select('*')
      .eq('id', dcrId)
      .single();

    if (!error && data) {
      return {
        userId: data.user_id,
        date: data.call_date,
        area: data.area,
        checkIns: data.calls || [],
        totalPob: data.total_pob,
        createdAt: data.created_at
      };
    }
  } catch (error) {
    console.warn("Supabase getDCR error:", error);
  }

  return null;
};

// Team Approvals Functions (For Manager)
export const getPendingMTPs = async () => {
  const user = getActiveUser();
  const managerId = (user as any).managerId || user.id;
  
  const localList: any[] = [];
  try {
    const divisionSuffix = (user as any).divisionId ? `_${(user as any).divisionId}` : '';
    const pending = localStorage.getItem(`raxon_pending_mtps_${getActiveCompanyId()}${divisionSuffix}`);
    if (pending) {
      localList.push(...JSON.parse(pending).filter((item: any) => item.status === 'submitted'));
    }
  } catch (e) {
    console.warn("Pending MTP local read error:", e);
  }

  try {
    const { data, error } = await supabase
      .from('mtps')
      .select('*')
      .eq('company_id', getActiveCompanyId())
      .eq('status', 'submitted');

    if (!error && data) {
      const supabaseList = data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        userName: row.user_name,
        managerId: row.manager_id,
        monthYear: row.month_year,
        status: row.status,
        plans: row.days || {},
        submittedAt: row.updated_at
      }));

      // Combine without duplicates
      const combined = [...localList];
      supabaseList.forEach(sItem => {
        if (!combined.some(cItem => cItem.id === sItem.id)) {
          combined.push(sItem);
        }
      });
      return combined;
    }
    return localList;
  } catch (e) {
    console.warn("Supabase getPendingMTPs error (using local):", e);
    return localList;
  }
};

export const approveMTP = async (mtpId: string) => {
  const user = getActiveUser();
  // Update local
  try {
    const divisionSuffix = (user as any).divisionId ? `_${(user as any).divisionId}` : '';
    const pendingKey = `raxon_pending_mtps_${getActiveCompanyId()}${divisionSuffix}`;
    const pending = localStorage.getItem(pendingKey);
    if (pending) {
      const list = JSON.parse(pending);
      const updated = list.map((item: any) => item.id === mtpId ? { ...item, status: 'approved', approvedAt: new Date().toISOString() } : item);
      localStorage.setItem(pendingKey, JSON.stringify(updated));
    }
    // Also update individual mtp key if exists
    const [userId, monthYear] = mtpId.split('_');
    if (userId && monthYear) {
      const key = getMtpKey(userId, monthYear);
      const single = localStorage.getItem(key);
      if (single) {
        const parsed = JSON.parse(single);
        parsed.status = 'approved';
        parsed.approvedAt = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    }
  } catch (e) {
    console.warn("Local approval error:", e);
  }

  // Update Supabase
  try {
    await supabase.from('mtps').update({
      status: 'approved',
      updated_at: new Date().toISOString()
    }).eq('id', mtpId);
  } catch (e) {
    console.warn("Supabase approveMTP error:", e);
  }
};

export const rejectMTP = async (mtpId: string, remark?: string) => {
  const user = getActiveUser();
  // Update local
  try {
    const divisionSuffix = (user as any).divisionId ? `_${(user as any).divisionId}` : '';
    const pendingKey = `raxon_pending_mtps_${getActiveCompanyId()}${divisionSuffix}`;
    const pending = localStorage.getItem(pendingKey);
    if (pending) {
      const list = JSON.parse(pending);
      const updated = list.map((item: any) => item.id === mtpId ? { ...item, status: 'rejected', remark: remark || 'Rejected by manager', rejectedAt: new Date().toISOString() } : item);
      localStorage.setItem(pendingKey, JSON.stringify(updated));
    }
    const [userId, monthYear] = mtpId.split('_');
    if (userId && monthYear) {
      const key = getMtpKey(userId, monthYear);
      const single = localStorage.getItem(key);
      if (single) {
        const parsed = JSON.parse(single);
        parsed.status = 'draft'; // MR can edit again
        parsed.remark = remark || 'Rejected by manager';
        parsed.rejectedAt = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    }
  } catch (e) {
    console.warn("Local reject error:", e);
  }

  // Update Supabase
  try {
    await supabase.from('mtps').update({
      status: 'draft',
      updated_at: new Date().toISOString()
    }).eq('id', mtpId);
  } catch (e) {
    console.warn("Supabase rejectMTP error:", e);
  }
};

// Joint Working & DCR Reports Functions for Managers & Admins
export const getAllTeamDCRVisits = async (dateStr?: string) => {
  const user = getActiveUser();
  const targetDate = dateStr || new Date().toISOString().split('T')[0];
  const allVisits: any[] = [];
  const profiles = getStoredUserProfiles();

  // Search localStorage keys starting with raxon_dcr_
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('raxon_dcr_')) {
        const item = localStorage.getItem(key);
        if (item) {
          const dcr = JSON.parse(item);
          if (dcr && (!targetDate || dcr.date === targetDate)) {
            const checkIns = dcr.checkIns || [];
            const profile = profiles.find(p => p.id === dcr.userId);
            const foundName = profile ? profile.name : (dcr.userId === user.id ? user.name : 'Field Staff');

            checkIns.forEach((ci: any) => {
              allVisits.push({
                ...ci,
                repId: dcr.userId,
                repName: foundName,
                date: dcr.date,
                area: dcr.area
              });
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn("Error reading team DCRs from local:", e);
  }

  return allVisits;
};
