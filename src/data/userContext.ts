import { getActiveCompanyId, getActiveCompany, getStoredCompanies } from './companyContext';
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'ZM' 
  | 'RM' 
  | 'AM' 
  | 'MR'
  | 'PLATFORM_SUPER_ADMIN' 
  | 'COMPANY_ADMIN' 
  | 'DIVISION_SYSTEM_ADMIN' 
  | 'REGIONAL_MANAGER' 
  | 'AREA_MANAGER' 
  | 'MEDICAL_REPRESENTATIVE'
  | 'Super Admin'
  | 'Admin'
  | 'System Admin'
  | 'Zone Manager'
  | 'Regional Manager'
  | 'Area Manager'
  | 'Medical Representative';

export function normalizeRole(role: UserRole | string): 'SUPER_ADMIN' | 'ADMIN' | 'ZM' | 'RM' | 'AM' | 'MR' {
  if (!role) return 'MR';
  const r = role.toString().trim();
  const rLower = r.toLowerCase();
  
  if (rLower.includes('super admin') || rLower.includes('super_admin') || rLower === 'super_admin') return 'SUPER_ADMIN';
  
  if (
    rLower.includes('admin') || 
    rLower.includes('company_admin') || 
    rLower.includes('company admin') || 
    rLower.includes('cadm') ||
    r === 'ADMIN' ||
    r === 'COMPANY_ADMIN'
  ) return 'ADMIN';
  
  if (rLower.includes('division system admin') || rLower.includes('division admin') || rLower.includes('zm') || rLower.includes('zone manager') || rLower === 'dsa') return 'ZM';
  
  if (rLower.includes('rm') || rLower.includes('regional manager')) return 'RM';
  
  if (rLower.includes('am') || rLower.includes('area manager')) return 'AM';
  
  return 'MR';
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  phone: string;
  companyId?: string;
  companyName?: string;
  divisionId?: string;
  divisionName?: string;
  hq: string;
  territory: string;
  zoneOrRegion?: string;
  initials: string;
  avatarBg?: string;
  teamSize?: number;
  password?: string;
  status?: 'Active' | 'Inactive';
  reportingToId?: string;
  reportingToName?: string;
  metrics: {
    // MR Specific
    plannedCallsToday?: number;
    completedCallsToday?: number;
    pobBookedToday?: number;
    monthlyTarget?: number;
    monthlyAchieved?: number;
    doctorsCount?: number;
    chemistsCount?: number;
    stockistsCount?: number;
    currentPatchName?: string;
    patchAreas?: string;
    linkedStockist?: string;
    isPunchedIn?: boolean;
    punchInTime?: string;
    punchInLocked?: boolean;
    gpsLocation?: string;

    // AM Specific
    areaMRCount?: number;
    areaActiveMRs?: number;
    areaCallsDone?: number;
    areaCallsPlanned?: number;
    areaPobToday?: number;
    areaMonthlyTarget?: number;
    areaMonthlyAchieved?: number;
    pendingMtpApprovals?: number;
    pendingDcrValidations?: number;
    jointCallsDoneThisMonth?: number;
    territoriesCovered?: string[];

    // RM Specific
    regionAMCount?: number;
    regionMRCount?: number;
    regionStockistsCount?: number;
    regionMonthlyTarget?: number;
    regionMonthlyAchieved?: number;
    regionMtpCompliance?: number;
    topTerritory?: string;
    areasList?: { name: string; amName: string; target: number; achieved: number; percent: number }[];

    // Division Specific / ZM Specific
    zoneRevenueTarget?: number;
    zoneRevenueAchieved?: number;
    divisionsCovered?: number;
    totalStockistsInZone?: number;
    zoneRegionsList?: { name: string; rmName: string; target: number; achieved: number; percent: number }[];
  };
}

export const INITIAL_USER_PROFILES: UserProfile[] = [
  // =============================================================
  // 1. SYSTEM SUPER ADMIN ONLY (ALL / SYSTEM)
  // =============================================================
  {
    id: 'SUPERADMIN',
    name: 'Platform Super Admin',
    role: 'SUPER_ADMIN',
    roleTitle: 'Super Admin',
    email: 'superadmin@raxon.cloud',
    phone: '+91 99999 99999',
    companyId: 'ALL',
    companyName: 'System',
    hq: 'Cloud Operations',
    territory: 'Global Platform Control',
    initials: 'SA',
    avatarBg: 'bg-purple-950',
    status: 'Active',
    metrics: {}
  }
];

const USER_PROFILES_STORAGE_KEY = 'raxon_custom_user_profiles_v8';
export const USER_PASSWORDS_STORAGE_KEY = 'raxon_user_passwords_v8';
const ACTIVE_USER_ID_KEY = 'raxon_current_active_user_id';

// Initialize and get all user profiles with persistence & live company admins integration
export function getStoredUserProfiles(): UserProfile[] {
  let baseProfiles: UserProfile[] = [];

  try {
    const raw = localStorage.getItem(USER_PROFILES_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        baseProfiles = parsed;
      }
    } else {
      // First time initialization only
      baseProfiles = [...INITIAL_USER_PROFILES];
      try {
        localStorage.setItem(USER_PROFILES_STORAGE_KEY, JSON.stringify(baseProfiles));
      } catch (_) {}
    }
  } catch (err) {
    console.warn('Failed to load user profiles from storage:', err);
    baseProfiles = [...INITIAL_USER_PROFILES];
  }

  // Deduplicate baseProfiles by ID (case-insensitive) to prevent duplicate user entries
  const seenIds = new Set<string>();
  baseProfiles = baseProfiles.filter(p => {
    if (!p || !p.id) return false;
    const lowerId = p.id.toLowerCase();
    if (seenIds.has(lowerId)) return false;
    seenIds.add(lowerId);
    return true;
  });

  // Always ensure SUPER_ADMIN exists
  const superAdminInitial = INITIAL_USER_PROFILES.find(p => normalizeRole(p.role) === 'SUPER_ADMIN');
  if (superAdminInitial && !baseProfiles.some(p => p.id === superAdminInitial.id || normalizeRole(p.role) === 'SUPER_ADMIN')) {
    baseProfiles.unshift(superAdminInitial);
  }

  // Merge live company admins from stored companies only if company is active and admin exists
  try {
    const companies = getStoredCompanies();
    companies.forEach(cmp => {
      if (cmp.status !== 'Suspended' && Array.isArray(cmp.companyAdmins)) {
        cmp.companyAdmins.forEach(adm => {
          if (adm.status !== 'Suspended') {
            const idx = baseProfiles.findIndex(p => 
              p.id.toLowerCase() === adm.id.toLowerCase() || 
              p.email.toLowerCase() === adm.email.toLowerCase()
            );
            const initials = adm.name
              .split(' ')
              .filter(Boolean)
              .map(n => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase() || 'CA';

            const adminProfile: UserProfile = {
              id: adm.id,
              name: adm.name,
              role: 'ADMIN',
              roleTitle: 'Company Admin',
              email: adm.email,
              phone: adm.phone || '+91 98000 00000',
              companyId: cmp.id,
              companyName: cmp.name,
              hq: `${cmp.hqCity || 'Head'} Corporate Office`,
              territory: 'National / All Divisions Field Network',
              initials: initials,
              avatarBg: 'bg-purple-900',
              teamSize: 50,
              metrics: {}
            };

            if (idx >= 0) {
              baseProfiles[idx] = { ...baseProfiles[idx], ...adminProfile };
            } else {
              baseProfiles.push(adminProfile);
            }
          }
        });
      }
    });
  } catch (err) {
    console.warn('Failed to merge company admins into profiles:', err);
  }

  // Also dynamically merge all active division admins (DSAs) from stored companies
  try {
    const companies = getStoredCompanies();
    companies.forEach(cmp => {
      if (cmp.status !== 'Suspended' && Array.isArray(cmp.activeDivisions)) {
        cmp.activeDivisions.forEach(div => {
          if (div.status === 'Active' && div.hasDedicatedAdmin && div.divisionAdminId && div.divisionAdminName && div.divisionAdminEmail) {
            const idx = baseProfiles.findIndex(p => 
              p.id.toLowerCase() === div.divisionAdminId?.toLowerCase() || 
              p.email.toLowerCase() === div.divisionAdminEmail.toLowerCase()
            );
            const initials = div.divisionAdminName
              .split(' ')
              .filter(Boolean)
              .map(n => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase() || 'DA';

            const adminProfile: UserProfile = {
              id: div.divisionAdminId,
              name: div.divisionAdminName,
              role: 'ZM',
              roleTitle: 'Division System Admin',
              email: div.divisionAdminEmail,
              phone: div.divisionAdminPhone || '+91 98000 00000',
              companyId: cmp.id,
              companyName: cmp.name,
              divisionId: div.id,
              divisionName: div.name,
              reportingToId: div.reportingToId,
              reportingToName: div.reportingToName,
              status: div.status || 'Active',
              hq: `${cmp.name} HQ Office`,
              territory: `${div.name} Operations`,
              initials: initials,
              avatarBg: 'bg-teal-800',
              teamSize: 10,
              metrics: {}
            };

            if (idx >= 0) {
              baseProfiles[idx] = { ...baseProfiles[idx], ...adminProfile };
            } else {
              baseProfiles.push(adminProfile);
            }
          }
        });
      }
    });
  } catch (err) {
    console.warn('Failed to merge division admins into profiles:', err);
  }

  // Also dynamically merge all employees/field force users created by Company Admins
  try {
    const companies = getStoredCompanies();
    companies.forEach(cmp => {
      if (cmp.status !== 'Suspended') {
        const savedMaster = localStorage.getItem(`raxon_users_master_${cmp.id}`);
        if (savedMaster) {
          try {
            const empList = JSON.parse(savedMaster);
            if (Array.isArray(empList)) {
              empList.forEach((emp: any) => {
                if (emp && emp.id && emp.status !== 'Inactive') {
                  const idx = baseProfiles.findIndex(p => 
                    p.id.toLowerCase() === emp.id.toLowerCase() ||
                    (emp.email && p.email?.toLowerCase() === emp.email.toLowerCase() && p.companyId?.toLowerCase() === cmp.id.toLowerCase())
                  );

                  let normRole: any = normalizeRole(emp.role);
                  const initials = (emp.name || 'User')
                    .split(' ')
                    .filter(Boolean)
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase() || 'EMP';

                  const empProfile: UserProfile = {
                    id: emp.id,
                    name: emp.name || 'Field Representative',
                    role: normRole,
                    roleTitle: emp.role || normRole,
                    email: emp.email || '',
                    phone: emp.phone || '',
                    companyId: cmp.id,
                    companyName: cmp.name,
                    divisionId: emp.divisionId,
                    divisionName: emp.divisionName,
                    hq: emp.hq || cmp.hqCity || 'Head Office',
                    territory: emp.territory || 'Assigned Territory',
                    initials: initials,
                    avatarBg: 'bg-indigo-700',
                    status: emp.status || 'Active',
                    reportingToId: emp.reportingToId,
                    reportingToName: emp.reportingToName,
                    metrics: emp.metrics || {}
                  };

                  if (idx >= 0) {
                    baseProfiles[idx] = { ...baseProfiles[idx], ...empProfile };
                  } else {
                    baseProfiles.push(empProfile);
                  }
                }
              });
            }
          } catch (_) {}
        }
      }
    });

    // Scan any orphaned raxon_users_master_* keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('raxon_users_master_')) {
        const cId = key.replace('raxon_users_master_', '');
        const savedOrphan = localStorage.getItem(key);
        if (savedOrphan) {
          try {
            const empList = JSON.parse(savedOrphan);
            if (Array.isArray(empList)) {
              empList.forEach((emp: any) => {
                if (emp && emp.id && emp.status !== 'Inactive') {
                  const idx = baseProfiles.findIndex(p => p.id.toLowerCase() === emp.id.toLowerCase());
                  if (idx < 0) {
                    const normRole: any = normalizeRole(emp.role);
                    const initials = (emp.name || 'User')
                      .split(' ')
                      .filter(Boolean)
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || 'EMP';

                    baseProfiles.push({
                      id: emp.id,
                      name: emp.name || 'Field Representative',
                      role: normRole,
                      roleTitle: emp.role || normRole,
                      email: emp.email || '',
                      phone: emp.phone || '',
                      companyId: cId,
                      companyName: 'Company Network',
                      divisionId: emp.divisionId,
                      divisionName: emp.divisionName,
                      hq: emp.hq || 'Head Office',
                      territory: emp.territory || 'Assigned Territory',
                      initials: initials,
                      avatarBg: 'bg-indigo-700',
                      status: emp.status || 'Active',
                      reportingToId: emp.reportingToId,
                      reportingToName: emp.reportingToName,
                      metrics: emp.metrics || {}
                    });
                  }
                  
                }
              });
            }
          } catch (_) {}
        }
      }
    }
  } catch (err) {
    console.warn('Failed to merge company employees into profiles:', err);
  }

  return baseProfiles;
}

export async function saveStoredUserProfiles(profiles: UserProfile[]) {
  // 1. Immediately update local storage and dispatch event so UI never hangs
  try {
    localStorage.setItem(USER_PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    window.dispatchEvent(new CustomEvent('raxon-users-updated', { detail: profiles }));
  } catch (err) {
    console.warn('Failed to save user profiles to local storage:', err);
  }

  // 2. Asynchronously sync to Supabase in background
  try {
    const promises = profiles.map(async (p) => {
      if (p && p.id) {
        try {
          await supabase.from('user_profiles').upsert({
            id: p.id,
            company_id: p.companyId || 'ALL',
            role: p.role,
            email: p.email || '',
            data: p,
            updated_at: new Date().toISOString()
          });
        } catch (e) {
          console.warn('Failed to serialize user profile for Supabase:', p.id, e);
        }
      }
    });
    Promise.all(promises).catch(cloudErr => {
      console.warn('Background Supabase user profiles sync notice:', cloudErr);
    });
  } catch (cloudErr) {
    console.warn('Supabase cloud user profiles save notice:', cloudErr);
  }
}

export function saveStoredUserProfilesLocally(profiles: UserProfile[]) {
  try {
    localStorage.setItem(USER_PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    window.dispatchEvent(new CustomEvent('raxon-users-updated', { detail: profiles }));
  } catch (err) {}
}

let isUserProfilesFirestoreSyncInitialized = false;

export function initUserProfilesFirestoreSync() {
  if (isUserProfilesFirestoreSyncInitialized) return;
  isUserProfilesFirestoreSyncInitialized = true;

  try {
    // Initial fetch from Supabase
    supabase.from('user_profiles').select('*').then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        const remoteProfiles: UserProfile[] = data.map((d: any) => (d.data || d) as UserProfile);
        localStorage.setItem(USER_PROFILES_STORAGE_KEY, JSON.stringify(remoteProfiles));
        USER_PROFILES = remoteProfiles;
        window.dispatchEvent(new CustomEvent('raxon-users-updated', { detail: remoteProfiles }));
      }
    });

    supabase.from('company_employees').select('*').then(({ data, error }) => {
      if (!error && data) {
        data.forEach((row: any) => {
          if (row.company_id && Array.isArray(row.employees)) {
            localStorage.setItem(`raxon_users_master_${row.company_id}`, JSON.stringify(row.employees));
            syncRemoteEmployeesToLocalProfiles(row.company_id, row.employees);
          }
        });
        window.dispatchEvent(new CustomEvent('raxon-company-employees-updated'));
      }
    });

    // Realtime Subscriptions
    supabase
      .channel('public:user_profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, (payload) => {
        const row = payload.new as any;
        if (row && row.id && row.data) {
          const profiles = getStoredUserProfiles();
          const idx = profiles.findIndex(p => p.id === row.id);
          if (idx >= 0) {
            profiles[idx] = row.data;
          } else {
            profiles.push(row.data);
          }
          localStorage.setItem(USER_PROFILES_STORAGE_KEY, JSON.stringify(profiles));
          USER_PROFILES = profiles;
          window.dispatchEvent(new CustomEvent('raxon-users-updated', { detail: profiles }));
        }
      })
      .subscribe();

    supabase
      .channel('public:company_employees')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'company_employees' }, (payload) => {
        const row = payload.new as any;
        if (row && row.company_id && Array.isArray(row.employees)) {
          localStorage.setItem(`raxon_users_master_${row.company_id}`, JSON.stringify(row.employees));
          syncRemoteEmployeesToLocalProfiles(row.company_id, row.employees);
          window.dispatchEvent(new CustomEvent('raxon-company-employees-updated'));
        }
      })
      .subscribe();

  } catch (err) {
    console.warn('Supabase user_profiles init error:', err);
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => initUserProfilesFirestoreSync(), 200);
}

let lastProfilesSyncTimestamp = 0;

export async function syncProfilesFromFirestore(force: boolean = false) {
  const now = Date.now();
  if (!force && now - lastProfilesSyncTimestamp < 30000) {
    return; // Don't re-query if synced within last 30 seconds
  }
  lastProfilesSyncTimestamp = now;

  try {
    const { data, error } = await supabase.from('user_profiles').select('*');
    if (!error && data && data.length > 0) {
      const remoteProfiles: UserProfile[] = data.map((d: any) => (d.data || d) as UserProfile);
      const local = getStoredUserProfiles();
      const profileMap = new Map<string, UserProfile>();
      local.forEach(p => profileMap.set(p.id, p));
      remoteProfiles.forEach(p => profileMap.set(p.id, { ...profileMap.get(p.id), ...p }));
      const merged = Array.from(profileMap.values());
      localStorage.setItem(USER_PROFILES_STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('raxon-users-updated', { detail: merged }));
    }
  } catch (err) {
    console.warn('Cloud sync profiles download notice:', err);
  }
}

export let USER_PROFILES: UserProfile[] = getStoredUserProfiles();

// User Password Helpers (Supabase Auth Authoritative)
export function getUserPassword(_userId?: string): string {
  // Passwords must never be read or stored in frontend localStorage
  return '';
}

export async function updateUserPassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return { success: false, error: error.message };
    }
    window.dispatchEvent(new CustomEvent('raxon-password-changed'));
    return { success: true };
  } catch (err: any) {
    console.error('Failed to update password via Supabase Auth:', err);
    return { success: false, error: err.message || 'Failed to update password.' };
  }
}

export async function syncCompanyAdminToUserProfiles(
  admin: { id: string; name: string; email: string; phone: string; isPrimary?: boolean; status?: string },
  companyName: string,
  companyId: string
) {
  try {
    const profiles = getStoredUserProfiles();
    const existingIndex = profiles.findIndex(u => u.id === admin.id || (u.email === admin.email && u.companyId === companyId));
    
    const initials = admin.name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'CA';

    const updatedProfile: UserProfile = {
      id: admin.id,
      name: admin.name,
      role: 'ADMIN',
      roleTitle: 'Company Admin',
      email: admin.email,
      phone: admin.phone || '+91 98000 00000',
      companyId: companyId,
      companyName: companyName,
      hq: `${companyName} Corporate Office`,
      territory: 'National / All Divisions Field Network',
      initials: initials,
      avatarBg: 'bg-purple-900',
      teamSize: 50,
      status: (admin.status as any) || 'Active',
      metrics: {}
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profiles[existingIndex], ...updatedProfile };
    } else {
      profiles.unshift(updatedProfile);
    }
    await saveStoredUserProfiles(profiles);

    // Direct Supabase write for immediate cross-client consistency (WITHOUT password)
    try {
      const sanitized = JSON.parse(JSON.stringify(updatedProfile));
      delete sanitized.password;
      await supabase.from('user_profiles').upsert({
        id: admin.id,
        company_id: companyId,
        role: 'ADMIN',
        email: admin.email,
        name: admin.name,
        phone: admin.phone || '',
        status: admin.status || 'Active',
        data: sanitized,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Direct user_profiles Supabase save notice:", e);
    }
  } catch (e) {
    console.warn("Failed to sync company admin profile:", e);
    throw e;
  }
}

export async function removeCompanyAdminFromUserProfiles(adminId: string) {
  try {
    const profiles = getStoredUserProfiles();
    const filtered = profiles.filter(u => u.id !== adminId);
    await saveStoredUserProfiles(filtered);

    try {
      await supabase.from('user_profiles').delete().eq('id', adminId);
    } catch (_) {}
  } catch (e) {
    console.warn("Failed to remove company admin profile:", e);
  }
}

export async function syncDivisionAdminToUserProfiles(
  admin: { id: string; name: string; email: string; phone?: string; reportingToId?: string; reportingToName?: string },
  companyId: string,
  companyName: string,
  divisionId: string,
  divisionName: string
) {
  try {
    const profiles = getStoredUserProfiles();
    // Match by ID or Email inside the same company
    const existingIndex = profiles.findIndex(u => u.id === admin.id || (u.email === admin.email && u.companyId === companyId));
    
    const initials = admin.name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'DA';

    const updatedProfile: UserProfile = {
      id: admin.id,
      name: admin.name,
      role: 'ZM',
      roleTitle: 'Division System Admin',
      email: admin.email,
      phone: admin.phone || '+91 98000 00000',
      companyId: companyId,
      companyName: companyName,
      divisionId: divisionId,
      divisionName: divisionName,
      hq: `${companyName} HQ Office`,
      territory: `${divisionName} Operations`,
      initials: initials,
      avatarBg: 'bg-teal-800',
      teamSize: 10,
      metrics: {},
      reportingToId: admin.reportingToId,
      reportingToName: admin.reportingToName
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profiles[existingIndex], ...updatedProfile };
    } else {
      profiles.unshift(updatedProfile);
    }
    await saveStoredUserProfiles(profiles);
  } catch (e) {
    console.warn("Failed to sync division admin profile to users list:", e);
  }
}

export function getLoggedInUser(): UserProfile | null {
  const savedId = localStorage.getItem(ACTIVE_USER_ID_KEY);
  if (!savedId) return null;
  
  const profiles = getStoredUserProfiles();
  return profiles.find(u => u.id.toLowerCase() === savedId.toLowerCase()) || null;
}

export function getActiveUserForRole(role: UserRole | string): UserProfile {
  const normRole = normalizeRole(role);
  const currentProfiles = getStoredUserProfiles();
  const activeCompanyId = getActiveCompanyId();

  try {
    const savedId = localStorage.getItem(ACTIVE_USER_ID_KEY);
    if (savedId) {
      const match = currentProfiles.find(u => u.id.toLowerCase() === savedId.toLowerCase());
      if (match) {
        return match;
      }
    }
  } catch (err) {
    console.warn('Failed to load user from localStorage:', err);
  }

  // If we are looking for a specific role and no session found, try to find a user in the active company with that role
  const companyMatch = currentProfiles.find(u => 
    normalizeRole(u.role) === normRole && 
    (u.companyId === activeCompanyId || normRole === 'SUPER_ADMIN')
  );
  if (companyMatch) return companyMatch;

  // Generic fallback if all else fails
  return {
    id: 'UNKNOWN',
    name: 'Field User',
    role: normRole as any,
    roleTitle: role as string,
    email: 'user@raxon.cloud',
    phone: '',
    hq: 'Branch Office',
    territory: 'Assigned Territory',
    initials: 'FU',
    metrics: {}
  };
}

export function setActiveUserById(userId: string) {
  const currentProfiles = getStoredUserProfiles();
  const profile = currentProfiles.find(u => u.id === userId);
  if (profile) {
    localStorage.setItem(ACTIVE_USER_ID_KEY, userId);
    window.dispatchEvent(new CustomEvent('raxon-active-user-changed', { detail: profile }));
  }
}

export function filterUsersByLoggedInDivision(users: UserProfile[]): UserProfile[] {
  const loggedIn = getLoggedInUser();
  if (!loggedIn) return users;

  const role = normalizeRole(loggedIn.role);
  if (role === 'SUPER_ADMIN') {
    return users;
  }

  // 1. Company Admin / Admin: sees all users in their company
  if (role === 'ADMIN') {
    return users.filter(u => {
      if (u.companyId && loggedIn.companyId && u.companyId !== loggedIn.companyId) return false;
      return true;
    });
  }

  // 2. Division / ZM / RM / AM / MR:
  // Must match companyId first
  const companyFiltered = users.filter(u => {
    if (u.companyId && loggedIn.companyId && u.companyId !== loggedIn.companyId) {
      return false;
    }
    return true;
  });

  // Division check
  const userDivId = loggedIn.divisionId;
  const userDivName = loggedIn.divisionName;

  const divisionFiltered = companyFiltered.filter(u => {
    const uNorm = normalizeRole(u.role);
    if (uNorm === 'SUPER_ADMIN' || uNorm === 'ADMIN') return false;

    if (!userDivId && !userDivName) return true;
    const uDivId = u.divisionId;
    const uDivName = u.divisionName;

    if (!uDivId && !uDivName) return true;

    const matchesId = !!(uDivId && userDivId && uDivId.toUpperCase() === userDivId.toUpperCase());
    const matchesName = !!(uDivName && userDivName && (
      uDivName.toUpperCase() === userDivName.toUpperCase() ||
      uDivName.toUpperCase().includes(userDivName.toUpperCase()) ||
      userDivName.toUpperCase().includes(uDivName.toUpperCase())
    ));

    return matchesId || matchesName;
  });

  // Hierarchical rank check (subordinates only: rank of loggedIn > rank of u)
  const loggedInRank = getRoleRank(loggedIn.roleTitle || loggedIn.role);

  return divisionFiltered.filter(u => {
    if (u.id.toLowerCase() === loggedIn.id.toLowerCase()) return true;
    const uRank = getRoleRank(u.roleTitle || u.role);
    return uRank < loggedInRank;
  });
}

export function getAllUsersByRole(role: UserRole | string, companyIdOrFilter: string | boolean = true): UserProfile[] {
  const norm = normalizeRole(role);
  let targetCompanyId: string | null = null;
  if (typeof companyIdOrFilter === 'string') {
    targetCompanyId = companyIdOrFilter;
  } else if (companyIdOrFilter !== false) {
    targetCompanyId = getActiveCompanyId();
  }

  const rawUsers = getStoredUserProfiles().filter(u => {
    if (normalizeRole(u.role) !== norm) return false;
    if (targetCompanyId && norm !== 'SUPER_ADMIN' && u.companyId) {
      return u.companyId === targetCompanyId;
    }
    return true;
  });

  return filterUsersByLoggedInDivision(rawUsers);
}

/**
 * Strictly returns users belonging ONLY to the specified or active company ID.
 */
export function getUsersByCompany(explicitCompanyId?: string): UserProfile[] {
  const targetCompanyId = explicitCompanyId || getActiveCompanyId();
  const allProfiles = getStoredUserProfiles();
  const rawUsers = allProfiles.filter(u => {
    if (normalizeRole(u.role) === 'SUPER_ADMIN') return false; // Super Admins are platform-level
    return u.companyId === targetCompanyId;
  });

  return filterUsersByLoggedInDivision(rawUsers);
}

export function getCurrentlyActiveUserProfile(): UserProfile | null {
  const activeUserId = localStorage.getItem(ACTIVE_USER_ID_KEY);
  if (!activeUserId) return null;
  const profiles = getStoredUserProfiles();
  return profiles.find(u => u.id === activeUserId) || null;
}

export function syncRemoteEmployeesToLocalProfiles(
  companyId: string,
  employees: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    hq: string;
    status: 'Active' | 'Inactive';
    reportingToId?: string;
    reportingToName?: string;
    divisionId?: string;
    divisionName?: string;
  }[]
) {
  const allProfiles = getStoredUserProfiles();
  let modified = false;

  for (const emp of employees) {
    const existingIndex = allProfiles.findIndex(p => p.id === emp.id);
    const initials = emp.name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'EMP';

    let normRole: any = 'MR';
    const rLower = emp.role.toLowerCase();
    if (rLower.includes('super admin')) normRole = 'SUPER_ADMIN';
    else if (rLower.includes('company admin') || rLower === 'admin') normRole = 'ADMIN';
    else if (rLower.includes('division system admin') || rLower.includes('zone manager') || rLower.includes('zm')) normRole = 'ZM';
    else if (rLower.includes('regional manager') || rLower === 'rm') normRole = 'RM';
    else if (rLower.includes('area manager') || rLower === 'am') normRole = 'AM';

    const mappedProfile: Partial<UserProfile> = {
      id: emp.id,
      name: emp.name,
      role: normRole,
      roleTitle: emp.role,
      email: emp.email,
      phone: emp.phone,
      hq: emp.hq,
      status: emp.status,
      reportingToId: emp.reportingToId,
      reportingToName: emp.reportingToName,
      divisionId: emp.divisionId,
      divisionName: emp.divisionName,
      initials: initials,
      companyId: companyId
    };

    if (existingIndex >= 0) {
      allProfiles[existingIndex] = { ...allProfiles[existingIndex], ...mappedProfile } as UserProfile;
      modified = true;
    } else {
      const newProfile: UserProfile = {
        ...mappedProfile,
        avatarBg: 'bg-indigo-700',
        metrics: {}
      } as UserProfile;
      allProfiles.unshift(newProfile);
      modified = true;
    }
  }

  if (modified) {
    saveStoredUserProfilesLocally(allProfiles);
  }
}

export async function saveEmployeesAsProfiles(
  companyId: string,
  employees: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    hq: string;
    status: 'Active' | 'Inactive';
    reportingToId?: string;
    reportingToName?: string;
    divisionId?: string;
    divisionName?: string;
  }[]
) {
  const allProfiles = getStoredUserProfiles();
  
  for (const emp of employees) {
    const existingIndex = allProfiles.findIndex(p => p.id === emp.id);
    const initials = emp.name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'EMP';

    let normRole: any = 'MR';
    const rLower = emp.role.toLowerCase();
    if (rLower.includes('super admin')) normRole = 'SUPER_ADMIN';
    else if (rLower.includes('company admin') || rLower === 'admin') normRole = 'ADMIN';
    else if (rLower.includes('division system admin') || rLower.includes('zone manager') || rLower.includes('zm')) normRole = 'ZM';
    else if (rLower.includes('regional manager') || rLower === 'rm') normRole = 'RM';
    else if (rLower.includes('area manager') || rLower === 'am') normRole = 'AM';

    const mappedProfile: Partial<UserProfile> = {
      id: emp.id,
      name: emp.name,
      role: normRole,
      roleTitle: emp.role,
      email: emp.email,
      phone: emp.phone,
      hq: emp.hq,
      status: emp.status,
      reportingToId: emp.reportingToId,
      reportingToName: emp.reportingToName,
      divisionId: emp.divisionId,
      divisionName: emp.divisionName,
      initials: initials,
      companyId: companyId
    };

    if (existingIndex >= 0) {
      allProfiles[existingIndex] = { ...allProfiles[existingIndex], ...mappedProfile } as UserProfile;
    } else {
      const newProfile: UserProfile = {
        ...mappedProfile,
        avatarBg: 'bg-indigo-700',
        metrics: {}
      } as UserProfile;
      allProfiles.unshift(newProfile);
    }
  }

  try {
    const sanitizedEmployees = JSON.parse(JSON.stringify(employees));
    await supabase.from('company_employees').upsert({
      company_id: companyId,
      employees: sanitizedEmployees,
      updated_at: new Date().toISOString()
    });
    localStorage.setItem(`raxon_users_master_${companyId}`, JSON.stringify(employees));
  } catch (err) {
    console.error(`Failed to save employees to DB for company ${companyId}:`, err);
    throw err;
  }

  await saveStoredUserProfiles(allProfiles);
}

export const saveCompanyEmployees = saveEmployeesAsProfiles;

export async function updateUserPunchState(userId: string, isPunchedIn: boolean, punchInTime: string | null, punchInLocked: boolean) {
  const currentProfiles = getStoredUserProfiles();
  const index = currentProfiles.findIndex(u => u.id === userId);
  if (index >= 0) {
    currentProfiles[index].metrics = {
      ...currentProfiles[index].metrics,
      isPunchedIn,
      punchInTime: punchInTime || undefined,
      punchInLocked
    };
    await saveStoredUserProfiles(currentProfiles);
    
    const activeUserId = localStorage.getItem('raxon_current_active_user_id');
    if (activeUserId && activeUserId.toLowerCase() === userId.toLowerCase()) {
      window.dispatchEvent(new CustomEvent('raxon-active-user-changed', { detail: currentProfiles[index] }));
    }
    return true;
  }
  return false;
}

export async function resetUserPunchIn(userId: string) {
  const currentProfiles = getStoredUserProfiles();
  const index = currentProfiles.findIndex(u => u.id === userId);
  if (index >= 0) {
    currentProfiles[index].metrics = {
      ...currentProfiles[index].metrics,
      punchInLocked: false,
      isPunchedIn: false,
      punchInTime: undefined
    };
    await saveStoredUserProfiles(currentProfiles);
    
    const activeUserId = localStorage.getItem('raxon_current_active_user_id');
    if (activeUserId && activeUserId.toLowerCase() === userId.toLowerCase()) {
      window.dispatchEvent(new CustomEvent('raxon-active-user-changed', { detail: currentProfiles[index] }));
    }
    return true;
  }
  return false;
}

export function getRoleRank(role: string): number {
  const r = (role || '').toUpperCase();
  if (r === 'SUPER_ADMIN') return 100;
  if (r === 'ADMIN' || r === 'SYSTEM ADMIN' || r.includes('COMPANY ADMIN') || r.includes('CADM')) return 90;
  if (r === 'ZM' || r.includes('DIVISION SYSTEM ADMIN') || r.includes('DSA') || r.includes('ZONAL')) return 80;
  if (r === 'RM' || r.includes('REGIONAL')) return 70;
  if (r === 'AM' || r.includes('AREA')) return 60;
  if (r === 'MR' || r.includes('MEDICAL')) return 50;
  return 0;
}

