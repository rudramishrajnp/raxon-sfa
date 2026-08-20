import { supabase } from '../supabaseClient';
import { getStoredCompanies, saveStoredCompanies, Company, getDeletedCompanyIds } from '../data/companyContext';
import { getStoredUserProfiles, saveStoredUserProfiles, UserProfile } from '../data/userContext';
import { getProductsCatalog, getDoctorsList, getChemistsList, getStockistsList } from '../data/masterData';
import { getAllHeadquarters } from '../data/hqMrMapping';
import { getMRSampleInventory, getMRGiftInventory, getSampleAuditLogs } from '../data/sampleInventory';
import { getAllPOBApprovalRequests } from '../data/pobApprovals';

export interface SyncStatus {
  message: string;
  phase: 'idle' | 'reading' | 'uploading' | 'downloading' | 'completed' | 'error';
  companiesCount: number;
  usersCount: number;
  productsCount: number;
  error?: string;
}

export type SyncProgressCallback = (status: SyncStatus) => void;

let isSyncRunning = false;

/**
 * Reads all locally stored companies, user profiles, passwords, product catalogs,
 * doctors, chemists, stockists, headquarters, territories, samples, and tenant configurations
 * and uploads them directly to Supabase.
 */
export async function syncAllLocalDataToFirestore(onProgress?: SyncProgressCallback): Promise<{
  success: boolean;
  companiesCount: number;
  usersCount: number;
  productsCount: number;
  message: string;
}> {
  if (isSyncRunning) {
    return {
      success: true,
      companiesCount: 0,
      usersCount: 0,
      productsCount: 0,
      message: 'Sync is already running.'
    };
  }

  isSyncRunning = true;

  const report = (phase: SyncStatus['phase'], message: string, companiesCount = 0, usersCount = 0, productsCount = 0, error?: string) => {
    if (onProgress) {
      onProgress({ message, phase, companiesCount, usersCount, productsCount, error });
    }
  };

  try {
    report('reading', 'Reading local data from storage...', 0, 0, 0);

    // 1. Read all local companies
    const localCompanies: Company[] = getStoredCompanies();
    const deletedIds = new Set(getDeletedCompanyIds());
    const validCompanies = localCompanies.filter(c => c && c.id && !deletedIds.has(c.id));

    // 2. Read all local user profiles and company admins
    const localProfiles: UserProfile[] = getStoredUserProfiles();
    const userMap = new Map<string, UserProfile>();

    // Add existing user profiles
    localProfiles.forEach(p => {
      if (p && p.id) {
        userMap.set(p.id.toLowerCase(), p);
      }
    });

    // Ensure company admins from all companies are represented
    validCompanies.forEach(comp => {
      if (Array.isArray(comp.companyAdmins)) {
        comp.companyAdmins.forEach(adm => {
          if (adm && adm.id) {
            const adminKey = adm.id.toLowerCase();
            if (!userMap.has(adminKey)) {
              const initials = (adm.name || 'Admin')
                .split(' ')
                .filter(Boolean)
                .map(n => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'CA';

              userMap.set(adminKey, {
                id: adm.id,
                name: adm.name,
                email: adm.email,
                phone: adm.phone || '+91 98000 00000',
                role: 'ADMIN',
                roleTitle: 'ADMIN',
                companyId: comp.id,
                companyName: comp.name,
                status: 'Active',
                hq: `${comp.name} Corporate Office`,
                territory: 'National / All Divisions Field Network',
                initials: initials,
                avatarBg: 'bg-purple-900',
                teamSize: comp.plan?.maxTotalUsers || 50,
                metrics: {}
              });
            }
          }
        });
      }
    });

    const allProfiles = Array.from(userMap.values());

    report(
      'uploading',
      `Syncing local data to Supabase (${validCompanies.length} companies, ${allProfiles.length} users)...`,
      validCompanies.length,
      allProfiles.length,
      0
    );

    // 4. Batch/Parallel upload companies and master data to Supabase
    let totalProductsUploaded = 0;
    const companyPromises = validCompanies.map(async (comp) => {
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

        // Upload master data for this company
        try {
          const prods = getProductsCatalog(comp.id);
          if (prods && prods.length > 0) {
            totalProductsUploaded += prods.length;
            await supabase.from('master_products').upsert({
              company_id: comp.id,
              products: JSON.parse(JSON.stringify(prods)),
              updated_at: new Date().toISOString()
            });
          }

          const docs = getDoctorsList(comp.id);
          if (docs && docs.length > 0) {
            await supabase.from('master_doctors').upsert({
              company_id: comp.id,
              doctors: JSON.parse(JSON.stringify(docs)),
              updated_at: new Date().toISOString()
            });
          }

          const chemists = getChemistsList(comp.id);
          if (chemists && chemists.length > 0) {
            await supabase.from('master_chemists').upsert({
              company_id: comp.id,
              chemists: JSON.parse(JSON.stringify(chemists)),
              updated_at: new Date().toISOString()
            });
          }

          const stockists = getStockistsList(comp.id);
          if (stockists && stockists.length > 0) {
            await supabase.from('master_stockists').upsert({
              company_id: comp.id,
              stockists: JSON.parse(JSON.stringify(stockists)),
              updated_at: new Date().toISOString()
            });
          }

          // Headquarters & Territories
          const hqs = getAllHeadquarters(comp.id);
          if (hqs && hqs.length > 0) {
            await supabase.from('headquarters').upsert({
              company_id: comp.id,
              headquarters: JSON.parse(JSON.stringify(hqs)),
              updated_at: new Date().toISOString()
            });
          }

          const rawAreas = localStorage.getItem(`raxon_areas_${comp.id}`);
          if (rawAreas) {
            await supabase.from('territories').upsert({
              company_id: comp.id,
              areas: JSON.parse(rawAreas),
              updated_at: new Date().toISOString()
            });
          }

          // Samples & Gifts
          const samples = getMRSampleInventory(undefined, undefined, comp.id);
          const gifts = getMRGiftInventory(comp.id);
          if (samples.length > 0 || gifts.length > 0) {
            await supabase.from('sample_inventory').upsert({
              company_id: comp.id,
              samples: JSON.parse(JSON.stringify(samples)),
              gifts: JSON.parse(JSON.stringify(gifts)),
              updated_at: new Date().toISOString()
            });
          }

          const auditLogs = getSampleAuditLogs(comp.id);
          if (auditLogs && auditLogs.length > 0) {
            await supabase.from('sample_audit_logs').upsert({
              company_id: comp.id,
              audit_logs: JSON.parse(JSON.stringify(auditLogs.slice(0, 100))),
              updated_at: new Date().toISOString()
            });
          }

          // Expense policies and claims
          const rawPolicy = localStorage.getItem(`raxon_expense_policy_${comp.id}`);
          if (rawPolicy) {
            await supabase.from('expense_policies').upsert({
              company_id: comp.id,
              policies: JSON.parse(rawPolicy),
              updated_at: new Date().toISOString()
            });
          }

          const rawClaims = localStorage.getItem(`raxon_expense_claims_${comp.id}`);
          if (rawClaims) {
            await supabase.from('expense_claims').upsert({
              company_id: comp.id,
              claims: JSON.parse(rawClaims),
              updated_at: new Date().toISOString()
            });
          }

          // POB Schemes
          const pobRequests = getAllPOBApprovalRequests(comp.id);
          if (pobRequests && pobRequests.length > 0) {
            await supabase.from('pob_approvals').upsert({
              company_id: comp.id,
              requests: JSON.parse(JSON.stringify(pobRequests)),
              updated_at: new Date().toISOString()
            });
          }

          // Company Employees
          const rawEmployees = localStorage.getItem(`raxon_users_master_${comp.id}`);
          if (rawEmployees) {
            await supabase.from('company_employees').upsert({
              company_id: comp.id,
              employees: JSON.parse(rawEmployees),
              updated_at: new Date().toISOString()
            });
          }
        } catch (masterErr) {
          console.warn(`Master data sync notice for ${comp.id}:`, masterErr);
        }
      } catch (err) {
        console.warn(`Company upload error for ${comp.id}:`, err);
      }
    });

    // 5. Upload user profiles to Supabase 'user_profiles'
    const profilePromises = allProfiles.map(async (profile) => {
      if (!profile || !profile.id) return;
      try {
        const sanitizedProfile = JSON.parse(JSON.stringify(profile));
        delete sanitizedProfile.password;
        await supabase.from('user_profiles').upsert({
          id: profile.id,
          company_id: profile.companyId || '',
          role: profile.role || 'MR',
          email: profile.email || '',
          name: profile.name || '',
          phone: profile.phone || '',
          status: profile.status || 'Active',
          data: sanitizedProfile,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn(`User profile upload error for ${profile.id}:`, err);
      }
    });

    // Wait for upload promises with non-blocking resilience
    await Promise.allSettled([...companyPromises, ...profilePromises]);

    report('downloading', 'Merging latest cloud data with local store...', validCompanies.length, allProfiles.length, totalProductsUploaded);

    // 7. Pull any existing remote companies from Supabase to merge with local state
    try {
      const [remoteCompsRes, remoteProfilesRes] = await Promise.allSettled([
        supabase.from('companies').select('*'),
        supabase.from('user_profiles').select('*')
      ]);

      if (remoteCompsRes.status === 'fulfilled' && remoteCompsRes.value.data) {
        const remoteCompanies: Company[] = remoteCompsRes.value.data
          .map((row: any) => (row.data ? { ...row.data, id: row.id } : row) as Company)
          .filter(c => c && c.id && !deletedIds.has(c.id));

        if (remoteCompanies.length > 0) {
          const mergedCompsMap = new Map<string, Company>();
          validCompanies.forEach(c => mergedCompsMap.set(c.id, c));
          remoteCompanies.forEach(c => mergedCompsMap.set(c.id, { ...mergedCompsMap.get(c.id), ...c }));
          const finalComps = Array.from(mergedCompsMap.values());
          saveStoredCompanies(finalComps);
        }
      }

      if (remoteProfilesRes.status === 'fulfilled' && remoteProfilesRes.value.data) {
        const remoteProfiles: UserProfile[] = remoteProfilesRes.value.data
          .map((row: any) => (row.data ? { ...row.data, id: row.id } : row) as UserProfile)
          .filter(p => p && p.id);

        if (remoteProfiles.length > 0) {
          const mergedProfilesMap = new Map<string, UserProfile>();
          allProfiles.forEach(p => mergedProfilesMap.set(p.id, p));
          remoteProfiles.forEach(p => mergedProfilesMap.set(p.id, { ...mergedProfilesMap.get(p.id), ...p }));
          const finalProfiles = Array.from(mergedProfilesMap.values());
          saveStoredUserProfiles(finalProfiles);
        }
      }
    } catch (pullErr) {
      console.warn("Pulling remote data error:", pullErr);
    }

    report('completed', 'Data successfully synced to Cloud (Supabase)!', validCompanies.length, allProfiles.length, totalProductsUploaded);

    return {
      success: true,
      companiesCount: validCompanies.length,
      usersCount: allProfiles.length,
      productsCount: totalProductsUploaded,
      message: 'Data successfully synced to Cloud (Supabase)!'
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Sync failed due to a network or configuration issue.';
    report('error', `Sync failed: ${errorMsg}`, 0, 0, 0, errorMsg);
    return {
      success: false,
      companiesCount: 0,
      usersCount: 0,
      productsCount: 0,
      message: errorMsg
    };
  } finally {
    isSyncRunning = false;
  }
}
