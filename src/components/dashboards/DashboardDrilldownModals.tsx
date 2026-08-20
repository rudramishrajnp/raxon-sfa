import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Phone, 
  Clock, 
  Battery, 
  Navigation, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Download, 
  Printer, 
  Filter, 
  Activity, 
  ShoppingCart, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Layers, 
  Award, 
  Globe, 
  Sparkles,
  Stethoscope,
  Pill,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Modal } from '../Modal';
import { 
  AM_AREA_MRS, 
  AM_CALL_LOGS, 
  AM_POB_ORDERS, 
  AM_MONTHLY_QUOTA,
  RM_AREAS_BREAKDOWN,
  RM_HIERARCHY_TEAMS,
  RM_STOCKISTS_DATA,
  ZM_REGIONS_BREAKDOWN,
  ZM_DIVISIONS_DATA,
  ZM_FIELD_FORCE_SUMMARY,
  DrilldownMR,
  DrilldownCallLog,
  DrilldownPobOrder,
  getDrilldownMrsForCompany,
  getDrilldownCallLogsForCompany,
  getDrilldownPobOrdersForCompany,
  getDrilldownAreasForCompany,
  getDrilldownZonalRegionsForCompany
} from '../../data/dashboardDrilldownData';
import { UserProfile } from '../../data/userContext';
import { getDoctorsList, getChemistsList, getStockistsList, getProductsCatalog } from '../../data/masterData';
import { useDataIsolation } from '../../hooks/useDataIsolation';

// -------------------------------------------------------------
// 1. AM DASHBOARD MODALS
// -------------------------------------------------------------

export function AmActiveMrsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { companyId } = useDataIsolation();
  const areaMrs = getDrilldownMrsForCompany(companyId);
  const [search, setSearch] = useState('');
  const filtered = areaMrs.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.hq.toLowerCase().includes(search.toLowerCase()) ||
    m.patch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Area Field MR Team • Live Daily Attendance & Status">
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* Quick KPI stats banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 text-xs">
          <div>
            <span className="text-3xs font-bold text-blue-900 uppercase">Total Field Reps</span>
            <p className="text-xl font-black text-blue-950">{areaMrs.length} Active</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-emerald-800 uppercase">Punch-In Rate</span>
            <p className="text-xl font-black text-emerald-700">100% (4/4)</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-indigo-900 uppercase">Calls Completed</span>
            <p className="text-xl font-black text-indigo-950">18 / 31</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-purple-900 uppercase">Today's Total POB</span>
            <p className="text-xl font-black text-purple-950">₹38,900</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search MR by name, HQ or territory patch..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Detailed MR Cards */}
        <div className="space-y-3">
          {filtered.map(mr => (
            <div key={mr.id} className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 shadow-2xs transition-all space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    {mr.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-gray-900">{mr.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {mr.punchStatus} ({mr.punchTime})
                      </span>
                    </div>
                    <p className="text-3xs font-semibold text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{mr.hq} • Patch: <strong className="text-gray-800">{mr.patch}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <a
                    href={`tel:${mr.phone}`}
                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-3xs font-extrabold border border-emerald-200 flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-3 h-3" /> Call MR
                  </a>
                  <a
                    href="/tracking"
                    className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg text-3xs font-extrabold border border-indigo-200 flex items-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3 h-3" /> Track GPS
                  </a>
                </div>
              </div>

              {/* MR Field Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-gray-50/70 p-2.5 rounded-lg border border-gray-200/70">
                <div>
                  <span className="text-3xs font-bold text-gray-500 uppercase">Today's Calls</span>
                  <p className="font-extrabold text-gray-900 mt-0.5">{mr.callsDone} / {mr.callsPlanned} done</p>
                </div>
                <div>
                  <span className="text-3xs font-bold text-gray-500 uppercase">POB Booked Today</span>
                  <p className="font-black text-emerald-700 mt-0.5">₹{mr.pobToday.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-3xs font-bold text-gray-500 uppercase">Monthly Target Met</span>
                  <p className="font-extrabold text-purple-950 mt-0.5">
                    {Math.round((mr.monthlyAchieved / mr.monthlyTarget) * 100)}% (₹{(mr.monthlyAchieved / 100000).toFixed(2)}L)
                  </p>
                </div>
                <div>
                  <span className="text-3xs font-bold text-gray-500 uppercase">Phone & GPS Lock</span>
                  <p className="font-semibold text-gray-800 mt-0.5 flex items-center gap-1 text-3xs">
                    <Battery className="w-3.5 h-3.5 text-emerald-600" /> {mr.battery} • {mr.gpsAccuracy}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function AmCallsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { companyId } = useDataIsolation();
  const callLogs = getDrilldownCallLogsForCompany(companyId);
  const areaMrs = getDrilldownMrsForCompany(companyId);
  const [selectedRep, setSelectedRep] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredLogs = callLogs.filter(log => {
    const matchRep = selectedRep === 'ALL' || log.mrId === selectedRep;
    const matchSearch = 
      log.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      log.specialty.toLowerCase().includes(search.toLowerCase()) ||
      log.hospital.toLowerCase().includes(search.toLowerCase()) ||
      log.mrName.toLowerCase().includes(search.toLowerCase());
    return matchRep && matchSearch;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Today's Area Call Logs (${callLogs.length} Calls Completed)`}>
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200 text-xs">
          <div>
            <span className="text-3xs font-bold text-indigo-900 uppercase">Calls Completed</span>
            <p className="text-xl font-black text-indigo-950">{callLogs.length} Calls</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-gray-600 uppercase">Daily Target Met</span>
            <p className="text-xl font-black text-indigo-700">92%</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-emerald-800 uppercase">Joint Calls by AM</span>
            <p className="text-xl font-black text-emerald-700">{callLogs.filter(c => c.isJointCall).length} Verified</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-purple-900 uppercase">Avg Call Duration</span>
            <p className="text-xl font-black text-purple-950">15.2 Mins</p>
          </div>
        </div>

        {/* Rep Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedRep('ALL')}
              className={`px-3 py-1.5 rounded-lg text-3xs font-black whitespace-nowrap transition-colors ${
                selectedRep === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Area Calls ({callLogs.length})
            </button>
            {areaMrs.map(mr => (
              <button
                key={mr.id}
                onClick={() => setSelectedRep(mr.id)}
                className={`px-3 py-1.5 rounded-lg text-3xs font-black whitespace-nowrap transition-colors ${
                  selectedRep === mr.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mr.name ? mr.name.split(' ')[0] : 'Unknown'} ({callLogs.filter(c => c.mrId === mr.id).length})
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
            <input
              type="text"
              placeholder="Search doctor or clinic..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Call Logs Table */}
        <div className="space-y-3">
          {filteredLogs.map(log => (
            <div key={log.id} className="p-3.5 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 shadow-2xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-gray-900 text-xs sm:text-sm">{log.doctorName}</span>
                    <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {log.specialty}
                    </span>
                    {log.isJointCall && (
                      <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                        ⭐ Joint Call
                      </span>
                    )}
                  </div>
                  <p className="text-3xs text-gray-500 font-semibold mt-0.5">
                    {log.hospital} • Field Rep: <strong className="text-indigo-900">{log.mrName}</strong> ({log.territory})
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-3xs font-mono font-extrabold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {log.callTime} ({log.durationMins}m)
                  </span>
                  {log.pobAmount > 0 && (
                    <div className="text-3xs font-black text-emerald-700 mt-1">
                      POB Booked: ₹{log.pobAmount.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Brands & Samples */}
              <div className="text-xs bg-gray-50 p-2 rounded-lg border border-gray-200/80 space-y-1">
                <div className="flex items-center gap-2 text-3xs">
                  <span className="font-bold text-gray-500 uppercase">Brands Detailed:</span>
                  <span className="font-extrabold text-gray-900">{log.detailedBrands.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-3xs">
                  <span className="font-bold text-gray-500 uppercase">Samples Distributed:</span>
                  <span className="font-semibold text-emerald-800">{log.samplesGiven}</span>
                </div>
                <div className="text-3xs text-gray-600 italic">
                  "{log.remarks}"
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function AmPobModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { companyId } = useDataIsolation();
  const pobOrders = getDrilldownPobOrdersForCompany(companyId);
  const totalAmount = pobOrders.reduce((acc, order) => acc + order.totalAmount, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Today's Area POB Orders Ledger (₹${totalAmount.toLocaleString('en-IN')} Total)`}>
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs">
          <div>
            <span className="text-3xs font-bold text-emerald-900 uppercase">Total Today's POB</span>
            <p className="text-xl font-black text-emerald-800">₹{totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-gray-600 uppercase">Orders Captured</span>
            <p className="text-xl font-black text-gray-900">{pobOrders.length} Orders</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-indigo-900 uppercase">Territories Covered</span>
            <p className="text-xl font-black text-indigo-950">Active Areas</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-purple-900 uppercase">Stockist Dispatch</span>
            <p className="text-xl font-black text-purple-950">100% Routed</p>
          </div>
        </div>

        {/* Orders Breakdown */}
        <div className="space-y-3">
          {pobOrders.map(order => (
            <div key={order.orderId} className="p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-gray-100 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-gray-900">{order.chemistName}</h4>
                    <span className="text-3xs font-mono font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {order.orderId}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-100 text-emerald-900">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-3xs text-gray-500 font-semibold mt-0.5">
                    {order.chemistAddress} • Booked by: <strong className="text-indigo-900">{order.mrName}</strong> ({order.territory})
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-base font-black text-emerald-700">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  <div className="text-3xs font-semibold text-gray-500">
                    Routed to: <strong className="text-gray-900">{order.stockistName}</strong>
                  </div>
                </div>
              </div>

              {/* Items Table inside order */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-3xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 font-extrabold uppercase border-b border-gray-200">
                      <th className="py-1 px-2">Brand / Formulation</th>
                      <th className="py-1 px-2">Packing</th>
                      <th className="py-1 px-2 text-center">Qty (Boxes)</th>
                      <th className="py-1 px-2 text-right">PTS Rate (₹)</th>
                      <th className="py-1 px-2 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-1.5 px-2 font-bold text-gray-900">{item.brand}</td>
                        <td className="py-1.5 px-2 text-gray-500">{item.pack}</td>
                        <td className="py-1.5 px-2 text-center font-mono font-bold text-gray-900">{item.qty}</td>
                        <td className="py-1.5 px-2 text-right font-mono text-gray-600">₹{item.rate}</td>
                        <td className="py-1.5 px-2 text-right font-mono font-black text-emerald-800">₹{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function AmQuotaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Area Monthly Sales Quota & Target Run-Rate (₹8.60L / ₹9.90L)">
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 text-xs">
          <div>
            <span className="text-3xs font-bold text-purple-900 uppercase">Monthly Target</span>
            <p className="text-xl font-black text-purple-950">₹9.90 Lakh</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-emerald-800 uppercase">Achieved to Date</span>
            <p className="text-xl font-black text-emerald-700">₹8.60 Lakh</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-gray-600 uppercase">Achievement %</span>
            <p className="text-xl font-black text-indigo-950">86.8%</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-amber-900 uppercase">Remaining Gap</span>
            <p className="text-xl font-black text-amber-800">₹1.30 Lakh</p>
          </div>
        </div>

        {/* Territory-wise Quota Breakdown Table */}
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-extrabold text-3xs uppercase border-b border-gray-200">
                <th className="py-2.5 px-3">Territory HQ</th>
                <th className="py-2.5 px-3">Field MR</th>
                <th className="py-2.5 px-3">Monthly Target</th>
                <th className="py-2.5 px-3">Achieved POB</th>
                <th className="py-2.5 px-3">Achievement %</th>
                <th className="py-2.5 px-3">Top Selling Brand</th>
                <th className="py-2.5 px-3 text-right">Daily Req. Run Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {AM_MONTHLY_QUOTA.map((q, idx) => (
                <tr key={idx} className="hover:bg-purple-50/20">
                  <td className="py-3 px-3 font-extrabold text-gray-900">{q.territory}</td>
                  <td className="py-3 px-3 font-bold text-indigo-900">{q.repOrAm}</td>
                  <td className="py-3 px-3 text-gray-600">₹{(q.target / 100000).toFixed(2)}L</td>
                  <td className="py-3 px-3 font-black text-emerald-700">₹{(q.achieved / 100000).toFixed(2)}L</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${q.percent >= 90 ? 'bg-emerald-500' : 'bg-purple-600'}`}
                          style={{ width: `${Math.min(q.percent, 100)}%` }}
                        />
                      </div>
                      <span className="font-extrabold text-3xs">{q.percent}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-3xs font-semibold text-gray-700">{q.topBrand}</td>
                  <td className="py-3 px-3 text-right font-mono font-black text-amber-700">
                    ₹{q.requiredDailyRunRate.toLocaleString('en-IN')}/day
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

// -------------------------------------------------------------
// 2. RM DASHBOARD MODALS
// -------------------------------------------------------------

export function RmSalesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { companyId } = useDataIsolation();
  const areasBreakdown = getDrilldownAreasForCompany(companyId);
  const totalTarget = areasBreakdown.reduce((sum, a) => sum + a.target, 0);
  const totalAchieved = areasBreakdown.reduce((sum, a) => sum + a.achieved, 0);
  const avgPercent = totalTarget > 0 ? (totalAchieved / totalTarget * 100).toFixed(1) : '90.0';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Regional Sales & POB Revenue Analysis (₹${(totalAchieved / 100000).toFixed(2)}L / ₹${(totalTarget / 100000).toFixed(2)}L)`}>
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 text-xs">
          <div>
            <span className="text-3xs font-bold text-purple-900 uppercase">Region Target</span>
            <p className="text-xl font-black text-purple-950">₹{(totalTarget / 100000).toFixed(2)} Lakh</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-emerald-800 uppercase">Region Achieved</span>
            <p className="text-xl font-black text-emerald-700">₹{(totalAchieved / 100000).toFixed(2)} Lakh</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-gray-600 uppercase">Achievement %</span>
            <p className="text-xl font-black text-indigo-950">{avgPercent}% Quota Met</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-emerald-800 uppercase">YoY Growth</span>
            <p className="text-xl font-black text-emerald-700">+18.5% YoY</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Area-by-Area Secondary Performance</h4>
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-extrabold text-3xs uppercase border-b border-gray-200">
                  <th className="py-2.5 px-3">Area Territory</th>
                  <th className="py-2.5 px-3">Area Manager (AM)</th>
                  <th className="py-2.5 px-3">Monthly Target</th>
                  <th className="py-2.5 px-3">Achieved</th>
                  <th className="py-2.5 px-3">Achievement %</th>
                  <th className="py-2.5 px-3">YoY Growth</th>
                  <th className="py-2.5 px-3 text-right">MTP Discipline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {areasBreakdown.map((area, idx) => (
                  <tr key={idx} className="hover:bg-purple-50/20">
                    <td className="py-3 px-3 font-extrabold text-gray-900">{area.areaName}</td>
                    <td className="py-3 px-3 font-bold text-indigo-900">{area.amName}</td>
                    <td className="py-3 px-3 text-gray-600">₹{(area.target / 100000).toFixed(2)}L</td>
                    <td className="py-3 px-3 font-black text-emerald-700">₹{(area.achieved / 100000).toFixed(2)}L</td>
                    <td className="py-3 px-3 font-black text-purple-900">{area.percent}%</td>
                    <td className="py-3 px-3 font-extrabold text-emerald-700">{area.growthYoY}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-100 text-emerald-900">
                        {area.mtpCompliance}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function RmHierarchyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Regional Hierarchy Directory (Field Teams)">
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <div className="space-y-4">
          {RM_HIERARCHY_TEAMS.map((team, idx) => (
            <div key={idx} className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                <div>
                  <h4 className="text-sm font-black text-indigo-950 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    {team.amName}
                  </h4>
                  <p className="text-3xs text-gray-500 font-semibold">{team.area} • HQ: {team.hq}</p>
                </div>
                <div className="text-3xs font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                  {team.phone}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                {team.reps.map((rep, rIdx) => (
                  <div key={rIdx} className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                    <div className="font-extrabold text-gray-900">{rep.name}</div>
                    <div className="text-3xs text-gray-500 font-semibold">{rep.hq} HQ</div>
                    <div className="flex justify-between text-3xs font-bold text-gray-700 pt-1 border-t border-gray-200">
                      <span>Calls: {rep.calls}</span>
                      <span className="text-emerald-700 font-black">{rep.pob}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function RmComplianceModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { companyId } = useDataIsolation();
  const areasBreakdown = getDrilldownAreasForCompany(companyId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Regional MTP & Field Discipline Compliance (95.5%)">
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-3 gap-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs">
          <div>
            <span className="text-3xs font-bold text-emerald-900 uppercase">MTP Compliance</span>
            <p className="text-xl font-black text-emerald-800">95.5%</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-gray-600 uppercase">On-Time Submissions</span>
            <p className="text-xl font-black text-gray-900">100%</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-indigo-900 uppercase">Route Adherence</span>
            <p className="text-xl font-black text-indigo-950">97.2%</p>
          </div>
        </div>

        <div className="space-y-2">
          {areasBreakdown.map((area, idx) => (
            <div key={idx} className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <div className="font-extrabold text-gray-900 text-xs">{area.areaName} ({area.amName})</div>
                <div className="text-3xs text-gray-500">Field MR Team • 0 Pending Submissions</div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-emerald-700">{area.mtpCompliance}%</span>
                <div className="text-3xs text-gray-400">Compliance Rating</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function RmStockistsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Regional Authorized Stockists Network (24 Agencies • 98% Health)">
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-extrabold text-3xs uppercase border-b border-gray-200">
                <th className="py-2.5 px-3">Stockist Agency</th>
                <th className="py-2.5 px-3">Headquarters / Area</th>
                <th className="py-2.5 px-3">Monthly Turnover</th>
                <th className="py-2.5 px-3">Credit Limit</th>
                <th className="py-2.5 px-3">Outstanding</th>
                <th className="py-2.5 px-3 text-right">Liquidation Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {RM_STOCKISTS_DATA.map((stk, idx) => (
                <tr key={idx} className="hover:bg-amber-50/20">
                  <td className="py-3 px-3 font-extrabold text-gray-900">{stk.name}</td>
                  <td className="py-3 px-3 text-gray-600">{stk.hq} ({stk.area})</td>
                  <td className="py-3 px-3 font-bold text-gray-900">₹{(stk.monthlyTurnover / 100000).toFixed(2)}L</td>
                  <td className="py-3 px-3 text-gray-500">₹{(stk.creditLimit / 100000).toFixed(2)}L</td>
                  <td className="py-3 px-3 font-bold text-amber-700">₹{(stk.outstanding / 100000).toFixed(2)}L</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-100 text-emerald-900">
                      {stk.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

// -------------------------------------------------------------
// 3. ZM DASHBOARD MODALS
// -------------------------------------------------------------

export function ZmRevenueModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { companyId } = useDataIsolation();
  const regions = getDrilldownZonalRegionsForCompany(companyId);
  const totalTarget = regions.reduce((sum, r) => sum + r.target, 0);
  const totalAchieved = regions.reduce((sum, r) => sum + r.achieved, 0);
  const avgPercent = totalTarget > 0 ? (totalAchieved / totalTarget * 100).toFixed(1) : '91.0';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Zonal Strategic Revenue Drilldown (₹${(totalAchieved / 10000000).toFixed(2)} Cr / ₹${(totalTarget / 10000000).toFixed(2)} Cr)`}>
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs">
          <div>
            <span className="text-3xs font-bold text-emerald-900 uppercase">Zonal Quota</span>
            <p className="text-xl font-black text-emerald-950">₹{(totalTarget / 10000000).toFixed(2)} Crore</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-emerald-800 uppercase">Achieved Revenue</span>
            <p className="text-xl font-black text-emerald-800">₹{(totalAchieved / 10000000).toFixed(2)} Crore</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-gray-600 uppercase">Zone Achievement</span>
            <p className="text-xl font-black text-indigo-950">{avgPercent}%</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-emerald-800 uppercase">YoY Growth</span>
            <p className="text-xl font-black text-emerald-700">+19.5% YoY</p>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-extrabold text-3xs uppercase border-b border-gray-200">
                <th className="py-2.5 px-3">Zone Region</th>
                <th className="py-2.5 px-3">Regional Manager (RM)</th>
                <th className="py-2.5 px-3">Target Quota</th>
                <th className="py-2.5 px-3">Achieved Sales</th>
                <th className="py-2.5 px-3">Target %</th>
                <th className="py-2.5 px-3">YoY Growth</th>
                <th className="py-2.5 px-3 text-right">Key Therapeutic Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {regions.map((reg, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/20">
                  <td className="py-3 px-3 font-extrabold text-gray-900">{reg.regionName}</td>
                  <td className="py-3 px-3 font-bold text-indigo-900">{reg.rmName}</td>
                  <td className="py-3 px-3 text-gray-600">₹{(reg.target / 100000).toFixed(2)}L</td>
                  <td className="py-3 px-3 font-black text-emerald-800">₹{(reg.achieved / 100000).toFixed(2)}L</td>
                  <td className="py-3 px-3 font-black text-indigo-950">{reg.percent}%</td>
                  <td className="py-3 px-3 font-extrabold text-emerald-700">{reg.growthYoY}</td>
                  <td className="py-3 px-3 text-right text-3xs font-semibold text-gray-700">{reg.keyDriver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

export function ZmDivisionsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Zonal Active Divisions Portfolio (3 Specialized Divisions)">
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <div className="space-y-3">
          {ZM_DIVISIONS_DATA.map((div, idx) => (
            <div key={idx} className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                <div>
                  <h4 className="text-sm font-black text-gray-900">{div.name}</h4>
                  <p className="text-3xs text-gray-500 font-semibold">{div.head}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-700">₹{(div.achieved / 100000).toFixed(2)}L</span>
                  <span className="text-3xs text-gray-400"> / ₹{(div.target / 100000).toFixed(2)}L ({div.percent}%)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <div>
                  <span className="text-3xs font-bold text-gray-500 uppercase">Core Flagship Brands:</span>
                  <p className="font-extrabold text-indigo-950 mt-0.5">{div.coreBrands.join(' • ')}</p>
                </div>
                <div className="flex justify-between sm:justify-end gap-4 text-3xs font-bold text-gray-700 self-center">
                  <span>Field Strength: {div.fieldStrength} Reps</span>
                  <span>Doctor Reach: {div.doctorCoverage} Doctors</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function ZmFieldForceModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Zonal Field Force Strength (84 Personnel • 97.6% Active)">
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-4 gap-3 bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 text-xs">
          <div>
            <span className="text-3xs font-bold text-purple-900 uppercase">Sanctioned</span>
            <p className="text-xl font-black text-purple-950">{ZM_FIELD_FORCE_SUMMARY.sanctioned}</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-emerald-800 uppercase">On-Roll</span>
            <p className="text-xl font-black text-emerald-800">{ZM_FIELD_FORCE_SUMMARY.onRoll}</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-amber-900 uppercase">Vacant</span>
            <p className="text-xl font-black text-amber-800">{ZM_FIELD_FORCE_SUMMARY.vacant}</p>
          </div>
          <div>
            <span className="text-3xs font-bold text-indigo-900 uppercase">Today's Attendance</span>
            <p className="text-xl font-black text-indigo-950">{ZM_FIELD_FORCE_SUMMARY.attendancePercent}%</p>
          </div>
        </div>

        <div className="space-y-2">
          {ZM_FIELD_FORCE_SUMMARY.breakdown.map((b, idx) => (
            <div key={idx} className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-extrabold text-gray-900">{b.role}</div>
                <div className="text-3xs text-gray-500">Sanctioned: {b.sanctioned} • On-Roll: {b.onRoll}</div>
              </div>
              <div className="text-right">
                <span className="font-black text-emerald-700">{b.activeToday} Active Today</span>
                <div className="text-3xs font-bold text-gray-400">{b.percent}% Present</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// -------------------------------------------------------------
// 4. MR DASHBOARD MODALS
// -------------------------------------------------------------

export function MrDoctorsModal({ isOpen, onClose, territory }: { isOpen: boolean; onClose: () => void; territory: string }) {
  const doctors = getDoctorsList();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`My Prescribing Doctors List • ${territory} (16 Doctors)`}>
      <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {doctors.map(doc => (
            <div key={doc.id} className="p-3.5 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 shadow-2xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-black text-gray-900">{doc.name}</h4>
                  <span className="text-3xs font-extrabold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                    {doc.specialty}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-3xs font-black bg-emerald-100 text-emerald-900">
                  Class A Core
                </span>
              </div>
              <p className="text-3xs text-gray-500 font-semibold">{doc.address || `${doc.area}, ${doc.subArea}`}</p>
              <div className="flex justify-between items-center text-3xs pt-1.5 border-t border-gray-100">
                <span className="text-gray-500 font-semibold">Monthly Visits: 3/3 Done</span>
                <a href={`tel:${doc.phone || '+91 98765 00000'}`} className="text-indigo-600 font-extrabold hover:underline">
                  {doc.phone || 'Call Clinic'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function MrChemistsModal({ isOpen, onClose, territory }: { isOpen: boolean; onClose: () => void; territory: string }) {
  const chemists = getChemistsList();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`My Chemist Retailers List • ${territory} (12 Chemists)`}>
      <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {chemists.map(ch => (
            <div key={ch.id} className="p-3.5 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 shadow-2xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-black text-gray-900">{ch.name}</h4>
                  <p className="text-3xs text-gray-500 font-semibold">Contact: {ch.contactPerson}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-3xs font-black bg-emerald-100 text-emerald-900">
                  RCPA Active
                </span>
              </div>
              <p className="text-3xs text-gray-500 font-semibold">{ch.address || `${ch.area}, ${ch.subArea}`}</p>
              <div className="flex justify-between items-center text-3xs pt-1.5 border-t border-gray-100">
                <span className="text-gray-600 font-bold">Stockist: {ch.stockist || 'Gupta Medical Agency'}</span>
                <a href={`tel:${ch.phone || '+91 98765 00000'}`} className="text-emerald-700 font-extrabold hover:underline">
                  {ch.phone || 'Call Chemist'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
