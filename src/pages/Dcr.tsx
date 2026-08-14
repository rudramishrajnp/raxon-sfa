import React, { useState, useEffect } from 'react';
import { Map, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Geolocation } from '@capacitor/geolocation';
import { getMTP, saveDCRCheckIn, getDCR } from '../lib/api';
import { Modal } from '../components/Modal';

const ALL_DOCTORS = [
  { id: 1, name: "Dr. A.K. Singh", area: "Jalalpur", subArea: "Jalalpur Market", specialty: "General Physician" },
  { id: 2, name: "Dr. R.K. Verma", area: "Jalalpur", subArea: "Jalalpur Chauraha", specialty: "Pediatrician" },
  { id: 3, name: "Dr. S.P. Gupta", area: "Shahzadpur", subArea: "Dostpur Mod", specialty: "Cardiologist" },
  { id: 4, name: "Dr. R.N. Yadav", area: "Shahzadpur", subArea: "Malipur Mod", specialty: "Orthopedic" },
  { id: 5, name: "Dr. Neha Sharma", area: "Medical college", subArea: "TFFF", specialty: "Gynecologist" },
  { id: 6, name: "Dr. M.L. Pandey", area: "District Hospital", subArea: "WRT", specialty: "General Surgeon" },
];

export default function Dcr() {
  const [plannedArea, setPlannedArea] = useState<string | null>(null);
  const [visitedDoctors, setVisitedDoctors] = useState<number[]>([]);
  const [activeCheckIn, setActiveCheckIn] = useState<number | null>(null);
  const [visitLocation, setVisitLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const monthYear = format(new Date(), 'yyyy-MM');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mtpData = await getMTP(monthYear);
        if (mtpData && mtpData.plans && mtpData.plans[todayStr]) {
          setPlannedArea(mtpData.plans[todayStr]);
        } else {
          setPlannedArea(null);
        }

        const dcrData = await getDCR(todayStr);
        if (dcrData && dcrData.checkIns) {
          setVisitedDoctors(dcrData.checkIns.map((c: any) => c.doctorId));
        }
      } catch (error) {
        console.error("Error fetching DCR data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [monthYear, todayStr]);

  const doctors = ALL_DOCTORS.filter(d => d.area === plannedArea);

  const handleCheckIn = async (doctorId: number) => {
    setIsGettingLocation(true);
    try {
      // In a real device, this prompts for GPS permissions. In browser, it uses HTML5 Geolocation.
      const coordinates = await Geolocation.getCurrentPosition();
      setVisitLocation({
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      });
      setActiveCheckIn(doctorId);
    } catch (error) {
      console.error("Error getting location:", error);
      setMessage("Could not get location. Please enable GPS permissions and try again.");
    }
    setIsGettingLocation(false);
  };

  const handleCheckOut = async (doctorId: number) => {
    try {
      if (!plannedArea) return;
      await saveDCRCheckIn(todayStr, plannedArea, doctorId, visitLocation || undefined);
      setVisitedDoctors(prev => [...prev, doctorId]);
      setActiveCheckIn(null);
      setVisitLocation(null);
    } catch (error) {
      console.error("Failed to save checkin:", error);
      setMessage("Failed to save visit to database. Please check connection.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading today's schedule...</div>;
  }

  return (
    <div className="space-y-6">
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm DCR Submission">
        <p className="text-gray-600 mb-6">Are you sure you want to end your day and submit the final Daily Call Report (DCR)?</p>
        <div className="flex justify-end space-x-3">
          <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
          <button onClick={() => { setShowConfirm(false); setMessage("DCR Submitted successfully!"); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Submit DCR</button>
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
              {plannedArea ? (
                <h2 className="text-3xl font-bold text-indigo-900 flex items-center">
                  <MapPin className="mr-2 h-8 w-8 text-indigo-600" />
                  {plannedArea}
                </h2>
              ) : (
                <h2 className="text-xl font-bold text-amber-600 flex items-center">
                  <AlertCircle className="mr-2 h-6 w-6" />
                  No MTP planned for today
                </h2>
              )}
            </div>
            <button className="mt-4 sm:mt-0 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 font-medium transition-colors text-sm">
              Apply Deviation
            </button>
          </div>
        </div>

        {/* Doctor List */}
        {plannedArea && (
          <>
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserIcon className="mr-2 h-5 w-5 text-gray-500" />
                Doctors in {plannedArea} ({doctors.length})
              </h3>
              
              <div className="space-y-4">
                {doctors.length === 0 && (
                  <p className="text-gray-500 bg-white p-6 rounded-lg text-center border border-gray-200">
                    No doctors mapped to this area yet.
                  </p>
                )}
                {doctors.map(doctor => {
                  const isVisited = visitedDoctors.includes(doctor.id);
                  const isCheckingIn = activeCheckIn === doctor.id;
                  const isCheckingLocationForThis = isGettingLocation && activeCheckIn === null;

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
                                disabled={activeCheckIn !== null || isGettingLocation}
                                className={`px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center ${
                                  activeCheckIn !== null || isGettingLocation ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                              >
                                {isCheckingLocationForThis ? (
                                  <>
                                    <span className="animate-spin mr-2 border-2 border-gray-400 border-t-transparent rounded-full w-4 h-4"></span>
                                    Locating...
                                  </>
                                ) : (
                                  <>
                                    <MapPin className="w-4 h-4 mr-2" /> Check-in
                                  </>
                                )}
                              </button>
                              <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50" disabled={isGettingLocation}>
                                Skip
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Checking In State expansion */}
                      {isCheckingIn && (
                        <div className="mt-4 pt-4 border-t border-amber-100 bg-amber-50 rounded-b-lg p-3 -mx-4 -mb-4">
                          <p className="text-sm text-amber-800 flex flex-col sm:flex-row sm:items-center">
                            <span className="flex items-center mb-1 sm:mb-0">
                              <span className="relative flex h-3 w-3 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                              </span>
                              Location verified: {visitLocation ? `${visitLocation.lat.toFixed(4)}, ${visitLocation.lng.toFixed(4)}` : 'Yes'}
                            </span>
                            <span className="sm:ml-auto font-semibold">Click 'Complete Visit' when done.</span>
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
                  <span className="text-gray-500 mb-1">/ {doctors.length} Calls</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${doctors.length ? (visitedDoctors.length / doctors.length) * 100 : 0}%` }}></div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowConfirm(true)}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold shadow-md hover:bg-gray-800 transition-colors"
              >
                End Day (Final Submit)
              </button>
            </div>
          </>
        )}
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
