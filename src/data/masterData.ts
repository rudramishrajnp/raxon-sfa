import { getActiveCompanyId } from './companyContext';
import { getLoggedInUser, normalizeRole } from './userContext';
import { supabase } from '../supabaseClient';

export function filterByLoggedInUserDivision<T extends { division?: string; divisionId?: string; divisionName?: string }>(records: T[]): T[] {
  const user = getLoggedInUser();
  if (!user) return records;

  const role = normalizeRole(user.role);
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return records;
  }

  const userDivId = user.divisionId;
  const userDivName = user.divisionName;
  if (!userDivId && !userDivName) return records;

  const userDivIdUpper = (userDivId || '').toUpperCase();
  const userDivNameUpper = (userDivName || '').toUpperCase();

  return records.filter(item => {
    const itemDivId = (item.divisionId || '').toUpperCase();
    const itemDivName = (item.division || item.divisionName || '').toUpperCase();

    // If the record has no division fields specified, let it pass so it doesn't break general records
    if (!itemDivId && !itemDivName) return true;

    const matchesId = !!(itemDivId && userDivIdUpper && itemDivId === userDivIdUpper);
    const matchesName = !!(itemDivName && userDivNameUpper && (
      itemDivName === userDivNameUpper ||
      itemDivName.includes(userDivNameUpper) ||
      userDivNameUpper.includes(itemDivName)
    ));

    return matchesId || matchesName;
  });
}

export interface Doctor {
  id: number;
  name: string;
  hq?: string;
  area: string;
  subArea: string;
  specialty: string;
  address?: string;
  phone?: string;
  qualification?: string;
  lat?: number;
  lng?: number;
  division?: string;
}

export interface Chemist {
  id: number;
  name: string;
  hq?: string;
  area: string;
  subArea: string;
  contactPerson: string;
  address?: string;
  phone?: string;
  dlNumber?: string;
  gstNumber?: string;
  stockist?: string;
  lat?: number;
  lng?: number;
  division?: string;
}

// Haversine formula to calculate distance in meters between two lat/lng points
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export interface Stockist {
  id: number | string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  dlNumber: string;
  gstNumber: string;
  address: string;
  area: string;
  district: string;
  hq: string;
  creditDays: string;
  creditLimit: string;
  outstandingValue: number | string;
  status: 'Active' | 'Inactive';
  division?: string;
}

export interface StockLedgerBrandItem {
  brandId: string;
  brandName: string;
  pack: string;
  pts: number;
  ptr: number;
  mrp: number;
  unitRate: number; // Guaranteed alias of pts
  openingQty: number;
  purchaseQty: number;
  saleQty: number;
  closingQty: number; // opening + purchase - sale
  openingValue: number; // openingQty * pts
  purchaseValue: number; // purchaseQty * pts
  saleValue: number; // saleQty * pts
  closingValue: number; // closingQty * pts
}

export interface StockistMonthlyLedger {
  stockistId: number | string;
  stockistName?: string;
  monthYear: string; // 'yyyy-MM'
  items: StockLedgerBrandItem[];
  totalOpeningValue: number;
  totalPurchaseValue: number;
  totalSaleValue: number;
  totalClosingValue: number;
  totals: {
    openingValue: number;
    purchaseValue: number;
    saleValue: number;
    closingValue: number;
  };
  updatedAt: string;
}

export interface ProductMasterItem {
  id: string;
  name: string;
  composition: string;
  division: string;
  category: 'Tablet' | 'Capsule' | 'Syrup' | 'Injectable' | 'Ointment' | 'Lotion' | 'Drops';
  pack: string;
  mrp: number;
  ptr: number;
  pts: number;
  scheme: string; // e.g. "10 + 1 Free"
  gst: string;
  indications: string;
  status: 'Active' | 'Inactive';
}

export const RAXON_AREAS: string[] = [];

export function getCompanyAreas(companyId?: string): string[] {
  try {
    const customHqRaw = localStorage.getItem(`raxon_custom_hqs_${companyId || getActiveCompanyId()}`);
    if (customHqRaw) {
      const hqs = JSON.parse(customHqRaw);
      const patches: string[] = [];
      hqs.forEach((h: any) => {
        if (Array.isArray(h.patches)) {
          patches.push(...h.patches);
        }
      });
      if (patches.length > 0) return patches;
    }
  } catch (e) {}
  return RAXON_AREAS;
}

export const AREAS = getCompanyAreas();

// -------------------------------------------------------------
// 1. DOCTOR DATASETS PER COMPANY
// -------------------------------------------------------------
export const RAXON_DOCTORS: Doctor[] = [];

export const INITIAL_DOCTORS: Doctor[] = RAXON_DOCTORS;

// -------------------------------------------------------------
// 2. CHEMIST DATASETS PER COMPANY
// -------------------------------------------------------------
export const RAXON_CHEMISTS: Chemist[] = [];

export const INITIAL_CHEMISTS: Chemist[] = RAXON_CHEMISTS;

// -------------------------------------------------------------
// 3. STOCKIST DATASETS PER COMPANY
// -------------------------------------------------------------
export const RAXON_STOCKISTS: Stockist[] = [];

export const INITIAL_STOCKISTS: Stockist[] = RAXON_STOCKISTS;

// -------------------------------------------------------------
// 4. PRODUCT CATALOG DATASETS PER COMPANY
// (Product ID prefix: 'PRD-RAX')
// -------------------------------------------------------------
export const RAXON_PRODUCTS: ProductMasterItem[] = [];

export const INITIAL_PRODUCTS_CATALOG: ProductMasterItem[] = RAXON_PRODUCTS;

// -------------------------------------------------------------
// Factory Functions returning company-specific initial datasets
// -------------------------------------------------------------
export function getInitialDoctorsForCompany(companyId?: string): Doctor[] {
  return [];
}

export function getInitialChemistsForCompany(companyId?: string): Chemist[] {
  return [];
}

export function getInitialStockistsForCompany(companyId?: string): Stockist[] {
  return [];
}

export function getInitialProductsForCompany(companyId?: string): ProductMasterItem[] {
  return [];
}

// Helper functions with localStorage persistence
export const getDoctorsList = (explicitCompanyId?: string): Doctor[] => {
  const companyId = explicitCompanyId || getActiveCompanyId();
  let list: Doctor[] = [];
  try {
    const saved = localStorage.getItem(`raxon_doctors_master_${companyId}`);
    if (saved !== null) {
      list = JSON.parse(saved);
    } else {
      list = getInitialDoctorsForCompany(companyId);
    }
  } catch (e) {
    console.warn("Doctors master read error:", e);
    list = getInitialDoctorsForCompany(companyId);
  }
  return filterByLoggedInUserDivision(list);
};

let isMasterDataFirestoreSyncInitialized = false;

export function initMasterDataFirestoreSync() {
  if (isMasterDataFirestoreSyncInitialized) return;
  isMasterDataFirestoreSyncInitialized = true;

  try {
    // Initial fetch from Supabase
    supabase.from('master_doctors').select('*').then(({ data, error }) => {
      if (!error && data) {
        data.forEach((row: any) => {
          if (row.company_id && Array.isArray(row.doctors)) {
            localStorage.setItem(`raxon_doctors_master_${row.company_id}`, JSON.stringify(row.doctors));
            window.dispatchEvent(new CustomEvent('raxon-doctors-updated', { detail: { doctors: row.doctors, companyId: row.company_id } }));
          }
        });
      }
    });

    supabase.from('master_chemists').select('*').then(({ data, error }) => {
      if (!error && data) {
        data.forEach((row: any) => {
          if (row.company_id && Array.isArray(row.chemists)) {
            localStorage.setItem(`raxon_chemists_master_${row.company_id}`, JSON.stringify(row.chemists));
            window.dispatchEvent(new CustomEvent('raxon-chemists-updated', { detail: { chemists: row.chemists, companyId: row.company_id } }));
          }
        });
      }
    });

    supabase.from('master_stockists').select('*').then(({ data, error }) => {
      if (!error && data) {
        data.forEach((row: any) => {
          if (row.company_id && Array.isArray(row.stockists)) {
            localStorage.setItem(`raxon_stockists_master_${row.company_id}`, JSON.stringify(row.stockists));
            window.dispatchEvent(new CustomEvent('raxon-stockists-updated', { detail: { stockists: row.stockists, companyId: row.company_id } }));
          }
        });
      }
    });

    supabase.from('master_products').select('*').then(({ data, error }) => {
      if (!error && data) {
        data.forEach((row: any) => {
          if (row.company_id && Array.isArray(row.products)) {
            localStorage.setItem(`raxon_products_catalog_${row.company_id}`, JSON.stringify(row.products));
            window.dispatchEvent(new CustomEvent('raxon-products-updated', { detail: { products: row.products, companyId: row.company_id } }));
          }
        });
      }
    });

    // Realtime Subscriptions
    supabase
      .channel('public:master_data')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'master_doctors' }, (payload) => {
        const row = payload.new as any;
        if (row && row.company_id && Array.isArray(row.doctors)) {
          localStorage.setItem(`raxon_doctors_master_${row.company_id}`, JSON.stringify(row.doctors));
          window.dispatchEvent(new CustomEvent('raxon-doctors-updated', { detail: { doctors: row.doctors, companyId: row.company_id } }));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'master_chemists' }, (payload) => {
        const row = payload.new as any;
        if (row && row.company_id && Array.isArray(row.chemists)) {
          localStorage.setItem(`raxon_chemists_master_${row.company_id}`, JSON.stringify(row.chemists));
          window.dispatchEvent(new CustomEvent('raxon-chemists-updated', { detail: { chemists: row.chemists, companyId: row.company_id } }));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'master_stockists' }, (payload) => {
        const row = payload.new as any;
        if (row && row.company_id && Array.isArray(row.stockists)) {
          localStorage.setItem(`raxon_stockists_master_${row.company_id}`, JSON.stringify(row.stockists));
          window.dispatchEvent(new CustomEvent('raxon-stockists-updated', { detail: { stockists: row.stockists, companyId: row.company_id } }));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'master_products' }, (payload) => {
        const row = payload.new as any;
        if (row && row.company_id && Array.isArray(row.products)) {
          localStorage.setItem(`raxon_products_catalog_${row.company_id}`, JSON.stringify(row.products));
          window.dispatchEvent(new CustomEvent('raxon-products-updated', { detail: { products: row.products, companyId: row.company_id } }));
        }
      })
      .subscribe();

  } catch (err) {
    console.warn('Supabase masterData init error:', err);
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => initMasterDataFirestoreSync(), 250);
}

export const saveDoctorsList = (doctors: Doctor[], explicitCompanyId?: string) => {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    localStorage.setItem(`raxon_doctors_master_${companyId}`, JSON.stringify(doctors));
    // Also sync the master catalog key used by PharmaMasters
    localStorage.setItem(`raxon_master_doctors_${companyId}`, JSON.stringify(doctors.map((d, idx) => {
      const dIdStr = String(d.id || '');
      return {
        id: dIdStr.startsWith('DOC-') ? dIdStr : `DOC-${d.id || idx + 101}`,
        name: d.name,
        mciNo: `MCI-${idx + 32100}`,
        specialty: d.specialty || 'General Physician',
        class: 'Core (A+)',
        division: d.division || 'General Medicine',
        hq: d.hq || '',
        patch: d.area,
        hospital: d.address || `${d.area} Clinic`,
        phone: d.phone || '+91 98000 12345',
        visitFreq: 'Weekly (4/mo)',
        status: 'Active'
      };
    })));
    window.dispatchEvent(new CustomEvent('raxon-doctors-updated', { detail: { doctors, companyId } }));

    // Sync to Supabase Database
    supabase.from('master_doctors').upsert({
      company_id: companyId,
      doctors: doctors,
      updated_at: new Date().toISOString()
    }).then(null, err => {
      console.warn(`Supabase doctors cloud save error for ${companyId}:`, err);
    });
  } catch (e) {
    console.error("Doctors master save error:", e);
  }
};

export const getChemistsList = (explicitCompanyId?: string): Chemist[] => {
  const companyId = explicitCompanyId || getActiveCompanyId();
  let list: Chemist[] = [];
  try {
    const saved = localStorage.getItem(`raxon_chemists_master_${companyId}`);
    if (saved !== null) {
      list = JSON.parse(saved);
    } else {
      list = getInitialChemistsForCompany(companyId);
    }
  } catch (e) {
    console.warn("Chemists master read error:", e);
    list = getInitialChemistsForCompany(companyId);
  }
  return filterByLoggedInUserDivision(list);
};

export const saveChemistsList = (chemists: Chemist[], explicitCompanyId?: string) => {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    localStorage.setItem(`raxon_chemists_master_${companyId}`, JSON.stringify(chemists));
    // Also sync the master catalog key used by PharmaMasters
    localStorage.setItem(`raxon_master_chemists_${companyId}`, JSON.stringify(chemists.map((c, idx) => {
      const cIdStr = String(c.id || '');
      return {
        id: cIdStr.startsWith('CHM-') ? cIdStr : `CHM-${c.id || idx + 101}`,
        name: c.name,
        contactPerson: c.contactPerson || 'Proprietor',
        dlNo: c.dlNumber || `DL-${idx + 1000}`,
        gstin: c.gstNumber || `09AAAPL${idx + 1000}Z1`,
        hq: c.hq || '',
        patch: c.area,
        attachedDocs: 'Key Territory Doctors',
        stockist: c.stockist || 'Authorized Super Stockist',
        status: 'Active'
      };
    })));
    window.dispatchEvent(new CustomEvent('raxon-chemists-updated', { detail: { chemists, companyId } }));

    // Sync to Supabase Database
    supabase.from('master_chemists').upsert({
      company_id: companyId,
      chemists: chemists,
      updated_at: new Date().toISOString()
    }).then(null, err => {
      console.warn(`Supabase chemists cloud save error for ${companyId}:`, err);
    });
  } catch (e) {
    console.error("Chemists master save error:", e);
  }
};

export const getStockistsList = (explicitCompanyId?: string): Stockist[] => {
  const companyId = explicitCompanyId || getActiveCompanyId();
  let list: Stockist[] = [];
  try {
    const saved = localStorage.getItem(`raxon_stockists_master_${companyId}`);
    if (saved !== null) {
      list = JSON.parse(saved);
    } else {
      list = getInitialStockistsForCompany(companyId);
    }
  } catch (e) {
    console.warn("Stockists master read error:", e);
    list = getInitialStockistsForCompany(companyId);
  }
  return filterByLoggedInUserDivision(list);
};

export const saveStockistsList = (stockists: Stockist[], explicitCompanyId?: string) => {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    localStorage.setItem(`raxon_stockists_master_${companyId}`, JSON.stringify(stockists));
    // Also sync the master catalog key used by PharmaMasters
    localStorage.setItem(`raxon_master_stockists_${companyId}`, JSON.stringify(stockists.map((s, idx) => ({
      id: typeof s.id === 'string' && s.id.startsWith('STK-') ? s.id : `STK-${s.id || idx + 1}`,
      agencyName: s.name,
      hq: s.hq || '',
      contactPerson: s.contactPerson || 'Authorized Partner',
      dlNo: s.dlNumber || `DL-${idx + 5000}`,
      gstin: s.gstNumber || `09AAACS${idx + 5000}Z1`,
      district: s.district || s.area || 'Central District',
      phone: s.phone || '+91 98111 22233',
      creditLimit: s.creditLimit ? `₹${s.creditLimit}` : '₹15,00,000',
      creditDays: s.creditDays ? `${s.creditDays} Days` : '30 Days',
      divisions: 'All Active Divisions',
      status: s.status || 'Active'
    }))));
    window.dispatchEvent(new CustomEvent('raxon-stockists-updated', { detail: { stockists, companyId } }));

    // Sync to Supabase Database
    supabase.from('master_stockists').upsert({
      company_id: companyId,
      stockists: stockists,
      updated_at: new Date().toISOString()
    }).then(null, err => {
      console.warn(`Supabase stockists cloud save error for ${companyId}:`, err);
    });
  } catch (e) {
    console.error("Stockists master save error:", e);
  }
};

export const getProductsCatalog = (explicitCompanyId?: string): ProductMasterItem[] => {
  const companyId = explicitCompanyId || getActiveCompanyId();
  let list: ProductMasterItem[] = [];
  try {
    const saved = localStorage.getItem(`raxon_products_catalog_${companyId}`);
    if (saved !== null) {
      list = JSON.parse(saved);
    } else {
      list = getInitialProductsForCompany(companyId);
    }
  } catch (e) {
    console.warn("Products catalog read error:", e);
    list = getInitialProductsForCompany(companyId);
  }
  return filterByLoggedInUserDivision(list);
};

export const getProductsList = getProductsCatalog;

export const saveProductsCatalog = (products: ProductMasterItem[], explicitCompanyId?: string) => {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    localStorage.setItem(`raxon_products_catalog_${companyId}`, JSON.stringify(products));
    // Also sync the master catalog key used by PharmaMasters
    localStorage.setItem(`raxon_master_products_${companyId}`, JSON.stringify(products.map((p, idx) => ({
      id: p.id || `PRD-${idx + 1}`,
      name: p.name,
      composition: p.composition || `${p.name} Standard formulation`,
      division: p.division || 'General Medicine',
      category: p.category || 'Tablet',
      pack: p.pack || '10x10 Strip',
      pts: p.pts || 100,
      ptr: p.ptr || 120,
      mrp: p.mrp || 160,
      gst: p.gst || '12%',
      status: p.status || 'Active'
    }))));
    window.dispatchEvent(new CustomEvent('raxon-products-updated', { detail: { products, companyId } }));

    // Sync to Supabase Database
    supabase.from('master_products').upsert({
      company_id: companyId,
      products: products,
      updated_at: new Date().toISOString()
    }).then(null, err => {
      console.warn(`Supabase products cloud save error for ${companyId}:`, err);
    });
  } catch (e) {
    console.error("Products catalog save error:", e);
  }
};

export const saveProductsList = saveProductsCatalog;

// Helper to get previous month 'YYYY-MM'
export function getPreviousMonthString(monthYear: string): string {
  const [yearStr, monthStr] = monthYear.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10);
  if (month === 1) {
    month = 12;
    year -= 1;
  } else {
    month -= 1;
  }
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function calculateLedgerTotals(items: StockLedgerBrandItem[]) {
  let totalOpeningValue = 0;
  let totalPurchaseValue = 0;
  let totalSaleValue = 0;
  let totalClosingValue = 0;

  const processedItems = items.map(item => {
    const rate = item.unitRate ?? item.pts ?? 0;
    const closingQty = Math.max(0, (item.openingQty || 0) + (item.purchaseQty || 0) - (item.saleQty || 0));
    const openingValue = (item.openingQty || 0) * rate;
    const purchaseValue = (item.purchaseQty || 0) * rate;
    const saleValue = (item.saleQty || 0) * rate;
    const closingValue = closingQty * rate;

    totalOpeningValue += openingValue;
    totalPurchaseValue += purchaseValue;
    totalSaleValue += saleValue;
    totalClosingValue += closingValue;

    return {
      ...item,
      pts: rate,
      unitRate: rate,
      closingQty,
      openingValue,
      purchaseValue,
      saleValue,
      closingValue
    };
  });

  return {
    items: processedItems,
    totalOpeningValue,
    totalPurchaseValue,
    totalSaleValue,
    totalClosingValue,
    totals: {
      openingValue: totalOpeningValue,
      purchaseValue: totalPurchaseValue,
      saleValue: totalSaleValue,
      closingValue: totalClosingValue
    }
  };
}

// Generate base items from catalog
function generateDefaultBrandItems(stockistId: number | string, baseQtyMultiplier: number = 1): StockLedgerBrandItem[] {
  const catalog = getProductsCatalog();
  // Generate deterministic realistic values
  const stIdNum = typeof stockistId === 'number' ? stockistId : parseInt(String(stockistId), 10) || 1;
  
  return catalog.map((p, idx) => {
    const seed = (stIdNum * 7 + idx * 13) % 25;
    const openingQty = (20 + seed * 4) * baseQtyMultiplier;
    const purchaseQty = (15 + (seed % 6) * 5) * baseQtyMultiplier;
    const saleQty = (12 + (seed % 5) * 4) * baseQtyMultiplier;
    const closingQty = Math.max(0, openingQty + purchaseQty - saleQty);
    const rate = p.pts || 0;

    return {
      brandId: p.id,
      brandName: p.name,
      pack: p.pack,
      pts: rate,
      ptr: p.ptr || 0,
      mrp: p.mrp || 0,
      unitRate: rate,
      openingQty,
      purchaseQty,
      saleQty,
      closingQty,
      openingValue: openingQty * rate,
      purchaseValue: purchaseQty * rate,
      saleValue: saleQty * rate,
      closingValue: closingQty * rate
    };
  });
}

// Get Stockist Monthly Ledger with Auto-Feed Rule:
// "this month closing stock qty is next months opening stock qty - auto feed"
export function getStockistLedger(stockistId: number | string, monthYear: string): StockistMonthlyLedger {
  const storageKey = `raxon_stockist_ledger_${stockistId}_${monthYear}_${getActiveCompanyId()}`;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.items)) {
        // Recalculate totals dynamically and ensure unitRate exists
        const calc = calculateLedgerTotals(parsed.items);
        return {
          ...parsed,
          stockistId,
          monthYear,
          items: calc.items,
          totalOpeningValue: calc.totalOpeningValue,
          totalPurchaseValue: calc.totalPurchaseValue,
          totalSaleValue: calc.totalSaleValue,
          totalClosingValue: calc.totalClosingValue,
          totals: calc.totals,
          updatedAt: parsed.updatedAt || new Date().toISOString()
        };
      }
    }
  } catch (e) {
    console.warn("Stockist ledger read error:", e);
  }

  // Check previous month for Auto-Feed
  const prevMonth = getPreviousMonthString(monthYear);
  const prevStorageKey = `raxon_stockist_ledger_${stockistId}_${prevMonth}_${getActiveCompanyId()}`;
  let openingFromPrevMonth: Record<string, number> = {};

  try {
    const prevSaved = localStorage.getItem(prevStorageKey);
    if (prevSaved) {
      const prevParsed = JSON.parse(prevSaved);
      if (prevParsed && Array.isArray(prevParsed.items)) {
        prevParsed.items.forEach((it: any) => {
          if (it && it.brandId) {
            openingFromPrevMonth[it.brandId] = it.closingQty ?? 0;
          }
        });
      }
    }
  } catch (e) {
    console.warn("Prev month ledger read error:", e);
  }

  const catalog = getProductsCatalog();
  const defaultItems = generateDefaultBrandItems(stockistId);

  const items: StockLedgerBrandItem[] = catalog.map(p => {
    const matchingDef = defaultItems.find(d => d.brandId === p.id);
    const openingQty = openingFromPrevMonth[p.id] !== undefined 
      ? openingFromPrevMonth[p.id] 
      : (matchingDef ? matchingDef.openingQty : 20);

    const purchaseQty = matchingDef ? matchingDef.purchaseQty : 10;
    const saleQty = matchingDef ? matchingDef.saleQty : 8;
    const closingQty = Math.max(0, openingQty + purchaseQty - saleQty);
    const rate = p.pts || 0;

    return {
      brandId: p.id,
      brandName: p.name,
      pack: p.pack,
      pts: rate,
      ptr: p.ptr || 0,
      mrp: p.mrp || 0,
      unitRate: rate,
      openingQty,
      purchaseQty,
      saleQty,
      closingQty,
      openingValue: openingQty * rate,
      purchaseValue: purchaseQty * rate,
      saleValue: saleQty * rate,
      closingValue: closingQty * rate
    };
  });

  const calc = calculateLedgerTotals(items);
  const ledger: StockistMonthlyLedger = {
    stockistId,
    monthYear,
    items: calc.items,
    totalOpeningValue: calc.totalOpeningValue,
    totalPurchaseValue: calc.totalPurchaseValue,
    totalSaleValue: calc.totalSaleValue,
    totalClosingValue: calc.totalClosingValue,
    totals: calc.totals,
    updatedAt: new Date().toISOString()
  };

  saveStockistLedger(stockistId, monthYear, ledger);
  return ledger;
}

export function saveStockistLedger(
  stockistIdOrLedger: number | string | StockistMonthlyLedger, 
  monthYearOrUndefined?: string, 
  ledgerOrUndefined?: StockistMonthlyLedger
) {
  try {
    let stockistId: number | string;
    let monthYear: string;
    let ledger: StockistMonthlyLedger;

    if (typeof stockistIdOrLedger === 'object' && stockistIdOrLedger !== null) {
      ledger = stockistIdOrLedger as StockistMonthlyLedger;
      stockistId = ledger.stockistId;
      monthYear = ledger.monthYear;
    } else {
      stockistId = stockistIdOrLedger as (number | string);
      monthYear = monthYearOrUndefined || '2026-08';
      ledger = ledgerOrUndefined!;
    }

    if (!ledger || !ledger.items) return;

    const calc = calculateLedgerTotals(ledger.items);
    const finalLedger: StockistMonthlyLedger = {
      ...ledger,
      stockistId,
      monthYear,
      items: calc.items,
      totalOpeningValue: calc.totalOpeningValue,
      totalPurchaseValue: calc.totalPurchaseValue,
      totalSaleValue: calc.totalSaleValue,
      totalClosingValue: calc.totalClosingValue,
      totals: calc.totals,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`raxon_stockist_ledger_${stockistId}_${monthYear}_${getActiveCompanyId()}`, JSON.stringify(finalLedger));

    // Update NEXT month's opening stock automatically (Auto-Feed cascading)
    const nextMonth = getNextMonthString(monthYear);
    const nextStorageKey = `raxon_stockist_ledger_${stockistId}_${nextMonth}_${getActiveCompanyId()}`;
    const nextSaved = localStorage.getItem(nextStorageKey);
    if (nextSaved) {
      try {
        const nextParsed: StockistMonthlyLedger = JSON.parse(nextSaved);
        if (nextParsed && Array.isArray(nextParsed.items)) {
          const updatedNextItems = nextParsed.items.map(nItem => {
            const matchingCurr = finalLedger.items.find(c => c.brandId === nItem.brandId);
            if (matchingCurr) {
              return {
                ...nItem,
                openingQty: matchingCurr.closingQty
              };
            }
            return nItem;
          });
          const nextCalc = calculateLedgerTotals(updatedNextItems);
          const updatedNextLedger: StockistMonthlyLedger = {
            ...nextParsed,
            items: nextCalc.items,
            totalOpeningValue: nextCalc.totalOpeningValue,
            totalPurchaseValue: nextCalc.totalPurchaseValue,
            totalSaleValue: nextCalc.totalSaleValue,
            totalClosingValue: nextCalc.totalClosingValue,
            totals: nextCalc.totals,
            updatedAt: new Date().toISOString()
          };
          localStorage.setItem(nextStorageKey, JSON.stringify(updatedNextLedger));
        }
      } catch (e) {
        console.warn("Cascade update error:", e);
      }
    }
  } catch (e) {
    console.error("Stockist ledger save error:", e);
  }
}

export function getNextMonthString(monthYear: string): string {
  const [yearStr, monthStr] = monthYear.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10);
  if (month === 12) {
    month = 1;
    year += 1;
  } else {
    month += 1;
  }
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function recordStockistPurchase(
  stockistId: number | string, 
  monthYear: string, 
  brandId: string, 
  addedQty: number
): StockistMonthlyLedger {
  const currentLedger = getStockistLedger(stockistId, monthYear);
  const updatedItems = currentLedger.items.map(item => {
    if (item.brandId === brandId) {
      const newPurchase = (item.purchaseQty || 0) + addedQty;
      return {
        ...item,
        purchaseQty: newPurchase
      };
    }
    return item;
  });

  const updatedLedger = {
    ...currentLedger,
    items: updatedItems
  };

  saveStockistLedger(stockistId, monthYear, updatedLedger);
  return getStockistLedger(stockistId, monthYear);
}

export function recordStockistSecondarySale(
  stockistId: number | string, 
  monthYear: string, 
  brandId: string, 
  soldQty: number
): StockistMonthlyLedger {
  const currentLedger = getStockistLedger(stockistId, monthYear);
  const updatedItems = currentLedger.items.map(item => {
    if (item.brandId === brandId) {
      const newSale = (item.saleQty || 0) + soldQty;
      return {
        ...item,
        saleQty: newSale
      };
    }
    return item;
  });

  const updatedLedger = {
    ...currentLedger,
    items: updatedItems
  };

  saveStockistLedger(stockistId, monthYear, updatedLedger);
  return getStockistLedger(stockistId, monthYear);
}
