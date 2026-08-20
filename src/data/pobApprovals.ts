import { getActiveCompanyId } from './companyContext';
import { getProductsList } from './masterData';
import { supabase } from '../supabaseClient';

export interface POBOrderItem {
  id: string;
  productName: string;
  quantity: number;
  manualValue: number;
  masterScheme: string;
  offeredScheme: string;
  isSchemeDeviation: boolean;
  approvalStatus: 'Direct_Approved' | 'Pending_Manager_Approval' | 'Approved' | 'Rejected';
  approvalId?: string;
}

export interface POBApprovalRequest {
  id: string;
  mrId: string;
  mrName: string;
  chemistId?: number;
  chemistName: string;
  chemistArea?: string;
  area?: string;
  doctorName?: string;
  date?: string;
  productName: string;
  quantity: number;
  manualValue: number;
  masterAuthorizedScheme?: string;
  masterScheme?: string;
  mrOfferedScheme?: string;
  offeredScheme?: string;
  deviationPercentage?: number;
  extraBonusPct?: number;
  justification?: string;
  remarks?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'pending' | 'approved' | 'rejected';
  managerRemark?: string;
  managerRemarks?: string;
  actionBy?: string;
  approvedBy?: string;
  actionAt?: string;
  createdAt: string;
}

function getPOBStorageKey(explicitCompanyId?: string) {
  return `raxon_pob_scheme_approvals_${explicitCompanyId || getActiveCompanyId()}`;
}

export function getInitialPOBRequestsForCompany(_companyId?: string): POBApprovalRequest[] {
  return [];
}

let isPOBFirestoreSyncInitialized = false;

export function initPOBApprovalsFirestoreSync() {
  if (isPOBFirestoreSyncInitialized) return;
  isPOBFirestoreSyncInitialized = true;

  try {
    const companyId = getActiveCompanyId();
    if (companyId) {
      supabase.from('pob_approvals').select('*').eq('company_id', companyId).maybeSingle().then(({ data, error }) => {
        if (!error && data && Array.isArray(data.requests)) {
          localStorage.setItem(getPOBStorageKey(companyId), JSON.stringify(data.requests));
          window.dispatchEvent(new CustomEvent('raxon-pob-approvals-updated', { detail: { requests: data.requests, companyId } }));
        }
      });
    }

    supabase
      .channel('public:pob_approvals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pob_approvals' }, (payload) => {
        const data = payload.new as any;
        if (data && data.company_id && Array.isArray(data.requests)) {
          localStorage.setItem(getPOBStorageKey(data.company_id), JSON.stringify(data.requests));
          window.dispatchEvent(new CustomEvent('raxon-pob-approvals-updated', { detail: { requests: data.requests, companyId: data.company_id } }));
        }
      })
      .subscribe();
  } catch (e) {
    console.warn('POB approvals Supabase init error:', e);
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => initPOBApprovalsFirestoreSync(), 150);
}

// Parse string like "10 + 2 Free", "10+4", "20+3 Free", "10+1" into fractional bonus ratio
export function parseSchemeRatio(schemeStr: string): number {
  if (!schemeStr || typeof schemeStr !== 'string') return 0;
  const clean = schemeStr.toLowerCase().replace(/\s+/g, '');
  // Match patterns like "10+2", "10+4free", "10+1+5cd"
  const match = clean.match(/(\d+)\+(\d+)/);
  if (match) {
    const buy = parseFloat(match[1]);
    const free = parseFloat(match[2]);
    if (buy > 0) {
      return free / buy;
    }
  }
  // Check if string contains percentage like "20%" or "15% Bonus"
  const pctMatch = clean.match(/(\d+)%/);
  if (pctMatch) {
    return parseFloat(pctMatch[1]) / 100;
  }
  return 0;
}

export function checkIsSchemeDeviation(
  productName: string,
  offeredScheme: string,
  explicitCompanyId?: string
): { isDeviation: boolean; masterScheme: string; masterRatio: number; offeredRatio: number; extraBonusPct: number } {
  const products = getProductsList(explicitCompanyId);
  const matched = products.find(p => p.name.toLowerCase() === productName.toLowerCase() || productName.toLowerCase().includes(p.name.toLowerCase()));
  
  const masterScheme = matched?.scheme || '10 + 1 Free';
  const masterRatio = parseSchemeRatio(masterScheme);
  const offeredRatio = parseSchemeRatio(offeredScheme);

  // If offered ratio is strictly greater than master ratio by > 1% (0.01)
  const isDeviation = offeredRatio > (masterRatio + 0.005);
  const extraBonusPct = Math.round((offeredRatio - masterRatio) * 100);

  return {
    isDeviation,
    masterScheme,
    masterRatio,
    offeredRatio,
    extraBonusPct: Math.max(0, extraBonusPct)
  };
}

export function getAllPOBApprovalRequests(explicitCompanyId?: string): POBApprovalRequest[] {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    const raw = localStorage.getItem(getPOBStorageKey(companyId));
    if (raw !== null) {
      const list: POBApprovalRequest[] = JSON.parse(raw);
      return list.map(req => ({
        ...req,
        area: req.area || req.chemistArea || 'Territory HQ',
        chemistArea: req.chemistArea || req.area || 'Territory HQ',
        masterScheme: req.masterScheme || req.masterAuthorizedScheme || '10+2',
        masterAuthorizedScheme: req.masterAuthorizedScheme || req.masterScheme || '10+2',
        offeredScheme: req.offeredScheme || req.mrOfferedScheme || '10+4',
        mrOfferedScheme: req.mrOfferedScheme || req.offeredScheme || '10+4',
        managerRemarks: req.managerRemarks || req.managerRemark,
        managerRemark: req.managerRemark || req.managerRemarks,
        approvedBy: req.approvedBy || req.actionBy,
        actionBy: req.actionBy || req.approvedBy
      }));
    }
  } catch (e) {
    console.warn("Failed to load POB approvals:", e);
  }
  return getInitialPOBRequestsForCompany(companyId);
}

export function savePOBApprovalRequests(requests: POBApprovalRequest[], explicitCompanyId?: string): void {
  const companyId = explicitCompanyId || getActiveCompanyId();
  try {
    localStorage.setItem(getPOBStorageKey(companyId), JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent('raxon-pob-approvals-updated', { detail: { requests, companyId } }));

    // Sync POB requests to Supabase
    supabase.from('pob_approvals').upsert({
      company_id: companyId,
      requests: requests,
      updated_at: new Date().toISOString()
    }).then(null, err => {
      console.warn(`Supabase POB approvals save notice for ${companyId}:`, err);
    });
  } catch (e) {
    console.error("Failed to save POB approvals:", e);
  }
}

export function createPOBApprovalRequest(data: Omit<POBApprovalRequest, 'id' | 'status' | 'createdAt'>, explicitCompanyId?: string): POBApprovalRequest {
  const companyId = explicitCompanyId || getActiveCompanyId();
  const requests = getAllPOBApprovalRequests(companyId);
  const newReq: POBApprovalRequest = {
    ...data,
    id: `POB-APP-${Date.now().toString().slice(-4)}`,
    status: 'Pending',
    area: data.area || data.chemistArea || 'Ambedkar Nagar HQ',
    chemistArea: data.chemistArea || data.area || 'Ambedkar Nagar HQ',
    masterScheme: data.masterScheme || data.masterAuthorizedScheme || '10+2',
    masterAuthorizedScheme: data.masterAuthorizedScheme || data.masterScheme || '10+2',
    offeredScheme: data.offeredScheme || data.mrOfferedScheme || '10+4',
    mrOfferedScheme: data.mrOfferedScheme || data.offeredScheme || '10+4',
    createdAt: new Date().toISOString()
  };
  requests.unshift(newReq);
  savePOBApprovalRequests(requests, companyId);
  return newReq;
}

export function approvePOBRequest(id: string, actionBy: string, managerRemark: string = 'Approved special scheme', explicitCompanyId?: string): boolean {
  const companyId = explicitCompanyId || getActiveCompanyId();
  const requests = getAllPOBApprovalRequests(companyId);
  const target = requests.find(r => r.id === id);
  if (!target) return false;
  
  target.status = 'Approved';
  target.actionBy = actionBy;
  target.approvedBy = actionBy;
  target.managerRemark = managerRemark;
  target.managerRemarks = managerRemark;
  target.actionAt = new Date().toISOString();
  savePOBApprovalRequests(requests, companyId);
  return true;
}

export function getPendingPOBApprovals(explicitCompanyId?: string): POBApprovalRequest[] {
  return getAllPOBApprovalRequests(explicitCompanyId).filter(r => r.status.toLowerCase() === 'pending');
}

export function rejectPOBRequest(id: string, actionBy: string, managerRemark: string = 'Extra scheme not feasible as per margin', explicitCompanyId?: string): boolean {
  const companyId = explicitCompanyId || getActiveCompanyId();
  const requests = getAllPOBApprovalRequests(companyId);
  const target = requests.find(r => r.id === id);
  if (!target) return false;

  target.status = 'Rejected';
  target.actionBy = actionBy;
  target.approvedBy = actionBy;
  target.managerRemark = managerRemark;
  target.managerRemarks = managerRemark;
  target.actionAt = new Date().toISOString();
  savePOBApprovalRequests(requests, companyId);
  return true;
}
