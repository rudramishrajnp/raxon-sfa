import React, { useState } from 'react';
import { 
  Users, FileText, CheckCircle, Clock, Map, PieChart, Activity, Building, ArrowRight, 
  UserPlus, FileSpreadsheet, Send, TrendingUp, X, Search, ShieldCheck, Check, AlertTriangle, Download, Database
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { INITIAL_DOCTORS, INITIAL_CHEMISTS, INITIAL_STOCKISTS } from '../data/masterData';

export default function SystemAdminDashboard() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: 'MR',
    hq: 'Akbarpur',
    territory: 'Akbarpur Core',
    email: '',
    phone: '',
    division: 'Cardio-Diab'
  });
  const [employeeSuccess, setEmployeeSuccess] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState({
    targetRole: 'All Field Force',
    priority: 'High',
    title: '',
    content: ''
  });
  const [broadcastSent, setBroadcastSent] = useState(false);

  const kpis = [
    { id: 'employees', title: 'Total Employees', value: '142', sub: '84 Field • 58 Support', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'approvals', title: 'Pending Approvals', value: '18', sub: '12 MTPs • 6 DCRs', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 'attendance', title: "Today's Attendance", value: '94%', sub: '133/142 Punched In', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'sync', title: 'Master Sync Health', value: '100%', sub: '0 Sync Errors Reported', icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const complianceData = [
    { name: 'Mon', attendance: 95, dcr: 90 },
    { name: 'Tue', attendance: 96, dcr: 92 },
    { name: 'Wed', attendance: 94, dcr: 94 },
    { name: 'Thu', attendance: 98, dcr: 95 },
    { name: 'Fri', attendance: 92, dcr: 88 },
    { name: 'Sat', attendance: 85, dcr: 80 },
    { name: 'Sun', attendance: 0, dcr: 0 },
  ];

  const recentActivities = [
    { id: 1, user: 'MR Pradeep Mishra', action: 'submitted DCR for Iltifatganj (18 Calls, ₹38,900 POB)', time: '10 mins ago', type: 'dcr', ip: '103.24.12.8' },
    { id: 2, user: 'AM Rahul Sharma', action: 'approved MTP for 3 users (Akbarpur & Tanda Areas)', time: '1 hour ago', type: 'approval', ip: '103.24.15.22' },
    { id: 3, user: 'MR Amit Singh', action: 'marked attendance with GPS deviation warning', time: '2 hours ago', type: 'alert', ip: '49.36.11.90' },
    { id: 4, user: 'System Auto-Backup', action: 'completed automated Firestore database snapshot', time: '3 hours ago', type: 'system', ip: '127.0.0.1 (Cloud Run)' },
    { id: 5, user: 'MR Vivek Kumar', action: 'added a new Doctor Dr. S. N. Verma in Akbarpur Patch 1', time: '4 hours ago', type: 'master', ip: '103.24.12.4' },
    { id: 6, user: 'RM Rajesh Srivastava', action: 'reviewed regional POB ₹34.39L and verified Stockist Ledgers', time: '5 hours ago', type: 'approval', ip: '103.44.19.12' },
    { id: 7, user: 'ZM Alok Nath', action: 'published cycle sales target ₹1.65 Cr for East Zone', time: '6 hours ago', type: 'master', ip: '103.88.21.9' },
  ];

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email) return;
    setEmployeeSuccess(true);
    setTimeout(() => {
      setEmployeeSuccess(false);
      setActiveModal(null);
      setNewEmployee({ name: '', role: 'MR', hq: 'Akbarpur', territory: 'Akbarpur Core', email: '', phone: '', division: 'Cardio-Diab' });
    }, 1500);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.title || !broadcastMessage.content) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setActiveModal(null);
      setBroadcastMessage({ targetRole: 'All Field Force', priority: 'High', title: '', content: '' });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-2xs font-extrabold rounded-md uppercase">
              Raxon Healthcare Central Admin
            </span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-xs font-bold text-gray-500">Live Enterprise Console</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Company Operations Dashboard</h1>
          <p className="text-xs font-semibold text-gray-600">
            Control organizational hierarchy, field users, real-time sync, and pharmaceutical master registries.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            to="/sys-admin/reports"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold flex items-center shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" /> Export Call Reports
          </Link>
          <button 
            onClick={() => setActiveModal('add_employee')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center shadow-2xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4 mr-1.5" /> Add Employee
          </button>
        </div>
      </div>

      {/* Top KPIs (All Clickable with Drill-Down Modals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div 
            key={kpi.id} 
            onClick={() => setActiveModal(`kpi_${kpi.id}`)}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex items-center hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-105 transition-transform`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{kpi.title}</p>
              <h3 className="text-2xl font-black text-gray-900 leading-tight">{kpi.value}</h3>
              <p className="text-3xs font-semibold text-gray-400 mt-0.5 flex items-center gap-1">
                {kpi.sub} <ArrowRight className="w-3 h-3 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Charts & Hierarchy */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Section */}
          <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-black text-gray-900">Weekly Compliance & Tour Trends</h2>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">Real-time Attendance vs DCR Submission Completion Rate (%)</p>
              </div>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-2xs font-extrabold px-2.5 py-1 rounded-full">
                Active Cycle: Aug 2026
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDcr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAttendance)" />
                  <Area type="monotone" dataKey="dcr" name="DCR Completion %" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDcr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Organization Hierarchy Summary Card */}
          <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-black text-gray-900">Organization Hierarchy</h2>
                <p className="text-xs font-semibold text-gray-500">Structured field territory tree and mapping</p>
              </div>
              <Link to="/sys-admin/org" className="text-indigo-600 hover:text-indigo-800 text-xs font-black flex items-center">
                Manage Full Tree <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div 
                onClick={() => setActiveModal('hierarchy_divisions')}
                className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 hover:border-indigo-300 transition-all cursor-pointer"
              >
                <div className="text-2xs font-bold text-indigo-700 uppercase tracking-wider mb-0.5">Divisions</div>
                <div className="text-2xl font-black text-indigo-950">3</div>
                <div className="text-3xs text-indigo-600 font-semibold mt-1">Cardio, Gastro, Ortho</div>
              </div>
              <div 
                onClick={() => setActiveModal('hierarchy_regions')}
                className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100 hover:border-purple-300 transition-all cursor-pointer"
              >
                <div className="text-2xs font-bold text-purple-700 uppercase tracking-wider mb-0.5">Regions</div>
                <div className="text-2xl font-black text-purple-950">12</div>
                <div className="text-3xs text-purple-600 font-semibold mt-1">Managed by 12 RMs</div>
              </div>
              <div 
                onClick={() => setActiveModal('hierarchy_areas')}
                className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 hover:border-blue-300 transition-all cursor-pointer"
              >
                <div className="text-2xs font-bold text-blue-700 uppercase tracking-wider mb-0.5">HQ / Areas</div>
                <div className="text-2xl font-black text-blue-950">48</div>
                <div className="text-3xs text-blue-600 font-semibold mt-1">Akbarpur, Tanda, etc.</div>
              </div>
              <div 
                onClick={() => setActiveModal('hierarchy_patches')}
                className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer"
              >
                <div className="text-2xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Field Patches</div>
                <div className="text-2xl font-black text-emerald-950">215</div>
                <div className="text-3xs text-emerald-600 font-semibold mt-1">Micro-routed routes</div>
              </div>
            </div>
          </div>
          
          {/* Master Data Health Section */}
          <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-black text-gray-900">Master Data Health & Sync Status</h2>
                <p className="text-xs font-semibold text-gray-500">Live doctor, chemist, and product master registries</p>
              </div>
              <Link to="/sys-admin/masters" className="text-indigo-600 hover:text-indigo-800 text-xs font-black flex items-center">
                Master Settings <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link 
                to="/products"
                className="p-4 border border-gray-200 rounded-xl shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/20 transition-all block"
              >
                <div className="font-black text-gray-900 text-sm">Products & Brands</div>
                <div className="text-xs font-bold text-gray-500 mt-0.5">245 Active SKUs / Brands</div>
                <div className="text-3xs text-emerald-700 mt-2.5 font-black flex items-center bg-emerald-100/80 w-fit px-2 py-0.5 rounded-md">
                  <CheckCircle className="w-3 h-3 mr-1" /> Synced across all apps
                </div>
              </Link>
              <Link 
                to="/doctors"
                className="p-4 border border-gray-200 rounded-xl shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/20 transition-all block"
              >
                <div className="font-black text-gray-900 text-sm">Doctor Directory</div>
                <div className="text-xs font-bold text-gray-500 mt-0.5">{INITIAL_DOCTORS.length} Verified Doctors</div>
                <div className="text-3xs text-emerald-700 mt-2.5 font-black flex items-center bg-emerald-100/80 w-fit px-2 py-0.5 rounded-md">
                  <CheckCircle className="w-3 h-3 mr-1" /> Geo-tagged & Categorized
                </div>
              </Link>
              <Link 
                to="/chemists"
                className="p-4 border border-gray-200 rounded-xl shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/20 transition-all block"
              >
                <div className="font-black text-gray-900 text-sm">Chemist Network</div>
                <div className="text-xs font-bold text-gray-500 mt-0.5">{INITIAL_CHEMISTS.length} Retail Pharmacies</div>
                <div className="text-3xs text-blue-700 mt-2.5 font-black flex items-center bg-blue-100/80 w-fit px-2 py-0.5 rounded-md">
                  <CheckCircle className="w-3 h-3 mr-1" /> Stockist Mapped
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* Right Column: Roles, Quick Actions, Feed */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-black text-gray-900 flex items-center">
                <Users className="w-4 h-4 text-indigo-600 mr-2" />
                Field Force Distribution
              </h2>
              <Link to="/sys-admin/users" className="text-3xs font-extrabold text-indigo-600 hover:underline">
                View All Users
              </Link>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-gray-700">Medical Representatives (MR)</span>
                  <span className="font-black text-gray-900">110 Users</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '77%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-gray-700">Area Managers (AM)</span>
                  <span className="font-black text-gray-900">24 Users</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{width: '17%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-gray-700">Regional Managers (RM)</span>
                  <span className="font-black text-gray-900">8 Users</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '6%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-xl shadow-2xs border border-indigo-800 p-5 text-white">
            <h2 className="text-base font-black mb-1">Admin Quick Actions</h2>
            <p className="text-2xs text-indigo-200 font-semibold mb-4">Instant field broadcasts and automated review tasks</p>
            <div className="space-y-2.5">
              <button 
                onClick={() => setActiveModal('broadcast')}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all flex items-center justify-between px-3.5 border border-white/15 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-indigo-300" /> Broadcast Field Message
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link 
                to="/sys-admin/reports"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-black transition-all flex items-center justify-between px-3.5 border border-indigo-400/40 shadow-xs block cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" /> Review & Export Call Reports
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Live Feed */}
          <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-black text-gray-900 flex items-center">
                <Activity className="w-4 h-4 text-emerald-600 mr-2" />
                Live System Feed
              </h2>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
            </div>
            
            <div className="space-y-3.5">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className={`w-2 h-2 rounded-full mt-1.5 mr-2.5 flex-shrink-0 ${
                    activity.type === 'dcr' ? 'bg-emerald-500' :
                    activity.type === 'approval' ? 'bg-blue-500' :
                    activity.type === 'alert' ? 'bg-amber-500' :
                    activity.type === 'master' ? 'bg-purple-500' : 'bg-gray-400'
                  }`} />
                  <div>
                    <p className="text-xs text-gray-800 font-semibold leading-snug">
                      <span className="font-black text-gray-900">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-3xs text-gray-400 mt-0.5 font-bold">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setActiveModal('audit_log')}
              className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-lg text-xs font-black border border-gray-200 transition-colors cursor-pointer"
            >
              View Complete Audit Log ({recentActivities.length})
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. ADD EMPLOYEE MODAL */}
      {activeModal === 'add_employee' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900">Add New Field Employee</h3>
                <p className="text-xs text-gray-500">Provision login, territory assignment, and hierarchy mapping</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {employeeSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-gray-900">Employee Created Successfully!</h4>
                <p className="text-xs text-gray-600">{newEmployee.name} ({newEmployee.role}) has been mapped to {newEmployee.hq} HQ.</p>
              </div>
            ) : (
              <form onSubmit={handleAddEmployeeSubmit} className="space-y-3.5 mt-4">
                <div>
                  <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Designation Role</label>
                    <select
                      value={newEmployee.role}
                      onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 bg-white"
                    >
                      <option value="MR">Medical Representative (MR)</option>
                      <option value="AM">Area Manager (AM)</option>
                      <option value="RM">Regional Manager (RM)</option>
                      <option value="ZM">Zonal Manager (ZM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Division</label>
                    <select
                      value={newEmployee.division}
                      onChange={(e) => setNewEmployee({...newEmployee, division: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 bg-white"
                    >
                      <option value="Cardio-Diab">Cardio-Diab Division</option>
                      <option value="Gastro">Gastro Division</option>
                      <option value="Ortho">Ortho Division</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Headquarter (HQ)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Akbarpur / Faizabad"
                      value={newEmployee.hq}
                      onChange={(e) => setNewEmployee({...newEmployee, hq: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Email / Login ID</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh.c@raxonpharma.com"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-900"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black shadow-xs"
                  >
                    Save & Assign Territory
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. BROADCAST MESSAGE MODAL */}
      {activeModal === 'broadcast' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900">Broadcast Notification</h3>
                <p className="text-xs text-gray-500">Send high-priority alert to field force devices</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {broadcastSent ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-gray-900">Broadcast Sent Successfully!</h4>
                <p className="text-xs text-gray-600">Delivered to 142 field force devices via push notification.</p>
              </div>
            ) : (
              <form onSubmit={handleBroadcastSubmit} className="space-y-3.5 mt-4">
                <div>
                  <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Target Audience</label>
                  <select
                    value={broadcastMessage.targetRole}
                    onChange={(e) => setBroadcastMessage({...broadcastMessage, targetRole: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 bg-white"
                  >
                    <option>All Field Force (MRs + AMs + RMs)</option>
                    <option>All Medical Representatives (MRs)</option>
                    <option>All Area Managers (AMs)</option>
                    <option>All Regional Managers (RMs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Notification Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Scheme Announcement on Brand Raxclav"
                    value={broadcastMessage.title}
                    onChange={(e) => setBroadcastMessage({...broadcastMessage, title: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Message Content</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter instructions, product focus, or cycle review meeting details..."
                    value={broadcastMessage.content}
                    onChange={(e) => setBroadcastMessage({...broadcastMessage, content: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-900"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Broadcast
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. COMPLETE AUDIT LOG MODAL */}
      {activeModal === 'audit_log' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900">Complete System Audit Log</h3>
                <p className="text-xs text-gray-500">Immutable ledger of all DCR submissions, approvals, and master modifications</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 my-4 space-y-3 pr-1">
              {recentActivities.map((act) => (
                <div key={act.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900">{act.user}</span>
                      <span className="text-3xs font-bold text-gray-400">•</span>
                      <span className="text-3xs font-semibold text-gray-500">{act.time}</span>
                    </div>
                    <p className="text-gray-700 font-medium mt-1">{act.action}</p>
                    <div className="text-3xs text-gray-400 mt-1.5 font-mono">IP Address: {act.ip}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-3xs font-black uppercase ${
                    act.type === 'dcr' ? 'bg-emerald-100 text-emerald-800' :
                    act.type === 'approval' ? 'bg-blue-100 text-blue-800' :
                    act.type === 'alert' ? 'bg-amber-100 text-amber-800' :
                    act.type === 'master' ? 'bg-purple-100 text-purple-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {act.type}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-black"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. KPI DRILL-DOWN MODALS */}
      {activeModal && activeModal.startsWith('kpi_') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {activeModal === 'kpi_employees' && 'Total Employee Roster (142 Active)'}
                  {activeModal === 'kpi_approvals' && 'Pending Approvals Queue (18 Items)'}
                  {activeModal === 'kpi_attendance' && "Today's Field Attendance Log (94%)"}
                  {activeModal === 'kpi_sync' && 'Master Sync & Offline Replication'}
                </h3>
                <p className="text-xs text-gray-500">Real-time status overview and actions</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-semibold text-gray-700">
              {activeModal === 'kpi_employees' && (
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-900 flex justify-between font-bold">
                    <span>Medical Representatives (MR):</span>
                    <span>110 on field</span>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg text-indigo-900 flex justify-between font-bold">
                    <span>Area Managers (AM):</span>
                    <span>24 managers</span>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-purple-900 flex justify-between font-bold">
                    <span>Regional Managers (RM):</span>
                    <span>8 leaders</span>
                  </div>
                </div>
              )}

              {activeModal === 'kpi_approvals' && (
                <div className="space-y-2">
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-900 flex justify-between font-bold">
                    <span>Monthly Tour Plans (MTP) Pending:</span>
                    <span>12 MTPs</span>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg text-orange-900 flex justify-between font-bold">
                    <span>Daily Call Reports (DCR) Pending:</span>
                    <span>6 DCRs</span>
                  </div>
                </div>
              )}

              {activeModal === 'kpi_attendance' && (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 rounded-lg text-emerald-900 flex justify-between font-bold">
                    <span>Total Punched In Today:</span>
                    <span>133 of 142 (93.7%)</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900 flex justify-between font-bold">
                    <span>Approved Leave:</span>
                    <span>5 personnel</span>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-red-900 flex justify-between font-bold">
                    <span>Absent / Not Reported:</span>
                    <span>4 personnel</span>
                  </div>
                </div>
              )}

              {activeModal === 'kpi_sync' && (
                <div className="p-4 bg-green-50 rounded-xl text-green-900 text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                  <p className="font-bold">All 142 client devices are in sync with cloud database.</p>
                  <p className="text-2xs text-green-700">Offline changes auto-replicate upon reconnecting.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
