import React, { useState } from 'react';
import { PlayCircle, StopCircle, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Modal } from '../components/Modal';

export default function Dashboard() {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const handlePunch = () => {
    if (!isPunchedIn) {
      setIsPunchedIn(true);
      setPunchTime(new Date().toLocaleTimeString());
    } else {
      setShowConfirm(true);
    }
  };

  const confirmPunchOut = () => {
    setIsPunchedIn(false);
    setPunchTime(null);
    setShowConfirm(false);
    setMessage("Punched out successfully!");
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Punch Out">
        <p className="text-gray-600 mb-6">Are you sure you want to Punch Out for today?</p>
        <div className="flex justify-end space-x-3">
          <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
          <button onClick={confirmPunchOut} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Punch Out</button>
        </div>
      </Modal>
      <Modal isOpen={!!message} onClose={() => setMessage('')} title="Notification">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex justify-end">
          <button onClick={() => setMessage('')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">OK</button>
        </div>
      </Modal>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Pradeep Mishra (MR)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-indigo-600" />
            Attendance
          </h2>
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <button
              onClick={handlePunch}
              className={`w-48 h-48 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-transform hover:scale-105 ${
                isPunchedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isPunchedIn ? (
                <>
                  <StopCircle size={48} className="mb-2" />
                  <span className="text-xl font-bold">Punch Out</span>
                </>
              ) : (
                <>
                  <PlayCircle size={48} className="mb-2" />
                  <span className="text-xl font-bold">Punch In</span>
                </>
              )}
            </button>
            {isPunchedIn && punchTime && (
              <p className="text-sm text-gray-600 font-medium bg-gray-100 px-4 py-2 rounded-full mt-4 flex items-center">
                <CheckCircle2 size={16} className="text-green-500 mr-2" />
                Started work at {punchTime}
              </p>
            )}
          </div>
        </div>

        {/* Today's Summary */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary (MTP)</h2>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-1">Planned Area</p>
                <h3 className="text-xl font-bold text-indigo-900 flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Jalalpur
                </h3>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                Approved
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-100 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Doctors Planned</p>
              <p className="text-2xl font-bold text-gray-900">11</p>
            </div>
            <div className="border border-gray-100 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Chemists Planned</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
