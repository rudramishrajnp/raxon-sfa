import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

const AREAS = [
  "Akbarpur 1", "Shahzadpur", "District Hospital", "Medical college", 
  "Tanda", "Baskhari", "Jalalpur", "Malipur", "Dostpur", "Maharua", 
  "Iltifatganj", "Akbarpur 2", "Leave", "Holiday", "Transit / Meeting"
];

export default function Mtp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [plans, setPlans] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'draft' | 'submitted' | 'approved'>('draft');

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleAreaSelect = (dateStr: string, area: string) => {
    if (status === 'approved') return;
    setPlans(prev => ({ ...prev, [dateStr]: area }));
  };

  const isComplete = daysInMonth.every(day => plans[format(day, 'yyyy-MM-dd')]);

  const handleSubmit = () => {
    if (!isComplete) {
      alert("Please fill the plan for all days in the month before submitting.");
      return;
    }
    setStatus('submitted');
    // Here we will save to Firebase
    alert("MTP Submitted to Manager for approval.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Tour Plan (MTP)</h1>
          <p className="text-gray-500">Plan your daily working areas for the entire month</p>
        </div>
        <div className="flex items-center space-x-2">
          {status === 'draft' && (
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <AlertCircle size={16} className="mr-1" /> Draft
            </span>
          )}
          {status === 'submitted' && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Clock size={16} className="mr-1" /> Pending Approval
            </span>
          )}
          {status === 'approved' && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <CheckCircle2 size={16} className="mr-1" /> Approved
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
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

        {/* Calendar Grid */}
        <div className="p-4">
          <div className="space-y-4">
            {daysInMonth.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayName = format(day, 'EEEE');
              const isWeekend = dayName === 'Sunday';
              const selectedArea = plans[dateStr];

              return (
                <div key={dateStr} className={`flex flex-col sm:flex-row sm:items-center p-3 rounded-lg border ${isWeekend ? 'bg-red-50 border-red-100' : 'bg-white border-gray-200'} ${isToday(day) ? 'ring-2 ring-indigo-500' : ''}`}>
                  <div className="w-48 mb-2 sm:mb-0 shrink-0">
                    <span className="font-semibold text-gray-700">{format(day, 'dd MMM')}</span>
                    <span className={`ml-2 text-sm ${isWeekend ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{dayName}</span>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <select
                      value={selectedArea || ''}
                      onChange={(e) => handleAreaSelect(dateStr, e.target.value)}
                      disabled={status !== 'draft'}
                      className={`w-full p-2 rounded-md border ${
                        !selectedArea && !isWeekend ? 'border-amber-300 bg-amber-50' : 'border-gray-300'
                      } ${status !== 'draft' ? 'bg-gray-100 opacity-75' : 'bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    >
                      <option value="" disabled>Select Area / Leave / Holiday</option>
                      {AREAS.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {isComplete ? 'All days planned.' : 'Please plan all days to submit.'}
          </p>
          <button
            onClick={handleSubmit}
            disabled={!isComplete || status !== 'draft'}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
              isComplete && status === 'draft'
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send size={18} className="mr-2" />
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
}
