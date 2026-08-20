import { getActiveCompanyId } from './companyContext';
import { supabase } from '../supabaseClient';

export interface SampleInventoryItem {
  id: string;
  name: string;
  pack: string;
  category: string;
  totalQuota: number;
  issuedQty: number;
  availableStock: number;
  currentStock: number;
  unitCost: number;
  itemName?: string;
  itemType?: 'sample' | 'gift';
}

export interface GiftInventoryItem {
  id: string;
  name: string;
  type: string;
  totalQuota: number;
  issuedQty: number;
  availableStock: number;
  currentStock: number;
  unitCost: number;
  itemName?: string;
  itemType?: 'sample' | 'gift';
}

export interface SampleTransactionAudit {
  id: string;
  timestamp: string;
  doctorName: string;
  itemName: string;
  itemType: 'Sample' | 'Promo Input';
  quantity: number;
  remainingStockAfter: number;
  mrName: string;
}

export const RAXON_SAMPLE_INVENTORY: SampleInventoryItem[] = [];

export const DEFAULT_SAMPLE_INVENTORY = RAXON_SAMPLE_INVENTORY;

export const RAXON_GIFT_INVENTORY: GiftInventoryItem[] = [];

export const DEFAULT_GIFT_INVENTORY = RAXON_GIFT_INVENTORY;

export function getInitialSamplesForCompany(_companyId?: string): SampleInventoryItem[] {
  return [];
}

export function getInitialGiftsForCompany(_companyId?: string): GiftInventoryItem[] {
  return [];
}

function getSampleStorageKey(explicitCompanyId?: string) {
  return `raxon_sample_inventory_${explicitCompanyId || getActiveCompanyId()}`;
}

function getGiftStorageKey(explicitCompanyId?: string) {
  return `raxon_gift_inventory_${explicitCompanyId || getActiveCompanyId()}`;
}

function getAuditStorageKey(explicitCompanyId?: string) {
  return `raxon_sample_audit_logs_${explicitCompanyId || getActiveCompanyId()}`;
}

let isSampleInventoryFirestoreSyncInitialized = false;

export function initSampleInventoryFirestoreSync() {
  if (isSampleInventoryFirestoreSyncInitialized) return;
  isSampleInventoryFirestoreSyncInitialized = true;

  try {
    // Initial fetch from Supabase
    supabase.from('sample_inventory').select('*').then(({ data, error }) => {
      if (!error && data) {
        data.forEach((row: any) => {
          if (row.company_id) {
            if (Array.isArray(row.samples)) {
              localStorage.setItem(getSampleStorageKey(row.company_id), JSON.stringify(row.samples));
              window.dispatchEvent(new CustomEvent('raxon-sample-inventory-updated', { detail: { items: row.samples, companyId: row.company_id } }));
            }
            if (Array.isArray(row.gifts)) {
              localStorage.setItem(getGiftStorageKey(row.company_id), JSON.stringify(row.gifts));
              window.dispatchEvent(new CustomEvent('raxon-gift-inventory-updated', { detail: { items: row.gifts, companyId: row.company_id } }));
            }
          }
        });
      }
    });

    supabase.from('sample_audit_logs').select('*').then(({ data, error }) => {
      if (!error && data) {
        data.forEach((row: any) => {
          if (row.company_id && Array.isArray(row.audit_logs)) {
            localStorage.setItem(getAuditStorageKey(row.company_id), JSON.stringify(row.audit_logs));
            window.dispatchEvent(new CustomEvent('raxon-sample-audit-updated', { detail: { auditLogs: row.audit_logs, companyId: row.company_id } }));
          }
        });
      }
    });

    // Realtime subscriptions
    supabase
      .channel('public:sample_inventory_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sample_inventory' }, (payload) => {
        const row = payload.new as any;
        if (row && row.company_id) {
          if (Array.isArray(row.samples)) {
            localStorage.setItem(getSampleStorageKey(row.company_id), JSON.stringify(row.samples));
            window.dispatchEvent(new CustomEvent('raxon-sample-inventory-updated', { detail: { items: row.samples, companyId: row.company_id } }));
          }
          if (Array.isArray(row.gifts)) {
            localStorage.setItem(getGiftStorageKey(row.company_id), JSON.stringify(row.gifts));
            window.dispatchEvent(new CustomEvent('raxon-gift-inventory-updated', { detail: { items: row.gifts, companyId: row.company_id } }));
          }
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sample_audit_logs' }, (payload) => {
        const row = payload.new as any;
        if (row && row.company_id && Array.isArray(row.audit_logs)) {
          localStorage.setItem(getAuditStorageKey(row.company_id), JSON.stringify(row.audit_logs));
          window.dispatchEvent(new CustomEvent('raxon-sample-audit-updated', { detail: { auditLogs: row.audit_logs, companyId: row.company_id } }));
        }
      })
      .subscribe();

  } catch (e) {
    console.warn('Sample inventory Supabase sync init error:', e);
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => initSampleInventoryFirestoreSync(), 350);
}

export function getMRSampleInventory(mrId?: string, mrName?: string, explicitCompanyId?: string): SampleInventoryItem[] {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    const raw = localStorage.getItem(getSampleStorageKey(companyId));
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      return parsed.map((item: any) => ({
        ...item,
        currentStock: item.currentStock ?? item.availableStock ?? (item.totalQuota - item.issuedQty),
        itemName: item.itemName || item.name,
        itemType: 'sample'
      }));
    }
  } catch (e) {
    console.warn("Failed to load sample inventory:", e);
  }
  return getInitialSamplesForCompany(companyId);
}

export function saveMRSampleInventory(items: SampleInventoryItem[], explicitCompanyId?: string): void {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    localStorage.setItem(getSampleStorageKey(companyId), JSON.stringify(items));
    // Also sync the master catalog key used by PharmaMasters
    localStorage.setItem(`raxon_master_samples_${companyId}`, JSON.stringify(items.map((s, idx) => ({
      id: s.id || `SMP-${idx + 1}`,
      name: s.name,
      type: s.itemType === 'gift' ? 'Promotional Gift' : 'Physician Sample',
      product: s.name ? s.name.split(' ')[0] : 'Unknown',
      packQty: s.pack || 'Catch Cover 2s',
      mrQuota: `${s.totalQuota || 50} Units/mo`,
      stock: (s.availableStock || 50) * 10,
      unitCost: s.unitCost || 20,
      status: (s.availableStock || 0) > 10 ? 'In Stock' : 'Low Stock'
    }))));
    window.dispatchEvent(new CustomEvent('raxon-sample-inventory-updated', { detail: { items, companyId } }));

    // Sync to Supabase
    supabase.from('sample_inventory').upsert({
      company_id: companyId,
      samples: items,
      updated_at: new Date().toISOString()
    }).then(null, err => {
      console.warn(`Supabase sample inventory save error for ${companyId}:`, err);
    });
  } catch (e) {
    console.error("Failed to save sample inventory:", e);
  }
}

export function getMRGiftInventory(explicitCompanyId?: string): GiftInventoryItem[] {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    const raw = localStorage.getItem(getGiftStorageKey(companyId));
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      return parsed.map((item: any) => ({
        ...item,
        currentStock: item.currentStock ?? item.availableStock ?? (item.totalQuota - item.issuedQty),
        itemName: item.itemName || item.name,
        itemType: 'gift'
      }));
    }
  } catch (e) {
    console.warn("Failed to load gift inventory:", e);
  }
  return getInitialGiftsForCompany(companyId);
}

export function saveMRGiftInventory(items: GiftInventoryItem[], explicitCompanyId?: string): void {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    localStorage.setItem(getGiftStorageKey(companyId), JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('raxon-gift-inventory-updated', { detail: { items, companyId } }));

    // Sync to Supabase
    supabase.from('sample_inventory').upsert({
      company_id: companyId,
      gifts: items,
      updated_at: new Date().toISOString()
    }).then(null, err => {
      console.warn(`Supabase gift inventory save error for ${companyId}:`, err);
    });
  } catch (e) {
    console.error("Failed to save gift inventory:", e);
  }
}

export function getSampleAuditLogs(explicitCompanyId?: string): SampleTransactionAudit[] {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    const raw = localStorage.getItem(getAuditStorageKey(companyId));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load sample audit logs:", e);
  }
  return [];
}

export function deductDoctorCallInputs(
  arg1: any,
  arg2: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any
): { success: boolean; deductedSamples: number; deductedGifts: number } {
  // Support both (doctorName, samples, gifts, mrName) and (mrId, mrName, doctorId, doctorName, samples, gifts)
  let doctorName = 'Doctor';
  let samples: { sampleName: string; quantity: number }[] = [];
  let gifts: { giftName: string; quantity: number }[] = [];
  let mrName = 'Rajesh Kumar';

  if (typeof arg1 === 'string' && Array.isArray(arg2)) {
    doctorName = arg1;
    samples = arg2;
    gifts = Array.isArray(arg3) ? arg3 : [];
    mrName = typeof arg4 === 'string' ? arg4 : 'Rajesh Kumar';
  } else if (typeof arg4 === 'string' && Array.isArray(arg5)) {
    mrName = typeof arg2 === 'string' ? arg2 : 'Rajesh Kumar';
    doctorName = arg4;
    samples = arg5;
    gifts = Array.isArray(arg6) ? arg6 : [];
  }

  let sampleInventory = getMRSampleInventory();
  let giftInventory = getMRGiftInventory();
  let auditLogs = getSampleAuditLogs();
  const now = new Date().toISOString();

  let deductedSamples = 0;
  let deductedGifts = 0;

  // Deduct samples
  samples.forEach(s => {
    if (s.quantity > 0) {
      const idx = sampleInventory.findIndex(item => item.name === s.sampleName || item.id === s.sampleName || item.itemName === s.sampleName);
      if (idx !== -1) {
        const item = sampleInventory[idx];
        const qtyToDeduct = Math.min(item.availableStock || item.currentStock, s.quantity);
        item.issuedQty += qtyToDeduct;
        item.availableStock = Math.max(0, item.totalQuota - item.issuedQty);
        item.currentStock = item.availableStock;
        deductedSamples += qtyToDeduct;

        auditLogs.unshift({
          id: `AUD-SMP-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: now,
          doctorName,
          itemName: item.name,
          itemType: 'Sample',
          quantity: qtyToDeduct,
          remainingStockAfter: item.availableStock,
          mrName
        });
      }
    }
  });

  // Deduct gifts
  gifts.forEach(g => {
    if (g.quantity > 0) {
      const idx = giftInventory.findIndex(item => item.name === g.giftName || item.id === g.giftName || item.itemName === g.giftName);
      if (idx !== -1) {
        const item = giftInventory[idx];
        const qtyToDeduct = Math.min(item.availableStock || item.currentStock, g.quantity);
        item.issuedQty += qtyToDeduct;
        item.availableStock = Math.max(0, item.totalQuota - item.issuedQty);
        item.currentStock = item.availableStock;
        deductedGifts += qtyToDeduct;

        auditLogs.unshift({
          id: `AUD-GFT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: now,
          doctorName,
          itemName: item.name,
          itemType: 'Promo Input',
          quantity: qtyToDeduct,
          remainingStockAfter: item.availableStock,
          mrName
        });
      }
    }
  });

  saveMRSampleInventory(sampleInventory);
  saveMRGiftInventory(giftInventory);
  try {
    localStorage.setItem(getAuditStorageKey(), JSON.stringify(auditLogs.slice(0, 100)));
  } catch (e) {
    console.error("Failed to save sample audit log:", e);
  }

  return { success: true, deductedSamples, deductedGifts };
}
