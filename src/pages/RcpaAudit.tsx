import React, { useState, useEffect } from 'react';
import { 
  FileCheck, Stethoscope, ShoppingBag, TrendingUp, Download, Plus, Search, Filter, CheckCircle2,
  BarChart3, PieChart, Users, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { getActiveCompanyId, getActiveCompany } from '../data/companyContext';
import { getDoctorsList, getChemistsList, getProductsCatalog } from '../data/masterData';

interface RcpaRecord {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  chemistName: string;
  chemistArea: string;
  ourProduct: string;
  ourQtyPrescribed: number;
  ourPrice: number;
  competitor1Name: string;
  competitor1Qty: number;
  competitor1Price: number;
  competitor2Name: string;
  competitor2Qty: number;
  competitor2Price: number;
  auditDate: string;
  auditedBy: string;
  rxSharePercent: number;
}

export default function RcpaAudit() {
  const activeCompanyId = getActiveCompanyId();
  const company = getActiveCompany();
  const doctors = getDoctorsList(activeCompanyId);
  const chemists = getChemistsList(activeCompanyId);
  const products = getProductsCatalog(activeCompanyId);

  const loadAuditRecords = (): RcpaRecord[] => {
    try {
      const saved = localStorage.getItem(`raxon_rcpa_${activeCompanyId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'RCPA-001',
        doctorName: 'Dr. Rajesh Sharma',
        doctorSpecialty: 'Cardiologist',
        chemistName: 'Apo Pharmacy',
        chemistArea: 'Hazratganj Central',
        ourProduct: 'Cefixime 200mg',
        ourQtyPrescribed: 45,
        ourPrice: 145,
        competitor1Name: 'Taxim-O 200 (Alkem)',
        competitor1Qty: 70,
        competitor1Price: 165,
        competitor2Name: 'Mahacef 200 (Mankind)',
        competitor2Qty: 35,
        competitor2Price: 140,
        auditDate: '2026-08-15',
        auditedBy: 'Rahul Verma (MR)',
        rxSharePercent: 30
      },
      {
        id: 'RCPA-002',
        doctorName: 'Dr. Priya Nair',
        doctorSpecialty: 'Pediatrician',
        chemistName: 'MedPlus Chemist',
        chemistArea: 'Aliganj North',
        ourProduct: 'Pantoprazole 40mg',
        ourQtyPrescribed: 80,
        ourPrice: 120,
        competitor1Name: 'Pan-40 (Alkem)',
        competitor1Qty: 50,
        competitor1Price: 135,
        competitor2Name: 'Pantocid (Sun Pharma)',
        competitor2Qty: 20,
        competitor2Price: 145,
        auditDate: '2026-08-14',
        auditedBy: 'Rahul Verma (MR)',
        rxSharePercent: 53.3
      },
      {
        id: 'RCPA-003',
        doctorName: 'Dr. Vivek Agrawal',
        doctorSpecialty: 'Physician',
        chemistName: 'Gupta Medical Hall',
        chemistArea: 'Civil Lines',
        ourProduct: 'Azithromycin 500mg',
        ourQtyPrescribed: 60,
        ourPrice: 115,
        competitor1Name: 'Azee 500 (Cipla)',
        competitor1Qty: 85,
        competitor1Price: 125,
        competitor2Name: 'Azithral (Alembic)',
        competitor2Qty: 30,
        competitor2Price: 130,
        auditDate: '2026-08-13',
        auditedBy: 'Pooja Sharma (MR)',
        rxSharePercent: 34.2
      }
    ];
  };

  const [records, setRecords] = useState<RcpaRecord[]>(loadAuditRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [newAudit, setNewAudit] = useState({
    doctorName: '',
    chemistName: '',
    ourProduct: '',
    ourQtyPrescribed: 40,
    ourPrice: 120,
    competitor1Name: '',
    competitor1Qty: 60,
    competitor1Price: 135,
    competitor2Name: '',
    competitor2Qty: 20,
    competitor2Price: 125,
    auditedBy: 'Rahul Verma (MR)'
  });

  useEffect(() => {
    localStorage.setItem(`raxon_rcpa_${activeCompanyId}`, JSON.stringify(records));
  }, [records, activeCompanyId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find(d => d.name === newAudit.doctorName) || { specialty: 'General Physician' };
    const chm = chemists.find(c => c.name === newAudit.chemistName) || { area: 'Main Market' };

    const totalQty = Number(newAudit.ourQtyPrescribed) + Number(newAudit.competitor1Qty) + Number(newAudit.competitor2Qty);
    const share = totalQty > 0 ? (Number(newAudit.ourQtyPrescribed) / totalQty) * 100 : 0;

    const record: RcpaRecord = {
      id: `RCPA-${Date.now().toString().slice(-4)}`,
      doctorName: newAudit.doctorName || 'Dr. Doctor',
      doctorSpecialty: doc.specialty || 'General',
      chemistName: newAudit.chemistName || 'Chemist Store',
      chemistArea: chm.area || 'Head Office Area',
      ourProduct: newAudit.ourProduct || products[0]?.name || 'Cefixime 200mg',
      ourQtyPrescribed: Number(newAudit.ourQtyPrescribed) || 0,
      ourPrice: Number(newAudit.ourPrice) || 0,
      competitor1Name: newAudit.competitor1Name || 'Competitor Brand A',
      competitor1Qty: Number(newAudit.competitor1Qty) || 0,
      competitor1Price: Number(newAudit.competitor1Price) || 0,
      competitor2Name: newAudit.competitor2Name || 'Competitor Brand B',
      competitor2Qty: Number(newAudit.competitor2Qty) || 0,
      competitor2Price: Number(newAudit.competitor2Price) || 0,
      auditDate: new Date().toISOString().split('T')[0],
      auditedBy: newAudit.auditedBy,
      rxSharePercent: parseFloat(share.toFixed(1))
    };

    setRecords([record, ...records]);
    showToast(`RCPA Audit recorded for ${record.doctorName} (${record.rxSharePercent}% Rx Share)!`);
    setIsAddModalOpen(false);
  };

  const handleExportCsv = () => {
    const headers = ['Audit ID', 'Doctor Name', 'Specialty', 'Chemist Counter', 'Area', 'Our Brand', 'Our Qty (Strips)', 'Competitor 1', 'Comp 1 Qty', 'Competitor 2', 'Comp 2 Qty', 'Our Rx Share %', 'Audited By', 'Date'];
    const rows = filteredRecords.map(r => [
      r.id,
      `"${r.doctorName}"`,
      r.doctorSpecialty,
      `"${r.chemistName}"`,
      `"${r.chemistArea}"`,
      `"${r.ourProduct}"`,
      r.ourQtyPrescribed,
      `"${r.competitor1Name}"`,
      r.competitor1Qty,
      `"${r.competitor2Name}"`,
      r.competitor2Qty,
      `${r.rxSharePercent}%`,
      `"${r.auditedBy}"`,
      r.auditDate
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `rcpa_prescription_audit_${company.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('RCPA Competitor audit data exported as CSV!');
  };

  const filteredRecords = records.filter(r => 
    r.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.chemistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.ourProduct.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.competitor1Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalOurPrescriptions = records.reduce((acc, r) => acc + r.ourQtyPrescribed, 0);
  const totalMarketPrescriptions = records.reduce((acc, r) => acc + r.ourQtyPrescribed + r.competitor1Qty + r.competitor2Qty, 0);
  const avgRxShare = totalMarketPrescriptions > 0 ? ((totalOurPrescriptions / totalMarketPrescriptions) * 100).toFixed(1) : '0';

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
          <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">RCPA (Retail Chemist Prescription Audit)</h1>
            <p className="text-xs text-gray-500">
              Chemist-wise doctor prescription audits, competitor brand volumes, market share tracking & conversion intelligence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" /> Export RCPA CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Chemist RCPA Audit
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Average Rx Market Share</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600 mt-2">{avgRxShare}%</div>
          <div className="text-xs text-gray-500 mt-1">Across all audited doctor counters</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Our Brand Prescriptions</span>
            <Stethoscope className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-gray-900 mt-2">{totalOurPrescriptions} Strips/Mo</div>
          <div className="text-xs text-gray-500 mt-1">From {records.length} key doctors</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Market Volume</span>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-extrabold text-purple-600 mt-2">{totalMarketPrescriptions} Strips/Mo</div>
          <div className="text-xs text-gray-500 mt-1">Including competitor molecules</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Audited Chemists</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-600 mt-2">{new Set(records.map(r => r.chemistName)).size} Stores</div>
          <div className="text-xs text-gray-500 mt-1">Primary retail audit counters</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xs font-bold text-gray-700">
          Showing <span className="text-indigo-600">{filteredRecords.length}</span> chemist prescription audits
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctor, chemist, brand..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* RCPA Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="px-5 py-3.5">Doctor & Specialty</th>
                <th className="px-5 py-3.5">Chemist Counter</th>
                <th className="px-5 py-3.5">Our Brand & Volume</th>
                <th className="px-5 py-3.5">Competitor 1</th>
                <th className="px-5 py-3.5">Competitor 2</th>
                <th className="px-5 py-3.5">Our Rx Share</th>
                <th className="px-5 py-3.5">Audit Date & MR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs font-medium">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No RCPA prescription audits found. Click "Add Chemist RCPA Audit" to start recording competitor intelligence.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-gray-900">{rec.doctorName}</div>
                      <div className="text-[10px] text-gray-500">{rec.doctorSpecialty}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-gray-800">{rec.chemistName}</div>
                      <div className="text-[10px] text-gray-500">{rec.chemistArea}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-indigo-700">{rec.ourProduct}</div>
                      <div className="text-[10px] text-emerald-700 font-bold">{rec.ourQtyPrescribed} Strips @ ₹{rec.ourPrice}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-gray-900 font-semibold">{rec.competitor1Name}</div>
                      <div className="text-[10px] text-gray-500">{rec.competitor1Qty} Strips @ ₹{rec.competitor1Price}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-gray-900 font-semibold">{rec.competitor2Name}</div>
                      <div className="text-[10px] text-gray-500">{rec.competitor2Qty} Strips @ ₹{rec.competitor2Price}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className={rec.rxSharePercent >= 50 ? 'text-emerald-700' : 'text-amber-700'}>
                            {rec.rxSharePercent}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${rec.rxSharePercent >= 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(rec.rxSharePercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-gray-900 font-semibold">{rec.auditDate}</div>
                      <div className="text-[10px] text-gray-500">{rec.auditedBy}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add RCPA Audit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" /> Record Chemist RCPA Prescription Audit
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateAudit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Doctor *</label>
                  <select
                    required
                    value={newAudit.doctorName}
                    onChange={e => setNewAudit({ ...newAudit, doctorName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">-- Select Doctor --</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Audited Chemist Counter *</label>
                  <select
                    required
                    value={newAudit.chemistName}
                    onChange={e => setNewAudit({ ...newAudit, chemistName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">-- Select Chemist --</option>
                    {chemists.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.area})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Our Brand Section */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
                <span className="text-xs font-bold text-indigo-900">1. Our Company's Brand</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-3xs font-bold text-gray-600 mb-0.5">Product</label>
                    <select
                      value={newAudit.ourProduct}
                      onChange={e => setNewAudit({ ...newAudit, ourProduct: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white"
                    >
                      <option value="">-- Product --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-3xs font-bold text-gray-600 mb-0.5">Monthly Qty (Strips)</label>
                    <input
                      type="number"
                      value={newAudit.ourQtyPrescribed}
                      onChange={e => setNewAudit({ ...newAudit, ourQtyPrescribed: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-bold text-gray-600 mb-0.5">MRP (₹)</label>
                    <input
                      type="number"
                      value={newAudit.ourPrice}
                      onChange={e => setNewAudit({ ...newAudit, ourPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Competitor 1 Section */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-gray-800">2. Primary Competitor Brand</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-3xs font-bold text-gray-600 mb-0.5">Brand & Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Taxim-O (Alkem)"
                      value={newAudit.competitor1Name}
                      onChange={e => setNewAudit({ ...newAudit, competitor1Name: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-bold text-gray-600 mb-0.5">Monthly Qty (Strips)</label>
                    <input
                      type="number"
                      value={newAudit.competitor1Qty}
                      onChange={e => setNewAudit({ ...newAudit, competitor1Qty: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-bold text-gray-600 mb-0.5">MRP (₹)</label>
                    <input
                      type="number"
                      value={newAudit.competitor1Price}
                      onChange={e => setNewAudit({ ...newAudit, competitor1Price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Competitor 2 Section */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <span className="text-xs font-bold text-gray-800">3. Secondary Competitor Brand</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-3xs font-bold text-gray-600 mb-0.5">Brand & Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Mahacef (Mankind)"
                      value={newAudit.competitor2Name}
                      onChange={e => setNewAudit({ ...newAudit, competitor2Name: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-bold text-gray-600 mb-0.5">Monthly Qty (Strips)</label>
                    <input
                      type="number"
                      value={newAudit.competitor2Qty}
                      onChange={e => setNewAudit({ ...newAudit, competitor2Qty: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-bold text-gray-600 mb-0.5">MRP (₹)</label>
                    <input
                      type="number"
                      value={newAudit.competitor2Price}
                      onChange={e => setNewAudit({ ...newAudit, competitor2Price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>
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
                  Save RCPA Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
