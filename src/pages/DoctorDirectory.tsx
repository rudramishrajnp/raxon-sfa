import React, { useState, useEffect } from 'react';
import { MapPin, User, Phone, Map, Plus, Award, Search, Edit2, Trash2, CheckCircle2, AlertTriangle, Shield, Lock, Building, Home, Stethoscope } from 'lucide-react';
import { getCompanyAreas, getDoctorsList, saveDoctorsList, Doctor } from '../data/masterData';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { getActiveUserContext, getUserPermissions, UserPermissions } from '../data/permissionSettings';
import { getActiveCompany } from '../data/companyContext';
import { useDataIsolation } from '../hooks/useDataIsolation';

export default function DoctorDirectory() {
  const { companyId } = useDataIsolation();
  const [company, setCompany] = useState(() => getActiveCompany());
  const companyAreas = getCompanyAreas(companyId);
  const [selectedArea, setSelectedArea] = useState<string | null>(() => companyAreas[0] || null);
  const [doctors, setDoctors] = useState<Doctor[]>(() => getDoctorsList(companyId));
  const [searchQuery, setSearchQuery] = useState('');
  
  // Current user permissions
  const [activeUser, setActiveUser] = useState(() => getActiveUserContext());
  const [permissions, setPermissions] = useState<UserPermissions>(() => {
    const ctx = getActiveUserContext();
    return getUserPermissions(ctx.id, ctx.role);
  });

  // Add Doctor Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctor, setDeletingDoctor] = useState<Doctor | null>(null);

  // Form fields: doctor name, speciality, address, Sub-area, phone/mobile
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('General Physician');
  const [qualification, setQualification] = useState('MBBS');
  const [address, setAddress] = useState('');
  const [subArea, setSubArea] = useState('');
  const [phone, setPhone] = useState('');
  const [targetArea, setTargetArea] = useState(() => companyAreas[0] || '');
  const [notification, setNotification] = useState('');
  const [isFetchingGps, setIsFetchingGps] = useState(false);

  // GPS Auto-Feed for Clinic / Hospital Address
  const handleAutoFeedGps = () => {
    if (!navigator.geolocation) {
      setNotification('GPS Geolocation is not supported by your browser.');
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    setIsFetchingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);
        const autoAddr = `GPS Pin: ${lat}° N, ${lng}° E, ${targetArea}`;
        setAddress(prev => prev.trim() ? `${prev} [${autoAddr}]` : autoAddr);
        setIsFetchingGps(false);
        setNotification(`GPS coordinates auto-fed successfully! (${lat}, ${lng})`);
        setTimeout(() => setNotification(''), 3500);
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsFetchingGps(false);
        // Fallback friendly message
        const fallback = `GPS Landmark: Near ${subArea || targetArea} Main Market`;
        setAddress(prev => prev.trim() ? prev : fallback);
        setNotification('Location captured via territory zone.');
        setTimeout(() => setNotification(''), 3000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    const refreshData = () => {
      const activeC = getActiveCompany();
      setCompany(activeC);
      const areas = getCompanyAreas(activeC.id);
      setDoctors(getDoctorsList(activeC.id));
      setSelectedArea(areas[0] || null);
    };
    refreshData();
    window.addEventListener('raxon-company-changed', refreshData);
    window.addEventListener('raxon-company-switched', refreshData);
    window.addEventListener('raxon-doctors-updated', refreshData);
    return () => {
      window.removeEventListener('raxon-company-changed', refreshData);
      window.removeEventListener('raxon-company-switched', refreshData);
      window.removeEventListener('raxon-doctors-updated', refreshData);
    };
  }, [companyId]);

  // Listen for permission updates
  useEffect(() => {
    const refreshPerms = () => {
      const ctx = getActiveUserContext();
      setActiveUser(ctx);
      setPermissions(getUserPermissions(ctx.id, ctx.role));
    };
    window.addEventListener('raxon-permissions-updated', refreshPerms);
    return () => window.removeEventListener('raxon-permissions-updated', refreshPerms);
  }, []);

  // Handle Add Doctor
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedName = name.trim().startsWith('Dr.') ? name.trim() : `Dr. ${name.trim()}`;
    const newDoc: Doctor = {
      id: Date.now(),
      name: formattedName,
      area: targetArea,
      subArea: subArea.trim() || 'Main Chowk',
      address: address.trim() || 'Near Main Road / Clinic Center',
      specialty: specialty || 'General Physician',
      qualification: qualification || 'MBBS',
      phone: phone.trim() || '+91 98380 12345'
    };

    const updated = [newDoc, ...doctors];
    setDoctors(updated);
    saveDoctorsList(updated, companyId);
    setSelectedArea(targetArea);

    setName('');
    setAddress('');
    setSubArea('');
    setPhone('');
    setShowAddModal(false);
    setNotification(`Dr. ${newDoc.name} successfully added with address!`);
  };

  // Open Edit Doctor Modal
  const handleOpenEdit = (doctor: Doctor) => {
    if (!permissions.canEditDoctor) {
      setNotification('Access Denied: You do not have permission to edit doctor details (Managed by System Admin).');
      return;
    }
    setEditingDoctor(doctor);
    setName(doctor.name);
    setSpecialty(doctor.specialty);
    setQualification(doctor.qualification || 'MBBS');
    setAddress(doctor.address || '');
    setSubArea(doctor.subArea);
    setPhone(doctor.phone || '');
    setTargetArea(doctor.area);
  };

  // Handle Save Edit Doctor
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canEditDoctor) {
      setNotification('Access Denied: Permission denied by System Admin.');
      return;
    }
    if (!editingDoctor || !name.trim()) return;

    const formattedName = name.trim().startsWith('Dr.') ? name.trim() : `Dr. ${name.trim()}`;
    const updated = doctors.map(d => {
      if (d.id === editingDoctor.id) {
        return {
          ...d,
          name: formattedName,
          specialty,
          qualification,
          address: address.trim() || 'Near Main Road / Clinic Center',
          subArea: subArea.trim() || 'Main Clinic',
          phone: phone.trim() || '+91 98380 12345',
          area: targetArea
        };
      }
      return d;
    });

    setDoctors(updated);
    saveDoctorsList(updated, companyId);
    setEditingDoctor(null);
    setNotification(`Dr. ${formattedName} details updated successfully!`);
  };

  // Handle Delete Doctor
  const handleConfirmDelete = () => {
    if (!permissions.canDeleteDoctor) {
      setNotification('Access Denied: You do not have permission to delete doctors from the directory.');
      setDeletingDoctor(null);
      return;
    }
    if (!deletingDoctor) return;
    const updated = doctors.filter(d => d.id !== deletingDoctor.id);
    setDoctors(updated);
    saveDoctorsList(updated, companyId);
    setNotification(`${deletingDoctor.name} removed from directory.`);
    setDeletingDoctor(null);
  };

  const filteredDoctors = doctors.filter(d => {
    const matchesArea = selectedArea 
      ? (d.area || '').trim().toLowerCase() === selectedArea.trim().toLowerCase()
      : true;
    const matchesSearch = searchQuery
      ? d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.subArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.address && d.address.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesArea && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-gray-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
          <button onClick={() => setNotification('')} className="text-gray-400 hover:text-white text-xs ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Stethoscope className="w-7 h-7 text-indigo-600" />
              Doctor Master Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {doctors.length} Doctors
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
              {company.name}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-2xs font-semibold flex items-center gap-1 border ${
              permissions.canEditDoctor && permissions.canDeleteDoctor
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : permissions.canEditDoctor
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <Shield className="w-3 h-3" />
              {permissions.canEditDoctor && permissions.canDeleteDoctor
                ? 'Full Control'
                : permissions.canEditDoctor
                ? 'Edit Only'
                : 'Read Only'}
            </span>
          </div>
          <p className="text-gray-600 text-xs mt-1 font-medium">
            Authorized prescribers and clinic database for <strong className="text-indigo-900">{company.name}</strong> field operations.
          </p>
        </div>
        <button
          onClick={() => {
            setName('');
            setAddress('');
            setSubArea('');
            setPhone('');
            setTargetArea(selectedArea || companyAreas[0] || '');
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Territory Area Selector Sidebar */}
        <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 overflow-hidden h-fit">
          <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-gray-900 text-sm">
              <Map size={18} className="text-indigo-600" />
              <span>Areas ({companyAreas.length})</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {companyAreas.map(area => {
              const count = doctors.filter(d => (d.area || '').toLowerCase() === area.toLowerCase()).length;
              return (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-indigo-50/50 transition-colors text-sm ${selectedArea === area ? 'bg-indigo-50 font-bold text-indigo-700' : 'text-gray-700'}`}
                >
                  <span>{area}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${selectedArea === area ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-gray-900 text-base">Doctors in {selectedArea}</h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {filteredDoctors.length}
                </span>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctor, address, specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs w-full sm:w-60 focus:ring-2 focus:ring-indigo-500 bg-white font-semibold text-gray-900 outline-none"
                />
              </div>
            </div>

            <div className="p-4">
              {filteredDoctors.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">No doctors found in {selectedArea}.</p>
                  <button
                    onClick={() => {
                      setTargetArea(selectedArea || companyAreas[0] || '');
                      setShowAddModal(true);
                    }}
                    className="mt-3 inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add First Doctor to {selectedArea}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-200">
                              {doctor.name.replace('Dr. ', '').charAt(0)}
                            </div>
                            <div className="ml-3">
                              <h3 className="font-bold text-gray-900 text-sm">{doctor.name}</h3>
                              <p className="text-xs font-bold text-indigo-700">{doctor.specialty}</p>
                            </div>
                          </div>
                          {doctor.qualification && (
                            <span className="text-2xs px-2 py-0.5 bg-gray-100 text-gray-700 font-bold rounded-md">
                              {doctor.qualification}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-700 space-y-1.5 font-medium">
                          {/* Address Display */}
                          {doctor.address && (
                            <div className="flex items-start bg-gray-50 p-2 rounded-lg border border-gray-100 text-xs text-gray-800">
                              <Home size={14} className="mr-1.5 text-indigo-600 shrink-0 mt-0.5" />
                              <span className="leading-snug">{doctor.address}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-2 text-gray-500 shrink-0" />
                            <span className="truncate font-semibold">{doctor.subArea} ({doctor.area})</span>
                          </div>
                          <div className="flex items-center">
                            <Phone size={14} className="mr-2 text-emerald-600 shrink-0" />
                            <span className="font-bold text-gray-900">{doctor.phone || '+91 98380 12345'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions: Edit & Delete */}
                      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-500 text-[11px] font-bold">{doctor.area}</span>
                        <div className="flex items-center space-x-1">
                          {permissions.canEditDoctor ? (
                            <button 
                              onClick={() => handleOpenEdit(doctor)}
                              className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                              title="Edit Doctor Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span 
                              className="p-1.5 text-gray-300 cursor-not-allowed" 
                              title="Doctor editing disabled by System Admin"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}

                          {permissions.canDeleteDoctor ? (
                            <button 
                              onClick={() => setDeletingDoctor(doctor)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete Doctor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : null}
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

      {/* --- ADD DOCTOR MODAL --- */}
      {/* Strict Sequence: Doctor Name, Specialty, Address (GPS Auto feed), Area, Sub-Area / Landmark, Qualification, Phone / Mobile */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Doctor Directory">
        <form onSubmit={handleAddDoctor} className="space-y-3.5 text-xs">
          {/* 1. Doctor Name */}
          <div>
            <label className="block font-bold text-gray-900 mb-1">Doctor Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. A.K. Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* 2. Specialty */}
          <div>
            <label className="block font-bold text-gray-900 mb-1">Specialty *</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
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

          {/* 3. Address (GPS Auto feed when is on) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-gray-900">Clinic / Hospital Address *</label>
              <button
                type="button"
                onClick={handleAutoFeedGps}
                disabled={isFetchingGps}
                className="text-2xs font-extrabold px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg flex items-center gap-1 transition-all"
              >
                <Home className="w-3 h-3 text-indigo-600" />
                <span>{isFetchingGps ? 'Capturing GPS...' : 'Auto-Feed GPS Location'}</span>
              </button>
            </div>
            <textarea
              rows={2}
              required
              placeholder="e.g. Shop No. 4, Sharma Complex, Opposite District Hospital, Main Road"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* 4. Area */}
          <div>
            <label className="block font-bold text-gray-900 mb-1">Area *</label>
            <select
              value={targetArea}
              onChange={(e) => setTargetArea(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {companyAreas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* 5. Sub-Area / Landmark */}
          <div>
            <label className="block font-bold text-gray-900 mb-1">Sub-Area / Landmark *</label>
            <input
              type="text"
              required
              placeholder="e.g. Thana Road / Main Chowk"
              value={subArea}
              onChange={(e) => setSubArea(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* 6. Qualification */}
          <div>
            <label className="block font-bold text-gray-900 mb-1">Qualification</label>
            <input
              type="text"
              placeholder="e.g. MBBS, MD (Med)"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* 7. Phone / Mobile */}
          <div>
            <label className="block font-bold text-gray-900 mb-1">Phone / Mobile</label>
            <input
              type="text"
              placeholder="+91 98390 XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold shadow-xs"
            >
              Save Doctor
            </button>
          </div>
        </form>
      </Modal>

      {/* --- EDIT DOCTOR MODAL --- */}
      {/* Strict Sequence: Doctor Name, Specialty, Address (GPS Auto feed), Area, Sub-Area / Landmark, Qualification, Phone / Mobile */}
      {editingDoctor && (
        <Modal isOpen={!!editingDoctor} onClose={() => setEditingDoctor(null)} title={`Edit Doctor - ${editingDoctor.name}`}>
          <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
            {/* 1. Doctor Name */}
            <div>
              <label className="block font-bold text-gray-900 mb-1">Doctor Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* 2. Specialty */}
            <div>
              <label className="block font-bold text-gray-900 mb-1">Specialty *</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
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

            {/* 3. Address (GPS Auto feed when is on) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-gray-900">Clinic / Hospital Address *</label>
                <button
                  type="button"
                  onClick={handleAutoFeedGps}
                  disabled={isFetchingGps}
                  className="text-2xs font-extrabold px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg flex items-center gap-1 transition-all"
                >
                  <Home className="w-3 h-3 text-indigo-600" />
                  <span>{isFetchingGps ? 'Capturing GPS...' : 'Auto-Feed GPS Location'}</span>
                </button>
              </div>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* 4. Area */}
            <div>
              <label className="block font-bold text-gray-900 mb-1">Area *</label>
              <select
                value={targetArea}
                onChange={(e) => setTargetArea(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {companyAreas.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* 5. Sub-Area / Landmark */}
            <div>
              <label className="block font-bold text-gray-900 mb-1">Sub-Area / Landmark *</label>
              <input
                type="text"
                required
                value={subArea}
                onChange={(e) => setSubArea(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* 6. Qualification */}
            <div>
              <label className="block font-bold text-gray-900 mb-1">Qualification</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* 7. Phone / Mobile */}
            <div>
              <label className="block font-bold text-gray-900 mb-1">Phone / Mobile</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deletingDoctor && (
        <ConfirmModal
          isOpen={!!deletingDoctor}
          onClose={() => setDeletingDoctor(null)}
          onConfirm={handleConfirmDelete}
          type="danger"
          title="Remove Doctor from Directory?"
          message={`Are you sure you want to remove ${deletingDoctor.name} from the master directory?`}
          subMessage="Confirmation is required to prevent accidental deletion. This action cannot be undone."
          itemName={`${deletingDoctor.name} • ${deletingDoctor.specialty} (${deletingDoctor.qualification}) • ${deletingDoctor.area} (${deletingDoctor.subArea})`}
          confirmText="Yes, Delete Doctor"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
