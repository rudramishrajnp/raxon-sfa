import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Clock,
  Building2,
  MapPin,
  User,
  Sparkles,
  Phone,
  Layers,
  Check,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  Info,
  Users,
  Eye,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { submitMTP, getMTP } from '../lib/api';
import { Modal } from '../components/Modal';
import { getActiveUserContext } from '../data/permissionSettings';
import { getActiveCompanyId } from '../data/companyContext';
import { 
  HEADQUARTERS_LIST, 
  MANAGER_SPECIAL_ACTIVITIES, 
  getAllHeadquarters,
  getMrPlannedAreaForHq, 
  getHeadquarterByName,
  getMrFullMonthMTP,
  HeadquarterInfo,
  MRProfile
} from '../data/hqMrMapping';
import { UserRole } from '../data/userContext';

interface MtpProps {
  role?: UserRole;
}

export default function Mtp({ role }: MtpProps) {
  const activeCompanyId = getActiveCompanyId();
  const activeUser = getActiveUserContext();
  const currentRole = role || (activeUser.role.includes('Manager') ? 'AM' : activeUser.role.includes('Admin') ? 'Admin' : 'MR');
  const isManager = currentRole === 'AM' || currentRole === 'RM' || currentRole === 'ZM' || currentRole === 'Admin' || currentRole === 'Super Admin';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [plans, setPlans] = useState<Record<string, string>>({});
  const [customAreas, setCustomAreas] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`raxon_areas_${activeCompanyId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((a: any) => a.name || a.patch).filter(Boolean);
        }
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    const handleAreasSync = () => {
      try {
        const saved = localStorage.getItem(`raxon_areas_${activeCompanyId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCustomAreas(parsed.map((a: any) => a.name || a.patch).filter(Boolean));
            return;
          }
        }
        setCustomAreas([]);
      } catch {
        setCustomAreas([]);
      }
    };
    window.addEventListener('raxon-areas-updated', handleAreasSync);
    return () => window.removeEventListener('raxon-areas-updated', handleAreasSync);
  }, [activeCompanyId]);

  // Dynamically constructed MR areas list
  const availableMrAreas = useMemo(() => {
    const defaultSpecial = ["Leave", "Holiday", "Transit / Meeting", "HQ Office Review"];
    if (customAreas.length > 0) {
      return [...Array.from(new Set(customAreas)), ...defaultSpecial];
    }
    return defaultSpecial;
  }, [customAreas]);
  const [managerHqPlans, setManagerHqPlans] = useState<Record<string, { 
    hq: string; 
    mrId?: string;
    mrName?: string; 
    plannedArea?: string; 
    autoLinked?: boolean;
    source?: string;
  }>>({});
  
  const [status, setStatus] = useState<'draft' | 'submitted' | 'approved'>('draft');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [showTeamMatrixModal, setShowTeamMatrixModal] = useState(false);
  const [matrixSelectedHq, setMatrixSelectedHq] = useState<string>('all');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const monthYear = format(currentDate, 'yyyy-MM');

  const allHqs = useMemo(() => getAllHeadquarters(), []);

  // Synchronize MTP for manager on date/HQ changes or load
  const syncManagerRow = (dateStr: string, hqName: string, specificMrId?: string) => {
    if (hqName === 'Holiday' || hqName === 'Leave') {
      return {
        hq: hqName,
        mrId: 'SELF',
        mrName: 'Self',
        plannedArea: hqName,
        autoLinked: false,
        source: 'SPECIAL_ACTIVITY'
      };
    }

    if (MANAGER_SPECIAL_ACTIVITIES.includes(hqName)) {
      return {
        hq: hqName,
        mrId: 'SELF',
        mrName: 'Manager Activity',
        plannedArea: hqName,
        autoLinked: false,
        source: 'SPECIAL_ACTIVITY'
      };
    }

    const mrLink = getMrPlannedAreaForHq(hqName, dateStr, specificMrId);
    return {
      hq: hqName,
      mrId: mrLink.mrId,
      mrName: mrLink.mrName,
      plannedArea: mrLink.plannedArea,
      autoLinked: mrLink.isAutoLinked,
      source: mrLink.source
    };
  };

  // Load MTP data on month change
  useEffect(() => {
    const fetchMTP = async () => {
      setLoading(true);
      try {
        const storageKey = isManager ? `raxon_manager_mtp_${monthYear}` : `raxon_mtp_${activeUser.id}_${monthYear}`;
        let savedManagerData: any = null;
        try {
          const raw = localStorage.getItem(storageKey);
          if (raw) savedManagerData = JSON.parse(raw);
        } catch {}

        const mtpData = await getMTP(monthYear);
        const initialPlans: Record<string, string> = { ...(mtpData?.plans || {}) };
        const initialHqPlans: Record<string, any> = { ...(savedManagerData?.hqPlans || {}) };

        // Process all days in the month
        daysInMonth.forEach(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isSunday = format(day, 'EEEE') === 'Sunday';

          if (isSunday) {
            if (!initialPlans[dateStr]) initialPlans[dateStr] = 'Holiday';
            if (!initialHqPlans[dateStr]) {
              initialHqPlans[dateStr] = { hq: 'Holiday', plannedArea: 'Holiday', mrName: 'Holiday', autoLinked: false };
            }
          } else if (isManager) {
            // If manager plan for this day already has an HQ, re-sync with latest MR MTP for that date
            if (initialHqPlans[dateStr]?.hq) {
              const hqName = initialHqPlans[dateStr].hq;
              const synced = syncManagerRow(dateStr, hqName, initialHqPlans[dateStr].mrId);
              initialHqPlans[dateStr] = synced;
              initialPlans[dateStr] = `${synced.hq} - ${synced.plannedArea}`;
            }
          }
        });

        setPlans(initialPlans);
        setManagerHqPlans(initialHqPlans);
        setStatus(mtpData?.status || savedManagerData?.status || 'draft');
      } catch (error) {
        console.error("Error fetching MTP:", error);
      }
      setLoading(false);
    };
    fetchMTP();
  }, [monthYear, isManager, activeUser.id]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Reset plans
  const handleReset = () => {
    const resetPlans: Record<string, string> = {};
    const resetHqPlans: Record<string, any> = {};

    daysInMonth.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      if (format(day, 'EEEE') === 'Sunday') {
        resetPlans[dateStr] = 'Holiday';
        resetHqPlans[dateStr] = { hq: 'Holiday', plannedArea: 'Holiday', mrName: 'Holiday', autoLinked: false };
      }
    });

    setStatus('draft');
    setPlans(resetPlans);
    setManagerHqPlans(resetHqPlans);
    setMessage("Reset to draft! Sundays auto-marked as Holiday.");
  };

  // Manager selects Headquarter for a specific date
  const handleManagerHqSelect = (dateStr: string, selectedHq: string, specificMrId?: string) => {
    if (status !== 'draft') {
      setMessage("Cannot edit MTP. Current status is: " + status);
      return;
    }

    const synced = syncManagerRow(dateStr, selectedHq, specificMrId);

    setManagerHqPlans(prev => ({
      ...prev,
      [dateStr]: synced
    }));

    // Update standard plan map with both HQ and auto-fetched patch
    setPlans(prev => ({
      ...prev,
      [dateStr]: synced.plannedArea === synced.hq 
        ? synced.hq 
        : `${selectedHq} - ${synced.plannedArea}`
    }));
  };

  // Manager selects specific MR inside the selected HQ for that date
  const handleManagerMrSelect = (dateStr: string, specificMrId: string) => {
    const currentHq = managerHqPlans[dateStr]?.hq;
    if (!currentHq) return;
    handleManagerHqSelect(dateStr, currentHq, specificMrId);
  };

  // MR selects Area
  const handleAreaSelect = (dateStr: string, area: string) => {
    if (status !== 'draft') {
      setMessage("Cannot edit MTP. Current status is: " + status);
      return;
    }
    const updated = { ...plans, [dateStr]: area };
    setPlans(updated);

    // Also persist in local store so managers viewing this MR immediately get live sync
    try {
      const storageKey = `raxon_mtp_${activeUser.id}_${monthYear}`;
      localStorage.setItem(storageKey, JSON.stringify({
        userId: activeUser.id,
        userName: activeUser.name,
        monthYear,
        plans: updated,
        status: 'draft',
        lastUpdated: new Date().toISOString()
      }));
    } catch (e) {
      console.warn("Error auto-saving MR plan locally:", e);
    }
  };

  // 1-Tap Re-Sync of All Dates with Live MR MTPs
  const handleReSyncAllTeamPlans = () => {
    const updatedHqPlans: Record<string, any> = { ...managerHqPlans };
    const updatedPlans: Record<string, string> = { ...plans };

    let syncedCount = 0;

    daysInMonth.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const isSunday = format(day, 'EEEE') === 'Sunday';

      if (!isSunday && updatedHqPlans[dateStr]?.hq) {
        const currentHq = updatedHqPlans[dateStr].hq;
        const currentMrId = updatedHqPlans[dateStr].mrId;
        const synced = syncManagerRow(dateStr, currentHq, currentMrId);
        updatedHqPlans[dateStr] = synced;
        updatedPlans[dateStr] = `${synced.hq} - ${synced.plannedArea}`;
        syncedCount++;
      }
    });

    setManagerHqPlans(updatedHqPlans);
    setPlans(updatedPlans);
    setMessage(`✅ Re-synced ${syncedCount} working days with the latest MR MTP database across all HQs!`);
  };

  // 1-Tap Manager Auto-Fill for the Entire Month
  const handleManagerAutoFillMonth = () => {
    if (status !== 'draft') {
      setMessage("Cannot edit. MTP is already " + status);
      return;
    }

    const newHqPlans: Record<string, any> = { ...managerHqPlans };
    const newPlans: Record<string, string> = { ...plans };

    // Standard HQ Joint Working Rotation across all team HQs
    const hqRotation = [
      'Akbarpur HQ',
      'Akbarpur HQ',
      'Faizabad / Ayodhya HQ',
      'Faizabad / Ayodhya HQ',
      'Varanasi HQ',
      'Varanasi HQ',
      'Kanpur HQ',
      'Kanpur HQ',
      'Lucknow HQ',
      'Lucknow HQ',
      'Sultanpur HQ',
      'Gorakhpur HQ'
    ];

    let workingDayIdx = 0;

    daysInMonth.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const isSunday = format(day, 'EEEE') === 'Sunday';

      if (isSunday) {
        newHqPlans[dateStr] = { hq: 'Holiday', plannedArea: 'Holiday', mrName: 'Holiday', autoLinked: false };
        newPlans[dateStr] = 'Holiday';
      } else {
        const hqName = hqRotation[workingDayIdx % hqRotation.length];
        workingDayIdx++;
        const synced = syncManagerRow(dateStr, hqName);

        newHqPlans[dateStr] = synced;
        newPlans[dateStr] = `${synced.hq} - ${synced.plannedArea}`;
      }
    });

    setManagerHqPlans(newHqPlans);
    setPlans(newPlans);
    setMessage("✨ Auto-filled entire month's Joint Working Tour Plan! Every date is matched with the respected HQ and auto-synced with that MR's planned patch.");
  };

  const isComplete = daysInMonth.every(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const isWeekend = format(day, 'EEEE') === 'Sunday';
    if (isManager) {
      return !!(managerHqPlans[dateStr]?.hq || (isWeekend ? 'Holiday' : ''));
    }
    return !!(plans[dateStr] || (isWeekend ? 'Holiday' : ''));
  });

  const handleSubmit = () => {
    if (!isComplete) {
      setMessage("Please fill the plan for all working days before submitting.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const finalPlans = { ...plans };
      daysInMonth.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        if (format(day, 'EEEE') === 'Sunday' && !finalPlans[dateStr]) {
          finalPlans[dateStr] = 'Holiday';
        }
      });

      if (isManager) {
        // Save manager HQ MTP locally
        localStorage.setItem(`raxon_manager_mtp_${monthYear}`, JSON.stringify({
          monthYear,
          managerRole: currentRole,
          managerName: activeUser.name,
          hqPlans: managerHqPlans,
          plans: finalPlans,
          status: 'submitted',
          submittedAt: new Date().toISOString()
        }));
      } else {
        // Save MR MTP locally
        localStorage.setItem(`raxon_mtp_${activeUser.id}_${monthYear}`, JSON.stringify({
          userId: activeUser.id,
          userName: activeUser.name,
          monthYear,
          plans: finalPlans,
          status: 'submitted',
          submittedAt: new Date().toISOString()
        }));
      }

      await submitMTP(monthYear, finalPlans);
      setPlans(finalPlans);
      setStatus('submitted');
      setMessage(isManager 
        ? "Manager Joint Working Tour Plan submitted successfully!" 
        : "MTP Submitted successfully to Manager for approval."
      );
    } catch (error: any) {
      console.error("Error submitting MTP:", error);
      const reason = error?.message || error?.code || (typeof error === 'string' ? error : JSON.stringify(error)) || "Unknown error";
      setMessage(`Failed to submit MTP. Reason: ${reason}`);
    }
    setLoading(false);
  };

  // Stats calculation for Manager View
  const hqStats = useMemo(() => {
    if (!isManager) return null;
    const stats: Record<string, number> = {};
    let totalWorkingDays = 0;

    Object.entries(managerHqPlans).forEach(([date, plan]) => {
      if (plan.hq && plan.hq !== 'Holiday' && plan.hq !== 'Leave') {
        stats[plan.hq] = (stats[plan.hq] || 0) + 1;
        totalWorkingDays++;
      }
    });

    return { stats, totalWorkingDays };
  }, [managerHqPlans, isManager]);

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm MTP Submission">
        <p className="text-gray-600 mb-6">
          {isManager 
            ? 'Are you sure you want to submit your Manager Joint Working Tour Plan? Once submitted, it will lock your HQ field travel schedule and team sync.' 
            : 'Are you sure you want to submit your MTP for approval? Once submitted, it cannot be edited.'}
        </p>
        <div className="flex justify-end space-x-3">
          <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
          <button onClick={confirmSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold">Submit</button>
        </div>
      </Modal>

      {/* Notification Modal */}
      <Modal isOpen={!!message} onClose={() => setMessage('')} title="Notification">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex justify-end">
          <button onClick={() => setMessage('')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold">OK</button>
        </div>
      </Modal>

      {/* Team MR Monthly Matrix Modal */}
      {showTeamMatrixModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-700 rounded-lg">
                  <Users className="w-5 h-5 text-indigo-200" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Team MR Monthly Tour Plans by Headquarter</h3>
                  <p className="text-xs text-indigo-200">
                    {format(currentDate, 'MMMM yyyy')} — View all MR planned patches across every HQ under your leadership
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowTeamMatrixModal(false)}
                className="p-1.5 hover:bg-indigo-800 rounded-lg text-indigo-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar inside Modal */}
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700">Filter by HQ:</span>
                <select 
                  value={matrixSelectedHq} 
                  onChange={(e) => setMatrixSelectedHq(e.target.value)}
                  className="text-xs font-bold border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-800"
                >
                  <option value="all">🏢 All Headquarters ({allHqs.length} HQs)</option>
                  {allHqs.map(hq => (
                    <option key={hq.id} value={hq.name}>{hq.name} ({hq.assignedMrName})</option>
                  ))}
                </select>
              </div>
              <span className="text-3xs font-bold text-gray-500">
                ⚡ Any changes made by an MR in their MTP automatically update here
              </span>
            </div>

            {/* Matrix Content */}
            <div className="overflow-y-auto p-4 space-y-4">
              {allHqs
                .filter(hq => matrixSelectedHq === 'all' || hq.name === matrixSelectedHq)
                .map(hq => {
                  const mrFullPlan = getMrFullMonthMTP(hq.assignedMrId, hq.assignedMrName, hq.name, monthYear);
                  return (
                    <div key={hq.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                      <div className="bg-indigo-50/80 px-4 py-2.5 border-b border-indigo-100 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-indigo-700" />
                          <span className="font-extrabold text-xs text-indigo-950">{hq.name}</span>
                          <span className="text-3xs px-2 py-0.5 bg-indigo-200 text-indigo-900 rounded font-black">
                            {hq.district}
                          </span>
                        </div>
                        <div className="text-xs flex items-center gap-2">
                          <span className="text-gray-600">Assigned MR: <strong className="text-gray-900">{hq.assignedMrName}</strong> ({hq.assignedMrId})</span>
                          <span className="text-3xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                            {mrFullPlan.source === 'SAVED_LOCAL' ? '🟢 Custom Submitted MTP' : '🔵 Approved Standard Roster'}
                          </span>
                        </div>
                      </div>

                      {/* Day Grid */}
                      <div className="p-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                        {daysInMonth.map(day => {
                          const dStr = format(day, 'yyyy-MM-dd');
                          const isSun = format(day, 'EEEE') === 'Sunday';
                          const patch = mrFullPlan.plans[dStr] || (isSun ? 'Holiday' : hq.patches?.[0] || 'Unknown Patch');

                          return (
                            <div 
                              key={dStr}
                              className={`p-2 rounded-lg border text-center ${
                                isSun 
                                  ? 'bg-red-50/60 border-red-100 text-red-600' 
                                  : 'bg-gray-50/70 border-gray-200 text-gray-800'
                              }`}
                            >
                              <div className="text-3xs font-extrabold text-gray-500 mb-0.5">
                                {format(day, 'dd MMM (EEE)')}
                              </div>
                              <div className={`text-2xs font-extrabold truncate ${isSun ? 'text-red-700' : 'text-indigo-950'}`} title={patch}>
                                {patch}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setShowTeamMatrixModal(false)}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
              >
                Close Matrix View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {isManager ? 'Manager Monthly Tour Plan (HQ Joint Working)' : 'Monthly Tour Plan (MTP)'}
            </h1>
            
            {isManager && (
              <span className="text-2xs font-extrabold px-2.5 py-1 bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                <span>{currentRole} Leadership Mode</span>
              </span>
            )}

            <button 
              onClick={handleReset} 
              className="text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded-md border border-indigo-200 transition-colors"
              title="Reset MTP to Draft and Auto-fill all Sundays as Holiday"
            >
              Reset / Sundays
            </button>

            {isManager && (
              <>
                <button
                  onClick={handleReSyncAllTeamPlans}
                  className="text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-md border border-blue-200 flex items-center gap-1.5 transition-colors"
                  title="Re-query all MRs across all HQs and sync with latest planned routes"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-Sync Team MTPs</span>
                </button>

                <button
                  onClick={() => setShowTeamMatrixModal(true)}
                  className="text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1 rounded-md border border-purple-200 flex items-center gap-1.5 transition-colors"
                  title="Open matrix view of all team MR monthly plans"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View All Team Plans</span>
                </button>

                {status === 'draft' && (
                  <button
                    onClick={handleManagerAutoFillMonth}
                    className="text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
                    title="Automatically rotate HQs and auto-fetch respected MR planned patches for all 30 days"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>⚡ Auto-Fill Month (Link MR Plans)</span>
                  </button>
                )}
              </>
            )}
          </div>
          <p className="text-gray-500 text-xs mt-1">
            {isManager 
              ? 'Har date ke liye target Headquarter (HQ) select karein — us respected HQ ke assigned MR ka us date ka planned patch/area automatically manager ke MTP me sync ho jata hai.'
              : 'Plan your daily working areas and patches for the entire month.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {loading && <span className="text-sm text-gray-500 animate-pulse">Loading plans...</span>}
          {status === 'draft' && (
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-gray-300">
              <AlertCircle size={14} className="mr-1 text-gray-500" /> Draft
            </span>
          )}
          {status === 'submitted' && (
            <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-amber-300">
              <Clock size={14} className="mr-1 text-amber-600" /> Active Tour Plan
            </span>
          )}
          {status === 'approved' && (
            <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-emerald-300">
              <CheckCircle2 size={14} className="mr-1 text-emerald-600" /> Approved
            </span>
          )}
        </div>
      </div>

      {/* Manager Explanatory & Dynamic Statistics Card */}
      {isManager && (
        <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 border border-indigo-200 p-4 rounded-xl shadow-2xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <div className="font-extrabold text-indigo-950 flex items-center gap-2">
                <span>Multi-HQ Field Tour Sync (Respected MR Plan Integration)</span>
                <span className="text-3xs bg-emerald-200 text-emerald-950 font-black px-2 py-0.5 rounded">
                  Live MR Link Active
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed text-3xs">
                Manager ke under me multiple HQs aur MRs hain. Har date me jab aap koi bhi <strong>HQ</strong> (e.g. Akbarpur, Faizabad, Varanasi, Kanpur, Lucknow, etc.) select karenge, system turant us din <strong>us respected HQ ke MR ka planned patch</strong> aapke tour plan me auto-sync kar dega.
              </p>
            </div>
          </div>

          {/* Quick HQ Breakdown Stats */}
          {hqStats && (
            <div className="pt-2 border-t border-indigo-200/80 flex items-center justify-between flex-wrap gap-2 text-2xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-indigo-950">Planned Working Days: {hqStats.totalWorkingDays} days</span>
                <span className="text-gray-400">|</span>
                {Object.entries(hqStats.stats).map(([hq, count]) => (
                  <span key={hq} className="px-2 py-0.5 bg-white border border-indigo-200 rounded-md font-semibold text-indigo-900 shadow-3xs">
                    {hq.replace(' HQ', '')}: <strong>{count}d</strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calendar Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Calendar Navigation Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <CalendarIcon className="mr-2 text-indigo-600" size={20} />
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Days Table / Grid */}
        <div className="p-4">
          <div className="space-y-3">
            {daysInMonth.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayName = format(day, 'EEEE');
              const isWeekend = dayName === 'Sunday';
              
              // Manager state
              const mgrPlan = managerHqPlans[dateStr];
              const selectedHq = mgrPlan?.hq || (isWeekend ? 'Holiday' : '');
              const mrName = mgrPlan?.mrName;
              const mrId = mgrPlan?.mrId;
              const plannedArea = mgrPlan?.plannedArea;
              const isAutoLinked = mgrPlan?.autoLinked;
              const source = mgrPlan?.source;

              // Find available MRs for selected HQ
              const currentHqObj = getHeadquarterByName(selectedHq);
              const availableMrs = currentHqObj?.assignedMrs || [];

              // MR state
              const selectedArea = plans[dateStr] !== undefined ? plans[dateStr] : (isWeekend ? 'Holiday' : '');

              return (
                <div 
                  key={dateStr} 
                  className={`flex flex-col lg:flex-row lg:items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isWeekend 
                      ? 'bg-red-50/50 border-red-200' 
                      : (isManager ? selectedHq : selectedArea)
                      ? 'bg-white border-gray-200 hover:border-indigo-300 shadow-2xs'
                      : 'bg-amber-50/40 border-amber-200'
                  } ${isToday(day) ? 'ring-2 ring-indigo-600 bg-indigo-50/30' : ''}`}
                >
                  {/* Date & Day Label */}
                  <div className="w-full lg:w-40 shrink-0 flex items-center justify-between lg:block mb-2 lg:mb-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-gray-900 text-sm">{format(day, 'dd MMM')}</span>
                      <span className={`text-xs font-semibold ${isWeekend ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                        {dayName}
                      </span>
                    </div>
                    {isToday(day) && (
                      <span className="text-3xs font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase lg:mt-1 lg:inline-block">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Manager HQ Selection Mode vs MR Area Selection Mode */}
                  {isManager ? (
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      {/* Step 1: Select HQ */}
                      <div className="md:col-span-5">
                        <label className="block text-3xs font-black uppercase tracking-wider text-gray-500 mb-1">
                          1. Select Headquarter (HQ) for {format(day, 'dd MMM')}:
                        </label>
                        <select
                          value={selectedHq || ''}
                          onChange={(e) => handleManagerHqSelect(dateStr, e.target.value)}
                          onClick={() => { if(status !== 'draft') setMessage("Cannot edit. MTP is already " + status); }}
                          className={`w-full p-2.5 rounded-lg border text-xs font-bold transition-all ${
                            selectedHq && !isWeekend 
                              ? 'border-indigo-300 bg-indigo-50/50 text-indigo-950 shadow-2xs' 
                              : isWeekend
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : 'border-amber-300 bg-amber-50 text-gray-700'
                          } ${status !== 'draft' ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-indigo-500'}`}
                        >
                          <option value="" disabled>-- Select HQ / Activity --</option>
                          
                          <optgroup label="🏢 Field Headquarters (HQs)">
                            {allHqs.map(hq => (
                              <option key={hq.id} value={hq.name}>
                                📍 {hq.name} ({hq.assignedMrName} - {hq.district})
                              </option>
                            ))}
                          </optgroup>

                          <optgroup label="💼 Special / Administrative Activities">
                            {MANAGER_SPECIAL_ACTIVITIES.map(act => (
                              <option key={act} value={act}>
                                📌 {act}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>

                      {/* Step 2: Respected MR & Auto-Synced Planned Patch for this Date */}
                      <div className="md:col-span-7">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-3xs font-black uppercase tracking-wider text-gray-500">
                            2. Respected MR & Synced Route on {format(day, 'dd MMM')}:
                          </label>
                          
                          {/* If HQ has multiple MRs, allow selecting which MR */}
                          {availableMrs.length > 1 && (
                            <span className="text-3xs text-indigo-700 font-bold">
                              Multiple MRs available
                            </span>
                          )}
                        </div>

                        {selectedHq && selectedHq !== 'Holiday' && selectedHq !== 'Leave' && !MANAGER_SPECIAL_ACTIVITIES.includes(selectedHq) ? (
                          <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between flex-wrap gap-2 text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                              <div>
                                <div className="font-extrabold text-emerald-950 flex items-center gap-2 flex-wrap">
                                  <span>MR: <strong>{mrName}</strong></span>
                                  
                                  {availableMrs.length > 1 && (
                                    <select
                                      value={mrId || availableMrs[0]?.empId}
                                      onChange={(e) => handleManagerMrSelect(dateStr, e.target.value)}
                                      className="text-3xs font-bold border border-emerald-300 bg-white text-emerald-900 rounded px-1.5 py-0.5"
                                    >
                                      {availableMrs.map(m => (
                                        <option key={m.empId || m.id} value={m.empId || m.id}>
                                          Switch MR: {m.name}
                                        </option>
                                      ))}
                                    </select>
                                  )}

                                  <span className="text-3xs px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded font-black">
                                    {source === 'MR_SAVED_MTP' ? '⚡ Live MTP Synced' : '⚡ Auto-Synced from HQ'}
                                  </span>
                                </div>

                                <div className="text-xs text-emerald-900 font-bold flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>MR's Planned Patch: <span className="underline decoration-emerald-500 decoration-2 font-black">{plannedArea}</span></span>
                                </div>
                              </div>
                            </div>

                            <span className="text-3xs font-black text-emerald-900 bg-white px-2.5 py-1 rounded-md border border-emerald-200 shadow-3xs">
                              Joint Work Target
                            </span>
                          </div>
                        ) : selectedHq === 'Holiday' ? (
                          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-700 flex items-center gap-2">
                            <span>🌴 Holiday / Non-Working Day</span>
                          </div>
                        ) : selectedHq ? (
                          <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg text-xs font-bold text-purple-900 flex items-center gap-2">
                            <span>📌 Special Manager Duty: {selectedHq}</span>
                          </div>
                        ) : (
                          <div className="p-2.5 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-3xs text-gray-400 font-semibold italic">
                            Select an HQ for this date to auto-sync the respected MR's route
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Standard MR Area Selection Mode */
                    <div className="flex-1 w-full">
                      <select
                        value={selectedArea || ''}
                        onChange={(e) => handleAreaSelect(dateStr, e.target.value)}
                        onClick={() => { if(status !== 'draft') setMessage("Cannot edit. MTP is already " + status); }}
                        className={`w-full p-2.5 rounded-lg border transition-colors text-xs font-bold ${
                          selectedArea && !isWeekend ? 'text-emerald-800 bg-emerald-50/40 border-emerald-300' : 'text-gray-700'
                        } ${
                          !selectedArea && !isWeekend ? 'border-amber-300 bg-amber-50' : 'border-gray-300'
                        } ${status !== 'draft' ? 'bg-gray-50' : 'bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}`}
                      >
                        <option value="" disabled>Select Area / Patch / Leave / Holiday</option>
                        {availableMrAreas.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs font-semibold text-gray-600">
            {isComplete 
              ? '✅ All days planned with respected MR routes and ready for submission.' 
              : '⚠️ Please select HQ / working area for all days before submitting.'}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={!isComplete || status !== 'draft' || loading}
              className={`flex items-center px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-xs transition-all ${
                isComplete && status === 'draft' && !loading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={16} className="mr-2" />
              {loading ? 'Submitting...' : isManager ? 'Submit Manager Tour Plan' : 'Submit for Approval'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
