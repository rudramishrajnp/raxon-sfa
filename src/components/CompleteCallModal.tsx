import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Gift, 
  ShoppingCart, 
  MessageSquare, 
  Users, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  IndianRupee,
  Sparkles,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Building2,
  PackageCheck,
  MapPin,
  Navigation,
  AlertTriangle,
  FileCheck,
  Info,
  Layers,
  Clock
} from 'lucide-react';
import { Modal } from './Modal';
import { Doctor, Chemist, calculateDistanceMeters, getProductsList } from '../data/masterData';
import { 
  PHARMA_SAMPLES_LIST, 
  PHARMA_GIFTS_LIST, 
  PHARMA_BRANDS_LIST, 
  MANAGERS_LIST,
  CallReportDetail,
  POBItemDetail
} from '../data/dcrCallDetails';
import { 
  getMRSampleInventory, 
  deductDoctorCallInputs, 
  SampleInventoryItem 
} from '../data/sampleInventory';
import { 
  checkIsSchemeDeviation, 
  createPOBApprovalRequest 
} from '../data/pobApprovals';

interface CompleteCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType?: 'doctor' | 'chemist';
  doctor?: Doctor | null;
  chemist?: Chemist | null;
  chemistsList?: Chemist[];
  location?: { lat: number; lng: number; accuracy?: number; address?: string } | null;
  onSaveCall: (callData: CallReportDetail) => void;
}

export function CompleteCallModal({
  isOpen,
  onClose,
  targetType = 'doctor',
  doctor,
  chemist,
  chemistsList = [],
  location,
  onSaveCall
}: CompleteCallModalProps) {
  const isChemistCall = targetType === 'chemist';
  const targetName = isChemistCall ? chemist?.name : doctor?.name;

  if (!isOpen || (!doctor && !chemist)) return null;

  // Active Tab
  const [activeTab, setActiveTab] = useState<'geo' | 'joint' | 'samples' | 'gifts' | 'pob' | 'remarks'>(
    isChemistCall ? 'pob' : 'geo'
  );

  // 1. Geo-Fencing & Real-Time Distance Match State
  // Clinic / Pharmacy Coordinates
  const targetLat = isChemistCall ? (chemist?.lat || 26.4954) : (doctor?.lat || 26.4952);
  const targetLng = isChemistCall ? (chemist?.lng || 82.6453) : (doctor?.lng || 82.6451);
  
  // Current MR Position
  const mrLat = location?.lat || targetLat;
  const mrLng = location?.lng || targetLng;

  // Calculate real distance
  const realDistance = calculateDistanceMeters(mrLat, mrLng, targetLat, targetLng);
  const [effectiveDistance, setEffectiveDistance] = useState<number>(realDistance);
  const [geoDeviationReason, setGeoDeviationReason] = useState<string>('');

  // Determine if within 100m
  const isGeoVerified = effectiveDistance <= 100;

  // 2. Real-Time Bag Inventory State
  const [bagInventory, setBagInventory] = useState<SampleInventoryItem[]>([]);
  
  useEffect(() => {
    // Load MR sample & gift inventory
    const inv = getMRSampleInventory('MR001', 'Rajesh Kumar');
    setBagInventory(inv);
  }, [isOpen]);

  // Helper to get available stock in MR's bag
  const getAvailableStock = (name: string, type: 'sample' | 'gift') => {
    const found = bagInventory.find(item => 
      item.itemName.toLowerCase() === name.toLowerCase() && item.itemType === type
    );
    return found ? found.currentStock : 25; // Default fallback to 25 if not seeded
  };

  // 3. Joint Working State - Supports MULTIPLE Managers selected simultaneously (AM, RM, ZM)
  const [isJointWorking, setIsJointWorking] = useState(false);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [customManagerName, setCustomManagerName] = useState('');
  const [jointWorkingNotes, setJointWorkingNotes] = useState('');
  const [jointSignOffStatus, setJointSignOffStatus] = useState('Pending Sign-off');

  // 4. Samples State (Doctor calls)
  const [sampleQuantities, setSampleQuantities] = useState<Record<string, number>>({});

  // 5. Gifts State
  const [giftQuantities, setGiftQuantities] = useState<Record<string, number>>({});

  // 6. POB (Order Booking) State with Scheme Deviation Workflow
  const masterProducts = getProductsList();
  const [pobItems, setPobItems] = useState<POBItemDetail[]>([]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState(
    masterProducts.length > 0 ? masterProducts[0].name : PHARMA_BRANDS_LIST[0].name
  );
  const [pobQtyInput, setPobQtyInput] = useState<string>('10');
  const [pobManualValueInput, setPobManualValueInput] = useState<string>('');
  const [offeredSchemeInput, setOfferedSchemeInput] = useState<string>('');
  const [selectedChemistFulfillment, setSelectedChemistFulfillment] = useState<string>(
    chemistsList.length > 0 ? chemistsList[0].name : ''
  );

  // Auto-fill master scheme when product changes
  useEffect(() => {
    const prod = masterProducts.find(p => p.name === selectedProductToAdd);
    const prodScheme = prod?.scheme || '10+2';
    setOfferedSchemeInput(prodScheme);

    // Calculate approximate manual value hint (PTS / PTR * Qty)
    const qty = parseInt(pobQtyInput, 10) || 10;
    const rate = prod?.ptr || 120;
    setPobManualValueInput((qty * rate).toString());
  }, [selectedProductToAdd]);

  // Recalculate estimated value when Qty changes
  const handleQtyChange = (qtyStr: string) => {
    setPobQtyInput(qtyStr);
    const qty = parseInt(qtyStr, 10) || 0;
    const prod = masterProducts.find(p => p.name === selectedProductToAdd);
    const rate = prod?.ptr || 120;
    if (qty > 0) {
      setPobManualValueInput((qty * rate).toString());
    }
  };

  // 7. Chemist-specific details
  const [stockAvailable, setStockAvailable] = useState(true);
  const [outstandingRemarks, setOutstandingRemarks] = useState('');

  // 8. Remarks & Feedback State
  const [doctorFeedback, setDoctorFeedback] = useState<string>('Positive Feedback & Prescribing Support');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [remarks, setRemarks] = useState('');

  // Toggle multiple manager selection
  const handleToggleManager = (mgrLabel: string) => {
    if (selectedManagers.includes(mgrLabel)) {
      setSelectedManagers(selectedManagers.filter(m => m !== mgrLabel));
    } else {
      setSelectedManagers([...selectedManagers, mgrLabel]);
    }
  };

  // Handlers for Samples with Bag Balance Validation
  const handleSampleQtyChange = (sampleName: string, qty: number) => {
    const available = getAvailableStock(sampleName, 'sample');
    const validQty = Math.min(Math.max(0, qty), available);
    setSampleQuantities(prev => ({
      ...prev,
      [sampleName]: validQty
    }));
  };

  // Handlers for Gifts with Bag Balance Validation
  const handleGiftQtyChange = (giftName: string, qty: number) => {
    const available = getAvailableStock(giftName, 'gift');
    const validQty = Math.min(Math.max(0, qty), available);
    setGiftQuantities(prev => ({
      ...prev,
      [giftName]: validQty
    }));
  };

  // Current selected product object
  const currentProductObj = masterProducts.find(p => p.name === selectedProductToAdd);
  const currentMasterScheme = currentProductObj?.scheme || '10+2';

  // Real-time scheme deviation check on current input
  const isCurrentSchemeDeviation = checkIsSchemeDeviation(selectedProductToAdd, offeredSchemeInput).isDeviation;

  // Add POB item with field staff manual quantity, value, and scheme
  const handleAddPobItem = () => {
    const qtyNumber = parseInt(pobQtyInput, 10) || 0;
    if (qtyNumber <= 0) {
      alert("Please enter a valid order quantity greater than 0.");
      return;
    }
    const manualValNumber = parseFloat(pobManualValueInput) || 0;
    if (manualValNumber <= 0) {
      alert("Please enter the manual order value amount (₹).");
      return;
    }

    const offeredScheme = offeredSchemeInput.trim() || '10+0';
    const isDeviation = checkIsSchemeDeviation(selectedProductToAdd, offeredScheme).isDeviation;

    const newItem: POBItemDetail = {
      id: `${Date.now()}-${Math.random()}`,
      productName: selectedProductToAdd,
      quantity: qtyNumber,
      manualValue: manualValNumber,
      masterScheme: currentMasterScheme,
      offeredScheme: offeredScheme,
      isSchemeDeviation: isDeviation,
      approvalStatus: isDeviation ? 'Pending_Manager_Approval' : 'Direct_Approved'
    };

    setPobItems(prev => [...prev, newItem]);
    setPobQtyInput('10');
  };

  const handleRemovePobItem = (itemId?: string) => {
    if (!itemId) return;
    setPobItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Calculations for POB
  const confirmedPobValue = pobItems
    .filter(item => !item.isSchemeDeviation)
    .reduce((acc, item) => acc + (item.manualValue || 0), 0);

  const pendingApprovalPobValue = pobItems
    .filter(item => item.isSchemeDeviation)
    .reduce((acc, item) => acc + (item.manualValue || 0), 0);

  const totalPobValue = pobItems.reduce((acc, item) => acc + (item.manualValue || 0), 0);

  // Active counts for badges
  const totalSamplesGiven = Object.values(sampleQuantities).reduce((acc, q) => acc + (q || 0), 0);
  const totalGiftsGiven = Object.values(giftQuantities).reduce((acc, q) => acc + (q || 0), 0);
  const totalPobQty = pobItems.reduce((acc, item) => acc + item.quantity, 0);
  const deviationItemsCount = pobItems.filter(i => i.isSchemeDeviation).length;

  // Submit Call Report
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check geo-deviation reason requirement if > 100m
    if (!isGeoVerified && !geoDeviationReason.trim()) {
      setActiveTab('geo');
      alert("⚠️ Geo-Fencing Alert: You are outside the 100m radius of the clinic. Please specify a reason for the location deviation.");
      return;
    }

    // Format samples
    const samplesGiven = Object.entries(sampleQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([sampleName, quantity]) => ({ sampleName, quantity }));

    // Format gifts
    const giftsGiven = Object.entries(giftQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([giftName, quantity]) => ({ giftName, quantity }));

    // Multi-managers resolution
    const allJointManagersList = [...selectedManagers];
    if (customManagerName.trim()) {
      allJointManagersList.push(customManagerName.trim());
    }

    const finalManagerString = isJointWorking 
      ? (allJointManagersList.join(', ') || 'Accompanied Joint Working')
      : '';

    // 1. Deduct Real-Time Inventory if Doctor Call
    if (!isChemistCall && (samplesGiven.length > 0 || giftsGiven.length > 0)) {
      deductDoctorCallInputs(
        'MR001',
        'Rajesh Kumar',
        doctor?.id || 1,
        doctor?.name || 'Dr. Target',
        samplesGiven,
        giftsGiven
      );
    }

    // 2. Create Manager Approval Requests for any Scheme Deviations
    const processedPobItems: POBItemDetail[] = pobItems.map(item => {
      if (item.isSchemeDeviation) {
        const approvalReq = createPOBApprovalRequest({
          mrId: 'MR001',
          mrName: 'Rajesh Kumar',
          chemistId: chemist?.id || (isChemistCall ? 1 : 0),
          chemistName: isChemistCall ? (chemist?.name || 'Chemist') : (selectedChemistFulfillment || 'Chemist Outlet'),
          doctorName: !isChemistCall ? doctor?.name : undefined,
          productName: item.productName,
          quantity: item.quantity,
          masterScheme: item.masterScheme || '10+2',
          offeredScheme: item.offeredScheme || '10+4',
          manualValue: item.manualValue,
          area: (isChemistCall ? chemist?.area : doctor?.area) || 'Ambedkar Nagar HQ',
          remarks: `Scheme deviation offered by MR during ${isChemistCall ? 'Chemist' : 'Doctor'} visit. Offered: ${item.offeredScheme} vs Company: ${item.masterScheme}`
        });
        return {
          ...item,
          approvalId: approvalReq.id,
          approvalStatus: 'Pending_Manager_Approval'
        };
      }
      return item;
    });

    const reportDetail: CallReportDetail = {
      callTargetType: isChemistCall ? 'chemist' : 'doctor',
      doctorId: doctor?.id,
      doctorName: doctor?.name,
      doctorSpecialty: doctor?.specialty,
      chemistId: chemist?.id,
      chemistName: chemist?.name,
      timestamp: new Date().toISOString(),
      location: location || { lat: mrLat, lng: mrLng },
      // Geo-Fencing
      geoDistanceMeters: effectiveDistance,
      geoVerified: isGeoVerified,
      geoDeviationReason: !isGeoVerified ? (geoDeviationReason || 'Field verified off-clinic') : undefined,
      clinicCoordinates: { lat: targetLat, lng: targetLng },
      // Joint Working
      isJointWorking,
      jointManagers: allJointManagersList,
      jointManagerName: finalManagerString,
      jointManagerRole: isJointWorking ? (allJointManagersList.length > 1 ? 'Multi-Manager' : (allJointManagersList[0] || 'Joint')) : 'None',
      jointWorkingNotes: isJointWorking ? jointWorkingNotes : undefined,
      jointSignOffStatus: isJointWorking ? (jointSignOffStatus || 'Verified') : undefined,
      // Inputs
      samplesGiven,
      giftsGiven,
      // POB Orders
      pobOrders: processedPobItems,
      pobTotalValue: totalPobValue,
      pobConfirmedValue: confirmedPobValue,
      pobPendingApprovalValue: pendingApprovalPobValue,
      chemistBookedWith: isChemistCall ? chemist?.name : (selectedChemistFulfillment || 'Direct Booking'),
      stockAvailable: isChemistCall ? stockAvailable : true,
      outstandingRemarks: isChemistCall ? outstandingRemarks : undefined,
      callType: isJointWorking ? `Joint with ${finalManagerString}` : 'Independent',
      doctorFeedback,
      nextFollowUpDate,
      remarks: remarks.trim() || (isChemistCall ? 'Chemist call completed with POB and stock verification.' : 'Doctor call completed with product detailing.')
    };

    onSaveCall(reportDetail);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isChemistCall ? `Complete Chemist Call: ${chemist?.name}` : `Complete Doctor Call: ${doctor?.name}`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col text-xs">
        {/* Top Geo-Fencing & Target Header Banner */}
        <div className={`rounded-xl p-3 border flex flex-wrap items-center justify-between gap-3 shrink-0 ${
          isGeoVerified 
            ? 'bg-emerald-50/90 border-emerald-300' 
            : 'bg-amber-50/90 border-amber-300'
        }`}>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-gray-900 text-sm">{targetName}</span>
              {doctor?.qualification && (
                <span className="text-3xs px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded font-extrabold border border-indigo-200">
                  {doctor.qualification}
                </span>
              )}
              {isChemistCall && (
                <span className="text-3xs px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-extrabold border border-emerald-200">
                  Chemist Retailer
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-gray-800 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-gray-500" />
              {doctor?.address || chemist?.address || `${doctor?.subArea || chemist?.subArea || 'Territory'}`}
            </p>
          </div>

          {/* Geo Distance Real-Time Match Badge */}
          <div className="flex items-center gap-2">
            {isGeoVerified ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <div>
                  <div className="text-3xs leading-none text-emerald-100 font-medium">Geo-Fenced</div>
                  <div className="text-xs font-extrabold leading-tight">Verified ({effectiveDistance}m)</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold shadow-xs">
                <ShieldAlert className="w-4 h-4 text-amber-200" />
                <div>
                  <div className="text-3xs leading-none text-amber-100 font-medium">Distance Warning</div>
                  <div className="text-xs font-extrabold leading-tight">Deviation ({effectiveDistance}m)</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 space-x-1 overflow-x-auto shrink-0 pb-1 text-xs font-extrabold">
          {/* Tab 1: Geo-Fencing */}
          <button
            type="button"
            onClick={() => setActiveTab('geo')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'geo' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            Geo-Fencing
            {isGeoVerified ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>

          {/* Tab 2: Joint Working */}
          <button
            type="button"
            onClick={() => setActiveTab('joint')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'joint' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Joint Working
            {isJointWorking && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 text-3xs rounded-full">
                {selectedManagers.length || 1}
              </span>
            )}
          </button>

          {/* Tab 3: Order (POB) */}
          <button
            type="button"
            onClick={() => setActiveTab('pob')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'pob' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Order (POB)
            {pobItems.length > 0 && (
              <span className={`px-2 py-0.5 text-3xs rounded-full font-extrabold ${
                deviationItemsCount > 0 
                  ? 'bg-amber-300 text-amber-950' 
                  : 'bg-emerald-400 text-emerald-950'
              }`}>
                ₹{totalPobValue.toFixed(0)}
              </span>
            )}
          </button>

          {/* Doctor-only Tabs: Samples & Gifts */}
          {!isChemistCall && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('samples')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'samples' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Pill className="w-3.5 h-3.5" />
                Samples
                {totalSamplesGiven > 0 && (
                  <span className="px-2 py-0.5 bg-indigo-200 text-indigo-950 text-3xs rounded-full font-extrabold">
                    {totalSamplesGiven}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gifts')}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'gifts' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                Gifts / Inputs
                {totalGiftsGiven > 0 && (
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-950 text-3xs rounded-full font-extrabold">
                    {totalGiftsGiven}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Tab: Remarks & Feedback */}
          <button
            type="button"
            onClick={() => setActiveTab('remarks')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'remarks' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Remarks
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 min-h-[280px]">
          
          {/* TAB 1: GEO-FENCING & DISTANCE MATCH */}
          {activeTab === 'geo' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${
                isGeoVerified ? 'bg-emerald-50/70 border-emerald-300' : 'bg-amber-50/70 border-amber-300'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-gray-900">
                        {isGeoVerified ? '🎯 GPS Geo-Fencing Verification: PASS' : '⚠️ GPS Geo-Fencing Warning: DEVIATION DETECTED'}
                      </span>
                      <span className={`text-3xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        isGeoVerified ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                      }`}>
                        {effectiveDistance} meters away
                      </span>
                    </div>
                    <p className="text-xs text-gray-700">
                      Standard validation threshold is <strong>100 meters</strong> from registered clinic / chemist coordinates.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
                  <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="text-3xs font-bold text-gray-500 block">Registered Clinic GPS:</span>
                    <span className="text-xs font-mono font-bold text-gray-800">
                      {targetLat.toFixed(5)}, {targetLng.toFixed(5)}
                    </span>
                    <p className="text-3xs text-gray-500 mt-0.5 truncate">{doctor?.address || chemist?.address}</p>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                    <span className="text-3xs font-bold text-gray-500 block">Current MR Device Location:</span>
                    <span className="text-xs font-mono font-bold text-gray-800">
                      {mrLat.toFixed(5)}, {mrLng.toFixed(5)}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <button
                        type="button"
                        onClick={() => setEffectiveDistance(35)}
                        className={`text-3xs px-2 py-0.5 rounded font-bold transition-all ${
                          effectiveDistance === 35 ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        Simulate In-Clinic (35m)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEffectiveDistance(280)}
                        className={`text-3xs px-2 py-0.5 rounded font-bold transition-all ${
                          effectiveDistance === 280 ? 'bg-amber-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        Simulate Off-Site (280m)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geo-Deviation Mandatory Reason if > 100m */}
              {!isGeoVerified && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-amber-950">
                    Select Location Deviation Reason (Mandatory for Compliance) *
                  </label>
                  <select
                    value={geoDeviationReason}
                    onChange={(e) => setGeoDeviationReason(e.target.value)}
                    className="w-full p-2.5 border border-amber-400 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- Select Deviation Reason --</option>
                    <option value="Doctor met at Hospital OPD / Operation Theatre">Doctor met at Hospital OPD / Operation Theatre</option>
                    <option value="Met at CME Seminar / Medical Conference Venue">Met at CME Seminar / Medical Conference Venue</option>
                    <option value="Doctor Consultation at Residential Chamber">Doctor Consultation at Residential Chamber</option>
                    <option value="Chemist Godown / Warehouse Stock Inspection">Chemist Godown / Warehouse Stock Inspection</option>
                    <option value="GPS Accuracy Variance / High-rise Indoor Jitter">GPS Accuracy Variance / High-rise Indoor Jitter</option>
                    <option value="Special Field Camp / Rural Health Drive">Special Field Camp / Rural Health Drive</option>
                    <option value="Other Legitimate Deviation (Detailed in Remarks)">Other Legitimate Deviation (Detailed in Remarks)</option>
                  </select>
                  <p className="text-3xs text-amber-800 font-medium">
                    Calls marked outside 100m will carry an audit flag for Area Manager review.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: JOINT WORKING - Accompanied by AM/RM/ZM */}
          {activeTab === 'joint' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isJointWorking}
                      onChange={(e) => {
                        setIsJointWorking(e.target.checked);
                        if (e.target.checked && selectedManagers.length === 0) {
                          setSelectedManagers([`${MANAGERS_LIST[0].name} (${MANAGERS_LIST[0].role})`]);
                        }
                      }}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-indigo-600" />
                      Manager Joint Working Call (Accompanied Visit)
                    </span>
                  </label>
                  {isJointWorking && (
                    <span className="text-3xs font-extrabold px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full">
                      JOINT VISIT ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  Tag accompanying <strong>Area Manager (AM)</strong>, <strong>Regional Manager (RM)</strong>, or <strong>Zonal Manager (ZM)</strong> with coaching observations and joint sign-off.
                </p>
              </div>

              {isJointWorking && (
                <div className="space-y-3 p-4 bg-white border border-indigo-200 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-900">
                      Select Accompanying Managers (Multi-select) *
                    </label>
                    <span className="text-3xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {selectedManagers.length} Manager(s) Tagged
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {MANAGERS_LIST.map(mgr => {
                      const mgrLabel = `${mgr.name} (${mgr.role})`;
                      const isSelected = selectedManagers.includes(mgrLabel);
                      return (
                        <div
                          key={mgr.id}
                          onClick={() => handleToggleManager(mgrLabel)}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-indigo-600 bg-indigo-50/90 font-bold text-indigo-950 ring-1 ring-indigo-500' 
                              : 'border-gray-300 hover:border-gray-400 bg-white text-gray-900'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 text-indigo-600 rounded pointer-events-none"
                            />
                            <div>
                              <div className="font-bold text-gray-900 text-sm">{mgr.name}</div>
                              <div className="text-3xs text-gray-700 font-semibold">{mgr.role} • {mgr.hq}</div>
                            </div>
                          </div>
                          <span className={`text-3xs font-extrabold px-2 py-0.5 rounded ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {mgr.code}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Joint Field Coaching Feedback & Sign-Off */}
                  <div className="pt-2 border-t border-gray-200 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1">
                        Joint Coaching Observations / Manager Feedback:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. AM observed detailing on Raxon-CV. Good communication on indication & clinical advantages."
                        value={jointWorkingNotes}
                        onChange={(e) => setJointWorkingNotes(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-900 mb-1">
                        Joint Working Verification Status:
                      </label>
                      <select
                        value={jointSignOffStatus}
                        onChange={(e) => setJointSignOffStatus(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Accompanied & Approved by AM">Accompanied & Approved by AM</option>
                        <option value="Accompanied & Approved by RM">Accompanied & Approved by RM</option>
                        <option value="Accompanied & Approved by ZM">Accompanied & Approved by ZM</option>
                        <option value="Pending Formal Joint Verification">Pending Formal Joint Verification</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: POB (Personal Order Booking) WITH SCHEME DEVIATION APPROVAL */}
          {activeTab === 'pob' && (
            <div className="space-y-4">
              {/* Order Entry Form */}
              <div className="p-4 bg-gray-50 border border-gray-300 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    Book Brand Order (Chemist POB)
                  </span>
                  <span className="text-3xs text-gray-700 font-bold bg-white border border-gray-300 px-2 py-0.5 rounded">
                    Field Scheme Entry & Deviation Control
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  {/* Brand Selector */}
                  <div className="sm:col-span-5">
                    <label className="block text-3xs font-bold text-gray-900 mb-1">Select Brand / Product *</label>
                    <select
                      value={selectedProductToAdd}
                      onChange={(e) => setSelectedProductToAdd(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      {masterProducts.map(prod => (
                        <option key={prod.id} value={prod.name} className="text-gray-900 font-bold">
                          {prod.name} (PTR ₹{prod.ptr} | Co. Scheme: {prod.scheme || '10+2'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2">
                    <label className="block text-3xs font-bold text-gray-900 mb-1">Order Qty *</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="10"
                      value={pobQtyInput}
                      onChange={(e) => handleQtyChange(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Offered Scheme by MR */}
                  <div className="sm:col-span-2">
                    <label className="block text-3xs font-bold text-indigo-950 mb-1">
                      Offered Scheme *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10+4"
                      value={offeredSchemeInput}
                      onChange={(e) => setOfferedSchemeInput(e.target.value)}
                      className={`w-full p-2.5 border rounded-xl text-xs font-extrabold focus:ring-2 ${
                        isCurrentSchemeDeviation 
                          ? 'border-amber-500 bg-amber-50 text-amber-950 focus:ring-amber-500' 
                          : 'border-gray-300 bg-white text-gray-900 focus:ring-indigo-500'
                      }`}
                    />
                  </div>

                  {/* Manual Order Value */}
                  <div className="sm:col-span-3">
                    <label className="block text-3xs font-bold text-emerald-950 mb-1">Booked Value (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="1500"
                      value={pobManualValueInput}
                      onChange={(e) => setPobManualValueInput(e.target.value)}
                      className="w-full p-2.5 border border-emerald-400 rounded-xl text-xs font-extrabold text-emerald-950 bg-emerald-50/50 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Scheme Comparison Notice */}
                <div className={`p-2.5 rounded-lg text-3xs flex items-center justify-between border ${
                  isCurrentSchemeDeviation 
                    ? 'bg-amber-100 border-amber-300 text-amber-950' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="flex items-center gap-1.5">
                    {isCurrentSchemeDeviation ? (
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    ) : (
                      <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                    <span>
                      Company Authorized: <strong>{currentMasterScheme}</strong> | Field Offered: <strong>{offeredSchemeInput || '10+0'}</strong>
                    </span>
                  </div>
                  <span className={`font-extrabold px-2 py-0.5 rounded ${
                    isCurrentSchemeDeviation ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {isCurrentSchemeDeviation ? '⚠️ Requires Manager Approval' : '✅ Standard Scheme (Auto-Add)'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200">
                  {!isChemistCall && chemistsList.length > 0 && (
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-3xs font-bold text-gray-900 mb-1">
                        Select Chemist for Order Execution / Supply:
                      </label>
                      <select
                        value={selectedChemistFulfillment}
                        onChange={(e) => setSelectedChemistFulfillment(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
                      >
                        {chemistsList.map(c => (
                          <option key={c.id} value={c.name} className="text-gray-900 font-bold">
                            {c.name} ({c.subArea})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddPobItem}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 shadow-xs flex items-center gap-1 ml-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Order Item
                  </button>
                </div>
              </div>

              {/* Booked POB Table */}
              {pobItems.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-gray-300 rounded-xl text-xs text-gray-700 bg-gray-50/50">
                  <ShoppingCart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="font-bold text-gray-900">No brand orders (POB) added yet.</span>
                  <p className="text-3xs text-gray-600 mt-1">Select brand, enter quantity, scheme, and manual order value (₹) above.</p>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-xl overflow-hidden shadow-2xs">
                  <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2.5 text-left font-extrabold text-gray-900">Brand</th>
                        <th className="px-2 py-2.5 text-center font-extrabold text-gray-900">Qty</th>
                        <th className="px-2 py-2.5 text-center font-extrabold text-gray-900">Scheme</th>
                        <th className="px-3 py-2.5 text-right font-extrabold text-emerald-950">Booked Value</th>
                        <th className="px-2 py-2.5 text-center font-extrabold text-gray-900">Status</th>
                        <th className="px-2 py-2.5 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {pobItems.map(item => (
                        <tr key={item.id} className={item.isSchemeDeviation ? 'bg-amber-50/40 hover:bg-amber-50' : 'hover:bg-gray-50'}>
                          <td className="px-3 py-2.5 font-bold text-gray-900">{item.productName}</td>
                          <td className="px-2 py-2.5 text-center font-bold text-indigo-950">{item.quantity} Units</td>
                          <td className="px-2 py-2.5 text-center">
                            <span className="font-bold text-gray-900">{item.offeredScheme}</span>
                            <span className="text-3xs text-gray-500 block">Co: {item.masterScheme}</span>
                          </td>
                          <td className="px-3 py-2.5 text-right font-extrabold text-emerald-700 text-sm">
                            ₹{item.manualValue.toFixed(2)}
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            {item.isSchemeDeviation ? (
                              <span className="text-3xs font-extrabold px-2 py-0.5 bg-amber-200 text-amber-950 rounded-full border border-amber-300">
                                ⏳ Approval Needed
                              </span>
                            ) : (
                              <span className="text-3xs font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded-full border border-emerald-300">
                                ✅ Confirmed
                              </span>
                            )}
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemovePobItem(item.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold border-t-2 border-gray-300">
                      <tr>
                        <td colSpan={2} className="px-3 py-2 text-gray-900 font-extrabold">
                          Total Order Summary:
                        </td>
                        <td colSpan={4} className="px-3 py-2 text-right">
                          <div className="text-3xs text-emerald-800 font-bold">
                            Direct Confirmed: <strong>₹{confirmedPobValue.toFixed(2)}</strong>
                          </div>
                          {pendingApprovalPobValue > 0 && (
                            <div className="text-3xs text-amber-800 font-bold">
                              Pending Manager Approval: <strong>₹{pendingApprovalPobValue.toFixed(2)}</strong>
                            </div>
                          )}
                          <div className="text-sm font-extrabold text-gray-900 mt-0.5">
                            Grand Total: ₹{totalPobValue.toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAMPLE DISTRIBUTION (Doctor Calls) WITH LIVE BAG INVENTORY */}
          {activeTab === 'samples' && !isChemistCall && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-800 font-bold bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200">
                <span className="flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-indigo-700" />
                  MR Bag Sample Inventory Tracking:
                </span>
                <span className="font-extrabold text-indigo-950">Given This Call: {totalSamplesGiven} Units</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {PHARMA_SAMPLES_LIST.map(sample => {
                  const qty = sampleQuantities[sample.name] || 0;
                  const inBag = getAvailableStock(sample.name, 'sample');
                  return (
                    <div 
                      key={sample.id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        qty > 0 ? 'bg-indigo-50/80 border-indigo-400 shadow-2xs' : 'bg-white border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-gray-900 text-sm">{sample.name}</div>
                        <div className="text-3xs text-gray-700 font-bold flex items-center gap-2 mt-0.5">
                          <span>Pack: {sample.pack}</span>
                          <span className={`px-1.5 py-0.2 rounded font-extrabold ${
                            inBag - qty > 5 ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            Bag Stock: {inBag - qty} / {inBag} avail
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSampleQtyChange(sample.name, qty - 1)}
                          className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center font-bold text-gray-900 text-base"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          max={inBag}
                          value={qty === 0 ? '' : qty}
                          placeholder="0"
                          onChange={(e) => handleSampleQtyChange(sample.name, parseInt(e.target.value, 10) || 0)}
                          className="w-14 text-center p-1.5 border border-gray-300 rounded-lg font-extrabold text-sm text-indigo-950 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          disabled={qty >= inBag}
                          onClick={() => handleSampleQtyChange(sample.name, qty + 1)}
                          className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center font-bold text-gray-900 text-base"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: GIFTS & PROMOTIONAL INPUTS */}
          {activeTab === 'gifts' && !isChemistCall && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-800 font-bold bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                <span className="flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-700" />
                  Doctor Gifts & Input Bag Stock:
                </span>
                <span className="font-extrabold text-amber-950">Given: {totalGiftsGiven} Units</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {PHARMA_GIFTS_LIST.map(gift => {
                  const qty = giftQuantities[gift.name] || 0;
                  const inBag = getAvailableStock(gift.name, 'gift');
                  return (
                    <div 
                      key={gift.id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        qty > 0 ? 'bg-amber-50/80 border-amber-400 shadow-2xs' : 'bg-white border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-gray-900 text-sm">{gift.name}</div>
                        <div className="text-3xs text-gray-700 font-bold flex items-center gap-2 mt-0.5">
                          <span>Type: {gift.type}</span>
                          <span className="px-1.5 py-0.2 rounded font-extrabold bg-amber-100 text-amber-900">
                            Bag Stock: {inBag - qty} / {inBag} avail
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleGiftQtyChange(gift.name, qty - 1)}
                          className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center font-bold text-gray-900 text-base"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          max={inBag}
                          value={qty === 0 ? '' : qty}
                          placeholder="0"
                          onChange={(e) => handleGiftQtyChange(gift.name, parseInt(e.target.value, 10) || 0)}
                          className="w-14 text-center p-1.5 border border-gray-300 rounded-lg font-extrabold text-sm text-amber-950 bg-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          disabled={qty >= inBag}
                          onClick={() => handleGiftQtyChange(gift.name, qty + 1)}
                          className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 flex items-center justify-center font-bold text-gray-900 text-base"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: FEEDBACK & REMARKS */}
          {activeTab === 'remarks' && (
            <div className="space-y-4">
              {isChemistCall ? (
                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stockAvailable}
                      onChange={(e) => setStockAvailable(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-xs font-bold text-gray-900">
                      Raxon Brands Stock Available at Chemist Counter
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Out-of-stock items / Shortage remarks"
                    value={outstandingRemarks}
                    onChange={(e) => setOutstandingRemarks(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white placeholder-gray-400"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1">
                    Doctor Response / Detailing Feedback *
                  </label>
                  <select
                    value={doctorFeedback}
                    onChange={(e) => setDoctorFeedback(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Positive Feedback & Prescribing Support">Positive Feedback & Prescribing Support</option>
                    <option value="High Interest in New Brands">High Interest in New Brands</option>
                    <option value="Average Response (Follow-up Required)">Average Response (Follow-up Required)</option>
                    <option value="Needs More Clinical Literature / Visual Aid">Needs More Clinical Literature / Visual Aid</option>
                    <option value="Currently Writing Competitor Brand">Currently Writing Competitor Brand</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Next Follow-up Date
                </label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Call Remarks & Detailing Notes *
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={isChemistCall ? "e.g. Chemist placed order for Raxon-CV and DermaRax. Requested fast delivery from stockist." : "e.g. Detailed Raxon-CV 625 & Raxodil-D. Doctor assured prescription support. Physician samples handed over."}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 shrink-0">
          <div className="text-3xs text-gray-700">
            {isGeoVerified ? (
              <span className="font-extrabold text-emerald-700 mr-2">🎯 Geo-Verified</span>
            ) : (
              <span className="font-extrabold text-amber-700 mr-2">⚠️ Geo-Deviation ({effectiveDistance}m)</span>
            )}
            {pobItems.length > 0 && (
              <span className="font-extrabold text-emerald-800 mr-2">
                POB: ₹{totalPobValue.toFixed(0)}
              </span>
            )}
            {totalSamplesGiven > 0 && <span className="font-bold text-gray-800">Samples: {totalSamplesGiven}</span>}
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-800 rounded-xl text-xs font-bold hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save & Complete Call
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
