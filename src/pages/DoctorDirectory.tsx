import React, { useState, useEffect } from 'react';
import { MapPin, User, Phone, Map, Plus, Award, Search } from 'lucide-react';
import { AREAS, getDoctorsList, saveDoctorsList, Doctor } from '../data/masterData';
import { Modal } from '../components/Modal';

export default function DoctorDirectory() {
  const [selectedArea, setSelectedArea] = useState<string | null>("Iltifatganj");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Doctor Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('General Physician');
  const [qualification, setQualification] = useState('MBBS');
  const [subArea, setSubArea] = useState('');
  const [phone, setPhone] = useState('');
  const [targetArea, setTargetArea] = useState(AREAS[0]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    setDoctors(getDoctorsList());
  }, []);

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDoc: Doctor = {
      id: Date.now(),
      name: name.trim().startsWith('Dr.') ? name.trim() : `Dr. ${name.trim()}`,
      area: targetArea,
      subArea: subArea.trim() || 'Main Bazar',
      specialty: specialty || 'General Physician',
      qualification: qualification || 'MBBS',
      phone: phone.trim() || '+91 XXXXX XXXXX'
    };

    const updated = [newDoc, ...doctors];
    setDoctors(updated);
    saveDoctorsList(updated);
    setSelectedArea(targetArea);

    setName('');
    setSubArea('');
    setPhone('');
    setShowAddModal(false);
    setNotification(`Dr. ${name} successfully added to ${targetArea}!`);
  };

  const filteredDoctors = doctors.filter(d => {
    const matchesArea = selectedArea 
      ? (d.area || '').trim().toLowerCase() === selectedArea.trim().toLowerCase()
      : true;
    const matchesSearch = searchQuery
      ? d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.subArea.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesArea && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Notification */}
      <Modal isOpen={!!notification} onClose={() => setNotification('')} title="Success">
        <p className="text-gray-800 mb-6">{notification}</p>
        <div className="flex justify-end">
          <button onClick={() => setNotification('')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">OK</button>
        </div>
      </Modal>

      {/* Add Doctor Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Doctor to Patch Master">
        <form onSubmit={handleAddDoctor} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Doctor Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. A.K. Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Area / Patch *</label>
              <select
                value={targetArea}
                onChange={(e) => setTargetArea(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
              >
                {AREAS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Specialty</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
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
                <option value="ENT Specialist">ENT Specialist</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Qualification</label>
              <input
                type="text"
                placeholder="e.g. MBBS, MD"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sub-Area / Landmark</label>
              <input
                type="text"
                placeholder="e.g. Near Thana, Main Chowk"
                value={subArea}
                onChange={(e) => setSubArea(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone / Mobile</label>
            <input
              type="text"
              placeholder="+91 98390 XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Directory</h1>
          <p className="text-gray-500">Manage doctors by Patch/Area and add new doctors</p>
        </div>
        <button
          onClick={() => {
            setTargetArea(selectedArea || AREAS[0]);
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Areas List */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-indigo-50/70">
            <h2 className="font-bold text-indigo-900 flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-indigo-600" />
              Select Area (Patch)
            </h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {AREAS.map(area => {
              const count = doctors.filter(d => (d.area || '').trim().toLowerCase() === area.trim().toLowerCase()).length;
              return (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-indigo-50/50 transition-colors text-sm ${selectedArea === area ? 'bg-indigo-50 font-bold text-indigo-700' : 'text-gray-700'}`}
                >
                  <span>{area}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${selectedArea === area ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctors List */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-gray-900 text-base">Doctors in {selectedArea}</h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {filteredDoctors.length} Doctors
                </span>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by doctor, specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs w-full sm:w-60 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="p-4">
              {filteredDoctors.length === 0 ? (
                <div className="text-center py-10">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">No doctors found in {selectedArea}.</p>
                  <button
                    onClick={() => {
                      setTargetArea(selectedArea || AREAS[0]);
                      setShowAddModal(true);
                    }}
                    className="mt-3 inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add First Doctor to {selectedArea}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-2xs transition-all bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                              {doctor.name.replace('Dr. ', '').charAt(0)}
                            </div>
                            <div className="ml-3">
                              <h3 className="font-bold text-gray-900 text-sm">{doctor.name}</h3>
                              <p className="text-xs font-medium text-indigo-600">{doctor.specialty}</p>
                            </div>
                          </div>
                          {doctor.qualification && (
                            <span className="text-2xs px-2 py-0.5 bg-gray-100 text-gray-600 font-medium rounded">
                              {doctor.qualification}
                            </span>
                          )}
                        </div>

                        <div className="mt-3.5 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1.5">
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{doctor.subArea}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                            <span>{doctor.phone || '+91 XXXXX XXXXX'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
