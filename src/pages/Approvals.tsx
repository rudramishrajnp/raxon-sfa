import React, { useState, useEffect } from 'react';
import { getPendingMTPs, approveMTP, rejectMTP } from '../lib/api';
import { Modal } from '../components/Modal';
import { CheckCircle, Clock, Calendar, Eye, Check, X, AlertCircle, MapPin, Coffee, FileText, User } from 'lucide-react';
import { format, parseISO, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';

export default function Approvals() {
  const [pendingMTPs, setPendingMTPs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Detailed viewing state
  const [selectedMTP, setSelectedMTP] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Rejection modal state
  const [rejectingMTPId, setRejectingMTPId] = useState<string | null>(null);
  const [remarkText, setRemarkText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const mtps = await getPendingMTPs();
      setPendingMTPs(mtps);
    } catch (error) {
      console.error("Failed to load approvals", error);
    }
    setLoading(false);
  };

  const handleOpenMTP = (mtp: any) => {
    setSelectedMTP(mtp);
    setIsViewModalOpen(true);
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await approveMTP(id);
      setPendingMTPs(prev => prev.filter(m => m.id !== id));
      if (selectedMTP?.id === id) {
        setIsViewModalOpen(false);
        setSelectedMTP(null);
      }
      setMessage("MTP has been APPROVED successfully! The MR can now proceed with DCR based on this approved plan.");
    } catch (error) {
      setMessage("Failed to approve MTP. Please try again.");
    }
    setActionLoading(false);
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

  // Helper to parse dates for selected MTP
  const getDaysBreakdown = (mtp: any) => {
    if (!mtp || !mtp.monthYear) return [];
    
    // monthYear is in format 'yyyy-MM'
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
      // Fallback from plans keys
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-500">
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
        <div className="p-1">
          <p className="text-gray-800 mb-6">{message}</p>
          <div className="flex justify-end">
            <button 
              onClick={() => setMessage('')} 
              className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      {/* Rejection Remark Modal */}
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
                  onClick={() => handleApprove(selectedMTP.id)}
                  disabled={actionLoading}
                  className="flex items-center px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4 mr-1.5" /> {actionLoading ? 'Approving...' : 'Approve Tour Plan'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Main Approvals Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manager Approvals</h1>
        <p className="text-gray-500">Review, inspect day-wise routes, and approve monthly tour plans submitted by your team</p>
      </div>

      {pendingMTPs.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-xs border border-gray-200 text-center max-w-xl mx-auto mt-6">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">All caught up!</h2>
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
                      onClick={() => handleApprove(mtp.id)}
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
  );
}
