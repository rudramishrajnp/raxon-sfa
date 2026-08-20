import React, { useState, useEffect } from 'react';
import { MapPin, Building2, Phone, Map, Plus, Search, Edit2, Trash2, CheckCircle2, AlertTriangle, Shield, Lock, Home, ShoppingBag } from 'lucide-react';
import { getCompanyAreas, getChemistsList, saveChemistsList, Chemist } from '../data/masterData';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { getActiveUserContext, getUserPermissions, UserPermissions } from '../data/permissionSettings';
import { getActiveCompany } from '../data/companyContext';
import { useDataIsolation } from '../hooks/useDataIsolation';

export default function ChemistDirectory() {
  const { companyId } = useDataIsolation();
  const [company, setCompany] = useState(() => getActiveCompany());
  const companyAreas = getCompanyAreas(companyId);
  const [selectedArea, setSelectedArea] = useState<string | null>(() => companyAreas[0] || null);
  const [chemists, setChemists] = useState<Chemist[]>(() => getChemistsList(companyId));
  const [searchQuery, setSearchQuery] = useState('');

  // Current user permissions
  const [activeUser, setActiveUser] = useState(() => getActiveUserContext());
  const [permissions, setPermissions] = useState<UserPermissions>(() => {
    const ctx = getActiveUserContext();
    return getUserPermissions(ctx.id, ctx.role);
  });

  // Add & Edit Chemist Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingChemist, setEditingChemist] = useState<Chemist | null>(null);
  const [deletingChemist, setDeletingChemist] = useState<Chemist | null>(null);

  // Form Fields: name, contactPerson, address, subArea, phone, targetArea
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [address, setAddress] = useState('');
  const [subArea, setSubArea] = useState('');
  const [phone, setPhone] = useState('');
  const [targetArea, setTargetArea] = useState(() => companyAreas[0] || '');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const refreshData = () => {
      const activeC = getActiveCompany();
      setCompany(activeC);
      const areas = getCompanyAreas(activeC.id);
      setChemists(getChemistsList(activeC.id));
      setSelectedArea(areas[0] || null);
    };
    refreshData();
    window.addEventListener('raxon-company-changed', refreshData);
    window.addEventListener('raxon-company-switched', refreshData);
    window.addEventListener('raxon-chemists-updated', refreshData);
    return () => {
      window.removeEventListener('raxon-company-changed', refreshData);
      window.removeEventListener('raxon-company-switched', refreshData);
      window.removeEventListener('raxon-chemists-updated', refreshData);
    };
  }, [companyId]);

  // Listen for permission updates from System Admin
  useEffect(() => {
    const refreshPerms = () => {
      const ctx = getActiveUserContext();
      setActiveUser(ctx);
      setPermissions(getUserPermissions(ctx.id, ctx.role));
    };
    window.addEventListener('raxon-permissions-updated', refreshPerms);
    return () => window.removeEventListener('raxon-permissions-updated', refreshPerms);
  }, []);

  const handleAddChemist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newChemist: Chemist = {
      id: Date.now(),
      name: name.trim(),
      area: targetArea,
      subArea: subArea.trim() || 'Main Market',
      address: address.trim() || 'Main Commercial Market Shop',
      contactPerson: contactPerson.trim() || 'Proprietor',
      phone: phone.trim() || '+91 94150 12345'
    };

    const updated = [newChemist, ...chemists];
    setChemists(updated);
    saveChemistsList(updated, companyId);
    setSelectedArea(targetArea);

    setName('');
    setContactPerson('');
    setAddress('');
    setSubArea('');
    setPhone('');
    setShowAddModal(false);
    setNotification(`${name} successfully added to ${targetArea}!`);
  };

  const handleOpenEdit = (chemist: Chemist) => {
    if (!permissions.canEditChemist) {
      setNotification('Access Denied: You do not have permission to edit chemist details (Managed by System Admin).');
      return;
    }
    setEditingChemist(chemist);
    setName(chemist.name);
    setContactPerson(chemist.contactPerson);
    setAddress(chemist.address || '');
    setSubArea(chemist.subArea);
    setPhone(chemist.phone || '');
    setTargetArea(chemist.area);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissions.canEditChemist) {
      setNotification('Access Denied: Chemist edit permission disabled.');
      return;
    }
    if (!editingChemist || !name.trim()) return;

    const updated = chemists.map(c => {
      if (c.id === editingChemist.id) {
        return {
          ...c,
          name: name.trim(),
          contactPerson: contactPerson.trim(),
          address: address.trim() || 'Main Commercial Market Shop',
          subArea: subArea.trim() || 'Main Market',
          phone: phone.trim() || '+91 94150 12345',
          area: targetArea
        };
      }
      return c;
    });

    setChemists(updated);
    saveChemistsList(updated, companyId);
    setEditingChemist(null);
    setNotification(`Chemist "${name}" updated successfully!`);
  };

  const handleConfirmDelete = () => {
    if (!permissions.canDeleteChemist) {
      setNotification('Access Denied: You do not have permission to delete chemists from the directory.');
      setDeletingChemist(null);
      return;
    }
    if (!deletingChemist) return;
    const updated = chemists.filter(c => c.id !== deletingChemist.id);
    setChemists(updated);
    saveChemistsList(updated, companyId);
    setNotification(`${deletingChemist.name} removed from directory.`);
    setDeletingChemist(null);
  };

  const filteredChemists = chemists.filter(c => {
    const matchesArea = selectedArea 
      ? (c.area || '').trim().toLowerCase() === selectedArea.trim().toLowerCase()
      : true;
    const matchesSearch = searchQuery
      ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesArea && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
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
              <ShoppingBag className="w-7 h-7 text-emerald-600" />
              Chemist & Retailer Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {chemists.length} Chemists
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-50 text-purple-800 border border-purple-200">
              {company.name}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-2xs font-semibold flex items-center gap-1 border ${
              permissions.canEditChemist && permissions.canDeleteChemist
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : permissions.canEditChemist
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <Shield className="w-3 h-3" />
              {permissions.canEditChemist && permissions.canDeleteChemist
                ? 'Full Control'
                : permissions.canEditChemist
                ? 'Edit Only'
                : 'Read Only'}
            </span>
          </div>
          <p className="text-gray-600 text-xs mt-1 font-medium">
            Retail chemist network and POB order points for <strong className="text-emerald-900">{company.name}</strong>.
          </p>
        </div>
        <button
          onClick={() => {
            setName('');
            setContactPerson('');
            setAddress('');
            setSubArea('');
            setPhone('');
            setTargetArea(selectedArea || companyAreas[0] || '');
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Chemist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Territory Area Selector Sidebar */}
        <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 overflow-hidden h-fit">
          <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-gray-900 text-sm">
              <Map size={18} className="text-emerald-600" />
              <span>Areas ({companyAreas.length})</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {companyAreas.map(area => {
              const count = chemists.filter(c => (c.area || '').toLowerCase() === area.toLowerCase()).length;
              return (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-emerald-50/50 transition-colors text-sm ${selectedArea === area ? 'bg-emerald-50 font-bold text-emerald-700' : 'text-gray-700'}`}
                >
                  <span>{area}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${selectedArea === area ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chemists Grid */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-gray-900 text-base">Chemists in {selectedArea}</h2>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {filteredChemists.length}
                </span>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shop, address, pharmacist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs w-full sm:w-60 focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-gray-900 outline-none"
                />
              </div>
            </div>

            <div className="p-4">
              {filteredChemists.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">No chemists found in {selectedArea}.</p>
                  <button
                    onClick={() => {
                      setTargetArea(selectedArea || companyAreas[0] || '');
                      setShowAddModal(true);
                    }}
                    className="mt-3 inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add First Chemist to {selectedArea}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredChemists.map(chemist => (
                    <div key={chemist.id} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm border border-emerald-200">
                              <Building2 size={18} />
                            </div>
                            <div className="ml-3">
                              <h3 className="font-bold text-gray-900 text-sm">{chemist.name}</h3>
                              <p className="text-xs font-bold text-emerald-700">Prop: {chemist.contactPerson}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-700 space-y-1.5 font-medium">
                          {/* Address Display */}
                          {chemist.address && (
                            <div className="flex items-start bg-gray-50 p-2 rounded-lg border border-gray-100 text-xs text-gray-800">
                              <Home size={14} className="mr-1.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-snug">{chemist.address}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-2 text-gray-500 shrink-0" />
                            <span className="truncate font-semibold">{chemist.subArea} ({chemist.area})</span>
                          </div>
                          <div className="flex items-center">
                            <Phone size={14} className="mr-2 text-emerald-600 shrink-0" />
                            <span className="font-bold text-gray-900">{chemist.phone || '+91 94150 12345'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions: Edit & Delete */}
                      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-500 text-[11px] font-bold">{chemist.area}</span>
                        <div className="flex items-center space-x-1">
                          {permissions.canEditChemist ? (
                            <button 
                              onClick={() => handleOpenEdit(chemist)}
                              className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Edit Chemist Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span 
                              className="p-1.5 text-gray-300 cursor-not-allowed" 
                              title="Chemist editing disabled by System Admin"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}

                          {permissions.canDeleteChemist ? (
                            <button 
                              onClick={() => setDeletingChemist(chemist)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete Chemist"
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

      {/* --- ADD CHEMIST MODAL --- */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Chemist / Retailer">
        <form onSubmit={handleAddChemist} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-gray-900 mb-1">Medical Store / Firm Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Balaji Medical Store"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-900 mb-1">Contact Person / Pharmacist *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-900 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                placeholder="+91 94150 XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Address field */}
          <div>
            <label className="block font-bold text-gray-900 mb-1">Shop / Outlet Address *</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Shop No 12, Main Bazar Complex, Opposite Bus Stand"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-900 mb-1">Area *</label>
              <select
                value={targetArea}
                onChange={(e) => setTargetArea(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {companyAreas.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-900 mb-1">Sub-Area / Landmark *</label>
              <input
                type="text"
                required
                placeholder="e.g. Near Bus Stand, Main Market"
                value={subArea}
                onChange={(e) => setSubArea(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-xs"
            >
              Save Chemist
            </button>
          </div>
        </form>
      </Modal>

      {/* --- EDIT CHEMIST MODAL --- */}
      {editingChemist && (
        <Modal isOpen={!!editingChemist} onClose={() => setEditingChemist(null)} title={`Edit Chemist - ${editingChemist.name}`}>
          <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-gray-900 mb-1">Medical Store / Firm Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-900 mb-1">Contact Person / Pharmacist *</label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-900 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Address Field in Edit */}
            <div>
              <label className="block font-bold text-gray-900 mb-1">Shop / Outlet Address *</label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-900 mb-1">Area *</label>
                <select
                  value={targetArea}
                  onChange={(e) => setTargetArea(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {companyAreas.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-900 mb-1">Sub-Area / Landmark *</label>
                <input
                  type="text"
                  required
                  value={subArea}
                  onChange={(e) => setSubArea(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingChemist(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deletingChemist && (
        <ConfirmModal
          isOpen={!!deletingChemist}
          onClose={() => setDeletingChemist(null)}
          onConfirm={handleConfirmDelete}
          type="danger"
          title="Delete Chemist from Directory?"
          message={`Are you sure you want to remove ${deletingChemist.name} from the chemist directory?`}
          subMessage="Confirmation is required to prevent accidental removal. This action cannot be undone."
          itemName={`${deletingChemist.name} • Prop: ${deletingChemist.contactPerson} • ${deletingChemist.area} (${deletingChemist.subArea})`}
          confirmText="Yes, Remove from Directory"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
