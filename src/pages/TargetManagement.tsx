import React, { useState, useEffect } from 'react';
import { 
  Target, TrendingUp, DollarSign, Award, Users, Filter, Download, Plus, CheckCircle2, 
  Search, Calendar, Percent, ShieldCheck, ChevronRight, BarChart3, ArrowUpRight, ArrowDownRight,
  Briefcase, Building2, MapPin
} from 'lucide-react';
import { getActiveCompanyId, getActiveCompany } from '../data/companyContext';
import { getUsersByCompany } from '../data/userContext';
import { getAllHeadquarters } from '../data/hqMrMapping';
import { getProductsCatalog } from '../data/masterData';

interface TargetAllocation {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  hq: string;
  month: string; // e.g. "2026-08"
  primaryTarget: number; // in INR
  secondaryTarget: number; // in INR
  primaryAchieved: number; // in INR
  secondaryAchieved: number; // in INR
  productFocus?: string;
  status: 'Allocated' | 'In Progress' | 'Achieved' | 'Shortfall';
  incentiveEarned?: number;
  incentiveStatus?: 'Pending' | 'Approved' | 'Paid';
}

export default function TargetManagement() {
  const activeCompanyId = getActiveCompanyId();
  const company = getActiveCompany();
  const existingHqs = getAllHeadquarters(activeCompanyId);
  const products = getProductsCatalog(activeCompanyId);

  const currentMonthStr = '2026-08';

  const loadAllocations = (): TargetAllocation[] => {
    try {
      const saved = localStorage.getItem(`raxon_targets_${activeCompanyId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    // Default seed targets
    return [
      {
        id: 'TGT-001',
        employeeId: 'MR-01',
        employeeName: 'Rahul Verma',
        role: 'MR',
        hq: 'Lucknow HQ',
        month: '2026-08',
        primaryTarget: 350000,
        secondaryTarget: 320000,
        primaryAchieved: 365000,
        secondaryAchieved: 330000,
        productFocus: 'Cefixime 200mg, Pantoprazole 40mg',
        status: 'Achieved',
        incentiveEarned: 16500,
        incentiveStatus: 'Approved'
      },
      {
        id: 'TGT-002',
        employeeId: 'MR-02',
        employeeName: 'Pooja Sharma',
        role: 'MR',
        hq: 'Kanpur HQ',
        month: '2026-08',
        primaryTarget: 300000,
        secondaryTarget: 280000,
        primaryAchieved: 245000,
        secondaryAchieved: 230000,
        productFocus: 'Azithromycin 500, Paracetamol 650',
        status: 'In Progress',
        incentiveEarned: 0,
        incentiveStatus: 'Pending'
      },
      {
        id: 'TGT-003',
        employeeId: 'MR-03',
        employeeName: 'Amit Singh',
        role: 'MR',
        hq: 'Varanasi HQ',
        month: '2026-08',
        primaryTarget: 400000,
        secondaryTarget: 380000,
        primaryAchieved: 420000,
        secondaryAchieved: 395000,
        productFocus: 'Rabeprazole DSR, Montelukast LC',
        status: 'Achieved',
        incentiveEarned: 21000,
        incentiveStatus: 'Approved'
      },
      {
        id: 'TGT-004',
        employeeId: 'AM-01',
        employeeName: 'Rameshwar Patil',
        role: 'AM',
        hq: 'Lucknow HQ',
        month: '2026-08',
        primaryTarget: 1200000,
        secondaryTarget: 1100000,
        primaryAchieved: 1180000,
        secondaryAchieved: 1080000,
        productFocus: 'Division Core Portfolio',
        status: 'In Progress',
        incentiveEarned: 35000,
        incentiveStatus: 'Pending'
      }
    ];
  };

  const [targets, setTargets] = useState<TargetAllocation[]>(loadAllocations);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [selectedHqFilter, setSelectedHqFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [targetEmpId, setTargetEmpId] = useState('');
  const [targetPrimary, setTargetPrimary] = useState('350000');
  const [targetSecondary, setTargetSecondary] = useState('320000');
  const [targetProductFocus, setTargetProductFocus] = useState('');

  const employees = getUsersByCompany(activeCompanyId);

  useEffect(() => {
    try {
      localStorage.setItem(`raxon_targets_${activeCompanyId}`, JSON.stringify(targets));
    } catch (e) {
      console.error(e);
    }
  }, [targets, activeCompanyId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(u => u.id === targetEmpId);
    if (!emp) {
      alert('Please select an employee');
      return;
    }

    const primary = parseFloat(targetPrimary) || 0;
    const secondary = parseFloat(targetSecondary) || 0;

    const newTgt: TargetAllocation = {
      id: `TGT-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      role: emp.role,
      hq: emp.hq || existingHqs[0]?.name || 'Lucknow HQ',
      month: selectedMonth,
      primaryTarget: primary,
      secondaryTarget: secondary,
      primaryAchieved: 0,
      secondaryAchieved: 0,
      productFocus: targetProductFocus.trim() || 'General Portfolio',
      status: 'Allocated',
      incentiveEarned: 0,
      incentiveStatus: 'Pending'
    };

    setTargets([newTgt, ...targets]);
    showToast(`Target of ₹${primary.toLocaleString('en-IN')} allocated to ${emp.name} for ${selectedMonth}!`);
    setIsAddModalOpen(false);
    setTargetEmpId('');
  };

  const handleUpdateAchievement = (id: string, primaryAch: number, secondaryAch: number) => {
    const updated = targets.map(t => {
      if (t.id === id) {
        const achPercent = t.primaryTarget > 0 ? (primaryAch / t.primaryTarget) * 100 : 0;
        let incentive = 0;
        let status: TargetAllocation['status'] = 'In Progress';
        
        if (achPercent >= 100) {
          status = 'Achieved';
          incentive = primaryAch * 0.05; // 5% bonus for 100%+
        } else if (achPercent >= 90) {
          status = 'In Progress';
          incentive = primaryAch * 0.02; // 2% bonus
        } else {
          status = 'Shortfall';
          incentive = 0;
        }

        return {
          ...t,
          primaryAchieved: primaryAch,
          secondaryAchieved: secondaryAch,
          status,
          incentiveEarned: Math.round(incentive)
        };
      }
      return t;
    });
    setTargets(updated);
    showToast('Sales achievement & calculated incentives updated!');
  };

  const handleApproveIncentive = (id: string) => {
    const updated = targets.map(t => {
      if (t.id === id) {
        return {
          ...t,
          incentiveStatus: 'Approved' as const
        };
      }
      return t;
    });
    setTargets(updated);
    showToast('Incentive approved for payroll release!');
  };

  const handleExportCsv = () => {
    const headers = ['Target ID', 'Employee', 'Role', 'HQ', 'Month', 'Primary Target', 'Primary Achieved', 'Achievement %', 'Incentive (INR)', 'Incentive Status'];
    const rows = filteredTargets.map(t => {
      const ach = t.primaryTarget > 0 ? ((t.primaryAchieved / t.primaryTarget) * 100).toFixed(1) : '0';
      return [
        t.id,
        `"${t.employeeName}"`,
        t.role,
        `"${t.hq}"`,
        t.month,
        t.primaryTarget,
        t.primaryAchieved,
        `${ach}%`,
        t.incentiveEarned || 0,
        t.incentiveStatus || 'Pending'
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `sales_targets_${selectedMonth}_${company.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Target vs Achievement report downloaded as CSV!');
  };

  const filteredTargets = targets.filter(t => {
    const matchMonth = selectedMonth ? t.month === selectedMonth : true;
    const matchHq = selectedHqFilter === 'ALL' ? true : t.hq === selectedHqFilter;
    const matchSearch = t.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.hq.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMonth && matchHq && matchSearch;
  });

  // Calculate totals
  const totalTarget = filteredTargets.reduce((acc, t) => acc + t.primaryTarget, 0);
  const totalAchieved = filteredTargets.reduce((acc, t) => acc + t.primaryAchieved, 0);
  const totalIncentives = filteredTargets.reduce((acc, t) => acc + (t.incentiveEarned || 0), 0);
  const overallPercentage = totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0;

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
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Target vs Achievement & Incentive Manager</h1>
              <p className="text-xs text-gray-500">
                HQ-wise monthly sales allocation, primary & secondary achievement, and automated incentive payouts.
              </p>
            </div>
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
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Allocate Target
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Sales Target</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 mt-2">₹{totalTarget.toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-500 mt-1">{filteredTargets.length} field allocations</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Achieved</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600 mt-2">₹{totalAchieved.toLocaleString('en-IN')}</div>
          <div className="flex items-center text-xs font-bold text-emerald-700 mt-1 gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> {overallPercentage}% of target
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Incentive Pool</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-600 mt-2">₹{totalIncentives.toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-500 mt-1">Calculated on slab bonuses</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Month & Slabs</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-sm font-bold text-gray-900 mt-2">{selectedMonth}</div>
          <div className="text-[11px] text-gray-500 mt-1">≥100%: 5% Bonus | ≥90%: 2%</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
            <Filter className="w-4 h-4 text-gray-400" />
            <span>Month:</span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
              <option value="2026-09">September 2026</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold text-gray-700">
            <span>HQ Filter:</span>
            <select
              value={selectedHqFilter}
              onChange={e => setSelectedHqFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Headquarters</option>
              {existingHqs.map(h => (
                <option key={h.id || h.name} value={h.name}>{h.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search MR, HQ, role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Target Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="px-5 py-3.5">Employee</th>
                <th className="px-5 py-3.5">Headquarters</th>
                <th className="px-5 py-3.5">Primary Target / Achieved</th>
                <th className="px-5 py-3.5">Secondary Target</th>
                <th className="px-5 py-3.5">Progress</th>
                <th className="px-5 py-3.5">Incentive</th>
                <th className="px-5 py-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs font-medium">
              {filteredTargets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No target allocations found for the selected filters. Use "Allocate Target" to add.
                  </td>
                </tr>
              ) : (
                filteredTargets.map(t => {
                  const percent = t.primaryTarget > 0 ? Math.min(Math.round((t.primaryAchieved / t.primaryTarget) * 100), 200) : 0;
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-gray-900">{t.employeeName}</div>
                        <div className="text-[10px] text-gray-500">{t.role} • {t.employeeId}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 font-semibold text-gray-800">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{t.hq}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 italic mt-0.5 truncate max-w-xs">{t.productFocus}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-gray-900">₹{t.primaryAchieved.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-gray-500">Target: ₹{t.primaryTarget.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-gray-800">₹{t.secondaryAchieved.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-gray-500">Target: ₹{t.secondaryTarget.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className={percent >= 100 ? 'text-emerald-700' : percent >= 80 ? 'text-amber-700' : 'text-red-700'}>
                              {percent}%
                            </span>
                            <span className="text-gray-400">{t.status}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-1.5 rounded-full ${percent >= 100 ? 'bg-emerald-500' : percent >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-amber-700">₹{(t.incentiveEarned || 0).toLocaleString('en-IN')}</div>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          t.incentiveStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {t.incentiveStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-y-1">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              const newPri = prompt('Enter Actual Primary Sales Achieved (INR):', String(t.primaryAchieved));
                              if (newPri !== null) {
                                const newSec = prompt('Enter Actual Secondary Sales Achieved (INR):', String(t.secondaryAchieved));
                                handleUpdateAchievement(t.id, parseFloat(newPri) || 0, parseFloat(newSec || '0') || 0);
                              }
                            }}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Update Sales
                          </button>
                          {t.incentiveEarned && t.incentiveEarned > 0 && t.incentiveStatus !== 'Approved' && (
                            <button
                              onClick={() => handleApproveIncentive(t.id)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocate Target Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" /> Allocate Sales Target
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleAddTarget} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Field Employee *</label>
                <select
                  required
                  value={targetEmpId}
                  onChange={e => setTargetEmpId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">-- Choose Field Rep / Manager --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role}) - {emp.hq || 'No HQ'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Primary Target (₹) *</label>
                  <input
                    type="number"
                    required
                    value={targetPrimary}
                    onChange={e => setTargetPrimary(e.target.value)}
                    placeholder="350000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Secondary Target (₹)</label>
                  <input
                    type="number"
                    value={targetSecondary}
                    onChange={e => setTargetSecondary(e.target.value)}
                    placeholder="320000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Key Focus Products / Schemes</label>
                <input
                  type="text"
                  value={targetProductFocus}
                  onChange={e => setTargetProductFocus(e.target.value)}
                  placeholder="e.g. Cefixime 200, Azithromycin 500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Allocate Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
