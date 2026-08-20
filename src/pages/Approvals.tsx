import React, { useState, useEffect } from 'react';
import { getPendingMTPs, approveMTP, rejectMTP } from '../lib/api';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  Eye, 
  Check, 
  X, 
  AlertCircle, 
  MapPin, 
  Coffee, 
  FileText, 
  User,
  ShoppingCart,
  ShieldAlert,
  Percent,
  Tag,
  Store,
  ArrowRight,
  Filter,
  CheckCircle2,
  XCircle,
  Building2
} from 'lucide-react';
import { format, parseISO, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { 
  getPendingPOBApprovals, 
  approvePOBRequest, 
  rejectPOBRequest, 
  POBApprovalRequest 
} from '../data/pobApprovals';

export default function Approvals() {
  // Top-Level Active Tab: 'mtp' | 'pob'
  const [activeApprovalTab, setActiveApprovalTab] = useState<'mtp' | 'pob'>('pob');

  // MTP state
  const [pendingMTPs, setPendingMTPs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // MTP detailed viewing state
  const [selectedMTP, setSelectedMTP] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // MTP rejection modal state
  const [rejectingMTPId, setRejectingMTPId] = useState<string | null>(null);
  const [confirmApproveMTP, setConfirmApproveMTP] = useState<any | null>(null);
  const [remarkText, setRemarkText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Chemist POB Scheme Deviations state
  const [pobRequests, setPobRequests] = useState<POBApprovalRequest[]>([]);
  const [pobFilter, setPobFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [confirmApprovePOB, setConfirmApprovePOB] = useState<POBApprovalRequest | null>(null);
  const [rejectingPOB, setRejectingPOB] = useState<POBApprovalRequest | null>(null);
  const [pobRejectRemark, setPobRejectRemark] = useState('');

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const mtps = await getPendingMTPs();
      setPendingMTPs(mtps);

      const pobs = getPendingPOBApprovals();
      setPobRequests(pobs);
    } catch (error) {
      console.error("Failed to load approvals", error);
    }
    setLoading(false);
  };

  const handleOpenMTP = (mtp: any) => {
    setSelectedMTP(mtp);
    setIsViewModalOpen(true);
  };

  const handleRequestApprove = (mtp: any) => {
    setConfirmApproveMTP(mtp);
  };

  const handleExecuteApprove = async () => {
    if (!confirmApproveMTP) return;
    const id = confirmApproveMTP.id;
    setActionLoading(true);
    try {
      await approveMTP(id);
      setPendingMTPs(prev => prev.filter(m => m.id !== id));
      if (selectedMTP?.id === id) {
        setIsViewModalOpen(false);
        setSelectedMTP(null);
      }
      setMessage(`MTP (${confirmApproveMTP.monthYear}) APPROVED successfully! MR (${confirmApproveMTP.userName}) can now execute DCR.`);
    } catch (error) {
      setMessage("Failed to approve MTP. Please try again.");
    }
    setActionLoading(false);
    setConfirmApproveMTP(null);
  };

  const handleStartReject = (id: string) => {
    setRejectingMTPId(id);
    setRemarkText('');
  };

  const handleConfirmReject = async () => {
    if (!rejectingMTPId) return;
    setActionLoading(true);
    try {
      await rejectMTP(rejectingMTPId, remarkText.trim() || 'Changes requested by manager');
      setPendingMTPs(prev => prev.filter(m => m.id !== rejectingMTPId));
      if (selectedMTP?.id === rejectingMTPId) {
        setIsViewModalOpen(false);
        setSelectedMTP(null);
      }
      setRejectingMTPId(null);
      setMessage("MTP has been sent back to MR for revision with your remarks.");
    } catch (error) {
      setMessage("Failed to reject MTP. Please try again.");
    }
    setActionLoading(false);
  };

  // POB Actions
  const handleExecuteApprovePOB = () => {
    if (!confirmApprovePOB) return;
    const updated = approvePOBRequest(confirmApprovePOB.id, 'AM Rahul Sharma (AM01)', 'Approved scheme deviation under special monthly target campaign.');
    setPobRequests(getPendingPOBApprovals());
    setConfirmApprovePOB(null);
    setMessage(`✅ POB Order for ${confirmApprovePOB.productName} (${confirmApprovePOB.offeredScheme}) at ${confirmApprovePOB.chemistName} has been APPROVED! Value ₹${confirmApprovePOB.manualValue} is now credited to MR POB total.`);
  };

  const handleExecuteRejectPOB = () => {
    if (!rejectingPOB) return;
    rejectPOBRequest(rejectingPOB.id, 'AM Rahul Sharma (AM01)', pobRejectRemark.trim() || 'Scheme exceeds authorized company discount ceiling. Please bill at standard company scheme.');
    setPobRequests(getPendingPOBApprovals());
    setRejectingPOB(null);
    setPobRejectRemark('');
    setMessage(`❌ POB Scheme deviation rejected. MR has been notified to re-book at authorized scheme.`);
  };

  // Helper to parse dates for selected MTP
  const getDaysBreakdown = (mtp: any) => {
    if (!mtp || !mtp.monthYear) return [];
    try {
      const [yearStr, monthStr] = mtp.monthYear.split('-');
      const baseDate = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
      const days = eachDayOfInterval({
        start: startOfMonth(baseDate),
        end: endOfMonth(baseDate),
      });

      return days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const plan = mtp.plans ? mtp.plans[dateStr] : null;
        const dayName = format(day, 'EEEE');
        const isSunday = dayName === 'Sunday';
        return {
          date: day,
          dateStr,
          dayName,
          isSunday,
          area: plan || (isSunday ? 'Holiday' : 'Not Set')
        };
      });
    } catch (e) {
      return Object.entries(mtp.plans || {}).sort().map(([dateStr, area]) => {
        const day = parseISO(dateStr);
        return {
          date: day,
          dateStr,
          dayName: format(day, 'EEEE'),
          isSunday: format(day, 'EEEE') === 'Sunday',
          area: area as string
        };
      });
    }
  };

  const filteredPobRequests = pobRequests.filter(req => {
    const status = req.status.toLowerCase();
    if (pobFilter === 'all') return true;
    if (pobFilter === 'pending') return status === 'pending';
    if (pobFilter === 'approved') return status === 'approved';
    if (pobFilter === 'rejected') return status === 'rejected';
    return true;
  });

  const pendingPobCount = pobRequests.filter(r => r.status.toLowerCase() === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-500 font-bold">
        <Clock className="w-6 h-6 animate-spin mr-2 text-indigo-600" />
        <span>Loading pending approvals...</span>
      </div>
    );
  }

  const daysList = selectedMTP ? getDaysBreakdown(selectedMTP) : [];
  const workingDaysCount = daysList.filter(d => d.area !== 'Holiday' && d.area !== 'Leave' && d.area !== 'Not Set').length;
  const holidaysCount = daysList.filter(d => d.area === 'Holiday').length;
  const leavesCount = daysList.filter(d => d.area === 'Leave').length;

  return (
    <div className="space-y-6">
      {/* General Notification Modal */}
      <Modal isOpen={!!message} onClose={() => setMessage('')} title="Status Update">
        <div className="p-1 space-y-4">
          <p className="text-gray-900 font-bold text-sm leading-relaxed">{message}</p>
          <div className="flex justify-end">
            <button 
              onClick={() => setMessage('')} 
              className="px-5 py-2 bg-indigo-600 text-white font-extrabold rounded-lg hover:bg-indigo-700 transition-colors text-xs"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      {/* Main Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Manager Approvals & Audit Hub</h1>
        <p className="text-xs font-semibold text-gray-600 mt-1">
          Review Monthly Tour Plans (MTP) and Chemist Personal Order Booking (POB) Scheme Deviations
        </p>
      </div>

      {/* Top Module Tabs */}
      <div className="flex border-b border-gray-200 space-x-2">
        <button
          onClick={() => setActiveApprovalTab('pob')}
          className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center gap-2 ${
            activeApprovalTab === 'pob' 
              ? 'border-indigo-600 text-indigo-700' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Chemist POB Scheme Deviations
          {pendingPobCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-3xs font-extrabold">
              {pendingPobCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveApprovalTab('mtp')}
          className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center gap-2 ${
            activeApprovalTab === 'mtp' 
              ? 'border-indigo-600 text-indigo-700' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Monthly Tour Plans (MTP)
          {pendingMTPs.length > 0 && (
            <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-full text-3xs font-extrabold">
              {pendingMTPs.length} Pending
            </span>
          )}
        </button>
      </div>

      {/* SECTION 1: CHEMIST POB SCHEME DEVIATIONS TAB */}
      {activeApprovalTab === 'pob' && (
        <div className="space-y-4">
          {/* Subheader & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                POB Scheme Deviation Approval Requests
              </h2>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                When MR offers extra promotional scheme (e.g. 10+4 vs Company 10+2), manager approval is required before POB value is credited.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={() => setPobFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  pobFilter === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({pobRequests.filter(r => r.status.toLowerCase() === 'pending').length})
              </button>
              <button
                onClick={() => setPobFilter('approved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  pobFilter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved ({pobRequests.filter(r => r.status.toLowerCase() === 'approved').length})
              </button>
              <button
                onClick={() => setPobFilter('rejected')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  pobFilter === 'rejected' ? 'bg-red-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected ({pobRequests.filter(r => r.status.toLowerCase() === 'rejected').length})
              </button>
              <button
                onClick={() => setPobFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  pobFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({pobRequests.length})
              </button>
            </div>
          </div>

          {/* List of POB Requests */}
          {filteredPobRequests.length === 0 ? (
            <div className="bg-white p-10 rounded-xl shadow-xs border border-gray-200 text-center max-w-lg mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-base font-extrabold text-gray-900">No POB requests found</h3>
              <p className="text-xs text-gray-600 mt-1">There are no {pobFilter} POB scheme deviation requests at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredPobRequests.map(req => {
                const isPending = req.status.toLowerCase() === 'pending';
                const isApproved = req.status.toLowerCase() === 'approved';
                const isRejected = req.status.toLowerCase() === 'rejected';

                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-xl border p-5 transition-all shadow-2xs ${
                      isPending ? 'border-amber-300 ring-1 ring-amber-200' : isApproved ? 'border-emerald-300 bg-emerald-50/10' : 'border-red-200 bg-red-50/10'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Product & Chemist Info */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="text-base font-black text-gray-900">{req.productName}</span>
                          <span className="text-xs px-2.5 py-0.5 bg-indigo-100 text-indigo-900 rounded font-black border border-indigo-200">
                            Qty: {req.quantity} Units
                          </span>
                          <span className="text-sm font-black text-emerald-700">
                            ₹{req.manualValue.toFixed(2)}
                          </span>

                          {/* Status Badge */}
                          {isPending && (
                            <span className="text-3xs font-extrabold px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Awaiting Manager Approval
                            </span>
                          )}
                          {isApproved && (
                            <span className="text-3xs font-extrabold px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-700" /> Approved & Added to POB
                            </span>
                          )}
                          {isRejected && (
                            <span className="text-3xs font-extrabold px-2.5 py-0.5 bg-red-100 text-red-900 border border-red-300 rounded-full flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-red-700" /> Rejected / Deviation Declined
                            </span>
                          )}
                        </div>

                        {/* Chemist & MR Details */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-700 font-medium">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                            Chemist: <strong>{req.chemistName}</strong> ({req.area})
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-indigo-600" />
                            MR: <strong>{req.mrName} ({req.mrId})</strong>
                          </span>
                          <span>•</span>
                          <span className="text-gray-500">
                            {format(new Date(req.createdAt), 'dd MMM yyyy, HH:mm')}
                          </span>
                        </div>

                        {/* Scheme Deviation Highlight Box */}
                        <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl text-xs space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-700 font-bold">Company Authorized Scheme:</span>
                            <span className="px-2 py-0.5 bg-white border border-gray-300 text-gray-900 font-mono font-bold rounded">
                              {req.masterScheme}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                            <span className="text-amber-950 font-bold">MR Offered Scheme:</span>
                            <span className="px-2.5 py-0.5 bg-amber-600 text-white font-mono font-extrabold rounded shadow-xs">
                              {req.offeredScheme}
                            </span>
                          </div>
                          {req.remarks && (
                            <p className="text-3xs text-gray-600 italic mt-1">
                              <strong>MR Note:</strong> "{req.remarks}"
                            </p>
                          )}
                          {req.managerRemarks && (
                            <p className="text-3xs text-indigo-900 font-bold mt-1">
                              <strong>Manager Sign-off:</strong> "{req.managerRemarks}" by {req.approvedBy}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      {isPending && (
                        <div className="flex sm:flex-col lg:flex-row items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setRejectingPOB(req);
                              setPobRejectRemark('');
                            }}
                            className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject Scheme
                          </button>
                          <button
                            onClick={() => setConfirmApprovePOB(req)}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            Approve POB Value
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: MONTHLY TOUR PLANS (MTP) TAB */}
      {activeApprovalTab === 'mtp' && (
        <div>
          {pendingMTPs.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-xs border border-gray-200 text-center max-w-xl mx-auto mt-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">All MTPs caught up!</h2>
              <p className="text-gray-500 text-sm mt-1">There are no pending MTP approval requests at this moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingMTPs.map(mtp => {
                const totalDays = Object.keys(mtp.plans || {}).length;
                return (
                  <div 
                    key={mtp.id} 
                    className="bg-white p-5 rounded-xl shadow-xs border border-gray-200 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* MR Details */}
                      <div className="flex items-start space-x-3.5">
                        <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-lg flex-shrink-0 mt-0.5">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-bold text-gray-900">{mtp.userName}</h3>
                            <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded-md border border-indigo-100">
                              Medical Rep
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center text-xs text-gray-500 gap-x-3 gap-y-1 mt-1">
                            <span className="flex items-center font-medium text-gray-700">
                              <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                              Plan for: <strong className="ml-1 text-indigo-900">{mtp.monthYear}</strong>
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                              Submitted: {
                                mtp.submittedAt 
                                  ? (typeof mtp.submittedAt?.toDate === 'function' 
                                      ? format(mtp.submittedAt.toDate(), 'dd MMM yyyy, HH:mm') 
                                      : format(new Date(mtp.submittedAt), 'dd MMM yyyy, HH:mm'))
                                  : 'Recently'
                              }
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-gray-600">
                            Total Days Planned: <span className="font-bold text-green-700">{totalDays} Days</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <button 
                          onClick={() => handleOpenMTP(mtp)}
                          className="flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-sm font-semibold transition-colors"
                          title="Open full day-by-day MTP breakdown"
                        >
                          <Eye className="w-4 h-4 mr-1.5 text-indigo-600" />
                          View / Open MTP
                        </button>
                        <button 
                          onClick={() => handleStartReject(mtp.id)}
                          className="flex items-center px-3.5 py-2 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 text-gray-700 hover:text-red-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                        <button 
                          onClick={() => handleRequestApprove(mtp)}
                          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
                        >
                          <Check className="w-4 h-4 mr-1.5" />
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- CONFIRMATION: APPROVE POB SCHEME DEVIATION MODAL --- */}
      {confirmApprovePOB && (
        <ConfirmModal
          isOpen={!!confirmApprovePOB}
          onClose={() => setConfirmApprovePOB(null)}
          onConfirm={handleExecuteApprovePOB}
          type="success"
          title="Approve Scheme Deviation & Authorize POB?"
          message={`Are you sure you want to approve the scheme deviation for ${confirmApprovePOB.productName} (${confirmApprovePOB.offeredScheme})?`}
          subMessage="Upon approval, the POB order value of ₹"
          itemName={`Product: ${confirmApprovePOB.productName} • Qty: ${confirmApprovePOB.quantity} • Offered Scheme: ${confirmApprovePOB.offeredScheme} (Co: ${confirmApprovePOB.masterScheme}) • Value: ₹${confirmApprovePOB.manualValue} • Chemist: ${confirmApprovePOB.chemistName}`}
          confirmText="Yes, Authorize Scheme & Approve Value"
          cancelText="Cancel"
        />
      )}

      {/* --- REJECTION REMARK MODAL FOR POB --- */}
      {rejectingPOB && (
        <Modal
          isOpen={!!rejectingPOB}
          onClose={() => setRejectingPOB(null)}
          title="Reject Scheme Deviation Request"
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-700 font-semibold">
              Enter reason for declining this scheme deviation for <strong>{rejectingPOB.productName}</strong>:
            </p>
            <textarea
              rows={3}
              value={pobRejectRemark}
              onChange={(e) => setPobRejectRemark(e.target.value)}
              placeholder="e.g. Authorized discount ceiling exceeded. Please re-book order at standard 10+2 scheme."
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setRejectingPOB(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRejectPOB}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* --- MTP REJECTION REMARK MODAL --- */}
      <Modal 
        isOpen={!!rejectingMTPId} 
        onClose={() => setRejectingMTPId(null)} 
        title="Reject / Request Revision"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please enter remarks/reasons for returning this MTP to the Medical Representative (MR):
          </p>
          <textarea
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
            placeholder="e.g. Please change 12th Aug area from Gomti Nagar to Alambagh..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
          />
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setRejectingMTPId(null)}
              disabled={actionLoading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
            >
              {actionLoading ? 'Submitting...' : 'Confirm Reject & Send Remarks'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Detailed MTP Day-Wise View Modal */}
      {selectedMTP && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Day-Wise Tour Plan: ${selectedMTP.userName}`}
        >
          <div className="space-y-5 max-h-[75vh] flex flex-col">
            {/* Header info */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base">
                  {selectedMTP.userName ? selectedMTP.userName.charAt(0) : 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{selectedMTP.userName} (MR)</h3>
                  <div className="flex items-center text-xs text-gray-600 gap-2 mt-0.5">
                    <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Month: {selectedMTP.monthYear}</span>
                    <span>•</span>
                    <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-gray-500" /> {selectedMTP.submittedAt ? format(new Date(selectedMTP.submittedAt), 'dd MMM yyyy, HH:mm') : 'Recently'}</span>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
                Pending Approval
              </span>
            </div>

            {/* Quick stats chips */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 text-center">
                <span className="text-xs text-green-700 font-medium block">Working Days</span>
                <span className="text-lg font-bold text-green-800">{workingDaysCount}</span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-center">
                <span className="text-xs text-red-700 font-medium block">Sundays / Holidays</span>
                <span className="text-lg font-bold text-red-800">{holidaysCount}</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center">
                <span className="text-xs text-amber-700 font-medium block">Leaves Planned</span>
                <span className="text-lg font-bold text-amber-800">{leavesCount}</span>
              </div>
            </div>

            {/* Day wise list */}
            <div className="flex-1 overflow-y-auto pr-1 border border-gray-200 rounded-xl bg-gray-50 p-2 space-y-1.5 max-h-[350px]">
              {daysList.map((item) => {
                const isHoliday = item.area === 'Holiday';
                const isLeave = item.area === 'Leave';
                const isRegularArea = !isHoliday && !isLeave && item.area !== 'Not Set';

                return (
                  <div
                    key={item.dateStr}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-sm transition-all ${
                      isHoliday 
                        ? 'bg-red-50/70 border-red-200 text-gray-700' 
                        : isLeave
                        ? 'bg-amber-50/70 border-amber-200 text-gray-700'
                        : 'bg-white border-gray-200 shadow-2xs hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-16 font-semibold text-gray-800">
                        {format(item.date, 'dd MMM')}
                      </div>
                      <div className={`text-xs w-20 font-medium ${item.isSunday ? 'text-red-600' : 'text-gray-500'}`}>
                        {item.dayName}
                      </div>
                    </div>

                    <div className="flex items-center">
                      {isHoliday ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                          <Coffee className="w-3 h-3 mr-1" /> Holiday
                        </span>
                      ) : isLeave ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                          <FileText className="w-3 h-3 mr-1" /> Leave
                        </span>
                      ) : isRegularArea ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-green-50 text-green-800 border border-green-200">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-green-600" /> {item.area}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No area set</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action buttons footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium"
              >
                Close View
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleStartReject(selectedMTP.id)}
                  disabled={actionLoading}
                  className="flex items-center px-4 py-2 bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors"
                >
                  <X className="w-4 h-4 mr-1.5" /> Reject / Remark
                </button>
                <button
                  onClick={() => handleRequestApprove(selectedMTP)}
                  disabled={actionLoading}
                  className="flex items-center px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
                >
                  <Check className="w-4 h-4 mr-1.5" /> Approve Tour Plan
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* --- CONFIRMATION: APPROVE MTP MODAL --- */}
      {confirmApproveMTP && (
        <ConfirmModal
          isOpen={!!confirmApproveMTP}
          onClose={() => setConfirmApproveMTP(null)}
          onConfirm={handleExecuteApprove}
          type="success"
          title="Approve Monthly Tour Plan?"
          message={`Are you sure you want to approve the MTP for ${confirmApproveMTP.userName} (MR) for ${confirmApproveMTP.monthYear}?`}
          subMessage="Once approved, the MR can submit their daily DCR based on this tour plan. Confirmation is required to prevent accidental changes."
          itemName={`MR: ${confirmApproveMTP.userName} • Month: ${confirmApproveMTP.monthYear} • Total Planned Days: ${Object.keys(confirmApproveMTP.plans || {}).length} Days`}
          confirmText="Yes, Approve MTP"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
