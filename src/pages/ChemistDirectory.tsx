import React, { useState, useEffect } from 'react';
import { MapPin, Building2, Phone, Map, Plus, Search } from 'lucide-react';
import { AREAS, getChemistsList, saveChemistsList, Chemist } from '../data/masterData';
import { Modal } from '../components/Modal';

export default function ChemistDirectory() {
  const [selectedArea, setSelectedArea] = useState<string | null>("Iltifatganj");
  const [chemists, setChemists] = useState<Chemist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Chemist Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [subArea, setSubArea] = useState('');
  const [phone, setPhone] = useState('');
  const [targetArea, setTargetArea] = useState(AREAS[0]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    setChemists(getChemistsList());
  }, []);

  const handleAddChemist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newChemist: Chemist = {
      id: Date.now(),
      name: name.trim(),
      area: targetArea,
      subArea: subArea.trim() || 'Main Market',
      contactPerson: contactPerson.trim() || 'Owner',
      phone: phone.trim() || '+91 XXXXX XXXXX'
    };

    const updated = [newChemist, ...chemists];
    setChemists(updated);
    saveChemistsList(updated);
    setSelectedArea(targetArea);

    setName('');
    setContactPerson('');
    setSubArea('');
    setPhone('');
    setShowAddModal(false);
    setNotification(`${name} successfully added to ${targetArea}!`);
  };

  const filteredChemists = chemists.filter(c => {
    const matchesArea = selectedArea 
      ? (c.area || '').trim().toLowerCase() === selectedArea.trim().toLowerCase()
      : true;
    const matchesSearch = searchQuery
      ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subArea.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesArea && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Notification */}
      <Modal isOpen={!!notification} onClose={() => setNotification('')} title="Success">
        <p className="text-gray-800 mb-6">{notification}</p>
        <div className="flex justify-end">
          <button onClick={() => setNotification('')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">OK</button>
        </div>
      </Modal>

      {/* Add Chemist Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Chemist / Retailer">
        <form onSubmit={handleAddChemist} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Medical Store / Agency Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Balaji Medical Store"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Area / Patch *</label>
              <select
                value={targetArea}
                onChange={(e) => setTargetArea(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
              >
                {AREAS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Rajesh Gupta"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sub-Area / Locality</label>
              <input
                type="text"
                placeholder="e.g. Near Bus Stand, Main Road"
                value={subArea}
                onChange={(e) => setSubArea(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone / Mobile</label>
              <input
                type="text"
                placeholder="+91 98390 XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-xs"
            >
              Save Chemist
            </button>
          </div>
        </form>
      </Modal>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chemist Directory</h1>
          <p className="text-gray-500">Manage chemist and pharmacy retailers by Patch/Area</p>
        </div>
        <button
          onClick={() => {
            setTargetArea(selectedArea || AREAS[0]);
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Chemist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Areas List */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-emerald-50/70">
            <h2 className="font-bold text-emerald-900 flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-emerald-600" />
              Select Area (Patch)
            </h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {AREAS.map(area => {
              const count = chemists.filter(c => (c.area || '').trim().toLowerCase() === area.trim().toLowerCase()).length;
              return (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-emerald-50/50 transition-colors text-sm ${selectedArea === area ? 'bg-emerald-50 font-bold text-emerald-700' : 'text-gray-700'}`}
                >
                  <span>{area}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${selectedArea === area ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chemists List */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-gray-900 text-base">Chemists in {selectedArea}</h2>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {filteredChemists.length} Chemists
                </span>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by shop name, contact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs w-full sm:w-60 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-4">
              {filteredChemists.length === 0 ? (
                <div className="text-center py-10">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">No chemists found in {selectedArea}.</p>
                  <button
                    onClick={() => {
                      setTargetArea(selectedArea || AREAS[0]);
                      setShowAddModal(true);
                    }}
                    className="mt-3 inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add First Chemist to {selectedArea}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredChemists.map(chemist => (
                    <div key={chemist.id} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-2xs transition-all bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                              <Building2 size={20} />
                            </div>
                            <div className="ml-3">
                              <h3 className="font-bold text-gray-900 text-sm">{chemist.name}</h3>
                              <p className="text-xs font-medium text-emerald-600">Prop: {chemist.contactPerson}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3.5 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1.5">
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{chemist.subArea}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                            <span>{chemist.phone || '+91 XXXXX XXXXX'}</span>
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
