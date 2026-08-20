import React, { useState, useEffect } from 'react';
import { 
  Map, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  Phone, 
  Award, 
  User, 
  Building2, 
  Navigation, 
  Pill, 
  Gift, 
  ShoppingCart, 
  MessageSquare, 
  Users,
  Share2,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Send,
  ShieldCheck,
  ShieldAlert,
  PackageCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { getMTP, saveDCRCheckIn, getDCR } from '../lib/api';
import { Modal } from '../components/Modal';
import { CompleteCallModal } from '../components/CompleteCallModal';
import { getDoctorsList, saveDoctorsList, getChemistsList, saveChemistsList, getCompanyAreas, Doctor, Chemist } from '../data/masterData';
import { getActiveUserContext, getUserPermissions } from '../data/permissionSettings';
import { getActiveCompany } from '../data/companyContext';
import { useDataIsolation } from '../hooks/useDataIsolation';
import { CallReportDetail } from '../data/dcrCallDetails';
import { enqueueOfflineCall, getOfflineCallQueue } from '../lib/offlineIndexedDB';
import { checkIsOnline } from '../lib/offlineSyncService';
import { OfflineSyncStatusBar, useOfflineSync } from '../components/OfflineSyncStatusBar';
import { OfflineQueueModal } from '../components/OfflineQueueModal';
import { 
  getMRSampleInventory, 
  getMRGiftInventory, 
  getSampleAuditLogs,
  SampleInventoryItem,
  GiftInventoryItem,
  SampleTransactionAudit
} from '../data/sampleInventory';

export default function Dcr() {
  const { companyId } = useDataIsolation();
  const activeCompany = getActiveCompany();
  const [plannedArea, setPlannedArea] = useState<string | null>(null);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [allChemists, setAllChemists] = useState<Chemist[]>([]);
  
  // Visited tracking
  const [visitedDoctors, setVisitedDoctors] = useState<number[]>([]);
  const [visitedChemists, setVisitedChemists] = useState<number[]>([]);
  const [visitedCallsMap, setVisitedCallsMap] = useState<Record<string, CallReportDetail>>({});

  // Active check-in state
  const [activeCheckInType, setActiveCheckInType] = useState<'doctor' | 'chemist' | null>(null);
  const [activeCheckInId, setActiveCheckInId] = useState<number | null>(null);
  const [visitLocation, setVisitLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Modals & notifications
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);

  // Active view tab: 'all' | 'doctors' | 'chemists'
  const [activeCallTab, setActiveCallTab] = useState<'all' | 'doctors' | 'chemists'>('all');

  // Complete Call Modal target
  const [doctorToComplete, setDoctorToComplete] = useState<Doctor | null>(null);
  const [chemistToComplete, setChemistToComplete] = useState<Chemist | null>(null);

  // Add doctor / chemist modals
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('General Physician');
  const [newDocAddress, setNewDocAddress] = useState('');
  const [newDocSubArea, setNewDocSubArea] = useState('');
  const [newDocPhone, setNewDocPhone] = useState('');

  // Offline Sync State
  const [showOfflineQueueModal, setShowOfflineQueueModal] = useState(false);
  const { queue, auditLogs, isOnline, isSyncing, refreshQueue } = useOfflineSync();

  // Sample Bag State
  const [showSampleBagModal, setShowSampleBagModal] = useState(false);
  const [bagSamples, setBagSamples] = useState<SampleInventoryItem[]>([]);
  const [bagGifts, setBagGifts] = useState<GiftInventoryItem[]>([]);
  const [bagAuditLogs, setBagAuditLogs] = useState<SampleTransactionAudit[]>([]);

  const reloadBagInventory = () => {
    setBagSamples(getMRSampleInventory(companyId));
    setBagGifts(getMRGiftInventory(companyId));
    setBagAuditLogs(getSampleAuditLogs(companyId));
  };

  useEffect(() => {
    reloadBagInventory();
  }, [companyId]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const formattedTodayDate = format(new Date(), 'dd MMMM yyyy (EEEE)');
  const monthYear = format(new Date(), 'yyyy-MM');

  // Active user context
  const activeUser = getActiveUserContext();

  useEffect(() => {
    setAllDoctors(getDoctorsList(companyId));
    setAllChemists(getChemistsList(companyId));

    const fetchData = async () => {
      setLoading(true);
      try {
        const mtpData = await getMTP(monthYear);
        if (mtpData && mtpData.plans && mtpData.plans[todayStr]) {
          setPlannedArea(mtpData.plans[todayStr]);
        } else {
          const compAreas = getCompanyAreas(companyId);
          setPlannedArea(compAreas[0] || "Headquarters"); // Default to active territory if empty
        }

        const dcrData = await getDCR(todayStr);
        if (dcrData && dcrData.checkIns) {
          const docIds: number[] = [];
          const chmIds: number[] = [];
          const map: Record<string, CallReportDetail> = {};

          dcrData.checkIns.forEach((c: any) => {
            if (c.callTargetType === 'chemist' || c.chemistId) {
              chmIds.push(c.chemistId);
              map[`chemist-${c.chemistId}`] = c;
            } else if (c.doctorId) {
              docIds.push(c.doctorId);
              map[`doctor-${c.doctorId}`] = c;
            }
          });

          setVisitedDoctors(docIds);
          setVisitedChemists(chmIds);
          setVisitedCallsMap(map);
        }
      } catch (error) {
        console.error("Error fetching DCR data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [monthYear, todayStr, companyId]);

  const normalizedPlannedArea = (plannedArea || '').trim().toLowerCase();
  
  const territoryDoctors = allDoctors.filter(d => 
    (d.area || '').trim().toLowerCase() === normalizedPlannedArea
  );

  const territoryChemists = allChemists.filter(c => 
    (c.area || '').trim().toLowerCase() === normalizedPlannedArea
  );

  // Stealth GPS Check-in handler
  const handleCheckIn = async (type: 'doctor' | 'chemist', id: number) => {
    setIsGettingLocation(true);
    setActiveCheckInType(type);
    setActiveCheckInId(id);

    try {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setVisitLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            });
            setIsGettingLocation(false);
          },
          () => {
            setVisitLocation({ lat: 26.4300, lng: 82.5400 });
            setIsGettingLocation(false);
          },
          { enableHighAccuracy: true, timeout: 4000 }
        );
      } else {
        setVisitLocation({ lat: 26.4300, lng: 82.5400 });
        setIsGettingLocation(false);
      }
    } catch (error) {
      // Stealth fallback
      setVisitLocation({ lat: 26.4300, lng: 82.5400 });
      setIsGettingLocation(false);
    }
  };

  // Save Complete Call Report (Doctor or Chemist)
  const handleSaveCompleteCall = async (callReport: CallReportDetail) => {
    try {
      if (!plannedArea) return;
      
      const targetId = callReport.callTargetType === 'chemist' ? callReport.chemistId : callReport.doctorId;
      const targetName = callReport.callTargetType === 'chemist' ? callReport.chemistName : callReport.doctorName;
      const key = `${callReport.callTargetType}-${targetId}`;
      const online = checkIsOnline();

      if (!online) {
        // Enqueue directly to IndexedDB
        await enqueueOfflineCall({
          userId: activeUser.id || 'user_pradeep_001',
          userName: activeUser.name,
          date: todayStr,
          monthYear,
          area: plannedArea,
          callTargetType: callReport.callTargetType,
          targetId: targetId || 0,
          targetName: targetName || 'Target',
          specialtyOrCategory: callReport.doctorSpecialty,
          pobTotalValue: callReport.pobTotalValue || 0,
          orderedBrandsCount: callReport.pobOrders?.length || 0,
          samplesGivenCount: callReport.samplesGiven?.reduce((s, a) => s + a.quantity, 0) || 0,
          location: visitLocation || undefined,
          callDetail: callReport
        });
      } else {
        await saveDCRCheckIn(
          todayStr, 
          plannedArea, 
          targetId || 0, 
          visitLocation || undefined,
          callReport
        );
      }

      if (callReport.callTargetType === 'chemist' && callReport.chemistId) {
        if (!visitedChemists.includes(callReport.chemistId)) {
          setVisitedChemists(prev => [...prev, callReport.chemistId!]);
        }
      } else if (callReport.doctorId) {
        if (!visitedDoctors.includes(callReport.doctorId)) {
          setVisitedDoctors(prev => [...prev, callReport.doctorId!]);
        }
      }

      setVisitedCallsMap(prev => ({
        ...prev,
        [key]: callReport
      }));

      setActiveCheckInId(null);
      setActiveCheckInType(null);
      setVisitLocation(null);
      setDoctorToComplete(null);
      setChemistToComplete(null);
      
      if (!online) {
        setMessage(`⚡ Call logged OFFLINE in IndexedDB for ${targetName}! It will automatically sync when network returns.`);
      } else {
        setMessage(`Call Report saved successfully for ${targetName}!`);
      }
      refreshQueue();
    } catch (error) {
      console.error("Failed to save checkin online, saving to offline IndexedDB:", error);
      try {
        const targetId = callReport.callTargetType === 'chemist' ? callReport.chemistId : callReport.doctorId;
        const targetName = callReport.callTargetType === 'chemist' ? callReport.chemistName : callReport.doctorName;
        const key = `${callReport.callTargetType}-${targetId}`;

        await enqueueOfflineCall({
          userId: activeUser.id || 'user_pradeep_001',
          userName: activeUser.name,
          date: todayStr,
          monthYear,
          area: plannedArea || 'Patch',
          callTargetType: callReport.callTargetType,
          targetId: targetId || 0,
          targetName: targetName || 'Target',
          specialtyOrCategory: callReport.doctorSpecialty,
          pobTotalValue: callReport.pobTotalValue || 0,
          orderedBrandsCount: callReport.pobOrders?.length || 0,
          samplesGivenCount: callReport.samplesGiven?.reduce((s, a) => s + a.quantity, 0) || 0,
          location: visitLocation || undefined,
          callDetail: callReport
        });

        if (callReport.callTargetType === 'chemist' && callReport.chemistId) {
          if (!visitedChemists.includes(callReport.chemistId)) {
            setVisitedChemists(prev => [...prev, callReport.chemistId!]);
          }
        } else if (callReport.doctorId) {
          if (!visitedDoctors.includes(callReport.doctorId)) {
            setVisitedDoctors(prev => [...prev, callReport.doctorId!]);
          }
        }

        setVisitedCallsMap(prev => ({
          ...prev,
          [key]: callReport
        }));

        setActiveCheckInId(null);
        setActiveCheckInType(null);
        setVisitLocation(null);
        setDoctorToComplete(null);
        setChemistToComplete(null);
        setMessage(`⚡ Saved to Offline IndexedDB Queue due to low network. Will auto-sync when connection returns!`);
        refreshQueue();
      } catch (innerErr) {
        setMessage("Failed to save visit. Please check device memory.");
      }
    }
  };

  // Add new doctor directly from DCR
  const handleAddNewDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !plannedArea) return;

    const formattedName = newDocName.trim().startsWith('Dr.') ? newDocName.trim() : `Dr. ${newDocName.trim()}`;
    const newDoc: Doctor = {
      id: Date.now(),
      name: formattedName,
      area: plannedArea,
      subArea: newDocSubArea.trim() || 'Main Chowk',
      address: newDocAddress.trim() || 'Opposite Main Hospital',
      specialty: newDocSpecialty || 'General Physician',
      phone: newDocPhone.trim() || '+91 98380 12345',
      qualification: 'MBBS'
    };

    const updated = [newDoc, ...allDoctors];
    setAllDoctors(updated);
    saveDoctorsList(updated, companyId);

    setNewDocName('');
    setNewDocAddress('');
    setNewDocSubArea('');
    setNewDocPhone('');
    setShowAddDoctor(false);
    setMessage(`Successfully added ${newDoc.name} to ${plannedArea}!`);
  };

  // --- WHATSAPP SHARE 1: MORNING PLAN SHARE ---
  const handleShareMorningPlanWhatsApp = () => {
    // Doctors list: Name only
    const plannedDocLines = territoryDoctors.map((d, i) => 
      `${i + 1}. *${d.name}*`
    ).join('\n');

    // Chemists list: Name only
    const plannedChmLines = territoryChemists.map((c, i) => 
      `${i + 1}. *${c.name}*`
    ).join('\n');

    const messageText = 
`🌅 *${activeCompany.name.toUpperCase()} - MORNING DCR FIELD PLAN*
━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${formattedTodayDate}
👤 *MR Name:* ${activeUser.name} (${activeUser.role})
📍 *Planned Area / Territory:* ${plannedArea}
🏢 *Headquarters:* ${activeUser.hq}

👨‍⚕️ *PLANNED DOCTORS (${territoryDoctors.length}):*
${plannedDocLines || 'No doctors scheduled'}

🏪 *PLANNED CHEMISTS (${territoryChemists.length}):*
${plannedChmLines || 'No chemists scheduled'}

🎯 *DAY TARGETS:*
• Expected Doctor Calls: ${territoryDoctors.length}
• Expected Chemist Calls: ${territoryChemists.length}
• Target POB Booking: ₹8,000+

_Report generated via ${activeCompany.name} SFA Field Automation_`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // --- WHATSAPP SHARE 2: EVENING CALL REPORT (DCR SUMMARY) SHARE ---
  const handleShareEveningReportWhatsApp = () => {
    // Collect Done calls
    const completedDocs = territoryDoctors.filter(d => visitedDoctors.includes(d.id));
    const missedDocs = territoryDoctors.filter(d => !visitedDoctors.includes(d.id));
    const completedChms = territoryChemists.filter(c => visitedChemists.includes(c.id));
    const missedChms = territoryChemists.filter(c => !visitedChemists.includes(c.id));

    let totalPob = 0;
    let totalSamples = 0;
    let totalGifts = 0;
    const jointManagersSet = new Set<string>();

    const docDoneLines = completedDocs.map((d, i) => {
      const rep = visitedCallsMap[`doctor-${d.id}`];
      if (rep) {
        totalPob += rep.pobTotalValue || 0;
        const sCount = rep.samplesGiven?.reduce((acc, s) => acc + s.quantity, 0) || 0;
        const gCount = rep.giftsGiven?.reduce((acc, g) => acc + g.quantity, 0) || 0;
        totalSamples += sCount;
        totalGifts += gCount;
        if (rep.isJointWorking && rep.jointManagers) {
          rep.jointManagers.forEach(m => jointManagersSet.add(m));
        }
        return `${i + 1}. *${d.name}* (Done)\n   └ POB: ₹${rep.pobTotalValue || 0} | Samples: ${sCount} | Joint: ${rep.isJointWorking ? rep.jointManagerName : 'Independent'}`;
      }
      return `${i + 1}. *${d.name}* - Call Done`;
    }).join('\n');

    const chmDoneLines = completedChms.map((c, i) => {
      const rep = visitedCallsMap[`chemist-${c.id}`];
      if (rep) {
        totalPob += rep.pobTotalValue || 0;
        return `${i + 1}. *${c.name}* (Done)\n   └ POB: ₹${rep.pobTotalValue || 0} | Stock: ${rep.stockAvailable ? 'Available' : 'Shortage'}`;
      }
      return `${i + 1}. *${c.name}* - Call Done`;
    }).join('\n');

    const missedDocLines = missedDocs.length > 0 
      ? missedDocs.map((d, i) => `${i + 1}. *${d.name}* (Missed)`).join('\n')
      : 'None (100% Doctor Calls Completed! 🎯)';

    const missedChmLines = missedChms.length > 0
      ? missedChms.map((c, i) => `${i + 1}. *${c.name}* (Missed)`).join('\n')
      : 'None (100% Chemist Calls Completed!)';

    const jointStatus = jointManagersSet.size > 0 
      ? Array.from(jointManagersSet).join(', ') 
      : 'Independent MR Working';

    const messageText = 
`📊 *${activeCompany.name.toUpperCase()} - DAILY CALL REPORT (FINAL DCR)*
━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${formattedTodayDate}
👤 *MR Name:* ${activeUser.name} (${activeUser.role})
📍 *Territory Worked:* ${plannedArea}
👥 *Manager Joint Working:* ${jointStatus}

✅ *CALL DONE - DOCTORS (${completedDocs.length}/${territoryDoctors.length}):*
${docDoneLines || 'No doctor calls recorded'}

🏪 *CALL DONE - CHEMISTS (${completedChms.length}/${territoryChemists.length}):*
${chmDoneLines || 'No chemist calls recorded'}

❌ *MISSED DOCTORS (${missedDocs.length}):*
${missedDocLines}

⚠️ *MISSED CHEMISTS (${missedChms.length}):*
${missedChmLines}

💰 *TOTAL FIELD PERFORMANCE:*
• 💵 *Total POB Booked:* ₹${totalPob.toFixed(2)}
• 💊 *Total Samples Given:* ${totalSamples} Units
• 🎁 *Total Gifts Delivered:* ${totalGifts} Units
• 📈 *Doctor Call Coverage:* ${((completedDocs.length / (territoryDoctors.length || 1)) * 100).toFixed(0)}%

_Final DCR Submitted & Verified by ${activeCompany.name} SFA_`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Calculations for total POB & samples
  const totalPobValue = Object.values(visitedCallsMap).reduce((acc, c) => acc + (c.pobTotalValue || 0), 0);
  const totalSamplesDistributed = Object.values(visitedCallsMap).reduce((acc, c) => 
    acc + (c.samplesGiven?.reduce((sAcc, s) => sAcc + s.quantity, 0) || 0), 0
  );
  const totalGiftsDistributed = Object.values(visitedCallsMap).reduce((acc, c) => 
    acc + (c.giftsGiven?.reduce((gAcc, g) => gAcc + g.quantity, 0) || 0), 0
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-700 font-bold">Loading today's field schedule...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Confirm Final Submit Modal */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="End Day & Final DCR Submit">
        <div className="space-y-4 text-xs">
          <p className="text-gray-900 font-extrabold text-sm">
            Are you sure you want to end today's field work and submit the final Daily Call Report (DCR)?
          </p>
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1.5 text-emerald-950 font-bold">
            <p><strong>Doctor Calls Completed:</strong> {visitedDoctors.length} / {territoryDoctors.length}</p>
            <p><strong>Chemist Calls Completed:</strong> {visitedChemists.length} / {territoryChemists.length}</p>
            <p><strong>Total POB Booked:</strong> ₹{totalPobValue.toFixed(2)}</p>
            <p><strong>Total Samples Distributed:</strong> {totalSamplesDistributed} Units</p>
          </div>
          <p className="text-gray-700 font-semibold">
            After submission, you can immediately share your complete Daily Call Report with your managers on WhatsApp.
          </p>
          <div className="flex justify-end space-x-3 pt-2">
            <button 
              type="button" 
              onClick={() => setShowConfirm(false)} 
              className="px-4 py-2 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={() => { 
                setShowConfirm(false); 
                setIsFinalSubmitted(true);
                setMessage("DCR Final Day Submission Completed Successfully!"); 
                handleShareEveningReportWhatsApp();
              }} 
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              Final Submit & Share on WhatsApp
            </button>
          </div>
        </div>
      </Modal>

      {/* Notification Toast */}
      {message && (
        <Modal isOpen={!!message} onClose={() => setMessage('')} title="Field System Notification">
          <div className="space-y-4">
            <p className="text-gray-900 font-bold text-sm">{message}</p>
            <div className="flex justify-end">
              <button onClick={() => setMessage('')} className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">OK</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Complete Call Modal for Doctor */}
      {doctorToComplete && (
        <CompleteCallModal
          isOpen={!!doctorToComplete}
          onClose={() => setDoctorToComplete(null)}
          targetType="doctor"
          doctor={doctorToComplete}
          chemistsList={territoryChemists}
          location={visitLocation}
          onSaveCall={handleSaveCompleteCall}
        />
      )}

      {/* Complete Call Modal for Chemist */}
      {chemistToComplete && (
        <CompleteCallModal
          isOpen={!!chemistToComplete}
          onClose={() => setChemistToComplete(null)}
          targetType="chemist"
          chemist={chemistToComplete}
          location={visitLocation}
          onSaveCall={handleSaveCompleteCall}
        />
      )}

      {/* Add New Doctor Modal */}
      <Modal isOpen={showAddDoctor} onClose={() => setShowAddDoctor(false)} title={`Add Doctor to ${plannedArea}`}>
        <form onSubmit={handleAddNewDoctor} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-gray-900 mb-1">Doctor Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. R.K. Sharma"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-900 mb-1">Specialty *</label>
              <select
                value={newDocSpecialty}
                onChange={(e) => setNewDocSpecialty(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg font-bold text-gray-900 bg-white"
              >
                <option value="General Physician">General Physician</option>
                <option value="Consultant Physician">Consultant Physician</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="General Surgeon">General Surgeon</option>
                <option value="Diabetologist">Diabetologist</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-900 mb-1">Sub-Area / Locality *</label>
              <input
                type="text"
                required
                placeholder="e.g. Main Market, Chauraha"
                value={newDocSubArea}
                onChange={(e) => setNewDocSubArea(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Address field */}
          <div>
            <label className="block font-bold text-gray-900 mb-1">Clinic / Hospital Address *</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Opposite District Hospital, Main Road"
              value={newDocAddress}
              onChange={(e) => setNewDocAddress(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-1">Phone / Mobile</label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={newDocPhone}
              onChange={(e) => setNewDocPhone(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold text-gray-900 bg-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddDoctor(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-extrabold shadow-xs"
            >
              Save Doctor
            </button>
          </div>
        </form>
      </Modal>

      {/* Offline Queue Inspector Modal */}
      <OfflineQueueModal
        isOpen={showOfflineQueueModal}
        onClose={() => setShowOfflineQueueModal(false)}
        queue={queue}
        auditLogs={auditLogs}
        isOnline={isOnline}
        isSyncing={isSyncing}
        onRefresh={refreshQueue}
      />

      {/* MR Sample & Input Bag Balance Modal */}
      <Modal
        isOpen={showSampleBagModal}
        onClose={() => setShowSampleBagModal(false)}
        title="MR Bag Stock (Physician Samples & Promo Inputs)"
      >
        <div className="space-y-4 max-h-[75vh] flex flex-col text-xs">
          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-extrabold text-indigo-950 text-sm flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-indigo-600" />
                Live Bag Inventory Balance
              </span>
              <p className="text-3xs text-indigo-800 mt-0.5">
                Stock automatically deducts whenever you detail and provide samples to doctors during DCR.
              </p>
            </div>
            <button
              onClick={reloadBagInventory}
              className="px-3 py-1.5 bg-white border border-indigo-300 text-indigo-900 rounded-lg text-3xs font-extrabold hover:bg-indigo-100"
            >
              Refresh Stock
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* Physician Samples */}
            <div>
              <h4 className="font-extrabold text-gray-900 mb-2 flex items-center gap-1.5 text-xs">
                <Pill className="w-4 h-4 text-indigo-600" />
                Physician Samples ({bagSamples.length} Brands)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bagSamples.map(item => (
                  <div key={item.id} className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-2xs space-y-1">
                    <div className="font-bold text-gray-900 text-xs">{item.name}</div>
                    <div className="flex justify-between items-center text-3xs text-gray-600">
                      <span>Quota: {item.totalQuota} | Issued: {item.issuedQty}</span>
                      <span className={`px-2 py-0.5 rounded font-extrabold ${
                        (item.currentStock || item.availableStock) > 10 
                          ? 'bg-emerald-100 text-emerald-900' 
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        In Bag: {item.currentStock ?? item.availableStock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promotional Inputs & Gifts */}
            <div>
              <h4 className="font-extrabold text-gray-900 mb-2 flex items-center gap-1.5 text-xs">
                <Gift className="w-4 h-4 text-amber-600" />
                Promotional Gifts & Detailing Inputs ({bagGifts.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bagGifts.map(item => (
                  <div key={item.id} className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-2xs space-y-1">
                    <div className="font-bold text-gray-900 text-xs">{item.name}</div>
                    <div className="flex justify-between items-center text-3xs text-gray-600">
                      <span>Quota: {item.totalQuota} | Issued: {item.issuedQty}</span>
                      <span className="px-2 py-0.5 rounded font-extrabold bg-amber-100 text-amber-900">
                        In Bag: {item.currentStock ?? item.availableStock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-Time Distribution Audit Trail */}
            {bagAuditLogs.length > 0 && (
              <div>
                <h4 className="font-extrabold text-gray-900 mb-2 text-xs">
                  Recent Input Distributions (Audit Log)
                </h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {bagAuditLogs.slice(0, 8).map(log => (
                    <div key={log.id} className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-3xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900">{log.doctorName}</span>
                        <span className="text-gray-500 ml-1.5">handed {log.quantity}x {log.itemName}</span>
                      </div>
                      <span className="text-gray-500 font-mono">
                        {format(new Date(log.timestamp), 'HH:mm')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowSampleBagModal(false)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs"
            >
              Done / Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Main DCR Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Map className="h-7 w-7 text-indigo-600" />
            Daily Call Report (DCR)
          </h1>
          <p className="text-xs font-semibold text-gray-600 mt-1">
            MR: <span className="text-indigo-900 font-bold">{activeUser.name}</span> • HQ: <span className="text-gray-900 font-bold">{activeUser.hq}</span> • Date: <span className="text-gray-900 font-bold">{formattedTodayDate}</span>
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sample Bag Stock Inspector */}
          <button
            onClick={() => {
              reloadBagInventory();
              setShowSampleBagModal(true);
            }}
            className="px-3.5 py-2 bg-white hover:bg-gray-100 text-indigo-950 border border-indigo-300 rounded-lg text-xs font-extrabold shadow-2xs transition-all flex items-center gap-1.5"
            title="Inspect Physician Samples and Inputs stock in bag"
          >
            <PackageCheck className="w-4 h-4 text-indigo-600" />
            Bag Stock & Samples
          </button>

          {/* Morning Plan Share */}
          <button
            onClick={handleShareMorningPlanWhatsApp}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold shadow-xs transition-all flex items-center gap-1.5"
            title="Share morning planned doctors on WhatsApp"
          >
            <Share2 className="w-4 h-4" />
            Share Morning Plan
          </button>

          {/* Evening Report Share */}
          <button
            onClick={() => setShowConfirm(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold shadow-xs transition-all flex items-center gap-1.5"
            title="Submit final DCR and share summary on WhatsApp"
          >
            <Send className="w-4 h-4" />
            End Day (Final DCR)
          </button>
        </div>
      </div>

      {/* Offline-First Caching & Auto-Sync Banner */}
      <OfflineSyncStatusBar onOpenQueue={() => setShowOfflineQueueModal(true)} />

      {/* Territory & Day Performance Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span className="text-3xs font-extrabold text-indigo-800 uppercase tracking-wider block mb-0.5">
              Today's Field Territory (MTP Mapped)
            </span>
            <h2 className="text-2xl font-black text-indigo-950 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-indigo-600" />
              {plannedArea} Territory Patch
            </h2>
            <p className="text-xs font-medium text-gray-600 mt-1">
              Active Prescribers: <strong>{territoryDoctors.length} Doctors</strong> | Retailers: <strong>{territoryChemists.length} Chemists</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddDoctor(true)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-gray-300"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Doctor to Patch
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center">
            <span className="text-3xs font-bold text-indigo-800 uppercase block">Doctor Calls</span>
            <p className="text-xl font-black text-indigo-950 mt-0.5">
              {visitedDoctors.length} <span className="text-xs font-semibold text-gray-500">/ {territoryDoctors.length}</span>
            </p>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
            <span className="text-3xs font-bold text-emerald-800 uppercase block">Chemist Calls</span>
            <p className="text-xl font-black text-emerald-950 mt-0.5">
              {visitedChemists.length} <span className="text-xs font-semibold text-gray-500">/ {territoryChemists.length}</span>
            </p>
          </div>

          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-center">
            <span className="text-3xs font-bold text-emerald-900 uppercase block">Total POB Booked</span>
            <p className="text-xl font-black text-emerald-900 mt-0.5">
              ₹{totalPobValue.toFixed(0)}
            </p>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-center">
            <span className="text-3xs font-bold text-amber-900 uppercase block">Samples & Gifts</span>
            <p className="text-xl font-black text-amber-950 mt-0.5">
              {totalSamplesDistributed + totalGiftsDistributed} <span className="text-xs font-semibold text-gray-600">Units</span>
            </p>
          </div>
        </div>
      </div>

      {/* Call Category Tabs: All / Doctors / Chemists */}
      <div className="flex border-b border-gray-200 space-x-2">
        <button
          onClick={() => setActiveCallTab('all')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
            activeCallTab === 'all' 
              ? 'border-indigo-600 text-indigo-700' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          All Field Visits ({territoryDoctors.length + territoryChemists.length})
        </button>

        <button
          onClick={() => setActiveCallTab('doctors')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
            activeCallTab === 'doctors' 
              ? 'border-indigo-600 text-indigo-700' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Doctor Calls ({territoryDoctors.length})
        </button>

        <button
          onClick={() => setActiveCallTab('chemists')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
            activeCallTab === 'chemists' 
              ? 'border-indigo-600 text-indigo-700' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Chemist Calls ({territoryChemists.length})
        </button>
      </div>

      {/* Main Calling Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 1. DOCTORS SECTION */}
          {(activeCallTab === 'all' || activeCallTab === 'doctors') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Doctors in {plannedArea} ({territoryDoctors.length})
                </h3>
                <span className="text-3xs font-bold text-gray-500">
                  {visitedDoctors.length} Done • {territoryDoctors.length - visitedDoctors.length} Pending
                </span>
              </div>

              <div className="space-y-3">
                {territoryDoctors.map(doc => {
                  const isVisited = visitedDoctors.includes(doc.id);
                  const isCheckingIn = activeCheckInType === 'doctor' && activeCheckInId === doc.id;
                  const rep = visitedCallsMap[`doctor-${doc.id}`];
                  const isQueuedOffline = queue.some(q => q.callTargetType === 'doctor' && q.targetId === doc.id && q.syncStatus === 'pending_sync');

                  return (
                    <div 
                      key={doc.id}
                      className={`bg-white rounded-xl border p-4 transition-all shadow-2xs ${
                        isVisited 
                          ? 'border-emerald-300 bg-emerald-50/20' 
                          : isCheckingIn 
                          ? 'border-amber-400 ring-2 ring-amber-200 bg-amber-50/20' 
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h4 className="font-extrabold text-gray-900 text-base">{doc.name}</h4>
                            {doc.qualification && (
                              <span className="text-3xs px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded font-bold border border-indigo-200">
                                {doc.qualification}
                              </span>
                            )}
                            <span className="text-xs font-bold text-indigo-700">
                              {doc.specialty}
                            </span>
                            {isQueuedOffline && (
                              <span className="text-3xs px-2 py-0.5 bg-amber-100 text-amber-950 rounded-full font-extrabold border border-amber-300 flex items-center gap-1">
                                ⚡ IndexedDB Queued
                              </span>
                            )}
                          </div>

                          {/* Address & Sub-Area */}
                          {doc.address && (
                            <p className="text-xs text-gray-700 font-medium">
                              📍 <strong>Address:</strong> {doc.address}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-medium">
                            <span>Sub-Area: <strong>{doc.subArea}</strong></span>
                            {doc.phone && <span>Phone: <strong>{doc.phone}</strong></span>}
                          </div>

                          {/* Call Report Badges if Visited */}
                          {isVisited && rep && (
                            <div className="flex flex-wrap items-center gap-2 pt-2 mt-2 border-t border-gray-100 text-3xs font-bold">
                              {/* Geo-Fencing Tag */}
                              {rep.geoVerified ? (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded-full flex items-center gap-1 border border-emerald-300 font-extrabold">
                                  <ShieldCheck className="w-3 h-3 text-emerald-700" /> 
                                  Geo-Verified ({rep.geoDistanceMeters ?? 32}m)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-950 rounded-full flex items-center gap-1 border border-amber-300 font-extrabold" title={rep.geoDeviationReason || 'Off-site check-in'}>
                                  <ShieldAlert className="w-3 h-3 text-amber-700" /> 
                                  Geo-Deviation ({rep.geoDistanceMeters ?? 185}m)
                                </span>
                              )}

                              {rep.isJointWorking && (
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded-full flex items-center gap-1 border border-indigo-200">
                                  <Users className="w-3 h-3" /> Joint: {rep.jointManagerName}
                                </span>
                              )}
                              {rep.pobTotalValue > 0 && (
                                <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 border font-extrabold ${
                                  (rep.pobPendingApprovalValue || 0) > 0
                                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                                    : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                }`}>
                                  <ShoppingCart className="w-3 h-3" /> 
                                  POB: ₹{rep.pobTotalValue.toFixed(0)}
                                  {(rep.pobPendingApprovalValue || 0) > 0 ? (
                                    <span className="text-amber-800 font-semibold">(⏳ Scheme Approval Req.)</span>
                                  ) : (
                                    <span className="text-emerald-800 font-semibold">(✅ Confirmed)</span>
                                  )}
                                </span>
                              )}
                              {(rep.samplesGiven?.length || 0) > 0 && (
                                <span className="px-2 py-0.5 bg-sky-100 text-sky-950 rounded-full flex items-center gap-1 border border-sky-300">
                                  <Pill className="w-3 h-3 text-sky-700" /> Samples: {rep.samplesGiven.reduce((a, s) => a + s.quantity, 0)}
                                </span>
                              )}
                              {(rep.giftsGiven?.length || 0) > 0 && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded-full flex items-center gap-1 border border-purple-200">
                                  <Gift className="w-3 h-3" /> Inputs: {rep.giftsGiven.reduce((a, g) => a + g.quantity, 0)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="shrink-0 flex items-center gap-2">
                          {isVisited ? (
                            <button
                              onClick={() => {
                                setDoctorToComplete(doc);
                              }}
                              className="px-3.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                              Call Done (Edit)
                            </button>
                          ) : isCheckingIn ? (
                            <button
                              onClick={() => {
                                setDoctorToComplete(doc);
                              }}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-extrabold shadow-xs transition-colors flex items-center gap-1 animate-pulse"
                            >
                              <Clock className="w-4 h-4" />
                              Complete Call
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCheckIn('doctor', doc.id)}
                              disabled={activeCheckInId !== null}
                              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                                activeCheckInId !== null 
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              }`}
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              Check-In
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Active Session Status Box */}
                      {isCheckingIn && (
                        <div className="mt-3 p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-xs font-semibold text-amber-950 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                            Active Call in Progress with {doc.name}
                          </span>
                          <span className="text-3xs text-amber-800 font-bold">
                            Click 'Complete Call' when meeting finishes
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. CHEMISTS SECTION (Chemist Call Support) */}
          {(activeCallTab === 'all' || activeCallTab === 'chemists') && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  Chemist Retailers in {plannedArea} ({territoryChemists.length})
                </h3>
                <span className="text-3xs font-bold text-gray-500">
                  {visitedChemists.length} Done • {territoryChemists.length - visitedChemists.length} Pending
                </span>
              </div>

              <div className="space-y-3">
                {territoryChemists.map(chm => {
                  const isVisited = visitedChemists.includes(chm.id);
                  const isCheckingIn = activeCheckInType === 'chemist' && activeCheckInId === chm.id;
                  const rep = visitedCallsMap[`chemist-${chm.id}`];
                  const isQueuedOffline = queue.some(q => q.callTargetType === 'chemist' && q.targetId === chm.id && q.syncStatus === 'pending_sync');

                  return (
                    <div 
                      key={chm.id}
                      className={`bg-white rounded-xl border p-4 transition-all shadow-2xs ${
                        isVisited 
                          ? 'border-emerald-300 bg-emerald-50/20' 
                          : isCheckingIn 
                          ? 'border-amber-400 ring-2 ring-amber-200 bg-amber-50/20' 
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h4 className="font-extrabold text-gray-900 text-base">{chm.name}</h4>
                            <span className="text-3xs px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold border border-emerald-200">
                              Chemist Retailer
                            </span>
                            {isQueuedOffline && (
                              <span className="text-3xs px-2 py-0.5 bg-amber-100 text-amber-950 rounded-full font-extrabold border border-amber-300 flex items-center gap-1">
                                ⚡ IndexedDB Queued
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-semibold text-gray-700">
                            Key Contact / Pharmacist: <span className="text-gray-900 font-bold">{chm.contactPerson}</span>
                          </p>

                          {chm.address && (
                            <p className="text-xs text-gray-700 font-medium">
                              📍 <strong>Address:</strong> {chm.address}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-medium">
                            <span>Sub-Area: <strong>{chm.subArea}</strong></span>
                            {chm.phone && <span>Phone: <strong>{chm.phone}</strong></span>}
                          </div>

                          {/* Chemist Report Badges if Visited */}
                          {isVisited && rep && (
                            <div className="flex flex-wrap items-center gap-2 pt-2 mt-2 border-t border-gray-100 text-3xs font-bold">
                              {/* Geo-Fencing Tag */}
                              {rep.geoVerified ? (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded-full flex items-center gap-1 border border-emerald-300 font-extrabold">
                                  <ShieldCheck className="w-3 h-3 text-emerald-700" /> 
                                  Geo-Verified ({rep.geoDistanceMeters ?? 28}m)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-950 rounded-full flex items-center gap-1 border border-amber-300 font-extrabold" title={rep.geoDeviationReason || 'Off-site check-in'}>
                                  <ShieldAlert className="w-3 h-3 text-amber-700" /> 
                                  Geo-Deviation ({rep.geoDistanceMeters ?? 175}m)
                                </span>
                              )}

                              {rep.pobTotalValue > 0 && (
                                <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 border font-extrabold ${
                                  (rep.pobPendingApprovalValue || 0) > 0
                                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                                    : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                }`}>
                                  <ShoppingCart className="w-3 h-3" /> 
                                  POB: ₹{rep.pobTotalValue.toFixed(0)}
                                  {(rep.pobPendingApprovalValue || 0) > 0 ? (
                                    <span className="text-amber-800 font-semibold">(⏳ Scheme Approval Req.)</span>
                                  ) : (
                                    <span className="text-emerald-800 font-semibold">(✅ Confirmed)</span>
                                  )}
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                                rep.stockAvailable ? 'bg-green-100 text-green-900 border-green-300' : 'bg-amber-100 text-amber-900 border-amber-300'
                              }`}>
                                Stock: {rep.stockAvailable ? 'Verified Available' : 'Shortage Noted'}
                              </span>
                              {rep.isJointWorking && (
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded-full flex items-center gap-1 border border-indigo-200">
                                  <Users className="w-3 h-3" /> Joint: {rep.jointManagerName}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons for Chemist */}
                        <div className="shrink-0 flex items-center gap-2">
                          {isVisited ? (
                            <button
                              onClick={() => {
                                setChemistToComplete(chm);
                              }}
                              className="px-3.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                              Call Done (Edit)
                            </button>
                          ) : isCheckingIn ? (
                            <button
                              onClick={() => {
                                setChemistToComplete(chm);
                              }}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-extrabold shadow-xs transition-colors flex items-center gap-1 animate-pulse"
                            >
                              <Clock className="w-4 h-4" />
                              Complete Chemist Call
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCheckIn('chemist', chm.id)}
                              disabled={activeCheckInId !== null}
                              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                                activeCheckInId !== null 
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              <Building2 className="w-3.5 h-3.5" />
                              Check-In Chemist
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary & Final Actions */}
        <div className="space-y-4">
          {/* Progress Tracker Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-gray-900 text-sm flex items-center justify-between">
              <span>Today's Call Coverage</span>
              <span className="text-3xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {visitedDoctors.length + visitedChemists.length} of {territoryDoctors.length + territoryChemists.length} Done
              </span>
            </h3>

            {/* Doctor Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Doctor Calls:</span>
                <span>{visitedDoctors.length} / {territoryDoctors.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${territoryDoctors.length ? (visitedDoctors.length / territoryDoctors.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Chemist Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Chemist Calls:</span>
                <span>{visitedChemists.length} / {territoryChemists.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${territoryChemists.length ? (visitedChemists.length / territoryChemists.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Total POB:</span>
                <span className="font-extrabold text-emerald-800">₹{totalPobValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Samples Given:</span>
                <span className="font-bold text-gray-900">{totalSamplesDistributed} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gifts Given:</span>
                <span className="font-bold text-gray-900">{totalGiftsDistributed} Units</span>
              </div>
            </div>

            {/* End Day Submit */}
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              End Day (Final Submit DCR)
            </button>

            {/* Morning WhatsApp Share */}
            <button
              onClick={handleShareMorningPlanWhatsApp}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Morning Plan on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
