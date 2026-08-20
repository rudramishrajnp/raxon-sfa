import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncCompanyAdminToUserProfiles, removeCompanyAdminFromUserProfiles, syncDivisionAdminToUserProfiles, getStoredUserProfiles, saveStoredUserProfiles } from './userContext';
import { supabase } from '../supabaseClient';

export interface CompanyFeatureSwitches {
  featureGpsTracking: boolean;
  featureChemistPob: boolean;
  featureSamplesGifts: boolean;
  featureStrictMtpApproval: boolean;
  featureStockistLedger: boolean;
  featureWhatsAppShare: boolean;
  featureDoctorSelfAdd: boolean;
  featureJointWorking: boolean;
  featureExpenseManagement: boolean;
}

export interface CompanyAdminAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'COMPANY_ADMIN';
  status: 'Active' | 'Suspended';
  isPrimary: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface CompanyDivision {
  id: string;
  name: string;
  code: string;
  headCount: number;
  status: 'Active' | 'Inactive';
  description?: string;
  hasDedicatedAdmin: boolean;
  divisionAdminId?: string;
  divisionAdminName?: string;
  divisionAdminEmail?: string;
  divisionAdminPhone?: string;
  reportingToId?: string;
  reportingToName?: string;
}

export interface CompanySubscriptionPlan {
  planTier: 'Starter' | 'Growth' | 'Enterprise' | 'Custom';
  maxTotalUsers: number;
  mrQuota: number;
  managerQuota: number;
  divisionQuota: number;
  billingCycle: 'Monthly' | 'Quarterly' | 'Annual';
  validUntil: string;
  status: 'Active' | 'Expiring Soon' | 'Suspended';
  pricePerMrPerMonth: number;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  logo: string;
  tagline: string;
  state: string;
  hqCity: string;
  gstNumber: string;
  dlNumber: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  plan: CompanySubscriptionPlan;
  companyAdmins: CompanyAdminAccount[];
  activeDivisions: CompanyDivision[];
  featureSwitches: CompanyFeatureSwitches;
  createdAt: string;
  status: 'Active' | 'Suspended' | 'Trial';
}

export const INITIAL_COMPANIES: Company[] = [];

const EMPTY_FALLBACK_COMPANY: Company = {
  id: '',
  name: 'No Company Configured',
  code: 'SYS',
  logo: 'S',
  tagline: '',
  state: '',
  hqCity: '',
  gstNumber: '',
  dlNumber: '',
  contactEmail: '',
  contactPhone: '',
  currency: 'INR (₹)',
  plan: {
    planTier: 'Enterprise',
    maxTotalUsers: 100,
    mrQuota: 80,
    managerQuota: 15,
    divisionQuota: 5,
    billingCycle: 'Annual',
    validUntil: '2028-12-31',
    status: 'Active',
    pricePerMrPerMonth: 0
  },
  companyAdmins: [],
  activeDivisions: [],
  featureSwitches: {
    featureGpsTracking: true,
    featureChemistPob: true,
    featureSamplesGifts: true,
    featureStrictMtpApproval: true,
    featureStockistLedger: true,
    featureWhatsAppShare: true,
    featureDoctorSelfAdd: true,
    featureJointWorking: true,
    featureExpenseManagement: true
  },
  createdAt: new Date().toISOString(),
  status: 'Active'
};

const STORAGE_COMPANIES_KEY = 'raxon_multitenant_companies_v8';
const STORAGE_ACTIVE_COMPANY_KEY = 'raxon_current_company_id_v8';
const STORAGE_ACTIVE_DIVISION_KEY = 'raxon_current_division_id_v8';
const STORAGE_DELETED_COMPANIES_KEY = 'raxon_deleted_company_ids_v8';

export function getDeletedCompanyIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_DELETED_COMPANIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return [];
}

export function markCompanyAsDeleted(companyId: string) {
  try {
    const deleted = getDeletedCompanyIds();
    if (!deleted.includes(companyId)) {
      deleted.push(companyId);
      localStorage.setItem(STORAGE_DELETED_COMPANIES_KEY, JSON.stringify(deleted));
    }
  } catch (_) {}
}

export function getStoredCompanies(): Company[] {
  try {
    const deletedIds = new Set(getDeletedCompanyIds());
    const saved = localStorage.getItem(STORAGE_COMPANIES_KEY);
    
    let baseList: Company[] = [];
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        baseList = parsed;
      } else {
        baseList = [...INITIAL_COMPANIES];
        try {
          localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(baseList));
        } catch (_) {}
      }
    } else {
      baseList = [...INITIAL_COMPANIES];
      try {
        localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(baseList));
      } catch (_) {}
    }

    // Filter out Medix/Zenith and explicitly deleted companies
    let cleaned = baseList.filter((c: any) => 
      c &&
      c.id &&
      c.id !== 'CMP-MED-01' && 
      c.id !== 'CMP-ZEN-01' && 
      !c.name?.toLowerCase().includes('medix') && 
      !c.name?.toLowerCase().includes('zenith') &&
      !deletedIds.has(c.id)
    );

    if (cleaned.length === 0 && deletedIds.size === 0) {
      cleaned = [...INITIAL_COMPANIES];
    }

    return cleaned.map((c: any) => ({
      ...c,
      code: (c.code && c.code.length <= 12 && !c.code.includes('_')) ? c.code : 'RAXON',
      logo: (c.logo && c.logo.length <= 20 && !c.logo.includes('_') && !c.logo.startsWith('data:image')) ? c.logo : (c.name ? c.name[0] : 'C')
    }));
  } catch (e) {
    console.warn("Companies read error:", e);
  }
  return [...INITIAL_COMPANIES];
}

let isCompanyFirestoreSyncInitialized = false;

export function initCompanyFirestoreSync() {
  if (isCompanyFirestoreSyncInitialized) return;
  isCompanyFirestoreSyncInitialized = true;

  try {
    // 1. Initial fetch from Supabase
    supabase.from('companies').select('*').then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        const deletedIds = new Set(getDeletedCompanyIds());
        const remoteCompanies: Company[] = data
          .map((row: any) => (row.data ? { ...row.data, id: row.id } : row) as Company)
          .filter(c => c && c.id && !deletedIds.has(c.id));

        if (remoteCompanies.length > 0) {
          localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(remoteCompanies));
          window.dispatchEvent(new CustomEvent('raxon-company-updated', { detail: remoteCompanies }));
        }
      }
    });

    // 2. Realtime listener for companies table
    supabase
      .channel('public:companies_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => {
        syncCompaniesFromFirestore(true);
      })
      .subscribe();
  } catch (err) {
    console.warn('Supabase company sync init error:', err);
  }
}

export async function syncCompaniesFromFirestore(force: boolean = false): Promise<Company[]> {
  try {
    const deletedIds = new Set(getDeletedCompanyIds());
    const { data, error } = await supabase.from('companies').select('*');
    if (!error && data && data.length > 0) {
      const remoteCompanies: Company[] = data
        .map((row: any) => (row.data ? { ...row.data, id: row.id } : row) as Company)
        .filter(c => c && c.id && !deletedIds.has(c.id));

      if (remoteCompanies.length > 0) {
        localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(remoteCompanies));
        window.dispatchEvent(new CustomEvent('raxon-company-updated', { detail: remoteCompanies }));
        return remoteCompanies;
      }
    }
  } catch (err) {
    console.warn('Direct Supabase company sync notice:', err);
  }
  return getStoredCompanies();
}

if (typeof window !== 'undefined') {
  setTimeout(() => initCompanyFirestoreSync(), 100);
}

export async function saveStoredCompanies(companies: Company[]) {
  const deletedIds = new Set(getDeletedCompanyIds());
  const filtered = companies.filter(c => c && c.id && !deletedIds.has(c.id));

  // 1. Update local cache immediately
  try {
    localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('raxon-company-updated'));
  } catch (err) {
    console.warn("Failed to write companies to local storage:", err);
  }
  
  // 2. Cloud sync each company directly to Supabase 'companies'
  try {
    const promises = filtered.map(async (comp) => {
      try {
        const sanitized = JSON.parse(JSON.stringify(comp));
        if (sanitized.logo && sanitized.logo.startsWith('data:image') && sanitized.logo.length > 500000) {
           sanitized.logo = sanitized.name ? sanitized.name[0] : 'C'; 
        }
        await supabase.from('companies').upsert({
          id: comp.id,
          name: comp.name,
          data: sanitized,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn(`Failed to serialize or save company ${comp.id}:`, err);
      }
    });

    Promise.all(promises).catch(err => console.warn("Background companies sync notice:", err));
  } catch (e) {
    console.warn("Save companies cloud sync notice:", e);
  }
}

export function saveStoredCompaniesLocally(companies: Company[]) {
  try {
    const deletedIds = new Set(getDeletedCompanyIds());
    const filtered = companies.filter(c => c && c.id && !deletedIds.has(c.id));
    localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('raxon-company-updated'));
  } catch (e) {}
}

export function getActiveCompanyId(): string {
  try {
    const activeUserId = localStorage.getItem('raxon_current_active_user_id');
    const storedActiveCompany = localStorage.getItem(STORAGE_ACTIVE_COMPANY_KEY);

    if (activeUserId) {
      const rawUsers = localStorage.getItem('raxon_custom_user_profiles_v5');
      if (rawUsers) {
        try {
          const users = JSON.parse(rawUsers);
          const currentUser = users.find((u: any) => u.id.toLowerCase() === activeUserId.toLowerCase());
          // For Super Admin, respect storedActiveCompany if set, otherwise fallback to first tenant
          if (currentUser && (currentUser.role === 'PLATFORM_SUPER_ADMIN' || currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'Super Admin')) {
            if (storedActiveCompany) return storedActiveCompany;
          }
        } catch {}
      }

      // Check company admins from stored companies
      const companies = getStoredCompanies();
      for (const comp of companies) {
        if (Array.isArray(comp.companyAdmins)) {
          const matched = comp.companyAdmins.find(a => a.id.toLowerCase() === activeUserId.toLowerCase());
          if (matched) {
            return comp.id;
          }
        }
      }

      // Check cached/stored user profiles for non-superadmin
      if (rawUsers) {
        try {
          const users = JSON.parse(rawUsers);
          const currentUser = users.find((u: any) => u.id.toLowerCase() === activeUserId.toLowerCase());
          if (currentUser && currentUser.companyId && currentUser.role !== 'PLATFORM_SUPER_ADMIN' && currentUser.role !== 'Super Admin' && currentUser.role !== 'SUPER_ADMIN') {
            return currentUser.companyId;
          }
        } catch {}
      }
    }
    if (storedActiveCompany) return storedActiveCompany;
    const comps = getStoredCompanies();
    if (comps.length > 0) return comps[0].id;
  } catch {}
  return '';
}

export async function deleteTenantCompany(companyId: string): Promise<boolean> {
  try {
    markCompanyAsDeleted(companyId);

    // Delete company document from Supabase
    await supabase.from('companies').delete().eq('id', companyId);

    const companies = getStoredCompanies();
    const updated = companies.filter(c => c.id !== companyId);

    // Since we just deleted from the backend, we can just save local
    saveStoredCompaniesLocally(updated);

    // Remove associated user profiles and company master data
    try {
      localStorage.removeItem(`raxon_users_master_${companyId}`);
      localStorage.removeItem(`raxon_doctors_${companyId}`);
      localStorage.removeItem(`raxon_chemists_${companyId}`);
      localStorage.removeItem(`raxon_stockists_${companyId}`);
      localStorage.removeItem(`raxon_products_${companyId}`);
      const profiles = getStoredUserProfiles();
      const filteredProfiles = profiles.filter(p => p.companyId !== companyId);
      // Let it async fire, but we don't strict wait
      saveStoredUserProfiles(filteredProfiles).catch(console.error);
    } catch (_) {}

    const activeCompany = localStorage.getItem(STORAGE_ACTIVE_COMPANY_KEY);
    if (activeCompany === companyId && updated.length > 0) {
      setActiveCompanyId(updated[0].id);
    }

    window.dispatchEvent(new CustomEvent('raxon-company-updated'));
    window.dispatchEvent(new CustomEvent('raxon-company-switched', { detail: { companyId: updated[0]?.id || '' } }));
    return true;
  } catch (err) {
    console.error('Failed to delete tenant company:', err);
    throw err;
  }
}

export function setActiveCompanyId(id: string) {
  try {
    localStorage.setItem(STORAGE_ACTIVE_COMPANY_KEY, id);
    window.dispatchEvent(new CustomEvent('raxon-company-switched', { detail: { companyId: id } }));
  } catch (e) {
    console.error("Set active company error:", e);
  }
}

export function getActiveCompany(): Company {
  const companies = getStoredCompanies();
  const id = getActiveCompanyId();
  const found = companies.find(c => c.id === id);
  return found || companies[0] || EMPTY_FALLBACK_COMPANY;
}

export function getActiveDivisionId(): string {
  try {
    const div = localStorage.getItem(STORAGE_ACTIVE_DIVISION_KEY);
    if (div) return div;
  } catch {}
  const company = getActiveCompany();
  return company.activeDivisions?.[0]?.id || 'DIV-ALL';
}

export function setActiveDivisionId(divId: string) {
  try {
    localStorage.setItem(STORAGE_ACTIVE_DIVISION_KEY, divId);
    window.dispatchEvent(new CustomEvent('raxon-division-switched', { detail: { divisionId: divId } }));
  } catch (e) {
    console.error("Set active division error:", e);
  }
}

// -------------------------------------------------------------
// Platform Super Admin Actions
// -------------------------------------------------------------
export async function createTenantCompany(data: {
  name: string;
  code: string;
  logo?: string;
  tagline?: string;
  state: string;
  hqCity: string;
  gstNumber?: string;
  dlNumber?: string;
  contactEmail: string;
  contactPhone: string;
  adminName: string;
  adminPhone: string;
  adminEmail: string;
  adminPassword?: string;
  planTier: 'Starter' | 'Growth' | 'Enterprise' | 'Custom';
  maxTotalUsers?: number;
  mrQuota: number;
  managerQuota: number;
  divisionQuota: number;
}): Promise<Company> {
  const companies = getStoredCompanies();
  const companyId = `CMP-${data.code.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  let adminUid = `CADM-${data.code.toUpperCase()}-01`;
  const cleanAdminEmail = data.adminEmail.trim().toLowerCase();
  const adminPassword = data.adminPassword?.trim() || '123456';

  // Generate admin UID
  if (!adminUid) {
    adminUid = `CADM-${data.code.toUpperCase()}-01`;
  }

  const newAdmin: CompanyAdminAccount = {
    id: adminUid,
    name: data.adminName,
    email: cleanAdminEmail,
    phone: data.adminPhone || '+91 98000 00000',
    role: 'COMPANY_ADMIN',
    status: 'Active',
    isPrimary: true,
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: 'Not yet logged in'
  };

  const defaultDivision: CompanyDivision = {
    id: `DIV-${data.code.toUpperCase()}-01`,
    name: `${data.name} General Division`,
    code: `${data.code.toUpperCase()}-GEN`,
    headCount: 1,
    status: 'Active',
    description: 'Primary pharmaceutical field division',
    hasDedicatedAdmin: false
  };

  const defaultMaxUsers = data.maxTotalUsers || (data.mrQuota || 50) + (data.managerQuota || 10) + 10;

  let logoString = data.logo || data.name?.[0] || 'C';
  if (logoString.length > 500000) {
     logoString = data.name?.[0] || 'C';
  }

  const newCompany: Company = {
    id: companyId,
    name: data.name,
    code: data.code.toUpperCase(),
    logo: logoString,
    tagline: data.tagline || 'Committed to Healthcare Excellence',
    state: data.state,
    hqCity: data.hqCity,
    gstNumber: data.gstNumber || 'PENDING',
    dlNumber: data.dlNumber || 'PENDING',
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    currency: 'INR (₹)',
    plan: {
      planTier: data.planTier || 'Enterprise',
      maxTotalUsers: defaultMaxUsers,
      mrQuota: data.mrQuota || 50,
      managerQuota: data.managerQuota || 10,
      divisionQuota: data.divisionQuota || 3,
      billingCycle: 'Annual',
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active',
      pricePerMrPerMonth: data.planTier === 'Enterprise' ? 450 : 500
    },
    companyAdmins: [newAdmin],
    activeDivisions: [defaultDivision],
    featureSwitches: {
      featureGpsTracking: true,
      featureChemistPob: true,
      featureSamplesGifts: true,
      featureStrictMtpApproval: true,
      featureStockistLedger: true,
      featureWhatsAppShare: true,
      featureDoctorSelfAdd: true,
      featureJointWorking: true,
      featureExpenseManagement: true
    },
    createdAt: new Date().toISOString().split('T')[0],
    status: 'Active'
  };

  // Update local storage immediately for zero UI delay
  companies.unshift(newCompany);
  saveStoredCompaniesLocally(companies);

  const adminInitials = (data.adminName || 'Admin')
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'CA';

  const adminProfileData = {
    id: adminUid,
    name: data.adminName,
    email: cleanAdminEmail,
    phone: data.adminPhone || '+91 98000 00000',
    role: 'ADMIN',
    roleTitle: 'ADMIN',
    companyId: newCompany.id,
    companyName: newCompany.name,
    status: 'Active',
    hq: `${newCompany.name} Corporate Office`,
    territory: 'National / All Divisions Field Network',
    initials: adminInitials,
    avatarBg: 'bg-purple-900',
    teamSize: defaultMaxUsers,
    metrics: {},
    createdAt: new Date().toISOString()
  };

  // 1. Direct writes to Supabase table 'companies' and 'user_profiles'
  try {
    // Attempt secure server-side Auth creation first
    try {
      const authRes = await fetch('/api/auth/admin-create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanAdminEmail,
          password: adminPassword,
          name: data.adminName,
          phone: data.adminPhone || '+91 98000 00000',
          companyId: newCompany.id,
          companyName: newCompany.name,
          role: 'ADMIN',
          roleTitle: 'Company Admin'
        })
      });
      const authData = await authRes.json();
      if (authData?.user?.id) {
        adminUid = authData.user.id;
        newAdmin.id = adminUid;
        adminProfileData.id = adminUid;
      }
    } catch (authErr) {
      console.warn("Server auth user provisioning notice:", authErr);
    }

    const sanitizedCompany = JSON.parse(JSON.stringify(newCompany));
    const sanitizedAdmin = JSON.parse(JSON.stringify(adminProfileData));

    const cloudWrites = Promise.all([
      supabase.from('companies').upsert({
        id: newCompany.id,
        name: newCompany.name,
        data: sanitizedCompany,
        updated_at: new Date().toISOString()
      }),
      supabase.from('user_profiles').upsert({
        id: adminUid,
        company_id: newCompany.id,
        role: sanitizedAdmin.role || 'ADMIN',
        email: cleanAdminEmail,
        name: data.adminName,
        phone: data.adminPhone || '',
        status: 'Active',
        data: sanitizedAdmin,
        updated_at: new Date().toISOString()
      })
    ]);

    const writeTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Supabase write timeout")), 2500));
    await Promise.race([cloudWrites, writeTimeout]);
  } catch (err) {
    console.warn("Cloud DB write delayed or offline, company preserved locally:", err);
  }

  // 2. Sync profile locally & in background
  syncCompanyAdminToUserProfiles(newAdmin, newCompany.name, newCompany.id).catch(e => {
    console.warn("User profile sync notice:", e);
  });

  return newCompany;
}

export async function updateTenantCompany(companyId: string, updates: Partial<Company>): Promise<Company> {
  const companies = getStoredCompanies();
  let updatedCompany: Company | null = null;

  const updatedList = companies.map(c => {
    if (c.id === companyId) {
      updatedCompany = {
        ...c,
        ...updates,
        id: c.id, // Immutable ID
        plan: {
          ...c.plan,
          ...(updates.plan || {})
        },
        featureSwitches: {
          ...c.featureSwitches,
          ...(updates.featureSwitches || {})
        }
      };
      // Strip large base64 logos
      if (updatedCompany.logo && updatedCompany.logo.startsWith('data:image') && updatedCompany.logo.length > 500000) {
        updatedCompany.logo = updatedCompany.name?.[0] || 'C';
      }
      return updatedCompany;
    }
    return c;
  });

  if (!updatedCompany) throw new Error("Company not found");

  await saveStoredCompanies(updatedList);

  // If company name was updated, sync its admins' profile records
  if (updates.name && (updatedCompany as Company).companyAdmins) {
    (updatedCompany as Company).companyAdmins.forEach(async (adm) => {
      await syncCompanyAdminToUserProfiles(adm, (updatedCompany as Company).name, companyId);
    });
  }

  return updatedCompany;
}

export async function toggleCompanyStatus(companyId: string, status: 'Active' | 'Suspended' | 'Trial') {
  const companies = getStoredCompanies();
  const updated = companies.map(c => c.id === companyId ? { ...c, status } : c);
  await saveStoredCompanies(updated);
}

export async function addCompanyAdminAccount(
  companyId: string, 
  admin: { id?: string; name: string; email: string; phone: string; isPrimary?: boolean; password?: string }
): Promise<CompanyAdminAccount> {
  const companies = getStoredCompanies();
  const target = companies.find(c => c.id === companyId);
  if (!target) throw new Error("Company not found");

  let adminUid = admin.id && admin.id.trim().length > 0 ? admin.id.trim() : `CADM-${target.code}-${Date.now().toString().slice(-4)}`;

  const isPrimary = admin.isPrimary ?? (target.companyAdmins.length === 0);

  // If new admin is primary, clear isPrimary on other admins
  if (isPrimary) {
    target.companyAdmins = target.companyAdmins.map(a => ({ ...a, isPrimary: false }));
  }

  const newAdmin: CompanyAdminAccount = {
    id: adminUid,
    name: admin.name,
    email: admin.email,
    phone: admin.phone || '+91 98000 00000',
    role: 'COMPANY_ADMIN',
    status: 'Active',
    isPrimary: isPrimary,
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: 'Never'
  };

  // Attempt server-side auth user creation
  if (admin.password && admin.email) {
    try {
      const authRes = await fetch('/api/auth/admin-create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: admin.email.trim().toLowerCase(),
          password: admin.password,
          name: admin.name,
          phone: admin.phone || '+91 98000 00000',
          companyId: target.id,
          companyName: target.name,
          role: 'ADMIN',
          roleTitle: 'Company Admin'
        })
      });
      const authData = await authRes.json();
      if (authData?.user?.id) {
        adminUid = authData.user.id;
        newAdmin.id = adminUid;
      }
    } catch (authErr) {
      console.warn("Server auth user provisioning notice:", authErr);
    }
  }

  target.companyAdmins = target.companyAdmins || [];
  target.companyAdmins.push(newAdmin);
  await saveStoredCompanies(companies);

  // Sync to user profiles
  await syncCompanyAdminToUserProfiles(newAdmin, target.name, target.id);

  return newAdmin;
}

export async function updateCompanyAdminAccount(
  companyId: string,
  adminId: string,
  updates: Partial<CompanyAdminAccount> & { password?: string }
) {
  const companies = getStoredCompanies();
  const target = companies.find(c => c.id === companyId);
  if (!target) throw new Error("Company not found");

  let updatedAdminObj: CompanyAdminAccount | null = null;

  target.companyAdmins = target.companyAdmins.map(a => {
    if (a.id === adminId) {
      updatedAdminObj = {
        ...a,
        ...updates,
        id: a.id // Keep original ID
      };
      return updatedAdminObj;
    }
    // If updating this admin to isPrimary=true, set others to false
    if (updates.isPrimary) {
      return { ...a, isPrimary: false };
    }
    return a;
  });

  await saveStoredCompanies(companies);

  if (updatedAdminObj) {
    await syncCompanyAdminToUserProfiles(updatedAdminObj, target.name, target.id);
  }
}

export async function removeCompanyAdminAccount(companyId: string, adminId: string) {
  const companies = getStoredCompanies();
  const target = companies.find(c => c.id === companyId);
  if (!target) throw new Error("Company not found");

  target.companyAdmins = target.companyAdmins.filter(a => a.id !== adminId);
  
  // If no primary admin left and some admins exist, promote first one
  if (target.companyAdmins.length > 0 && !target.companyAdmins.some(a => a.isPrimary)) {
    target.companyAdmins[0].isPrimary = true;
  }

  await saveStoredCompanies(companies);
  await removeCompanyAdminFromUserProfiles(adminId);
}

export async function setPrimaryCompanyAdmin(companyId: string, adminId: string) {
  const companies = getStoredCompanies();
  const target = companies.find(c => c.id === companyId);
  if (!target) throw new Error("Company not found");

  target.companyAdmins = target.companyAdmins.map(a => ({
    ...a,
    isPrimary: a.id === adminId
  }));

  await saveStoredCompanies(companies);

  target.companyAdmins.forEach(async (adm) => {
    await syncCompanyAdminToUserProfiles(adm, target.name, target.id);
  });
}

export async function updateCompanyFeatureSwitches(companyId: string, switches: Partial<CompanyFeatureSwitches>) {
  const companies = getStoredCompanies();
  const updated = companies.map(c => {
    if (c.id === companyId) {
      return {
        ...c,
        featureSwitches: {
          ...c.featureSwitches,
          ...switches
        }
      };
    }
    return c;
  });
  await saveStoredCompanies(updated);
}

export async function updateCompanyPlan(companyId: string, planData: Partial<CompanySubscriptionPlan>) {
  const companies = getStoredCompanies();
  const updated = companies.map(c => {
    if (c.id === companyId) {
      return {
        ...c,
        plan: {
          ...c.plan,
          ...planData
        }
      };
    }
    return c;
  });
  await saveStoredCompanies(updated);
}

// -------------------------------------------------------------
// Company Admin Division Management
// -------------------------------------------------------------
export async function addCompanyDivision(companyId: string, div: {
  name: string;
  code: string;
  description?: string;
  hasDedicatedAdmin: boolean;
  divisionAdminName?: string;
  divisionAdminEmail?: string;
  divisionAdminPhone?: string;
}): Promise<CompanyDivision> {
  const companies = getStoredCompanies();
  const target = companies.find(c => c.id === companyId);
  if (!target) throw new Error("Company not found");

  const primaryAdmin = target.companyAdmins?.find(a => a.isPrimary) || target.companyAdmins?.[0];

  const newDiv: CompanyDivision = {
    id: `DIV-${target.code}-${Date.now().toString().slice(-4)}`,
    name: div.name,
    code: div.code.toUpperCase(),
    headCount: 1,
    status: 'Active',
    description: div.description || 'Therapeutic division',
    hasDedicatedAdmin: div.hasDedicatedAdmin,
    divisionAdminId: div.hasDedicatedAdmin ? `DADM-${Date.now().toString().slice(-4)}` : undefined,
    divisionAdminName: div.divisionAdminName,
    divisionAdminEmail: div.divisionAdminEmail,
    divisionAdminPhone: div.divisionAdminPhone,
    reportingToId: primaryAdmin ? primaryAdmin.id : undefined,
    reportingToName: primaryAdmin ? primaryAdmin.name : undefined
  };

  target.activeDivisions.push(newDiv);
  await saveStoredCompanies(companies);

  // Auto create User Account if division has dedicated admin
  if (newDiv.hasDedicatedAdmin && newDiv.divisionAdminId && newDiv.divisionAdminName && newDiv.divisionAdminEmail) {
    await syncDivisionAdminToUserProfiles(
      {
        id: newDiv.divisionAdminId,
        name: newDiv.divisionAdminName,
        email: newDiv.divisionAdminEmail,
        phone: newDiv.divisionAdminPhone,
        reportingToId: newDiv.reportingToId,
        reportingToName: newDiv.reportingToName
      },
      target.id,
      target.name,
      newDiv.id,
      newDiv.name
    );
  }

  return newDiv;
}

export async function toggleDivisionDedicatedAdmin(companyId: string, divisionId: string, adminDetails?: { name: string; email: string; phone?: string }) {
  const companies = getStoredCompanies();
  const target = companies.find(c => c.id === companyId);
  if (!target) return;

  const primaryAdmin = target.companyAdmins?.find(a => a.isPrimary) || target.companyAdmins?.[0];
  let syncedAdmin: any = null;
  let syncedDiv: any = null;

  target.activeDivisions = target.activeDivisions.map(d => {
    if (d.id === divisionId) {
      const willHaveAdmin = adminDetails ? true : !d.hasDedicatedAdmin;
      const finalId = willHaveAdmin ? (d.divisionAdminId || `DADM-${Date.now().toString().slice(-4)}`) : undefined;
      const finalName = willHaveAdmin ? (adminDetails?.name || d.divisionAdminName || 'Assigned Division Admin') : undefined;
      const finalEmail = willHaveAdmin ? (adminDetails?.email || d.divisionAdminEmail || 'divadmin@company.com') : undefined;
      const finalPhone = willHaveAdmin ? (adminDetails?.phone || d.divisionAdminPhone) : undefined;
      const repId = d.reportingToId || primaryAdmin?.id;
      const repName = d.reportingToName || primaryAdmin?.name;

      if (willHaveAdmin && finalId && finalName && finalEmail) {
        syncedAdmin = {
          id: finalId,
          name: finalName,
          email: finalEmail,
          phone: finalPhone,
          reportingToId: repId,
          reportingToName: repName
        };
        syncedDiv = {
          id: d.id,
          name: d.name
        };
      }

      return {
        ...d,
        hasDedicatedAdmin: willHaveAdmin,
        divisionAdminId: finalId,
        divisionAdminName: finalName,
        divisionAdminEmail: finalEmail,
        divisionAdminPhone: finalPhone,
        reportingToId: repId,
        reportingToName: repName
      };
    }
    return d;
  });

  await saveStoredCompanies(companies);

  if (syncedAdmin && syncedDiv) {
    await syncDivisionAdminToUserProfiles(
      syncedAdmin,
      target.id,
      target.name,
      syncedDiv.id,
      syncedDiv.name
    );
  }
}

export async function updateDivisionReportingManager(
  companyId: string,
  divisionId: string,
  reportingToId: string,
  reportingToName: string
) {
  const companies = getStoredCompanies();
  const target = companies.find(c => c.id === companyId);
  if (!target) return;

  target.activeDivisions = target.activeDivisions.map(d => {
    if (d.id === divisionId) {
      return {
        ...d,
        reportingToId,
        reportingToName
      };
    }
    return d;
  });

  await saveStoredCompanies(companies);

  // Also sync this to the corresponding UserProfile of the DSA if present
  const updatedDiv = target.activeDivisions.find(d => d.id === divisionId);
  if (updatedDiv?.hasDedicatedAdmin && updatedDiv.divisionAdminId) {
    const profiles = getStoredUserProfiles();
    const idx = profiles.findIndex(p => p.id === updatedDiv.divisionAdminId);
    if (idx >= 0) {
      profiles[idx] = {
        ...profiles[idx],
        reportingToId,
        reportingToName
      };
      await saveStoredUserProfiles(profiles);
    }
  }
}

export async function removeCompanyDivision(companyId: string, divisionId: string) {
  const companies = getStoredCompanies();
  const target = companies.find(c => c.id === companyId);
  if (!target) throw new Error("Company not found");

  const removedDivision = target.activeDivisions.find(d => d.id === divisionId);
  target.activeDivisions = target.activeDivisions.filter(d => d.id !== divisionId);

  await saveStoredCompanies(companies);

  // If division had a dedicated admin, remove their user profile as well
  if (removedDivision?.hasDedicatedAdmin && removedDivision.divisionAdminId) {
    const profiles = getStoredUserProfiles();
    const filtered = profiles.filter(p => p.id !== removedDivision.divisionAdminId);
    await saveStoredUserProfiles(filtered);
  }

  // Notify listeners of company updates
  window.dispatchEvent(new CustomEvent('raxon-company-updated', { detail: { companyId } }));
}

export async function updateCompanyDivision(
  companyId: string,
  divisionId: string,
  data: Partial<CompanyDivision>
) {
  const companies = getStoredCompanies();
  const target = companies.find(c => c.id === companyId);
  if (!target) return;

  target.activeDivisions = target.activeDivisions.map(d => {
    if (d.id === divisionId) {
      return { ...d, ...data };
    }
    return d;
  });

  await saveStoredCompanies(companies);
  window.dispatchEvent(new CustomEvent('raxon-company-updated', { detail: { companyId } }));
}

export async function toggleDivisionStatus(companyId: string, divisionId: string) {
  const companies = getStoredCompanies();
  const target = companies.find(c => c.id === companyId);
  if (!target) return;

  target.activeDivisions = target.activeDivisions.map(d => {
    if (d.id === divisionId) {
      const nextStatus = d.status === 'Active' ? 'Inactive' : 'Active';
      return { ...d, status: nextStatus };
    }
    return d;
  });

  await saveStoredCompanies(companies);
  window.dispatchEvent(new CustomEvent('raxon-company-updated', { detail: { companyId } }));
}




