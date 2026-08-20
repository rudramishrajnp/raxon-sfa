import { getActiveCompanyId } from './companyContext';
// Master Headquarters (HQ) & Assigned MR Directory with MTP Auto-Linking for Pharma Managers
import { format } from 'date-fns';
import { supabase } from '../supabaseClient';

export interface MRProfile {
  id: string;
  empId: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  hq: string;
  division: string;
  status: 'Active' | 'Inactive';
}

export interface HeadquarterInfo {
  id: string;
  name: string;
  code: string;
  zone: string;
  state: string;
  district: string;
  assignedMrId: string;
  assignedMrName: string;
  assignedMrPhone: string;
  assignedMrEmail: string;
  assignedDivision: string;
  assignedMrs: MRProfile[];
  patches: string[];
  totalDoctors: number;
  totalChemists: number;
  monthlyTargetPob: number;
}

export const HEADQUARTERS_LIST: HeadquarterInfo[] = [];

export function getBaseHeadquartersForCompany(_companyId?: string): HeadquarterInfo[] {
  return HEADQUARTERS_LIST;
}

export const MANAGER_SPECIAL_ACTIVITIES = [
  'Monthly Cycle Meeting',
  'Primary Stockist Review',
  'HQ Team Training',
  'Holiday',
  'Leave',
  'Transit / Travel'
];

let isHqFirestoreSyncInitialized = false;

export function initHeadquartersFirestoreSync() {
  if (isHqFirestoreSyncInitialized) return;
  isHqFirestoreSyncInitialized = true;

  try {
    // Initial fetch from Supabase
    supabase.from('headquarters').select('*').then(({ data, error }) => {
      if (!error && data) {
        data.forEach((row: any) => {
          if (row.company_id && Array.isArray(row.headquarters)) {
            localStorage.setItem(`raxon_custom_hqs_${row.company_id}`, JSON.stringify(row.headquarters));
            window.dispatchEvent(new CustomEvent('raxon-company-updated'));
            window.dispatchEvent(new CustomEvent('raxon-hqs-updated', { detail: { headquarters: row.headquarters, companyId: row.company_id } }));
          }
        });
      }
    });

    supabase.from('territories').select('*').then(({ data, error }) => {
      if (!error && data) {
        data.forEach((row: any) => {
          if (row.company_id && Array.isArray(row.areas)) {
            localStorage.setItem(`raxon_areas_${row.company_id}`, JSON.stringify(row.areas));
            window.dispatchEvent(new CustomEvent('raxon-areas-updated', { detail: { areas: row.areas, companyId: row.company_id } }));
          }
        });
      }
    });

    // Realtime subscriptions
    supabase
      .channel('public:hqs_territories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'headquarters' }, (payload) => {
        const row = payload.new as any;
        if (row && row.company_id && Array.isArray(row.headquarters)) {
          localStorage.setItem(`raxon_custom_hqs_${row.company_id}`, JSON.stringify(row.headquarters));
          window.dispatchEvent(new CustomEvent('raxon-company-updated'));
          window.dispatchEvent(new CustomEvent('raxon-hqs-updated', { detail: { headquarters: row.headquarters, companyId: row.company_id } }));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'territories' }, (payload) => {
        const row = payload.new as any;
        if (row && row.company_id && Array.isArray(row.areas)) {
          localStorage.setItem(`raxon_areas_${row.company_id}`, JSON.stringify(row.areas));
          window.dispatchEvent(new CustomEvent('raxon-areas-updated', { detail: { areas: row.areas, companyId: row.company_id } }));
        }
      })
      .subscribe();

  } catch (e) {
    console.warn('Headquarters/Territories Supabase sync init error:', e);
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => initHeadquartersFirestoreSync(), 300);
}

export function saveCustomHeadquarters(hqs: HeadquarterInfo[], explicitCompanyId?: string): void {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    localStorage.setItem(`raxon_custom_hqs_${companyId}`, JSON.stringify(hqs));
    window.dispatchEvent(new CustomEvent('raxon-company-updated'));
    window.dispatchEvent(new CustomEvent('raxon-hqs-updated', { detail: { headquarters: hqs, companyId } }));

    // Sync to Supabase
    supabase.from('headquarters').upsert({
      company_id: companyId,
      headquarters: hqs,
      updated_at: new Date().toISOString()
    }).then(null, err => {
      console.warn(`Supabase custom HQs save error for ${companyId}:`, err);
    });
  } catch (e) {
    console.error("Failed to save custom HQs:", e);
  }
}

export function saveCustomAreas(areas: any[], explicitCompanyId?: string): void {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    localStorage.setItem(`raxon_areas_${companyId}`, JSON.stringify(areas));
    window.dispatchEvent(new CustomEvent('raxon-areas-updated', { detail: { areas, companyId } }));

    // Sync to Supabase
    supabase.from('territories').upsert({
      company_id: companyId,
      areas: areas,
      updated_at: new Date().toISOString()
    }).then(null, err => {
      console.warn(`Supabase territories save error for ${companyId}:`, err);
    });
  } catch (e) {
    console.error("Failed to save custom areas:", e);
  }
}

/**
 * Get all HQs strictly isolated by companyId, combined with newly registered users for that company
 */
export function getAllHeadquarters(explicitCompanyId?: string): HeadquarterInfo[] {
  const companyId = explicitCompanyId || getActiveCompanyId();
  let baseHqs = [...getBaseHeadquartersForCompany(companyId)];

  try {
    const customHqsRaw = localStorage.getItem(`raxon_custom_hqs_${companyId}`);
    if (customHqsRaw) {
      const customHqs: HeadquarterInfo[] = JSON.parse(customHqsRaw);
      customHqs.forEach(chq => {
        if (!baseHqs.some(b => b.name.toLowerCase() === chq.name.toLowerCase())) {
          baseHqs.unshift(chq);
        }
      });
    }
  } catch (e) {
    console.warn('Error reading custom HQs:', e);
  }

  try {
    const savedUsersRaw = localStorage.getItem(`${'raxon_users_master'}_${companyId}`);
    if (savedUsersRaw) {
      const savedUsers: any[] = JSON.parse(savedUsersRaw);
      const mrUsers = savedUsers.filter(u => u.role && u.role.includes('MR') && u.status === 'Active');

      // Augment assignedMrs in baseHqs
      return baseHqs.map(hq => {
        const matchingUsers = mrUsers.filter(u => u.hq && u.hq.toLowerCase().includes(hq.name.toLowerCase().replace(' hq', '')));
        const mergedMrs = [...hq.assignedMrs];

        matchingUsers.forEach(u => {
          if (!mergedMrs.some(m => m.id === u.id || m.empId === u.id)) {
            mergedMrs.push({
              id: u.id,
              empId: u.id,
              name: u.name,
              role: u.role,
              phone: u.phone || '+91 98765 43210',
              email: u.email || 'mr@company.com',
              hq: hq.name,
              division: hq.assignedDivision,
              status: 'Active'
            });
          }
        });

        return {
          ...hq,
          assignedMrs: mergedMrs
        };
      });
    }
  } catch (e) {
    console.warn('Error reading saved users for HQs:', e);
  }
  return baseHqs;
}

/**
 * Find HQ by name for current or explicit company
 */
export function getHeadquarterByName(name: string, explicitCompanyId?: string): HeadquarterInfo | undefined {
  const all = getAllHeadquarters(explicitCompanyId);
  return all.find(h => h.name.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(h.code.toLowerCase()));
}

/**
 * Pre-defined deterministic schedule template for MRs when no custom MTP is saved
 */
export function getMrDefaultMonthlyPatchSchedule(hq: HeadquarterInfo, monthYear: string): Record<string, string> {
  const schedule: Record<string, string> = {};
  const [year, month] = monthYear.split('-').map(Number);
  const totalDays = new Date(year, month, 0).getDate();

  for (let day = 1; day <= totalDays; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `${monthYear}-${dayStr}`;
    const dateObj = new Date(year, month - 1, day);
    const dayName = format(dateObj, 'EEEE');

    if (dayName === 'Sunday') {
      schedule[dateStr] = 'Holiday';
    } else {
      const patchIndex = (day - 1) % hq.patches.length;
      schedule[dateStr] = hq.patches?.[patchIndex] || hq.patches?.[0] || 'Unknown Patch';
    }
  }
  return schedule;
}

/**
 * Fetch the full month plan of a specific MR in an HQ
 */
export function getMrFullMonthMTP(mrId: string, mrName: string, hqName: string, monthYear: string): {
  plans: Record<string, string>;
  source: 'SAVED_LOCAL' | 'DEFAULT_ROSTER';
} {
  try {
    const keysToCheck = [
      `raxon_mtp_${mrId}_${monthYear}_${getActiveCompanyId()}`,
      `raxon_mtp_${mrName.toLowerCase().replace(/\s+/g, '_')}_${monthYear}_${getActiveCompanyId()}`,
      `raxon_mtp_user_pradeep_001_${monthYear}_${getActiveCompanyId()}`,
      `raxon_mtp_${monthYear}_${getActiveCompanyId()}`
    ];

    for (const key of keysToCheck) {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.plans && Object.keys(parsed.plans).length > 0) {
          return {
            plans: parsed.plans,
            source: 'SAVED_LOCAL'
          };
        }
      }
    }
  } catch (e) {
    console.warn('Error reading MR full month MTP:', e);
  }

  const hq = getHeadquarterByName(hqName);
  if (hq) {
    return {
      plans: getMrDefaultMonthlyPatchSchedule(hq, monthYear),
      source: 'DEFAULT_ROSTER'
    };
  }

  return { plans: {}, source: 'DEFAULT_ROSTER' };
}

/**
 * Auto-fetch the planned area of an MR for a selected HQ and date.
 * When the manager selects an HQ on a given date:
 * - Finds the respected MR(s) under that HQ
 * - Retrieves that MR's exact saved/scheduled MTP for that specific date
 * - Returns the exact patch planned by that MR for that date
 */
export function getMrPlannedAreaForHq(hqName: string, dateStr: string, specificMrId?: string): {
  plannedArea: string;
  mrId: string;
  mrName: string;
  mrRole: string;
  mrPhone: string;
  mrList: MRProfile[];
  isAutoLinked: boolean;
  source: 'MR_SAVED_MTP' | 'HQ_DEFAULT_ROSTER' | 'SPECIAL_ACTIVITY';
} {
  // Check if it's a special manager activity
  if (MANAGER_SPECIAL_ACTIVITIES.includes(hqName)) {
    return {
      plannedArea: hqName,
      mrId: 'SELF',
      mrName: 'Self Work',
      mrRole: 'Manager Activity',
      mrPhone: '',
      mrList: [],
      isAutoLinked: false,
      source: 'SPECIAL_ACTIVITY'
    };
  }

  const hq = getHeadquarterByName(hqName);
  if (!hq) {
    return {
      plannedArea: hqName,
      mrId: 'MR-GEN',
      mrName: 'Medical Representative',
      mrRole: 'MR',
      mrPhone: '',
      mrList: [],
      isAutoLinked: false,
      source: 'HQ_DEFAULT_ROSTER'
    };
  }

  // Find target MR within HQ
  const mrList = hq.assignedMrs && hq.assignedMrs.length > 0 ? hq.assignedMrs : [
    {
      id: hq.assignedMrId,
      empId: hq.assignedMrId,
      name: hq.assignedMrName,
      role: 'Medical Representative (MR)',
      phone: hq.assignedMrPhone,
      email: hq.assignedMrEmail,
      hq: hq.name,
      division: hq.assignedDivision,
      status: 'Active' as const
    }
  ];

  const targetMr = specificMrId 
    ? (mrList.find(m => m.id === specificMrId || m.empId === specificMrId) || mrList[0])
    : mrList[0];

  const monthYear = dateStr.substring(0, 7); // "YYYY-MM"

  // 1. Check if the target MR has a saved custom MTP
  try {
    const keysToCheck = [
      `raxon_mtp_${targetMr.empId}_${monthYear}_${getActiveCompanyId()}`,
      `raxon_mtp_${targetMr.id}_${monthYear}_${getActiveCompanyId()}`,
      `raxon_mtp_${targetMr.name.toLowerCase().replace(/\s+/g, '_')}_${monthYear}_${getActiveCompanyId()}`
    ];

    if (targetMr.name === 'Pradeep Mishra') {
      keysToCheck.unshift(`raxon_mtp_user_pradeep_001_${monthYear}_${getActiveCompanyId()}`);
      keysToCheck.push(`raxon_mtp_${monthYear}_${getActiveCompanyId()}`);
    }

    for (const k of keysToCheck) {
      const saved = localStorage.getItem(k);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.plans && parsed.plans[dateStr]) {
          return {
            plannedArea: parsed.plans[dateStr],
            mrId: targetMr.empId || targetMr.id,
            mrName: targetMr.name,
            mrRole: targetMr.role || 'Medical Representative (MR)',
            mrPhone: targetMr.phone || hq.assignedMrPhone,
            mrList,
            isAutoLinked: true,
            source: 'MR_SAVED_MTP'
          };
        }
      }
    }
  } catch (e) {
    console.warn('Error reading MR MTP for date:', dateStr, e);
  }

  // 2. Deterministic schedule based on day of month from HQ's approved patch roster
  const dayNum = parseInt(dateStr.split('-')[2] || '1', 10);
  const patchIndex = (dayNum - 1) % hq.patches.length;
  const fallbackPatch = hq.patches?.[patchIndex] || hq.patches?.[0] || 'Unknown Patch';

  return {
    plannedArea: fallbackPatch,
    mrId: targetMr.empId || targetMr.id,
    mrName: targetMr.name,
    mrRole: targetMr.role || 'Medical Representative (MR)',
    mrPhone: targetMr.phone || hq.assignedMrPhone,
    mrList,
    isAutoLinked: true,
    source: 'HQ_DEFAULT_ROSTER'
  };
}
