import React, { useState, useEffect } from 'react';
import { 
  Package, Gift, Plus, Download, Search, Filter, CheckCircle2, AlertTriangle, ArrowDownRight, 
  Send, Users, ShieldCheck, RefreshCw, BarChart2, CheckSquare, Pill
} from 'lucide-react';
import { getActiveCompanyId, getActiveCompany } from '../data/companyContext';
import { getUsersByCompany } from '../data/userContext';
import { getProductsCatalog } from '../data/masterData';

interface SampleItem {
  id: string;
  name: string;
  type: 'Sample Medicine' | 'Promotional Gift' | 'Visual Aid / LBL';
  batchNo: string;
  expiry: string;
  centralStock: number;
  allocatedStock: number;
  unit: string;
}

interface SampleAllotment {
  id: string;
  sampleId: string;
  sampleName: string;
  employeeId: string;
  employeeName: string;
  hq: string;
  quantity: number;
  distributedToDoctors: number;
  balanceStock: number;
  dateAllocated: string;
  status: 'Dispatched' | 'Acknowledged' | 'Audited';
}

export default function SampleInventory() {
  const activeCompanyId = getActiveCompanyId();
  const company = getActiveCompany();
  const employees = getUsersByCompany(activeCompanyId);
  const products = getProductsCatalog(activeCompanyId);

  const loadCentralStock = (): SampleItem[] => {
    try {
      const saved = localStorage.getItem(`raxon_sample_master_${activeCompanyId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'SMP-01',
        name: 'Cefixime 200mg (Physician Sample 4s)',
        type: 'Sample Medicine',
        batchNo: 'SMP-CF-88',
        expiry: '2027-12',
        centralStock: 1200,
        allocatedStock: 800,
        unit: 'Packs'
      },
      {
        id: 'SMP-02',
        name: 'Pantoprazole 40mg (Doctor Sample 2s)',
        type: 'Sample Medicine',
        batchNo: 'SMP-PAN-12',
        expiry: '2028-02',
        centralStock: 2500,
        allocatedStock: 1500,
        unit: 'Packs'
      },
      {
        id: 'GFT-01',
        name: 'Executive Metal Doctor Pen & Notepad',
        type: 'Promotional Gift',
        batchNo: 'GFT-2026-A',
        expiry: 'N/A',
        centralStock: 300,
        allocatedStock: 200,
        unit: 'Units'
      },
      {
        id: 'LBL-01',
        name: 'Cardiology Visual Aid Folder (Laminated)',
        type: 'Visual Aid / LBL',
        batchNo: 'VA-CARDIO',
        expiry: 'N/A',
        centralStock: 80,
        allocatedStock: 45,
        unit: 'Units'
      }
    ];
  };

  const loadAllotments = (): SampleAllotment[] => {
    try {
      const saved = localStorage.getItem(`raxon_sample_allotments_${activeCompanyId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'ALT-101',
        sampleId: 'SMP-01',
        sampleName: 'Cefixime 200mg (Physician Sample 4s)',
        employeeId: 'MR-01',
        employeeName: 'Rahul Verma',
        hq: 'Lucknow HQ',
        quantity: 150,
        distributedToDoctors: 110,
        balanceStock: 40,
        dateAllocated: '2026-08-01',
        status: 'Acknowledged'
      },
      {
        id: 'ALT-102',
        sampleId: 'SMP-02',
        sampleName: 'Pantoprazole 40mg (Doctor Sample 2s)',
        employeeId: 'MR-01',
        employeeName: 'Rahul Verma',
        hq: 'Lucknow HQ',
        quantity: 200,
        distributedToDoctors: 140,
        balanceStock: 60,
        dateAllocated: '2026-08-01',
        status: 'Acknowledged'
      },
      {
        id: 'ALT-103',
        sampleId: 'GFT-01',
        sampleName: 'Executive Metal Doctor Pen & Notepad',
        employeeId: 'MR-02',
        employeeName: 'Pooja Sharma',
        hq: 'Kanpur HQ',
        quantity: 50,
        distributedToDoctors: 35,
        balanceStock: 15,
        dateAllocated: '2026-08-03',
        status: 'Audited'
      }
    ];
  };

  const [samples, setSamples] = useState<SampleItem[]>(loadCentralStock);
  const [allotments, setAllotments] = useState<SampleAllotment[]>(loadAllotments);
  const [activeTab, setActiveTab] = useState<'central' | 'allotments'>('allotments');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddSampleModalOpen, setIsAddSampleModalOpen] = useState(false);
  const [isAllotModalOpen, setIsAllotModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [newSample, setNewSample] = useState({
    name: '',
    type: 'Sample Medicine' as SampleItem['type'],
    batchNo: '',
    expiry: '2027-12',
    centralStock: 500,
    unit: 'Packs'
  });

  const [allotForm, setAllotForm] = useState({
    sampleId: '',
    employeeId: '',
    quantity: 50
  });

  useEffect(() => {
    const handleSync = () => {
      setSamples(loadCentralStock());
      setAllotments(loadAllotments());
    };
    window.addEventListener('raxon-samples-updated', handleSync);
    window.addEventListener('raxon-company-switched', handleSync);
    window.addEventListener('raxon-company-updated', handleSync);
    return () => {
      window.removeEventListener('raxon-samples-updated', handleSync);
      window.removeEventListener('raxon-company-switched', handleSync);
      window.removeEventListener('raxon-company-updated', handleSync);
    };
  }, [activeCompanyId]);

  useEffect(() => {
    localStorage.setItem(`raxon_sample_master_${activeCompanyId}`, JSON.stringify(samples));
  }, [samples, activeCompanyId]);

  useEffect(() => {
    localStorage.setItem(`raxon_sample_allotments_${activeCompanyId}`, JSON.stringify(allotments));
  }, [allotments, activeCompanyId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateSample = (e: React.FormEvent) => {
    e.preventDefault();
    const item: SampleItem = {
      id: `SMP-${Date.now().toString().slice(-4)}`,
      name: newSample.name,
      type: newSample.type,
      batchNo: newSample.batchNo || 'BATCH-01',
      expiry: newSample.expiry,
      centralStock: Number(newSample.centralStock) || 0,
      allocatedStock: 0,
      unit: newSample.unit
    };
    setSamples([item, ...samples]);
    showToast(`New sample item "${item.name}" registered in inventory!`);
    setIsAddSampleModalOpen(false);
    setNewSample({ name: '', type: 'Sample Medicine', batchNo: '', expiry: '2027-12', centralStock: 500, unit: 'Packs' });
  };

  const handleAllotSample = (e: React.FormEvent) => {
    e.preventDefault();
    const sample = samples.find(s => s.id === allotForm.sampleId);
    const emp = employees.find(u => u.id === allotForm.employeeId);
    if (!sample || !emp) {
      alert('Please choose both a valid sample and an employee.');
      return;
    }
    const qty = Number(allotForm.quantity) || 0;
    if (sample.centralStock < qty) {
      alert(`Insufficient central stock. Available: ${sample.centralStock}`);
      return;
    }

    // Deduct central stock
    setSamples(samples.map(s => {
      if (s.id === sample.id) {
        return {
          ...s,
          centralStock: s.centralStock - qty,
          allocatedStock: s.allocatedStock + qty
        };
      }
      return s;
    }));

    const newAllot: SampleAllotment = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      sampleId: sample.id,
      sampleName: sample.name,
      employeeId: emp.id,
      employeeName: emp.name,
      hq: emp.hq || 'Lucknow HQ',
      quantity: qty,
      distributedToDoctors: 0,
      balanceStock: qty,
      dateAllocated: new Date().toISOString().split('T')[0],
      status: 'Dispatched'
    };

    setAllotments([newAllot, ...allotments]);
    showToast(`Issued ${qty} ${sample.unit} to ${emp.name} (${emp.hq})!`);
    setIsAllotModalOpen(false);
    setAllotForm({ sampleId: '', employeeId: '', quantity: 50 });
  };

  const handleRecordDoctorDistribution = (allotId: string) => {
    const allot = allotments.find(a => a.id === allotId);
    if (!allot) return;
    const additional = prompt(`Enter number of samples given to doctors (Current given: ${allot.distributedToDoctors}/${allot.quantity}):`, '10');
    if (additional !== null) {
      const addedQty = parseInt(additional) || 0;
      const newGiven = Math.min(allot.distributedToDoctors + addedQty, allot.quantity);
      setAllotments(allotments.map(a => {
        if (a.id === allotId) {
          return {
            ...a,
            distributedToDoctors: newGiven,
            balanceStock: a.quantity - newGiven,
            status: (a.quantity - newGiven === 0 ? 'Audited' : 'Acknowledged') as any
          };
        }
        return a;
      }));
      showToast('Doctor sample distribution log updated!');
    }
  };

  const handleExportCsv = () => {
    const headers = ['Allotment ID', 'Sample / Gift', 'Field Rep', 'HQ', 'Date Issued', 'Allocated Qty', 'Distributed to Doctors', 'Balance Left', 'Status'];
    const rows = allotments.map(a => [
      a.id,
      `"${a.sampleName}"`,
      `"${a.employeeName}"`,
      `"${a.hq}"`,
      a.dateAllocated,
      a.quantity,
      a.distributedToDoctors,
      a.balanceStock,
      a.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `sample_inventory_audit_${company.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sample inventory audit report exported!');
  };

  const totalCentralStock = samples.reduce((acc, s) => acc + s.centralStock, 0);
  const totalAllocated = allotments.reduce((acc, a) => acc + a.quantity, 0);
  const totalDistributed = allotments.reduce((acc, a) => acc + a.distributedToDoctors, 0);
  const totalFieldBalance = allotments.reduce((acc, a) => acc + a.balanceStock, 0);

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
          <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Sample & Promotional Inputs Inventory</h1>
            <p className="text-xs text-gray-500">
              Control physician samples, visual aids, doctor promotional gifts, MR allotments and closing balance audits.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" /> Export Audit CSV
          </button>
          <button
            onClick={() => setIsAddSampleModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Sample SKU
          </button>
          <button
            onClick={() => setIsAllotModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" /> Issue to MR
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Central Warehouse Stock</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 mt-2">{totalCentralStock.toLocaleString()} Units</div>
          <div className="text-xs text-gray-500 mt-1">{samples.length} registered SKUs</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Dispatched to MRs</span>
            <Send className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-extrabold text-purple-600 mt-2">{totalAllocated.toLocaleString()} Units</div>
          <div className="text-xs text-gray-500 mt-1">{allotments.length} field allotments</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Distributed to Doctors</span>
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600 mt-2">{totalDistributed.toLocaleString()} Units</div>
          <div className="text-xs text-emerald-700 font-bold mt-1">
            {totalAllocated > 0 ? Math.round((totalDistributed / totalAllocated) * 100) : 0}% verified consumed
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Field Rep Closing Balance</span>
            <Gift className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-600 mt-2">{totalFieldBalance.toLocaleString()} Units</div>
          <div className="text-xs text-gray-500 mt-1">Ready for next doctor calls</div>
        </div>
      </div>

      {/* Tabs Switcher & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl text-xs font-bold w-full md:w-auto">
          <button
            onClick={() => setActiveTab('allotments')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'allotments' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            MR Allotments & Doctor Distribution ({allotments.length})
          </button>
          <button
            onClick={() => setActiveTab('central')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'central' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Central Stock & SKU Master ({samples.length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sample, MR, batch..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* TAB 1: ALLOTMENTS & FIELD BALANCE */}
      {activeTab === 'allotments' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Sample / Promotional Item</th>
                  <th className="px-5 py-3.5">Assigned MR & HQ</th>
                  <th className="px-5 py-3.5">Date Issued</th>
                  <th className="px-5 py-3.5">Issued Qty</th>
                  <th className="px-5 py-3.5">Given to Doctors</th>
                  <th className="px-5 py-3.5">Closing Balance</th>
                  <th className="px-5 py-3.5 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs font-medium">
                {allotments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No sample allotments recorded yet. Click "Issue to MR" to allocate promotional inputs.
                    </td>
                  </tr>
                ) : (
                  allotments.map(allot => (
                    <tr key={allot.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-gray-900">{allot.sampleName}</div>
                        <div className="text-[10px] text-gray-500">ID: {allot.id}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-gray-800">{allot.employeeName}</div>
                        <div className="text-[10px] text-gray-500">{allot.hq}</div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{allot.dateAllocated}</td>
                      <td className="px-5 py-3.5 font-bold text-gray-900">{allot.quantity}</td>
                      <td className="px-5 py-3.5 font-bold text-emerald-700">{allot.distributedToDoctors}</td>
                      <td className="px-5 py-3.5 font-extrabold text-amber-700">{allot.balanceStock}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleRecordDoctorDistribution(allot.id)}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Record Call Samples
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CENTRAL STOCK MASTER */}
      {activeTab === 'central' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Item Name & SKU</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Batch / Expiry</th>
                  <th className="px-5 py-3.5">Central Warehouse Stock</th>
                  <th className="px-5 py-3.5">Allocated to Field</th>
                  <th className="px-5 py-3.5 text-right">Quick Stock Addition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs font-medium">
                {samples.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-gray-900">{s.name}</div>
                      <div className="text-[10px] text-gray-500">SKU: {s.id}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.type === 'Sample Medicine' ? 'bg-blue-100 text-blue-800' :
                        s.type === 'Promotional Gift' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {s.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-gray-900 font-semibold">{s.batchNo}</div>
                      <div className="text-[10px] text-gray-500">Exp: {s.expiry}</div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-gray-900">{s.centralStock} {s.unit}</td>
                    <td className="px-5 py-3.5 font-bold text-indigo-700">{s.allocatedStock} {s.unit}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          const add = prompt(`Add stock to ${s.name} (Current: ${s.centralStock}):`, '100');
                          if (add !== null) {
                            const val = parseInt(add) || 0;
                            setSamples(samples.map(item => item.id === s.id ? { ...item, centralStock: item.centralStock + val } : item));
                            showToast(`Added ${val} units to central warehouse stock.`);
                          }
                        }}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        + Add Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Sample Modal */}
      {isAddSampleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)] my-auto overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 shrink-0">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" /> Register Sample / Gift SKU
              </h3>
              <button onClick={() => setIsAddSampleModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm p-1 rounded-lg hover:bg-gray-100 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateSample} className="space-y-3.5 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Item / Sample Name *</label>
                <input
                  type="text"
                  required
                  value={newSample.name}
                  onChange={e => setNewSample({ ...newSample, name: e.target.value })}
                  placeholder="e.g. Azithromycin 500mg Sample 3s"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={newSample.type}
                    onChange={e => setNewSample({ ...newSample, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Sample Medicine">Sample Medicine</option>
                    <option value="Promotional Gift">Promotional Gift</option>
                    <option value="Visual Aid / LBL">Visual Aid / LBL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newSample.batchNo}
                    onChange={e => setNewSample({ ...newSample, batchNo: e.target.value })}
                    placeholder="BATCH-2026"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Initial Central Stock</label>
                  <input
                    type="number"
                    value={newSample.centralStock}
                    onChange={e => setNewSample({ ...newSample, centralStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Packaging Unit</label>
                  <input
                    type="text"
                    value={newSample.unit}
                    onChange={e => setNewSample({ ...newSample, unit: e.target.value })}
                    placeholder="Packs / Units"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddSampleModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue to MR Modal */}
      {isAllotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)] my-auto overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 shrink-0">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-600" /> Issue Stock to MR
              </h3>
              <button onClick={() => setIsAllotModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm p-1 rounded-lg hover:bg-gray-100 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAllotSample} className="space-y-3.5 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Sample SKU *</label>
                <select
                  required
                  value={allotForm.sampleId}
                  onChange={e => setAllotForm({ ...allotForm, sampleId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">-- Choose Sample SKU --</option>
                  {samples.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Available: {s.centralStock} {s.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Field Employee (MR / Manager) *</label>
                <select
                  required
                  value={allotForm.employeeId}
                  onChange={e => setAllotForm({ ...allotForm, employeeId: e.target.value })}
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

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Quantity to Issue *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={allotForm.quantity}
                  onChange={e => setAllotForm({ ...allotForm, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAllotModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Dispatch to MR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
