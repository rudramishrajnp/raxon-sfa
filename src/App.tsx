import React, { useState } from 'react';
import {
  Fingerprint,
  Scan,
  ShieldCheck,
  Building2,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  Search,
  Plus,
  Clock,
  Briefcase,
  User,
  Settings,
  Mail,
  Lock,
  Download,
  Filter,
  RefreshCw,
  Bell,
  Sliders,
  Database
} from 'lucide-react';
import { UserProfile, UserRole, DcrCall, ExpenseRecord, SecondarySaleRecord, TeamMemberStatus } from './types/sfa';

// Demo Credentials preset matching Image 2
const DEMO_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Pradeep Mishra',
    email: 'pradeep.mishra.kalyan@gmail.com',
    role: 'super_admin',
    roleTitle: 'Super Admin',
    badgeAccess: 'Global Access',
    headquarters: 'Mumbai HQ',
    division: 'Cardio-Diabetic'
  },
  {
    id: '2',
    name: 'System Admin User',
    email: 'admin@raxon.com',
    role: 'system_admin',
    roleTitle: 'System Admin',
    badgeAccess: 'Full Access',
    headquarters: 'Delhi Corporate',
    division: 'All Divisions'
  },
  {
    id: '3',
    name: 'Regional Manager',
    email: 'regional.mgr@raxon.com',
    role: 'regional_manager',
    roleTitle: 'Regional Manager',
    badgeAccess: 'Region Level',
    headquarters: 'North Region',
    division: 'Oncology & Specialty'
  },
  {
    id: '4',
    name: 'Area Manager',
    email: 'area.mgr@raxon.com',
    role: 'area_manager',
    roleTitle: 'Area Manager',
    badgeAccess: 'Area Level',
    headquarters: 'Chandigarh Area',
    division: 'General Healthcare'
  },
  {
    id: '5',
    name: 'Dr. Rahul Sharma',
    email: 'dr.rahul@raxon.com',
    role: 'medical_rep',
    roleTitle: 'Medical Representative',
    badgeAccess: 'Field Rep',
    headquarters: 'Ludhiana Territory',
    division: 'Cardio Care'
  }
];

const INITIAL_CALLS: DcrCall[] = [
  {
    id: 'CALL-101',
    doctorName: 'Dr. A. K. Verma',
    specialty: 'Cardiologist',
    hospital: 'Max Super Specialty Hospital',
    time: '09:30 AM',
    status: 'Completed',
    pobAmount: 45000,
    productsSampled: ['Raxacard 50mg', 'Metoprol-XL'],
    feedback: 'Interested in bulk hospital supply contract. Requested sample pack for clinic.',
    gpsVerified: true
  },
  {
    id: 'CALL-102',
    doctorName: 'Dr. Priya Sundaram',
    specialty: 'Diabetologist',
    hospital: 'Apollo Clinic Center',
    time: '11:15 AM',
    status: 'Completed',
    pobAmount: 28000,
    productsSampled: ['Raxaglip 100mg', 'Insugen-R'],
    feedback: 'Promised high prescription share for new Raxaglip batch.',
    gpsVerified: true
  },
  {
    id: 'CALL-103',
    doctorName: 'Dr. Rajesh Malhotra',
    specialty: 'General Physician',
    hospital: 'City Care Clinic',
    time: '02:00 PM',
    status: 'In Progress',
    pobAmount: 15000,
    productsSampled: ['Raxamox CV 625'],
    feedback: 'Waiting in OPD queue. Detailing starter kit ready.',
    gpsVerified: true
  },
  {
    id: 'CALL-104',
    doctorName: 'Dr. Sunita Rao',
    specialty: 'Pediatrician',
    hospital: 'Fortis Healthcare',
    time: '04:30 PM',
    status: 'Pending',
    pobAmount: 0,
    productsSampled: [],
    feedback: 'Scheduled evening visit.',
    gpsVerified: false
  }
];

const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'EXP-8801',
    date: '2026-08-12',
    taAmount: 450,
    daAmount: 350,
    miscAmount: 120,
    total: 920,
    status: 'Approved',
    billUploaded: true,
    billUrl: 'fuel_receipt_12aug.pdf'
  },
  {
    id: 'EXP-8802',
    date: '2026-08-11',
    taAmount: 600,
    daAmount: 350,
    miscAmount: 250,
    total: 1200,
    status: 'Pending Manager',
    billUploaded: true,
    billUrl: 'toll_hotel_receipt.pdf'
  },
  {
    id: 'EXP-8803',
    date: '2026-08-10',
    taAmount: 320,
    daAmount: 350,
    miscAmount: 0,
    total: 670,
    status: 'Approved',
    billUploaded: false
  }
];

const INITIAL_TEAM: TeamMemberStatus[] = [
  {
    id: 'TM-1',
    name: 'Dr. Rahul Sharma',
    role: 'Medical Rep',
    headquarters: 'Ludhiana',
    status: 'On Duty',
    callsDone: 3,
    targetCalls: 10,
    pobToday: 88000,
    lastLocation: 'Max Super Specialty Hospital (Geofenced)',
    lastSync: '2 mins ago',
    battery: 88
  },
  {
    id: 'TM-2',
    name: 'Vikram Sethi',
    role: 'Medical Rep',
    headquarters: 'Jalandhar',
    status: 'On Duty',
    callsDone: 5,
    targetCalls: 12,
    pobToday: 112000,
    lastLocation: 'Civil Hospital Road',
    lastSync: '5 mins ago',
    battery: 74
  },
  {
    id: 'TM-3',
    name: 'Ananya Roy',
    role: 'Area Manager',
    headquarters: 'Chandigarh',
    status: 'In Meeting',
    callsDone: 2,
    targetCalls: 6,
    pobToday: 65000,
    lastLocation: 'Regional Distribution Office',
    lastSync: '12 mins ago',
    battery: 92
  },
  {
    id: 'TM-4',
    name: 'Suresh Kumar',
    role: 'Medical Rep',
    headquarters: 'Amritsar',
    status: 'Travel',
    callsDone: 1,
    targetCalls: 10,
    pobToday: 22000,
    lastLocation: 'GT Road Toll Plaza',
    lastSync: '25 mins ago',
    battery: 45
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [emailInput, setEmailInput] = useState('admin@raxon.com');
  const [passwordInput, setPasswordInput] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Portal State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'dcr' | 'workplan' | 'expense' | 'secondary' | 'team' | 'reports' | 'admin'>('dashboard');
  const [calls, setCalls] = useState<DcrCall[]>(INITIAL_CALLS);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [team, setTeam] = useState<TeamMemberStatus[]>(INITIAL_TEAM);
  
  // DCR New Call Modal State
  const [showNewCallModal, setShowNewCallModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('Cardiologist');
  const [newHospital, setNewHospital] = useState('');
  const [newPob, setNewPob] = useState('');
  const [newFeedback, setNewFeedback] = useState('');

  // Auto-fill credential helper
  const handleSelectDemoUser = (user: UserProfile) => {
    setEmailInput(user.email);
    setPasswordInput(user.role === 'super_admin' ? 'admin@123' : 'admin123');
    setCurrentUser(user);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = DEMO_USERS.find(u => u.email.toLowerCase() === emailInput.trim().toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      setAuthError(null);
    } else {
      // Fallback custom user
      setCurrentUser({
        id: 'user-custom',
        name: emailInput.split('@')[0].toUpperCase(),
        email: emailInput,
        role: 'super_admin',
        roleTitle: 'Super Admin',
        badgeAccess: 'Global Access',
        headquarters: 'Central HQ'
      });
      setAuthError(null);
    }
  };

  const handleBiometricLogin = () => {
    // Quick auto-login as Super Admin
    const superAdmin = DEMO_USERS[0];
    setCurrentUser(superAdmin);
  };

  const handleAddNewCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    const newCallItem: DcrCall = {
      id: `CALL-${Math.floor(100 + Math.random() * 900)}`,
      doctorName: newDocName,
      specialty: newDocSpecialty,
      hospital: newHospital || 'City Specialty Clinic',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Completed',
      pobAmount: Number(newPob) || 0,
      productsSampled: ['Raxacard 50mg', 'Raxaglip 100mg'],
      feedback: newFeedback || 'Successful detailing session.',
      gpsVerified: true
    };
    setCalls([newCallItem, ...calls]);
    setShowNewCallModal(false);
    setNewDocName('');
    setNewHospital('');
    setNewPob('');
    setNewFeedback('');
  };

  // IF NOT LOGGED IN -> SHOW UI MATCHING IMAGE 2
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
        {/* Glowing Background Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Main Card Container */}
        <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 my-auto">
          
          {/* RAXON Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30 mb-3">
              <span className="text-2xl font-extrabold text-white tracking-wider">R</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">RAXON SFA</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Sales Force Automation & Field Operations Portal</p>
          </div>

          {/* Biometric Quick Pass */}
          <div className="bg-slate-900/90 border border-indigo-900/40 rounded-xl p-4 mb-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Fingerprint className="w-5 h-5 text-indigo-400" />
                <Scan className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[11px] font-semibold tracking-wide text-indigo-300 uppercase bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/50">
                Biometric Quick Pass
              </span>
            </div>
            <p className="text-[12px] text-slate-400 mb-3">Touch ID / Face ID / Fingerprint Field Staff Login</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleBiometricLogin}
                className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow-sm"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Scan & Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => alert("Device biometric registration active for this device.")}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center justify-center transition"
              >
                <span>Enroll Device</span>
              </button>
            </div>
          </div>

          {/* DEMO QUICK SELECT */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                Demo Quick Select
              </span>
              <span className="text-[11px] text-slate-500">Auto-fill credentials</span>
            </div>
            
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectDemoUser(u)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between ${
                    emailInput.toLowerCase() === u.email.toLowerCase()
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-slate-200 truncate">{u.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{u.roleTitle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium shrink-0">
                    {u.badgeAccess}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@raxon.com"
                  required
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset instructions sent to work email."); }} className="text-[11px] text-indigo-400 hover:text-indigo-300 transition">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-9 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-400">Remember session</span>
              </label>
              <span className="text-[10px] font-mono text-slate-500">API Endpoint: /api/auth/login</span>
            </div>

            {authError && (
              <div className="p-2.5 bg-red-950/50 border border-red-800/80 rounded-lg text-xs text-red-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition duration-200 shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 mt-2"
            >
              <span>Sign In to SFA Portal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer badge */}
          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              WebAuthn & 256-bit Encrypted
            </span>
            <span className="font-mono text-slate-400">v1.0.0 Enterprise</span>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN PORTAL VIEW
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="bg-[#0f172a] border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-base shadow-md shadow-indigo-600/30">
              R
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                RAXON SFA
                <span className="text-[10px] font-mono font-normal bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.5 rounded">
                  PORTAL
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">Sales Force Automation System</div>
            </div>
          </div>
        </div>

        {/* User Info & Role Badge */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-200">{currentUser.name}</div>
            <div className="text-[10px] text-indigo-400 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {currentUser.roleTitle} • {currentUser.headquarters}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentUser(null)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-xs flex items-center space-x-1.5 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#0b1120] border-b md:border-b-0 md:border-r border-slate-800/80 p-3 flex md:flex-col justify-between shrink-0 overflow-x-auto">
          <nav className="flex md:flex-col space-x-1 md:space-x-0 md:space-y-1 min-w-full md:min-w-0">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'dcr', label: 'DCR Calls', icon: FileText, badge: calls.length },
              { id: 'workplan', label: 'Work Plan & MTP', icon: Calendar },
              { id: 'expense', label: 'TA/DA Expenses', icon: DollarSign },
              { id: 'secondary', label: 'Secondary Sales', icon: TrendingUp },
              { id: 'team', label: 'Team Tracking', icon: MapPin },
              { id: 'reports', label: 'Reports & Analytics', icon: Briefcase },
              { id: 'admin', label: 'Super Admin Console', icon: Settings }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-300'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* System status footer in sidebar */}
          <div className="hidden md:block p-3 mt-6 bg-slate-900/80 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>GPS Geofence</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Sync Engine</span>
              <span className="text-indigo-400 font-mono">Live WebSocket</span>
            </div>
          </div>
        </aside>

        {/* Main Workspace View */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Field Operations Overview</div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Welcome, {currentUser.name}!</h2>
                  <p className="text-xs text-slate-400 mt-1">Logged in as {currentUser.roleTitle} ({currentUser.headquarters}). Your daily SFA portal is active.</p>
                </div>
                <button
                  onClick={() => setShowNewCallModal(true)}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log New DCR Visit</span>
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Calls Logged Today</span>
                    <FileText className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">{calls.filter(c => c.status === 'Completed').length} / 10</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>70% Target Completion</span>
                  </div>
                </div>

                <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>POB Order Value Today</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">
                    ₹{calls.reduce((acc, curr) => acc + curr.pobAmount, 0).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-indigo-300 mt-1">From 3 hospital accounts</div>
                </div>

                <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Approved Expenses</span>
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">
                    ₹{expenses.filter(e => e.status === 'Approved').reduce((acc, curr) => acc + curr.total, 0).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">TA/DA auto-calculated</div>
                </div>

                <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Field Reps On Duty</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">
                    {team.filter(t => t.status === 'On Duty').length} / {team.length}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1">Live GPS tracking active</div>
                </div>
              </div>

              {/* Today's Call Schedule & Live Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      Today's DCR Doctor Visits
                    </h3>
                    <span className="text-xs text-indigo-400 font-medium">4 Scheduled</span>
                  </div>

                  <div className="space-y-3">
                    {calls.map(c => (
                      <div key={c.id} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-slate-100">{c.doctorName}</span>
                            <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
                              {c.specialty}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{c.hospital}</div>
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                            <span>Time: {c.time}</span>
                            {c.gpsVerified && (
                              <span className="text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> GPS Verified
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            c.status === 'Completed' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' :
                            c.status === 'In Progress' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' :
                            'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {c.status}
                          </span>
                          {c.pobAmount > 0 && (
                            <div className="text-xs font-bold text-emerald-400 mt-1">POB: ₹{c.pobAmount.toLocaleString('en-IN')}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Announcements & Quick Actions */}
                <div className="space-y-4">
                  <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      Corporate Announcements
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-lg">
                        <div className="font-semibold text-indigo-300">New Product Launch: Raxacard-XL</div>
                        <p className="text-slate-400 text-[11px] mt-1">Updated doctor detailing slides uploaded to digital catalog.</p>
                      </div>
                      <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-lg">
                        <div className="font-semibold text-emerald-300">Monthly Target Deadline</div>
                        <p className="text-slate-400 text-[11px] mt-1">Submit secondary sales stockist report by 15th Aug.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-white mb-3">Field Rep Quick Tools</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button onClick={() => setActiveTab('dcr')} className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-200 font-medium text-left transition">
                        📄 DCR Entry
                      </button>
                      <button onClick={() => setActiveTab('expense')} className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-200 font-medium text-left transition">
                        💳 Expense Claim
                      </button>
                      <button onClick={() => setActiveTab('workplan')} className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-200 font-medium text-left transition">
                        📅 Tour Plan
                      </button>
                      <button onClick={() => setActiveTab('secondary')} className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-200 font-medium text-left transition">
                        📊 Sales Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DCR CALLS */}
          {activeTab === 'dcr' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                  <h2 className="text-xl font-bold text-white">Daily Call Report (DCR)</h2>
                  <p className="text-xs text-slate-400">Log doctor detailing, product sampling, POB orders, and GPS validation.</p>
                </div>
                <button
                  onClick={() => setShowNewCallModal(true)}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log New Call</span>
                </button>
              </div>

              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Calls Logged Today ({calls.length})</span>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter Status</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {calls.map(c => (
                    <div key={c.id} className="p-4 hover:bg-slate-900/40 transition space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-white">{c.doctorName}</span>
                            <span className="text-[10px] bg-slate-800 text-indigo-300 border border-slate-700 px-2 py-0.5 rounded">
                              {c.specialty}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">{c.hospital}</div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            c.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {c.status}
                          </span>
                          <div className="text-xs font-mono text-slate-400 mt-1">{c.time}</div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-slate-400 font-medium">Feedback: </span>
                        {c.feedback}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-slate-300">Samples:</span>
                          {c.productsSampled.map((p, idx) => (
                            <span key={idx} className="bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.5 rounded text-[10px]">
                              {p}
                            </span>
                          ))}
                        </div>
                        {c.pobAmount > 0 && (
                          <div className="text-xs font-bold text-emerald-400">POB Booking: ₹{c.pobAmount.toLocaleString('en-IN')}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WORK PLAN & MTP */}
          {activeTab === 'workplan' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800/80">
                <h2 className="text-xl font-bold text-white">Monthly Tour Plan (MTP) & Work Plan</h2>
                <p className="text-xs text-slate-400">Pre-plan territory visits, request joint work approvals, and route maps.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800/80 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">August 2026 Schedule</h3>
                    <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-full font-semibold">
                      MTP Approved by Area Manager
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
                    <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 text-xs">
                    {Array.from({ length: 31 }).map((_, i) => {
                      const day = i + 1;
                      const isToday = day === 12;
                      return (
                        <div
                          key={day}
                          className={`p-2.5 rounded-lg border flex flex-col justify-between min-h-[64px] ${
                            isToday
                              ? 'bg-indigo-950/80 border-indigo-500 text-white'
                              : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                          }`}
                        >
                          <span className={`font-bold ${isToday ? 'text-indigo-400' : 'text-slate-400'}`}>{day}</span>
                          <span className="text-[9px] truncate text-slate-400 mt-1">
                            {day % 3 === 0 ? 'Ludhiana Core' : day % 3 === 1 ? 'Jalandhar HQ' : 'Amritsar OPD'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-white">Joint Work & Deviations</h3>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-2">
                    <div className="font-semibold text-indigo-300">Joint Visit Request</div>
                    <p className="text-slate-400 text-[11px]">Area Manager Ananya Roy joining for Max Hospital Cardiology OPD visit.</p>
                    <button className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold text-[11px]">
                      Confirm Joint Work
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TA/DA EXPENSE */}
          {activeTab === 'expense' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div>
                  <h2 className="text-xl font-bold text-white">TA/DA Expense Management</h2>
                  <p className="text-xs text-slate-400">Automatic distance-based Travel Allowance and Daily Allowance claim engine.</p>
                </div>
                <button
                  onClick={() => alert("Expense draft created. Attach hotel/fuel bills to submit.")}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit New Claim</span>
                </button>
              </div>

              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Recent Claims ({expenses.length})</span>
                  <span className="text-slate-400">Auto-audited against company limits</span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {expenses.map(exp => (
                    <div key={exp.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{exp.id} • Date: {exp.date}</div>
                        <div className="text-slate-400 mt-1 flex items-center space-x-3 text-[11px]">
                          <span>TA: ₹{exp.taAmount}</span>
                          <span>DA: ₹{exp.daAmount}</span>
                          <span>Misc: ₹{exp.miscAmount}</span>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <div className="text-sm font-extrabold text-white">Total: ₹{exp.total}</div>
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          exp.status === 'Approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {exp.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECONDARY SALES */}
          {activeTab === 'secondary' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800/80">
                <h2 className="text-xl font-bold text-white">Secondary Sales & Stockist Statements</h2>
                <p className="text-xs text-slate-400">Stockist closing stock, monthly secondary off-take, and retailer orders.</p>
              </div>

              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Stockist Inventory Statement - Ludhiana Territory</h3>
                  <button className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700">
                    Export Excel
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3">Stockist Name</th>
                        <th className="p-3">Opening Stock</th>
                        <th className="p-3">Receipts</th>
                        <th className="p-3">Sales Qty</th>
                        <th className="p-3">Closing Stock</th>
                        <th className="p-3 text-right">Value (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      <tr>
                        <td className="p-3 font-semibold">Gupta Pharma Distributors</td>
                        <td className="p-3">1,200</td>
                        <td className="p-3">2,500</td>
                        <td className="p-3 font-bold text-emerald-400">2,800</td>
                        <td className="p-3">900</td>
                        <td className="p-3 text-right font-bold">₹4,20,000</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Ludhiana Medico Agencies</td>
                        <td className="p-3">800</td>
                        <td className="p-3">1,500</td>
                        <td className="p-3 font-bold text-emerald-400">1,900</td>
                        <td className="p-3">400</td>
                        <td className="p-3 text-right font-bold">₹2,85,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TEAM TRACKING */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800/80">
                <h2 className="text-xl font-bold text-white">Live Field Staff GPS Tracking</h2>
                <p className="text-xs text-slate-400">Real-time team location, battery status, and route movement radar.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      Live Radar Map
                    </h3>
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      GPS Synchronized
                    </span>
                  </div>

                  {/* Simulated Map View */}
                  <div className="w-full h-64 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="text-center space-y-2 z-10 p-4">
                      <div className="w-12 h-12 bg-indigo-600/30 border border-indigo-500 rounded-full flex items-center justify-center mx-auto text-indigo-400 animate-pulse">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-slate-200">Ludhiana & Chandigarh Field Grid</div>
                      <div className="text-[11px] text-slate-400">4 Active Reps currently geofenced at assigned OPD Clinics.</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-white">Active Field Staff ({team.length})</h3>
                  {team.map(t => (
                    <div key={t.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-white">
                        <span>{t.name}</span>
                        <span className="text-[10px] text-emerald-400">{t.status}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">{t.lastLocation}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <span>Calls: {t.callsDone}/{t.targetCalls}</span>
                        <span>Battery: {t.battery}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REPORTS & ANALYTICS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800/80">
                <h2 className="text-xl font-bold text-white">Reports & Field Analytics</h2>
                <p className="text-xs text-slate-400">Performance leaderboards, sales vs target conversion, and PDF export.</p>
              </div>

              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Territory Performance Summary</h3>
                  <button className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded flex items-center space-x-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full PDF Report</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="text-slate-400">Call Average / Day</div>
                    <div className="text-xl font-bold text-white mt-1">9.4 Calls</div>
                    <div className="text-[10px] text-emerald-400 mt-1">+12% vs last month</div>
                  </div>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="text-slate-400">Doctor Coverage %</div>
                    <div className="text-xl font-bold text-white mt-1">94.8%</div>
                    <div className="text-[10px] text-emerald-400 mt-1">Target achieved</div>
                  </div>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="text-slate-400">Primary to Secondary Ratio</div>
                    <div className="text-xl font-bold text-white mt-1">1 : 1.15</div>
                    <div className="text-[10px] text-indigo-400 mt-1">Healthy off-take</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SUPER ADMIN CONSOLE */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800/80">
                <h2 className="text-xl font-bold text-white">Super Admin System Console</h2>
                <p className="text-xs text-slate-400">Manage user credentials, organization hierarchy, biometric policies, and audit logs.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    System Users & Access Roles
                  </h3>
                  <div className="space-y-2 text-xs">
                    {DEMO_USERS.map(u => (
                      <div key={u.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-slate-400 text-[11px]">{u.email}</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold">
                          {u.badgeAccess}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    Global System Flags
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <div>
                        <div className="font-semibold text-white">GPS Geofencing Enforcement</div>
                        <div className="text-[11px] text-slate-400">Requires rep to be within 100m of doctor clinic to submit DCR.</div>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold">ENABLED</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <div>
                        <div className="font-semibold text-white">Biometric Quick Pass Login</div>
                        <div className="text-[11px] text-slate-400">Allow WebAuthn fingerprint & Face ID authentication.</div>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold">ENABLED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* NEW CALL LOGGING MODAL */}
      {showNewCallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log New Doctor DCR Call</h3>
              <button onClick={() => setShowNewCallModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddNewCall} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. A. P. Singh"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Specialty</label>
                  <select
                    value={newDocSpecialty}
                    onChange={(e) => setNewDocSpecialty(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Diabetologist">Diabetologist</option>
                    <option value="General Physician">General Physician</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Neurologist">Neurologist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">POB Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    value={newPob}
                    onChange={(e) => setNewPob(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Hospital / Clinic Center</label>
                <input
                  type="text"
                  placeholder="e.g. Fortis Healthcare OPD"
                  value={newHospital}
                  onChange={(e) => setNewHospital(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Call Feedback & Notes</label>
                <textarea
                  rows={3}
                  placeholder="Detailing feedback, sample requests, or hospital contract notes..."
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-emerald-400 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>GPS Location geofenced at current coordinates.</span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCallModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow"
                >
                  Save & Log Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
