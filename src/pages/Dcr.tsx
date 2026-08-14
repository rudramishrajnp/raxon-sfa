import React, { useState, useEffect } from 'react';
import { Map, MapPin, CheckCircle, Clock, AlertCircle, Plus, Phone, Award, User, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { Geolocation } from '@capacitor/geolocation';
import { getMTP, saveDCRCheckIn, getDCR } from '../lib/api';
import { Modal } from '../components/Modal';
import { getDoctorsList, saveDoctorsList, getChemistsList, Doctor, Chemist } from '../data/masterData';

export default function Dcr() {
  const [plannedArea, setPlannedArea] = useState<string | null>(null);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [allChemists, setAllChemists] = useState<Chemist[]>([]);
  const [visitedDoctors, setVisitedDoctors] = useState<number[]>([]);
  const [activeCheckIn, setActiveCheckIn] = useState<number | null>(null);
  const [visitLocation, setVisitLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');

  // Add doctor modal in DCR
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('General Physician');
  const [newDocSubArea, setNewDocSubArea] = useState('');
  const [newDocPhone, setNewDocPhone] = useState('');

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const monthYear = format(new Date(), 'yyyy-MM');

  useEffect(() => {
    // Load master doctors and chemists
    setAllDoctors(getDoctorsList());
    setAllChemists(getChemistsList());

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

  // Robust matching: trim and case-insensitive
  const normalizedPlannedArea = (plannedArea || '').trim().toLowerCase();
  
  const doctors = allDoctors.filter(d => 
    (d.area || '').trim().toLowerCase() === normalizedPlannedArea
  );

  const chemists = allChemists.filter(c => 
    (c.area || '').trim().toLowerCase() === normalizedPlannedArea
  );

  const handleAddNewDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !plannedArea) return;

    const newDoc: Doctor = {
      id: Date.now(),
      name: newDocName.trim().startsWith('Dr.') ? newDocName.trim() : `Dr. ${newDocName.trim()}`,
      area: plannedArea,
      subArea: newDocSubArea.trim() || 'Main Market',
      specialty: newDocSpecialty || 'General Physician',
      phone: newDocPhone.trim() || '+91 XXXXX XXXXX',
      qualification: 'MBBS'
    };

    const updated = [newDoc, ...allDoctors];
    setAllDoctors(updated);
    saveDoctorsList(updated);

    setNewDocName('');
    setNewDocSubArea('');
    setNewDocPhone('');
    setShowAddDoctor(false);
    setMessage(`Successfully added ${newDoc.name} to ${plannedArea}!`);
  };

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
      {/* Modal to Add New Doctor */}
      <Modal isOpen={showAddDoctor} onClose={() => setShowAddDoctor(false)} title={`Add Doctor to ${plannedArea}`}>
        <form onSubmit={handleAddNewDoctor} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Doctor Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. R.K. Sharma"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Specialty</label>
              <select
                value={newDocSpecialty}
                onChange={(e) => setNewDocSpecialty(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sub-Area / Locality</label>
              <input
                type="text"
                placeholder="e.g. Main Market, Chauraha"
                value={newDocSubArea}
                onChange={(e) => setNewDocSubArea(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone / Mobile</label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={newDocPhone}
              onChange={(e) => setNewDocPhone(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setShowAddDoctor(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-xs"
            >
              Save Doctor
            </button>
          </div>
        </form>
      </Modal>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Call Report (DCR)</h1>
          <p className="text-gray-500">{format(new Date(), 'EEEE, dd MMMM yyyy')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planned Area Info */}
        <div className="bg-indigo-50 rounded-xl shadow-xs border border-indigo-100 p-6 lg:col-span-3">
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
            {plannedArea && (
              <div className="mt-4 sm:mt-0 flex gap-2">
                <button
                  onClick={() => setShowAddDoctor(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm flex items-center shadow-xs"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add Doctor
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Doctor List */}
        {plannedArea && (
          <>
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <User className="mr-2 h-5 w-5 text-indigo-600" />
                    Doctors in {plannedArea} ({doctors.length})
                  </h3>
                  <button
                    onClick={() => setShowAddDoctor(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add New
                  </button>
                </div>
                
                <div className="space-y-3">
                  {doctors.length === 0 && (
                    <div className="bg-white p-8 rounded-xl text-center border border-gray-200 shadow-xs">
                      <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-700 font-semibold mb-1">No doctors listed in {plannedArea} yet.</p>
                      <p className="text-xs text-gray-500 mb-4">You can add doctors to this patch to begin logging check-ins.</p>
                      <button
                        onClick={() => setShowAddDoctor(true)}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700"
                      >
                        + Add Doctor to {plannedArea}
                      </button>
                    </div>
                  )}
                  {doctors.map(doctor => {
                    const isVisited = visitedDoctors.includes(doctor.id);
                    const isCheckingIn = activeCheckIn === doctor.id;
                    const isCheckingLocationForThis = isGettingLocation && activeCheckIn === null;

                    return (
                      <div key={doctor.id} className={`bg-white rounded-xl shadow-xs border ${isVisited ? 'border-green-200 bg-green-50/20' : isCheckingIn ? 'border-amber-400 ring-2 ring-amber-200' : 'border-gray-200 hover:border-indigo-300'} p-4 transition-all`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-gray-900 text-base">{doctor.name}</h4>
                              {doctor.qualification && (
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">
                                  {doctor.qualification}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-indigo-700 font-semibold mt-0.5">{doctor.specialty}</p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1.5">
                              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" /> {doctor.subArea}</span>
                              {doctor.phone && (
                                <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-gray-400" /> {doctor.phone}</span>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            {isVisited ? (
                              <span className="inline-flex items-center text-green-700 bg-green-100 border border-green-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
                                <CheckCircle className="w-4 h-4 mr-1.5 text-green-600" /> Call Done
                              </span>
                            ) : isCheckingIn ? (
                              <button 
                                onClick={() => handleCheckOut(doctor.id)}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-xs transition-colors flex items-center"
                              >
                                <Clock className="w-4 h-4 mr-1.5" /> Complete Call
                              </button>
                            ) : (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleCheckIn(doctor.id)}
                                  disabled={activeCheckIn !== null || isGettingLocation}
                                  className={`px-4 py-2 rounded-lg font-semibold text-sm shadow-xs transition-colors flex items-center ${
                                    activeCheckIn !== null || isGettingLocation ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                  }`}
                                >
                                  {isCheckingLocationForThis ? (
                                    <>
                                      <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-3.5 h-3.5"></span>
                                      Locating...
                                    </>
                                  ) : (
                                    <>
                                      <MapPin className="w-4 h-4 mr-1.5" /> Check-in
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Checking In State expansion */}
                        {isCheckingIn && (
                          <div className="mt-3 pt-3 border-t border-amber-200 bg-amber-50/80 rounded-lg p-2.5 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="flex items-center font-medium">
                              <span className="relative flex h-2.5 w-2.5 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                              </span>
                              GPS Verified: {visitLocation ? `${visitLocation.lat.toFixed(4)}, ${visitLocation.lng.toFixed(4)}` : 'Active'}
                            </span>
                            <span className="font-semibold text-amber-800">Visit in progress. Click 'Complete Call' after discussion.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chemist patch display */}
              {chemists.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <h3 className="text-base font-bold text-gray-900 flex items-center">
                    <Building2 className="mr-2 h-4 w-4 text-emerald-600" />
                    Chemists / Retailers in {plannedArea} ({chemists.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {chemists.map(chemist => (
                      <div key={chemist.id} className="bg-white p-3 rounded-lg border border-gray-200 text-xs space-y-1 shadow-2xs">
                        <div className="font-bold text-gray-900">{chemist.name}</div>
                        <div className="text-gray-500">Contact: {chemist.contactPerson}</div>
                        <div className="text-gray-400 flex items-center"><MapPin className="w-3 h-3 mr-1" /> {chemist.subArea}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
