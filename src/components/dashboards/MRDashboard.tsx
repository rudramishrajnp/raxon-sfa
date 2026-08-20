import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  StopCircle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Building2, 
  Pill, 
  Users, 
  Calendar, 
  TrendingUp, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Target, 
  FileText, 
  Activity, 
  PhoneCall, 
  UserCheck, 
  Lock,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '../Modal';
import { UserProfile, getAllUsersByRole, setActiveUserById, updateUserPunchState } from '../../data/userContext';
import { getStockistsList, getDoctorsList, getChemistsList, getProductsCatalog } from '../../data/masterData';
import { useDataIsolation } from '../../hooks/useDataIsolation';
import { getMyManager } from '../../services/managerHierarchyService';
import { 
  MrDoctorsModal, 
  MrChemistsModal, 
  AmPobModal, 
  AmQuotaModal 
} from './DashboardDrilldownModals';

interface MRDashboardProps {
  user: UserProfile;
  onUserChange?: (newUser: UserProfile) => void;
}

export function MRDashboard({ user, onUserChange }: MRDashboardProps) {
  const { companyId } = useDataIsolation();
  const [isPunchedIn, setIsPunchedIn] = useState<boolean>(user.metrics.isPunchedIn ?? true);
  const [punchTime, setPunchTime] = useState<string | null>(user.metrics.punchInTime ?? '09:15 AM');
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [drilldown, setDrilldown] = useState<'doctors' | 'chemists' | 'pob' | 'target' | null>(null);
  const [reportingManager, setReportingManager] = useState<{
    managerId: string;
    managerName: string;
    managerRole: string;
    managerEmail?: string;
    managerHq?: string;
    managerPhone?: string;
  } | null>(null);

  useEffect(() => {
    setIsPunchedIn(user.metrics.isPunchedIn ?? false);
    setPunchTime(user.metrics.punchInTime ?? null);

    let isMounted = true;
    getMyManager(user.id).then(mgr => {
      if (isMounted) setReportingManager(mgr);
    });

    const handleHierarchyUpdate = () => {
      getMyManager(user.id).then(mgr => {
        if (isMounted) setReportingManager(mgr);
      });
    };
    window.addEventListener('raxon-hierarchy-updated', handleHierarchyUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('raxon-hierarchy-updated', handleHierarchyUpdate);
    };
  }, [user]);

  const stockists = getStockistsList(companyId);
  const doctors = getDoctorsList(companyId);
  const chemists = getChemistsList(companyId);
  const products = getProductsCatalog(companyId);

  const allMRs = getAllUsersByRole('MR', companyId);

  const handlePunch = async () => {
    if (user.metrics?.punchInLocked) {
      setMessage("Your Punch-In is locked for today. Please contact your reporting manager or administrator to reset your field session.");
      return;
    }
    if (!isPunchedIn) {
      setIsPunchedIn(true);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setPunchTime(time);
      await updateUserPunchState(user.id, true, time, false);
      setMessage(`Attended Field Punch-In recorded with GPS Pin: ${user.hq}.`);
      setTimeout(() => setMessage(''), 3500);
    } else {
      setShowConfirm(true);
    }
  };

  const confirmPunchOut = async () => {
    setIsPunchedIn(false);
    setPunchTime(null);
    setShowConfirm(false);
    await updateUserPunchState(user.id, false, null, true);
    setMessage("Punched out successfully! Field day ended. Your Punch-In has been locked until reset by your manager or administrator.");
    setTimeout(() => setMessage(''), 5000);
  };

  const handleSwitchMR = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const found = allMRs.find(m => m.id === selectedId);
    if (found && onUserChange) {
      onUserChange(found);
    }
  };

  const targetAchievedPercent = user.metrics.monthlyTarget && user.metrics.monthlyAchieved
    ? Math.round((user.metrics.monthlyAchieved / user.metrics.monthlyTarget) * 100)
    : 85;

  return (
    <div className="space-y-6">
      {/* Drilldown Modals */}
      <MrDoctorsModal isOpen={drilldown === 'doctors'} onClose={() => setDrilldown(null)} territory={user.territory} />
      <MrChemistsModal isOpen={drilldown === 'chemists'} onClose={() => setDrilldown(null)} territory={user.territory} />
      <AmPobModal isOpen={drilldown === 'pob'} onClose={() => setDrilldown(null)} />
      <AmQuotaModal isOpen={drilldown === 'target'} onClose={() => setDrilldown(null)} />

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Punch Out">
        <p className="text-gray-700 font-medium mb-6">
          Are you sure you want to Punch Out for today and close your field session for <strong>{user.name}</strong>?
        </p>
        <div className="flex justify-end space-x-3">
          <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-100 text-gray-800 font-bold rounded-lg hover:bg-gray-200">Cancel</button>
          <button onClick={confirmPunchOut} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Punch Out</button>
        </div>
      </Modal>

      <Modal isOpen={!!message} onClose={() => setMessage('')} title="Field Attendance Notification">
        <p className="text-gray-900 font-bold mb-6">{message}</p>
        <div className="flex justify-end">
          <button onClick={() => setMessage('')} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">OK</button>
        </div>
      </Modal>

      {/* Greeting & Header with MR Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl ${user.avatarBg || 'bg-indigo-600'} text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0`}>
            {user.initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Field Representative Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                MR Field Active
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 mt-0.5">
              Welcome, <span className="text-indigo-900 font-black">{user.name}</span> • Territory: <strong className="text-gray-900">{user.territory}</strong> ({user.hq})
            </p>
          </div>
        </div>

        {/* Switch MR Profile Selector */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-3xs font-bold text-gray-500 uppercase">Switch MR:</span>
            <select
              value={user.id}
              onChange={handleSwitchMR}
              className="bg-transparent font-extrabold text-indigo-950 focus:outline-none cursor-pointer"
            >
              {allMRs.map(mr => (
                <option key={mr.id} value={mr.id}>
                  {mr.name} ({mr.hq ? mr.hq.split(' ')[0] : ''})
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/dcr"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" />
            Open Today's DCR
          </Link>
        </div>
      </div>

      {/* Authoritative Reporting Manager Banner */}
      {reportingManager && (
        <div className="bg-gradient-to-r from-indigo-50 via-blue-50/50 to-white p-4 rounded-xl border border-indigo-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xs font-bold text-indigo-700 uppercase tracking-wider">Reporting Area Manager:</span>
                <span className="text-xs font-black text-gray-900">{reportingManager.managerName}</span>
                <span className="px-2 py-0.2 rounded-full text-3xs font-extrabold bg-indigo-100 text-indigo-900">
                  {reportingManager.managerRole}
                </span>
              </div>
              <div className="flex items-center gap-3 text-3xs text-gray-600 font-semibold mt-0.5">
                {reportingManager.managerHq && <span>HQ: {reportingManager.managerHq}</span>}
                {reportingManager.managerPhone && <span>Phone: {reportingManager.managerPhone}</span>}
              </div>
            </div>
          </div>
          <span className="text-3xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Authoritative Supabase Hierarchy Link
          </span>
        </div>
      )}

      {/* MR Top 4 Specific Metrics (All Clickable) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doctors in territory */}
        <button
          onClick={() => setDrilldown('doctors')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-400 shadow-2xs hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-indigo-700 transition-colors">
              My Doctors ({user.territory ? user.territory.split(' ')[0] : ''})
            </span>
            <Users className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{user.metrics.doctorsCount || doctors.length}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xs font-semibold text-indigo-700">
              Doctor Universe
            </span>
            <span className="text-3xs font-extrabold text-indigo-600 group-hover:underline flex items-center">
              View <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Chemists in territory */}
        <button
          onClick={() => setDrilldown('chemists')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-emerald-700 transition-colors">
              My Chemists ({user.territory ? user.territory.split(' ')[0] : ''})
            </span>
            <Building2 className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{user.metrics.chemistsCount || chemists.length}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xs font-semibold text-emerald-700">
              Chemist Retailers
            </span>
            <span className="text-3xs font-extrabold text-emerald-700 group-hover:underline flex items-center">
              View <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>

        {/* POB Booked Today */}
        <button
          onClick={() => setDrilldown('pob')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-emerald-700 transition-colors">
              Today's POB Orders
            </span>
            <ShoppingCart className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">
            ₹{(user.metrics.pobBookedToday || 0).toLocaleString('en-IN')}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-3xs font-semibold text-gray-500">
              {user.metrics.completedCallsToday || 0} calls completed
            </span>
            <span className="text-3xs font-extrabold text-emerald-700 group-hover:underline flex items-center">
              Ledger <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Monthly Target Achievement */}
        <button
          onClick={() => setDrilldown('target')}
          className="text-left bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-purple-700 transition-colors">
              Monthly POB Target
            </span>
            <Target className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-purple-950">
              ₹{((user.metrics.monthlyAchieved || 0) / 100000).toFixed(2)}L
            </span>
            <span className="text-3xs text-gray-400 font-bold">
              / ₹{((user.metrics.monthlyTarget || 250000) / 100000).toFixed(1)}L
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div 
              className="bg-purple-600 h-1.5 rounded-full" 
              style={{ width: `${Math.min(targetAchievedPercent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-3xs font-bold text-gray-500 mt-1">
            <span>{targetAchievedPercent}% Achieved</span>
            <span className="text-emerald-700 font-black">On Track</span>
          </div>
        </button>
      </div>

      {/* Main Grid: Biometric Attendance + Today's MTP Tour Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biometric Field Attendance */}
        <div className="bg-white rounded-xl shadow-2xs p-6 border border-gray-200 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-extrabold text-gray-900 mb-1 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-indigo-600" />
              Daily Field Attendance
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              GPS-tagged biometric punch for {user.name} ({user.hq}).
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            {user.metrics?.punchInLocked ? (
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={handlePunch}
                  className="w-36 h-36 rounded-full flex flex-col items-center justify-center text-white shadow-lg bg-gray-400 cursor-not-allowed"
                >
                  <Lock size={40} className="mb-1" />
                  <span className="text-base font-black">Locked</span>
                  <span className="text-3xs text-gray-100 font-semibold">Punched Out Today</span>
                </button>
                <span className="text-3xs text-red-600 font-bold bg-red-50 border border-red-100 px-3 py-1 rounded-lg text-center max-w-xs">
                  🔒 Requires Manager/Admin Reset
                </span>
              </div>
            ) : (
              <button
                onClick={handlePunch}
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                  isPunchedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isPunchedIn ? (
                  <>
                    <StopCircle size={40} className="mb-1" />
                    <span className="text-base font-black">Punch Out</span>
                    <span className="text-3xs text-red-100 font-semibold">End Field Day</span>
                  </>
                ) : (
                  <>
                    <PlayCircle size={40} className="mb-1" />
                    <span className="text-base font-black">Punch In</span>
                    <span className="text-3xs text-emerald-100 font-semibold">Start Working</span>
                  </>
                )}
              </button>
            )}
            {isPunchedIn && punchTime && (
              <p className="text-xs text-gray-800 font-bold bg-green-50 border border-green-200 px-4 py-2 rounded-full flex items-center text-center">
                <CheckCircle2 size={16} className="text-green-600 mr-2 shrink-0" />
                Active on Field since {punchTime}
              </p>
            )}
          </div>

          <div className="text-3xs text-center text-gray-500 border-t border-gray-100 pt-3">
            {user.metrics.gpsLocation || 'Location Auto-Captured • Stealth Accuracy Tracking'}
          </div>
        </div>

        {/* Today's Territory Schedule & MTP */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-2xs p-6 border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-indigo-600" />
              Today's Field Schedule (MTP Approved)
            </h2>
            <span className="bg-emerald-100 text-emerald-900 text-3xs font-extrabold px-3 py-1 rounded-full border border-emerald-300">
              MTP Approved for {user.name}
            </span>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-3xs text-indigo-800 font-extrabold uppercase tracking-wider mb-0.5">
                  Today's Territory Patch ({user.hq})
                </p>
                <h3 className="text-2xl font-black text-indigo-950 flex items-center">
                  <MapPin className="mr-2 h-6 w-6 text-indigo-600 shrink-0" />
                  {user.metrics.currentPatchName || user.territory}
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-1">
                  Includes: {user.metrics.patchAreas || 'Main Market Chowk, Hospital Road, Civil Lines'}
                </p>
              </div>

              <div className="shrink-0 flex gap-2">
                <Link
                  to="/dcr"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
                >
                  Start Calling
                </Link>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-gray-200 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-3xs font-bold text-gray-500 uppercase">Doctors Planned</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {user.metrics.completedCallsToday || 0}/{user.metrics.plannedCallsToday || 8}
              </p>
              <span className="text-3xs text-indigo-600 font-semibold">
                {Math.round(((user.metrics.completedCallsToday || 0) / (user.metrics.plannedCallsToday || 8)) * 100)}% Completed
              </span>
            </div>
            <div className="border border-gray-200 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-3xs font-bold text-gray-500 uppercase">Chemists Planned</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {user.metrics.chemistsCount || 3}
              </p>
              <span className="text-3xs text-emerald-600 font-semibold">Stock Verification</span>
            </div>
            <div className="border border-gray-200 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-3xs font-bold text-gray-500 uppercase">POB Target</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                ₹{(user.metrics.pobBookedToday || 8000).toLocaleString('en-IN')}
              </p>
              <span className="text-3xs text-gray-500 font-semibold">Brand Order</span>
            </div>
          </div>

          {/* Quick Authorized Stockist Bar for territory */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <span className="font-bold text-amber-950">Linked Supply Stockist:</span>{' '}
                <span className="text-gray-900 font-bold">{user.metrics.linkedStockist || 'Gupta Medical Agency'}</span>
              </div>
            </div>
            <Link
              to="/stockists"
              className="text-3xs font-bold text-indigo-700 hover:text-indigo-900 underline shrink-0"
            >
              View All Stockists →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
