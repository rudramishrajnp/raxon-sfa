import React, { useState, useEffect } from 'react';
import { 
  CreditCard, DollarSign, Settings, CheckCircle2, XCircle, Download, Plus, Filter, Search,
  Navigation, Car, Bike, MapPin, Check, AlertCircle, FileText, ArrowRight
} from 'lucide-react';
import { getActiveCompanyId, getActiveCompany } from '../data/companyContext';
import { getUsersByCompany } from '../data/userContext';
import { supabase } from '../supabaseClient';

interface ExpensePolicy {
  role: string;
  hqDailyAllowance: number; // in INR
  exHqDailyAllowance: number; // in INR
  outstationDailyAllowance: number; // in INR
  bikePerKmRate: number; // in INR
  carPerKmRate: number; // in INR
  nightStayAllowance: number; // in INR
}

interface ExpenseClaim {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  hq: string;
  date: string;
  workType: 'HQ' | 'EX-HQ' | 'Outstation';
  distanceKm: number;
  modeOfTravel: 'Bike' | 'Car' | 'Bus' | 'Train';
  calculatedTa: number;
  calculatedDa: number;
  miscExpense: number;
  totalClaim: number;
  dcrCallCount: number;
  remarks: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function ExpensePolicyMaster() {
  const activeCompanyId = getActiveCompanyId();
  const company = getActiveCompany();
  const employees = getUsersByCompany(activeCompanyId);

  const loadPolicies = (): ExpensePolicy[] => {
    try {
      const saved = localStorage.getItem(`raxon_expense_policy_${activeCompanyId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { role: 'MR', hqDailyAllowance: 250, exHqDailyAllowance: 400, outstationDailyAllowance: 700, bikePerKmRate: 3.50, carPerKmRate: 8.00, nightStayAllowance: 1200 },
      { role: 'AM', hqDailyAllowance: 350, exHqDailyAllowance: 550, outstationDailyAllowance: 950, bikePerKmRate: 4.00, carPerKmRate: 9.00, nightStayAllowance: 1800 },
      { role: 'RM', hqDailyAllowance: 500, exHqDailyAllowance: 750, outstationDailyAllowance: 1300, bikePerKmRate: 4.50, carPerKmRate: 10.50, nightStayAllowance: 2500 },
      { role: 'ZM', hqDailyAllowance: 650, exHqDailyAllowance: 950, outstationDailyAllowance: 1600, bikePerKmRate: 5.00, carPerKmRate: 12.00, nightStayAllowance: 3200 }
    ];
  };

  const loadClaims = (): ExpenseClaim[] => {
    try {
      const saved = localStorage.getItem(`raxon_expense_claims_${activeCompanyId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'EXP-101',
        employeeId: 'MR-01',
        employeeName: 'Rahul Verma',
        role: 'MR',
        hq: 'Lucknow HQ',
        date: '2026-08-15',
        workType: 'EX-HQ',
        distanceKm: 65,
        modeOfTravel: 'Bike',
        calculatedTa: 227.5,
        calculatedDa: 400,
        miscExpense: 50,
        totalClaim: 677.5,
        dcrCallCount: 12,
        remarks: 'Barabanki route doctor calls & chemist POB collection',
        status: 'Pending'
      },
      {
        id: 'EXP-102',
        employeeId: 'MR-02',
        employeeName: 'Pooja Sharma',
        role: 'MR',
        hq: 'Kanpur HQ',
        date: '2026-08-14',
        workType: 'HQ',
        distanceKm: 28,
        modeOfTravel: 'Bike',
        calculatedTa: 98,
        calculatedDa: 250,
        miscExpense: 0,
        totalClaim: 348,
        dcrCallCount: 14,
        remarks: 'Civil lines core doctor coverage',
        status: 'Approved'
      },
      {
        id: 'EXP-103',
        employeeId: 'AM-01',
        employeeName: 'Rameshwar Patil',
        role: 'AM',
        hq: 'Lucknow HQ',
        date: '2026-08-13',
        workType: 'Outstation',
        distanceKm: 140,
        modeOfTravel: 'Car',
        calculatedTa: 1260,
        calculatedDa: 950,
        miscExpense: 300,
        totalClaim: 2510,
        dcrCallCount: 8,
        remarks: 'Joint fieldwork with MR in Sitapur & Lakhimpur',
        status: 'Approved'
      }
    ];
  };

  const [policies, setPolicies] = useState<ExpensePolicy[]>(loadPolicies);
  const [claims, setClaims] = useState<ExpenseClaim[]>(loadClaims);
  const [activeTab, setActiveTab] = useState<'claims' | 'policies'>('claims');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Approved' | 'Rejected'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitClaimOpen, setIsSubmitClaimOpen] = useState(false);

  // New claim form state
  const [claimForm, setClaimForm] = useState({
    employeeId: '',
    workType: 'HQ' as ExpenseClaim['workType'],
    distanceKm: 30,
    modeOfTravel: 'Bike' as ExpenseClaim['modeOfTravel'],
    miscExpense: 0,
    remarks: ''
  });

  // Real-time Supabase Sync for Policies & Claims
  useEffect(() => {
    if (!activeCompanyId) return;

    // Fetch initial
    supabase.from('expense_policies').select('*').eq('company_id', activeCompanyId).maybeSingle().then(({ data, error }) => {
      if (!error && data && Array.isArray(data.policies)) {
        setPolicies(data.policies);
        localStorage.setItem(`raxon_expense_policy_${activeCompanyId}`, JSON.stringify(data.policies));
      }
    });

    supabase.from('expense_claims').select('*').eq('company_id', activeCompanyId).maybeSingle().then(({ data, error }) => {
      if (!error && data && Array.isArray(data.claims)) {
        setClaims(data.claims);
        localStorage.setItem(`raxon_expense_claims_${activeCompanyId}`, JSON.stringify(data.claims));
      }
    });

    // Realtime channel
    const channel = supabase
      .channel(`public:expenses_${activeCompanyId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expense_policies', filter: `company_id=eq.${activeCompanyId}` }, (payload) => {
        const data = payload.new as any;
        if (data && Array.isArray(data.policies)) {
          setPolicies(data.policies);
          localStorage.setItem(`raxon_expense_policy_${activeCompanyId}`, JSON.stringify(data.policies));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expense_claims', filter: `company_id=eq.${activeCompanyId}` }, (payload) => {
        const data = payload.new as any;
        if (data && Array.isArray(data.claims)) {
          setClaims(data.claims);
          localStorage.setItem(`raxon_expense_claims_${activeCompanyId}`, JSON.stringify(data.claims));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeCompanyId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdatePolicy = (role: string, field: keyof ExpensePolicy, val: number) => {
    const updated = policies.map(p => p.role === role ? { ...p, [field]: val } : p);
    setPolicies(updated);
    localStorage.setItem(`raxon_expense_policy_${activeCompanyId}`, JSON.stringify(updated));
    supabase.from('expense_policies').upsert({
      company_id: activeCompanyId,
      policies: updated,
      updated_at: new Date().toISOString()
    }).then(null, err => console.warn('Supabase policy save error:', err));
    showToast(`Updated ${role} ${field} allowance rate.`);
  };

  const handleClaimStatus = (id: string, newStatus: ExpenseClaim['status']) => {
    const updated = claims.map(c => c.id === id ? { ...c, status: newStatus } : c);
    setClaims(updated);
    localStorage.setItem(`raxon_expense_claims_${activeCompanyId}`, JSON.stringify(updated));
    supabase.from('expense_claims').upsert({
      company_id: activeCompanyId,
      claims: updated,
      updated_at: new Date().toISOString()
    }).then(null, err => console.warn('Supabase claim status save error:', err));
    showToast(`Claim ${id} has been ${newStatus.toLowerCase()}!`);
  };

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(u => u.id === claimForm.employeeId);
    if (!emp) {
      alert('Please select an employee');
      return;
    }

    const policy = policies.find(p => p.role === emp.role) || policies[0];
    let da = policy.hqDailyAllowance;
    if (claimForm.workType === 'EX-HQ') da = policy.exHqDailyAllowance;
    if (claimForm.workType === 'Outstation') da = policy.outstationDailyAllowance;

    const rate = claimForm.modeOfTravel === 'Car' ? policy.carPerKmRate : policy.bikePerKmRate;
    const ta = claimForm.distanceKm * rate;
    const misc = Number(claimForm.miscExpense) || 0;
    const total = ta + da + misc;

    const newClaim: ExpenseClaim = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      role: emp.role,
      hq: emp.hq || 'Lucknow HQ',
      date: new Date().toISOString().split('T')[0],
      workType: claimForm.workType,
      distanceKm: claimForm.distanceKm,
      modeOfTravel: claimForm.modeOfTravel,
      calculatedTa: ta,
      calculatedDa: da,
      miscExpense: misc,
      totalClaim: total,
      dcrCallCount: 10,
      remarks: claimForm.remarks || 'Daily field work expenses',
      status: 'Pending'
    };

    const updatedClaims = [newClaim, ...claims];
    setClaims(updatedClaims);
    localStorage.setItem(`raxon_expense_claims_${activeCompanyId}`, JSON.stringify(updatedClaims));
    supabase.from('expense_claims').upsert({
      company_id: activeCompanyId,
      claims: updatedClaims,
      updated_at: new Date().toISOString()
    }).then(null, err => console.warn('Supabase new claim save error:', err));

    showToast(`Expense claim of ₹${total.toFixed(2)} submitted for ${emp.name}!`);
    setIsSubmitClaimOpen(false);
  };

  const handleExportCsv = () => {
    const headers = ['Claim ID', 'Employee', 'Role', 'HQ', 'Date', 'Work Type', 'Distance (KM)', 'Travel Mode', 'TA (₹)', 'DA (₹)', 'Misc (₹)', 'Total (₹)', 'Status'];
    const rows = filteredClaims.map(c => [
      c.id,
      `"${c.employeeName}"`,
      c.role,
      `"${c.hq}"`,
      c.date,
      c.workType,
      c.distanceKm,
      c.modeOfTravel,
      c.calculatedTa,
      c.calculatedDa,
      c.miscExpense,
      c.totalClaim,
      c.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `expense_claims_report_${company.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Expense claims exported to CSV!');
  };

  const filteredClaims = claims.filter(c => statusFilter === 'ALL' ? true : c.status === statusFilter);

  const pendingAmount = claims.filter(c => c.status === 'Pending').reduce((acc, c) => acc + c.totalClaim, 0);
  const approvedAmount = claims.filter(c => c.status === 'Approved').reduce((acc, c) => acc + c.totalClaim, 0);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-gray-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white text-xs ml-2">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TA / DA & Expense Policy Master</h1>
            <p className="text-xs text-gray-500">
              Configure daily allowances, per-km travel fare slabs, DCR distance validation, and approve field claims.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>
          <button
            onClick={() => setIsSubmitClaimOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Submit Field Claim
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Claims Value</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-600 mt-2">₹{pendingAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div className="text-xs text-gray-500 mt-1">{claims.filter(c => c.status === 'Pending').length} claims awaiting approval</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Approved for Payout</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600 mt-2">₹{approvedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div className="text-xs text-gray-500 mt-1">{claims.filter(c => c.status === 'Approved').length} approved claims</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">MR Travel Rate</span>
            <Bike className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 mt-2">₹3.50 / KM</div>
          <div className="text-xs text-gray-500 mt-1">Bike standard reimbursement</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Policy Rules</span>
            <Settings className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-extrabold text-purple-600 mt-2">{policies.length} Slabs</div>
          <div className="text-xs text-gray-500 mt-1">MR, AM, RM, ZM tiers</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl text-xs font-bold w-full md:w-auto">
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'claims' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Field Expense Claims & Approvals ({claims.length})
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'policies' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Allowance & Fare Policy Master ({policies.length})
          </button>
        </div>

        {activeTab === 'claims' && (
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
            <span>Status Filter:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending Only</option>
              <option value="Approved">Approved Only</option>
              <option value="Rejected">Rejected Only</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: CLAIMS & APPROVALS */}
      {activeTab === 'claims' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-5 py-3.5">Date & Route</th>
                  <th className="px-5 py-3.5">Work Type</th>
                  <th className="px-5 py-3.5">Distance & TA</th>
                  <th className="px-5 py-3.5">DA + Misc</th>
                  <th className="px-5 py-3.5">Total Claim</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs font-medium">
                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No expense claims match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map(claim => (
                    <tr key={claim.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-gray-900">{claim.employeeName}</div>
                        <div className="text-[10px] text-gray-500">{claim.role} • {claim.hq}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-gray-900 font-semibold">{claim.date}</div>
                        <div className="text-[10px] text-gray-500 truncate max-w-xs">{claim.remarks}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          claim.workType === 'HQ' ? 'bg-blue-100 text-blue-800' :
                          claim.workType === 'EX-HQ' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {claim.workType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-gray-900">{claim.distanceKm} KM ({claim.modeOfTravel})</div>
                        <div className="text-[10px] text-gray-500">TA: ₹{claim.calculatedTa}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-gray-800">₹{claim.calculatedDa} (DA)</div>
                        {claim.miscExpense > 0 && (
                          <div className="text-[10px] text-gray-500">+₹{claim.miscExpense} Misc</div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-extrabold text-emerald-700">
                        ₹{claim.totalClaim.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          claim.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          claim.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {claim.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleClaimStatus(claim.id, 'Approved')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleClaimStatus(claim.id, 'Rejected')}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: POLICY MASTER TABLE */}
      {activeTab === 'policies' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-700" />
              <div>
                <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Company TA / DA Policy Master</h3>
                <p className="text-3xs text-indigo-700">Admins can click and edit any slab value directly.</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Designation</th>
                  <th className="px-5 py-3.5">HQ DA (₹/Day)</th>
                  <th className="px-5 py-3.5">EX-HQ DA (₹/Day)</th>
                  <th className="px-5 py-3.5">Outstation DA (₹/Day)</th>
                  <th className="px-5 py-3.5">Bike Fare (₹/KM)</th>
                  <th className="px-5 py-3.5">Car Fare (₹/KM)</th>
                  <th className="px-5 py-3.5">Night Stay (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs font-medium">
                {policies.map(p => (
                  <tr key={p.role} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-gray-900">{p.role}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => {
                          const val = prompt(`Enter HQ DA for ${p.role}:`, String(p.hqDailyAllowance));
                          if (val) handleUpdatePolicy(p.role, 'hqDailyAllowance', parseFloat(val) || p.hqDailyAllowance);
                        }}
                        className="font-bold text-indigo-700 hover:underline cursor-pointer"
                      >
                        ₹{p.hqDailyAllowance}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => {
                          const val = prompt(`Enter EX-HQ DA for ${p.role}:`, String(p.exHqDailyAllowance));
                          if (val) handleUpdatePolicy(p.role, 'exHqDailyAllowance', parseFloat(val) || p.exHqDailyAllowance);
                        }}
                        className="font-bold text-indigo-700 hover:underline cursor-pointer"
                      >
                        ₹{p.exHqDailyAllowance}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => {
                          const val = prompt(`Enter Outstation DA for ${p.role}:`, String(p.outstationDailyAllowance));
                          if (val) handleUpdatePolicy(p.role, 'outstationDailyAllowance', parseFloat(val) || p.outstationDailyAllowance);
                        }}
                        className="font-bold text-indigo-700 hover:underline cursor-pointer"
                      >
                        ₹{p.outstationDailyAllowance}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => {
                          const val = prompt(`Enter Bike ₹/KM for ${p.role}:`, String(p.bikePerKmRate));
                          if (val) handleUpdatePolicy(p.role, 'bikePerKmRate', parseFloat(val) || p.bikePerKmRate);
                        }}
                        className="font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        ₹{p.bikePerKmRate.toFixed(2)}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => {
                          const val = prompt(`Enter Car ₹/KM for ${p.role}:`, String(p.carPerKmRate));
                          if (val) handleUpdatePolicy(p.role, 'carPerKmRate', parseFloat(val) || p.carPerKmRate);
                        }}
                        className="font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        ₹{p.carPerKmRate.toFixed(2)}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => {
                          const val = prompt(`Enter Night Stay Allowance for ${p.role}:`, String(p.nightStayAllowance));
                          if (val) handleUpdatePolicy(p.role, 'nightStayAllowance', parseFloat(val) || p.nightStayAllowance);
                        }}
                        className="font-bold text-purple-700 hover:underline cursor-pointer"
                      >
                        ₹{p.nightStayAllowance}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Submit Field Claim Modal */}
      {isSubmitClaimOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)] my-auto overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 shrink-0">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" /> Submit Daily Travel & DA Claim
              </h3>
              <button onClick={() => setIsSubmitClaimOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm p-1 rounded-lg hover:bg-gray-100 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-3.5 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Field Representative *</label>
                <select
                  required
                  value={claimForm.employeeId}
                  onChange={e => setClaimForm({ ...claimForm, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role}) - {emp.hq || 'Lucknow HQ'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Work Type *</label>
                  <select
                    value={claimForm.workType}
                    onChange={e => setClaimForm({ ...claimForm, workType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="HQ">HQ (Local)</option>
                    <option value="EX-HQ">EX-HQ (Town Visit)</option>
                    <option value="Outstation">Outstation (OS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Travel Mode</label>
                  <select
                    value={claimForm.modeOfTravel}
                    onChange={e => setClaimForm({ ...claimForm, modeOfTravel: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Bike">Own Bike (₹3.50/KM)</option>
                    <option value="Car">Car (₹8.00/KM)</option>
                    <option value="Bus">Bus / Public Fare</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Distance (KM) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={claimForm.distanceKm}
                    onChange={e => setClaimForm({ ...claimForm, distanceKm: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Misc Expense (Toll/Parking)</label>
                  <input
                    type="number"
                    min="0"
                    value={claimForm.miscExpense}
                    onChange={e => setClaimForm({ ...claimForm, miscExpense: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Route & Field Remarks</label>
                <input
                  type="text"
                  value={claimForm.remarks}
                  onChange={e => setClaimForm({ ...claimForm, remarks: e.target.value })}
                  placeholder="e.g. Visited Gomti Nagar & Aliganj doctors"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitClaimOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Submit Expense Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
