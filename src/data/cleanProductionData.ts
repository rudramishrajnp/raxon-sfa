import { saveProductsCatalog, saveDoctorsList, saveChemistsList, saveStockistsList } from './masterData';
import { saveMRSampleInventory, saveMRGiftInventory } from './sampleInventory';
import { getActiveCompanyId, getStoredCompanies } from './companyContext';
import { getStoredUserProfiles, saveStoredUserProfiles, normalizeRole } from './userContext';
import { savePOBApprovalRequests } from './pobApprovals';

/**
 * Wipes out all mock / sample data from the application state & localStorage
 * for the current company so the user can upload genuine real-world records.
 */
export function clearAllCompanyMockData(explicitCompanyId?: string) {
  const companyId = explicitCompanyId || getActiveCompanyId();

  // 1. Clear Master Tables to Empty Arrays
  saveProductsCatalog([], companyId);
  saveDoctorsList([], companyId);
  saveChemistsList([], companyId);
  saveStockistsList([], companyId);
  saveMRSampleInventory([], companyId);
  saveMRGiftInventory([], companyId);
  savePOBApprovalRequests([], companyId);

  // 2. Clear Territories, Areas, Custom HQs, and all module keys to empty arrays
  try {
    const emptyKeys = [
      `raxon_areas_${companyId}`,
      `raxon_custom_hqs_${companyId}`,
      `raxon_master_products_${companyId}`,
      `raxon_master_doctors_${companyId}`,
      `raxon_master_chemists_${companyId}`,
      `raxon_master_stockists_${companyId}`,
      `raxon_master_samples_${companyId}`,
      `raxon_sample_inventory_${companyId}`,
      `raxon_gift_inventory_${companyId}`,
      `raxon_sample_audit_logs_${companyId}`,
      `raxon_sample_master_${companyId}`,
      `raxon_sample_allotments_${companyId}`,
      `raxon_pob_requests_${companyId}`,
      `raxon_expense_claims_${companyId}`,
      `raxon_expense_policy_${companyId}`,
      `raxon_targets_${companyId}`,
      `raxon_field_allocations_${companyId}`,
      `raxon_rcpa_${companyId}`,
      `raxon_broadcasts_${companyId}`,
      `raxon_audit_logs_${companyId}`,
      `raxon_audit_trail_${companyId}`,
      `raxon_doctors_master_${companyId}`,
      `raxon_chemists_master_${companyId}`,
      `raxon_stockists_master_${companyId}`,
      `raxon_products_catalog_${companyId}`
    ];
    emptyKeys.forEach(k => localStorage.setItem(k, JSON.stringify([])));
  } catch (e) {
    console.error("Error clearing master and module keys in localStorage:", e);
  }

  // 3. Clean Field Force Profiles: Retain only Company Admins for this tenant, purge mock field MRs/Managers
  try {
    const allProfiles = getStoredUserProfiles();
    const companies = getStoredCompanies();
    const targetComp = companies.find(c => c.id === companyId);
    const validAdminIds = new Set((targetComp?.companyAdmins || []).map(a => a.id.toLowerCase()));

    const cleanedProfiles = allProfiles.filter(p => {
      // Keep other companies untouched
      if (p.companyId && p.companyId !== companyId) return true;
      if (normalizeRole(p.role) === 'SUPER_ADMIN') return true;
      // For this company, keep only active company admin account
      if (normalizeRole(p.role) === 'ADMIN' || validAdminIds.has(p.id.toLowerCase())) return true;
      return false; // Remove mock MR, AM, RM, ZM profiles
    });
    saveStoredUserProfiles(cleanedProfiles);

    // Update users master list for this company to only include admins
    const remainingCompUsers = cleanedProfiles.filter(p => p.companyId === companyId).map(u => ({
      id: u.id,
      name: u.name,
      role: u.roleTitle || u.role,
      email: u.email,
      phone: u.phone,
      hq: u.hq || 'Head Office',
      status: u.status || 'Active',
      lastActive: 'Active Admin',
      reportingToId: u.reportingToId,
      reportingToName: u.reportingToName
    }));
    localStorage.setItem(`raxon_users_master_${companyId}`, JSON.stringify(remainingCompUsers));
  } catch (e) {
    console.error("Error cleaning user profiles for company:", e);
  }

  // 4. Clear MTP Plans, Daily Calls, and transactional keys to empty arrays instead of removing them
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('raxon_mtp_') ||
        key.startsWith('raxon_manager_mtp_') ||
        key.startsWith('raxon_dcr_') ||
        key.startsWith('raxon_rcpa_') ||
        key.startsWith('raxon_stockist_ledger_') ||
        key.startsWith('raxon_sample_tx_') ||
        key.startsWith('raxon_expense_') ||
        key.startsWith('raxon_target_') ||
        key.startsWith('raxon_pob_')
      )) {
        if (!explicitCompanyId || key.includes(companyId) || !key.includes('CMP-')) {
          localStorage.setItem(key, JSON.stringify([]));
        }
      }
    }
  } catch (e) {
    console.error("Error clearing transactional keys:", e);
  }

  // 5. Dispatch real-time events across all open components
  window.dispatchEvent(new CustomEvent('raxon-products-updated', { detail: { products: [], companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-doctors-updated', { detail: { doctors: [], companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-chemists-updated', { detail: { chemists: [], companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-stockists-updated', { detail: { stockists: [], companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-sample-inventory-updated', { detail: { items: [], companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-areas-updated', { detail: { companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-users-updated', { detail: { companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-company-updated', { detail: { companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-mtp-updated', { detail: { companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-dcr-updated', { detail: { companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-rcpa-updated', { detail: { companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-targets-updated', { detail: { companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-expenses-updated', { detail: { companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-pob-updated', { detail: { companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-broadcasts-updated', { detail: { companyId } }));
  window.dispatchEvent(new CustomEvent('raxon-audit-updated', { detail: { companyId } }));
}

