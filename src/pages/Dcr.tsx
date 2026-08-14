import React, { useState } from 'react';
import { Map, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const MOCK_MTP_TODAY = "Jalalpur"; // This will later come from Firebase

const DOCTORS = [
  { id: 1, name: "Dr. A.K. Singh", subArea: "Jalalpur Market", specialty: "General Physician" },
  { id: 2, name: "Dr. R.K. Verma", subArea: "Jalalpur Chauraha", specialty: "Pediatrician" },
  { id: 3, name: "Dr. R.S. Tiwari", subArea: "Jalalpur Market", specialty: "Cardiologist" },
];

export default function Dcr() {
  const [visitedDoctors, setVisitedDoctors] = useState<number[]>([]);
  const [activeCheckIn, setActiveCheckIn] = useState<number | null>(null);

  const handleCheckIn = (doctorId: number) => {
    setActiveCheckIn(doctorId);
    // Here we will trigger geolocation verification
  };

  const handleCheckOut = (doctorId: number) => {
    setVisitedDoctors(prev => [...prev, doctorId]);
    setActiveCheckIn(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Call Report (DCR)</h1>
          <p className="text-gray-500">{format(new Date(), 'EEEE, dd MMMM yyyy')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planned Area Info */}
        <div className="bg-indigo-50 rounded-xl shadow-sm border border-indigo-100 p-6 lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <p className="text-sm font-semibold text-indigo-800 uppercase tracking-wider mb-1">Today's Approved Area (Auto-fetched from MTP)</p>
              <h2 className="text-3xl font-bold text-indigo-900 flex items-center">
                <MapPin className="mr-2 h-8 w-8 text-indigo-600" />
                {MOCK_MTP_TODAY}
              </h2>
            </div>
            <button className="mt-4 sm:mt-0 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 font-medium transition-colors text-sm">
              Apply Deviation
            </button>
          </div>
        </div>

        {/* Doctor List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <UserIcon className="mr-2 h-5 w-5 text-gray-500" />
            Doctors in {MOCK_MTP_TODAY} ({DOCTORS.length})
          </h3>
          
          <div className="space-y-4">
            {DOCTORS.map(doctor => {
              const isVisited = visitedDoctors.includes(doctor.id);
              const isCheckingIn = activeCheckIn === doctor.id;

              return (
                <div key={doctor.id} className={`bg-white rounded-lg shadow-sm border ${isVisited ? 'border-green-200 bg-green-50/30' : isCheckingIn ? 'border-amber-300 ring-2 ring-amber-200' : 'border-gray-200'} p-4 transition-all`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{doctor.name}</h4>
                      <p className="text-sm text-gray-500">{doctor.specialty} • {doctor.subArea}</p>
                    </div>
                    
                    <div>
                      {isVisited ? (
                        <span className="flex items-center text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                          <CheckCircle className="w-4 h-4 mr-1" /> Visited
                        </span>
                      ) : isCheckingIn ? (
                        <button 
                          onClick={() => handleCheckOut(doctor.id)}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center"
                        >
                          <Clock className="w-4 h-4 mr-2" /> Complete Visit
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleCheckIn(doctor.id)}
                            disabled={activeCheckIn !== null}
                            className={`px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center ${
                              activeCheckIn !== null ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                          >
                            <MapPin className="w-4 h-4 mr-2" /> Check-in
                          </button>
                          <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
                            Skip
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Checking In State expansion */}
                  {isCheckingIn && (
                    <div className="mt-4 pt-4 border-t border-amber-100 bg-amber-50 rounded-b-lg p-3 -mx-4 -mb-4">
                      <p className="text-sm text-amber-800 flex items-center">
                        <span className="relative flex h-3 w-3 mr-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                        Location verified. Meeting in progress. Click 'Complete Visit' when done.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Progress Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Daily Progress</h3>
            <div className="flex items-end space-x-2 mb-2">
              <span className="text-3xl font-bold text-indigo-600">{visitedDoctors.length}</span>
              <span className="text-gray-500 mb-1">/ {DOCTORS.length} Calls</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(visitedDoctors.length / DOCTORS.length) * 100}%` }}></div>
            </div>
          </div>
          
          <button className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold shadow-md hover:bg-gray-800 transition-colors">
            End Day (Final Submit)
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline UserIcon to avoid import issues temporarily
function UserIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
