import { getActiveCompanyId, getActiveCompany } from '../data/companyContext';
import { getLoggedInUser } from '../data/userContext';
import React, { useState, useEffect } from 'react';
import { 
  Map, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Download, 
  FileSpreadsheet, 
  AlertTriangle,
  Building,
  Layers,
  MapPin,
  Users
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { ManagerHierarchyManagement } from '../components/ManagerHierarchyManagement';

// Initial Hierarchy Generators Per Company
function getInitialHierarchyForCompany(_companyId?: string) {
  return {
    divisions: [
      { id: 'DIV-01', name: 'General Medicine', head: 'Rajiv Sharma', regionsCount: 5, status: 'Active' },
      { id: 'DIV-02', name: 'Cardio-Diabetic', head: 'Dr. Anita Desai', regionsCount: 4, status: 'Active' },
      { id: 'DIV-03', name: 'Dermatology', head: 'Vikram Singh', regionsCount: 3, status: 'Active' },
    ],
    regions: [
      { id: 'REG-01', name: 'Uttar Pradesh East', division: 'General Medicine', head: 'R.K. Tiwari (RM)', areasCount: 8, status: 'Active' },
      { id: 'REG-02', name: 'Uttar Pradesh West', division: 'General Medicine', head: 'Sanjay Verma (RM)', areasCount: 6, status: 'Active' },
      { id: 'REG-03', name: 'Bihar', division: 'General Medicine', head: 'Amit Kumar (RM)', areasCount: 7, status: 'Active' },
      { id: 'REG-04', name: 'Delhi NCR', division: 'Cardio-Diabetic', head: 'Neha Gupta (RM)', areasCount: 5, status: 'Active' },
    ],
    areas: [
      { id: 'HQ-01', name: 'Lucknow HQ', region: 'Uttar Pradesh East', head: 'Rahul Sharma (AM)', patchesCount: 12, status: 'Active' },
      { id: 'HQ-02', name: 'Varanasi HQ', region: 'Uttar Pradesh East', head: 'Anand Prakash (AM)', patchesCount: 10, status: 'Active' },
      { id: 'HQ-03', name: 'Gorakhpur HQ', region: 'Uttar Pradesh East', head: 'Vivek Singh (AM)', patchesCount: 8, status: 'Active' },
      { id: 'HQ-04', name: 'Kanpur HQ', region: 'Uttar Pradesh West', head: 'Priyanka Patel (AM)', patchesCount: 14, status: 'Active' },
    ],
    patches: [
      { id: 'PT-01', name: 'Iltifatganj', area: 'Lucknow HQ', assignedMR: 'Pradeep Mishra', doctorsCount: 4, status: 'Active' },
      { id: 'PT-02', name: 'Akbarpur 1', area: 'Lucknow HQ', assignedMR: 'Pradeep Mishra', doctorsCount: 6, status: 'Active' },
      { id: 'PT-03', name: 'Shahzadpur', area: 'Lucknow HQ', assignedMR: 'Pradeep Mishra', doctorsCount: 4, status: 'Active' },
      { id: 'PT-04', name: 'Gomti Nagar', area: 'Lucknow HQ', assignedMR: 'Sumit Verma', doctorsCount: 12, status: 'Active' },
      { id: 'PT-05', name: 'Alambagh', area: 'Lucknow HQ', assignedMR: 'Amit Singh', doctorsCount: 9, status: 'Active' },
    ]
  };
}

export default function OrganizationStructure() {
  const activeCompanyId = getActiveCompanyId();
  const [activeTab, setActiveTab] = useState<'Divisions' | 'Regions' | 'Areas' | 'Patches' | 'Manager Hierarchy'>('Areas');
  const [searchQuery, setSearchQuery] = useState('');
  
  const initData = getInitialHierarchyForCompany(activeCompanyId);

  // State for all 4 hierarchy tiers
  const [divisions, setDivisions] = useState(() => {
    try {
      const saved = localStorage.getItem(`raxon_org_divisions_${activeCompanyId}`);
      return saved ? JSON.parse(saved) : initData.divisions;
    } catch { return initData.divisions; }
  });

  const [regions, setRegions] = useState(() => {
    try {
      const saved = localStorage.getItem(`raxon_org_regions_${activeCompanyId}`);
      return saved ? JSON.parse(saved) : initData.regions;
    } catch { return initData.regions; }
  });

  const [areas, setAreas] = useState(() => {
    try {
      const saved = localStorage.getItem(`raxon_org_areas_${activeCompanyId}`);
      return saved ? JSON.parse(saved) : initData.areas;
    } catch { return initData.areas; }
  });

  const [patches, setPatches] = useState(() => {
    try {
      const saved = localStorage.getItem(`raxon_org_patches_${activeCompanyId}`);
      return saved ? JSON.parse(saved) : initData.patches;
    } catch { return initData.patches; }
  });

  // Re-sync when company switches
  useEffect(() => {
    const handleCompanySwitch = () => {
      const cId = getActiveCompanyId();
      const freshData = getInitialHierarchyForCompany(cId);
      try {
        const savedDiv = localStorage.getItem(`raxon_org_divisions_${cId}`);
        setDivisions(savedDiv ? JSON.parse(savedDiv) : freshData.divisions);
        const savedReg = localStorage.getItem(`raxon_org_regions_${cId}`);
        setRegions(savedReg ? JSON.parse(savedReg) : freshData.regions);
        const savedAreas = localStorage.getItem(`raxon_org_areas_${cId}`);
        setAreas(savedAreas ? JSON.parse(savedAreas) : freshData.areas);
        const savedPatches = localStorage.getItem(`raxon_org_patches_${cId}`);
        setPatches(savedPatches ? JSON.parse(savedPatches) : freshData.patches);
      } catch {
        setDivisions(freshData.divisions);
        setRegions(freshData.regions);
        setAreas(freshData.areas);
        setPatches(freshData.patches);
      }
    };
    window.addEventListener('raxon-company-switched', handleCompanySwitch);
    window.addEventListener('raxon-company-updated', handleCompanySwitch);
    return () => {
      window.removeEventListener('raxon-company-switched', handleCompanySwitch);
      window.removeEventListener('raxon-company-updated', handleCompanySwitch);
    };
  }, []);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);
  const [confirmStatusItem, setConfirmStatusItem] = useState<{ item: any; nextStatus: 'Active' | 'Inactive' } | null>(null);
  const [formState, setFormState] = useState<any>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const tabs = ['Divisions', 'Regions', 'Areas', 'Patches', 'Manager Hierarchy'];

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(`raxon_org_divisions_${getActiveCompanyId()}`, JSON.stringify(divisions));
  }, [divisions]);

  useEffect(() => {
    localStorage.setItem(`raxon_org_regions_${getActiveCompanyId()}`, JSON.stringify(regions));
  }, [regions]);

  useEffect(() => {
    localStorage.setItem(`raxon_org_areas_${getActiveCompanyId()}`, JSON.stringify(areas));
  }, [areas]);

  useEffect(() => {
    localStorage.setItem(`raxon_org_patches_${getActiveCompanyId()}`, JSON.stringify(patches));
  }, [patches]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    if (activeTab === 'Divisions') {
      setFormState({ name: '', head: '', regionsCount: 0, status: 'Active' });
    } else if (activeTab === 'Regions') {
      setFormState({ name: '', division: divisions[0]?.name || 'General Medicine', head: '', areasCount: 0, status: 'Active' });
    } else if (activeTab === 'Areas') {
      setFormState({ name: '', region: regions[0]?.name || 'Uttar Pradesh East', head: '', patchesCount: 0, status: 'Active' });
    } else if (activeTab === 'Patches') {
      setFormState({ name: '', area: areas[0]?.name || 'Lucknow HQ', assignedMR: '', doctorsCount: 0, status: 'Active' });
    }
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormState({ ...item });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name) return;

    if (activeTab === 'Divisions') {
      const newDiv = { id: `DIV-0${divisions.length + 1}`, ...formState };
      setDivisions([...divisions, newDiv]);
      showToast(`Division "${newDiv.name}" added successfully!`);
    } else if (activeTab === 'Regions') {
      const newReg = { id: `REG-0${regions.length + 1}`, ...formState };
      setRegions([...regions, newReg]);
      showToast(`Region "${newReg.name}" created!`);
    } else if (activeTab === 'Areas') {
      const newArea = { id: `HQ-0${areas.length + 1}`, ...formState };
      setAreas([...areas, newArea]);
      showToast(`Area HQ "${newArea.name}" added!`);
    } else if (activeTab === 'Patches') {
      const newPatch = { id: `PT-0${patches.length + 1}`, ...formState };
      setPatches([...patches, newPatch]);
      showToast(`Patch "${newPatch.name}" registered!`);
    }

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formState.name) return;

    if (activeTab === 'Divisions') {
      setDivisions(divisions.map((d: any) => d.id === editingItem.id ? { ...d, ...formState } : d));
    } else if (activeTab === 'Regions') {
      setRegions(regions.map((r: any) => r.id === editingItem.id ? { ...r, ...formState } : r));
    } else if (activeTab === 'Areas') {
      setAreas(areas.map((a: any) => a.id === editingItem.id ? { ...a, ...formState } : a));
    } else if (activeTab === 'Patches') {
      setPatches(patches.map((p: any) => p.id === editingItem.id ? { ...p, ...formState } : p));
    }

    showToast(`Updated "${formState.name}" details.`);
    setEditingItem(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;

    if (activeTab === 'Divisions') {
      setDivisions(divisions.filter((d: any) => d.id !== deletingItem.id));
    } else if (activeTab === 'Regions') {
      setRegions(regions.filter((r: any) => r.id !== deletingItem.id));
    } else if (activeTab === 'Areas') {
      setAreas(areas.filter((a: any) => a.id !== deletingItem.id));
    } else if (activeTab === 'Patches') {
      setPatches(patches.filter((p: any) => p.id !== deletingItem.id));
    }

    showToast(`Removed "${deletingItem.name}" from organization.`);
    setDeletingItem(null);
  };

  const handleRequestToggleStatus = (item: any) => {
    const nextStatus: 'Active' | 'Inactive' = item.status === 'Active' ? 'Inactive' : 'Active';
    setConfirmStatusItem({ item, nextStatus });
  };

  const handleExecuteStatusToggle = () => {
    if (!confirmStatusItem) return;
    const { item, nextStatus } = confirmStatusItem;

    if (activeTab === 'Divisions') {
      setDivisions(divisions.map((d: any) => d.id === item.id ? { ...d, status: nextStatus } : d));
    } else if (activeTab === 'Regions') {
      setRegions(regions.map((r: any) => r.id === item.id ? { ...r, status: nextStatus } : r));
    } else if (activeTab === 'Areas') {
      setAreas(areas.map((a: any) => a.id === item.id ? { ...a, status: nextStatus } : a));
    } else if (activeTab === 'Patches') {
      setPatches(patches.map((p: any) => p.id === item.id ? { ...p, status: nextStatus } : p));
    }
    showToast(`Status changed to ${nextStatus} for ${item.name}`);
    setConfirmStatusItem(null);
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[] = [];

    if (activeTab === 'Divisions') {
      headers = ['ID', 'Division Name', 'Division Head', 'Total Regions', 'Status'];
      rows = divisions.map((d: any) => [`"${d.id}"`, `"${d.name}"`, `"${d.head}"`, d.regionsCount, `"${d.status}"`].join(','));
    } else if (activeTab === 'Regions') {
      headers = ['ID', 'Region Name', 'Division', 'Regional Manager', 'Total HQs', 'Status'];
      rows = regions.map((r: any) => [`"${r.id}"`, `"${r.name}"`, `"${r.division}"`, `"${r.head}"`, r.areasCount, `"${r.status}"`].join(','));
    } else if (activeTab === 'Areas') {
      headers = ['ID', 'HQ Name', 'Region', 'Area Manager', 'Total Patches', 'Status'];
      rows = areas.map((a: any) => [`"${a.id}"`, `"${a.name}"`, `"${a.region}"`, `"${a.head}"`, a.patchesCount, `"${a.status}"`].join(','));
    } else if (activeTab === 'Patches') {
      headers = ['ID', 'Patch Name', 'Parent HQ', 'Assigned MR', 'Doctors Count', 'Status'];
      rows = patches.map((p: any) => [`"${p.id}"`, `"${p.name}"`, `"${p.area}"`, `"${p.assignedMR}"`, p.doctorsCount, `"${p.status}"`].join(','));
    }

    const csvContent = `${headers.join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Raxon_Org_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Organization ${activeTab} exported to CSV.`);
  };

  const loggedIn = getLoggedInUser();
  const isDsa = loggedIn && (loggedIn.role === 'ZM' || loggedIn.roleTitle?.toLowerCase().includes('division system admin') || loggedIn.roleTitle?.toLowerCase().includes('dsa'));

  const doesDivMatch = (divName: string, dsaDiv: string): boolean => {
    if (!divName || !dsaDiv) return false;
    const iD = divName.toLowerCase();
    const dD = dsaDiv.toLowerCase();
    if (iD.includes(dD) || dD.includes(iD)) return true;
    const keywords = ['general', 'cardio', 'diab', 'pediatric', 'dermatology', 'ortho', 'gastro'];
    for (const kw of keywords) {
      if (iD.includes(kw) && dD.includes(kw)) {
        return true;
      }
    }
    return false;
  };

  const getActiveData = () => {
    let rawList = [];
    switch (activeTab) {
      case 'Divisions': rawList = divisions; break;
      case 'Regions': rawList = regions; break;
      case 'Areas': rawList = areas; break;
      case 'Patches': rawList = patches; break;
      default: rawList = [];
    }

    if (isDsa && loggedIn?.divisionName) {
      const dsaDiv = loggedIn.divisionName;
      if (activeTab === 'Divisions') {
        return rawList.filter((d: any) => doesDivMatch(d.name, dsaDiv));
      } else if (activeTab === 'Regions') {
        return rawList.filter((r: any) => doesDivMatch(r.division, dsaDiv));
      } else if (activeTab === 'Areas') {
        const validRegions = regions.filter((r: any) => doesDivMatch(r.division, dsaDiv)).map((r: any) => r.name.toLowerCase());
        return rawList.filter((a: any) => validRegions.includes((a.region || '').toLowerCase()));
      } else if (activeTab === 'Patches') {
        const validRegions = regions.filter((r: any) => doesDivMatch(r.division, dsaDiv)).map((r: any) => r.name.toLowerCase());
        const validAreas = areas.filter((a: any) => validRegions.includes((a.region || '').toLowerCase())).map((a: any) => a.name.toLowerCase());
        return rawList.filter((p: any) => validAreas.includes((p.area || '').toLowerCase()));
      }
    }
    return rawList;
  };

  const data = getActiveData().filter((item: any) => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-gray-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white text-xs ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">Organization Hierarchy</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {data.length} {activeTab}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Configure business divisions, state regions, area headquarters, and beat patches.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 mr-1.5 text-gray-500" /> Export CSV
          </button>
          <button 
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium flex items-center shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add {activeTab === 'Areas' ? 'Area/HQ' : activeTab.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-1.5 flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as any);
              setSearchQuery('');
            }}
            className={`
              flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer text-center
              ${activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'Manager Hierarchy' ? (
        <ManagerHierarchyManagement embedded={true} />
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/60">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm w-full focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-shadow"
            />
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Total {activeTab}: {data.length}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Code & Name</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">
                  {activeTab === 'Divisions' ? 'Division Head' : activeTab === 'Regions' ? 'Parent Division / RM' : activeTab === 'Areas' ? 'Region / AM' : 'Parent HQ / Assigned MR'}
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">
                  {activeTab === 'Divisions' ? 'Regions' : activeTab === 'Regions' ? 'Area HQs' : activeTab === 'Areas' ? 'Patches' : 'Doctors Count'}
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row: any) => (
                <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900 text-sm">{row.name}</div>
                    <div className="text-xs text-indigo-600 font-mono font-medium">{row.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {row.head || row.assignedMR || 'Unassigned'}
                    </div>
                    {(row.division || row.region || row.area) && (
                      <div className="text-xs text-gray-500 font-medium mt-0.5">
                        Parent: {row.division || row.region || row.area}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                    {row.regionsCount !== undefined && `${row.regionsCount} Regions`}
                    {row.areasCount !== undefined && `${row.areasCount} Area HQs`}
                    {row.patchesCount !== undefined && `${row.patchesCount} Patches`}
                    {row.doctorsCount !== undefined && `${row.doctorsCount} Doctors`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleRequestToggleStatus(row)} title="Click to toggle status">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${
                        row.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}>
                        {row.status === 'Active' ? <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" /> : <XCircle className="w-3 h-3 mr-1 text-red-600" />}
                        {row.status}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button 
                        onClick={() => handleOpenEdit(row)} 
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" 
                        title="Edit Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeletingItem(row)} 
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" 
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* --- ADD MODAL --- */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={`Add New ${activeTab === 'Areas' ? 'Area/HQ' : activeTab.slice(0, -1)}`}>
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name *</label>
            <input 
              type="text" 
              required
              value={formState.name || ''} 
              onChange={e => setFormState({ ...formState, name: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder={`e.g. ${activeTab === 'Divisions' ? 'Gastro-Care Division' : activeTab === 'Regions' ? 'Uttar Pradesh Central' : activeTab === 'Areas' ? 'Faizabad HQ' : 'Bikapur'}`} 
            />
          </div>
          
          {activeTab === 'Regions' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Parent Division</label>
              <select 
                value={formState.division || divisions[0]?.name} 
                onChange={e => setFormState({ ...formState, division: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white"
              >
                {divisions.map((d: any) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'Areas' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Parent Region</label>
              <select 
                value={formState.region || regions[0]?.name} 
                onChange={e => setFormState({ ...formState, region: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white"
              >
                {regions.map((r: any) => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'Patches' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Parent Area / HQ</label>
              <select 
                value={formState.area || areas[0]?.name} 
                onChange={e => setFormState({ ...formState, area: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white"
              >
                {areas.map((a: any) => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              {activeTab === 'Patches' ? 'Assigned Field MR' : 'Assigned Manager / Head'}
            </label>
            <input 
              type="text" 
              value={formState.head || formState.assignedMR || ''} 
              onChange={e => setFormState({ ...formState, head: e.target.value, assignedMR: e.target.value })}
              placeholder="e.g. Pradeep Mishra"
              className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
            <button 
              type="button"
              onClick={() => setIsAddModalOpen(false)} 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-xs"
            >
              Save Unit
            </button>
          </div>
        </form>
      </Modal>

      {/* --- EDIT MODAL --- */}
      {editingItem && (
        <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title={`Edit ${activeTab.slice(0, -1)} - ${editingItem.name}`}>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name *</label>
              <input 
                type="text" 
                required
                value={formState.name || ''} 
                onChange={e => setFormState({ ...formState, name: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-semibold" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                {activeTab === 'Patches' ? 'Assigned Field MR' : 'Assigned Manager / Head'}
              </label>
              <input 
                type="text" 
                value={formState.head || formState.assignedMR || ''} 
                onChange={e => setFormState({ ...formState, head: e.target.value, assignedMR: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
              <button 
                type="button"
                onClick={() => setEditingItem(null)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-xs"
              >
                Update Details
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* --- CONFIRMATION 1: STATUS TOGGLE MODAL --- */}
      {confirmStatusItem && (
        <ConfirmModal
          isOpen={!!confirmStatusItem}
          onClose={() => setConfirmStatusItem(null)}
          onConfirm={handleExecuteStatusToggle}
          type={confirmStatusItem.nextStatus === 'Inactive' ? 'warning' : 'success'}
          title={`Change Status for ${activeTab.slice(0, -1)}?`}
          message={
            confirmStatusItem.nextStatus === 'Inactive'
              ? `Are you sure you want to deactivate ${confirmStatusItem.item.name}?`
              : `Are you sure you want to activate ${confirmStatusItem.item.name}?`
          }
          subMessage="This confirmation is required to prevent accidental changes."
          itemName={`${confirmStatusItem.item.name} (${confirmStatusItem.item.id}) • Tier: ${activeTab}`}
          confirmText={confirmStatusItem.nextStatus === 'Inactive' ? 'Yes, Deactivate' : 'Yes, Activate'}
          cancelText="Cancel"
        />
      )}

      {/* --- CONFIRMATION 2: DELETE MODAL --- */}
      {deletingItem && (
        <ConfirmModal
          isOpen={!!deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleConfirmDelete}
          type="danger"
          title={`Delete ${activeTab.slice(0, -1)} Unit?`}
          message={`Are you sure you want to remove ${deletingItem.name} (${deletingItem.id}) from the organizational structure?`}
          subMessage="Warning: Subordinate records linked to this unit may be affected. Please confirm."
          itemName={`${deletingItem.name} (${deletingItem.id}) • Tier: ${activeTab}`}
          confirmText="Yes, Delete Unit"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
