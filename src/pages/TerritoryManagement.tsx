import React, { useState, useEffect } from 'react';
import { MapPin, Building, Search, Edit2, CheckCircle2, User, Shield, Briefcase, Plus, X, Upload, Layers, Download, Trash2, AlertTriangle, ChevronRight, Key, Lock, Unlock, UserCheck, UserX, Phone, Mail } from 'lucide-react';
import { getActiveCompanyId, getActiveCompany } from '../data/companyContext';
import { Employee } from './UserManagement';

export interface TerritoryEmployee extends Employee {
  areaPatch?: string;
}
import { getUsersByCompany, getLoggedInUser, saveCompanyEmployees } from '../data/userContext';
import { getAllHeadquarters, saveCustomHeadquarters, saveCustomAreas } from '../data/hqMrMapping';
import { ConfirmModal } from '../components/ConfirmModal';
import { UserPermissionModal } from '../components/UserPermissionModal';

interface AreaItem {
  id: string;
  name: string;
  hq: string;
  patch: string;
}

export default function TerritoryManagement() {
  const activeCompanyId = getActiveCompanyId();
  const company = getActiveCompany();
  const loggedIn = getLoggedInUser();
  const roleStr = String(loggedIn?.role || '').toLowerCase();
  const isSuperOrAdmin = roleStr.includes('super') || roleStr.includes('admin');
  const existingHqs = getAllHeadquarters(activeCompanyId);

  const loadEmployees = () => {
    try {
      const saved = localStorage.getItem(`raxon_users_master_${activeCompanyId}`);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  const loadAreas = (): AreaItem[] => {
    try {
      const saved = localStorage.getItem(`raxon_areas_${activeCompanyId}`);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    // If no custom areas saved yet, start with clean empty list or default
    return [];
  };

  const loadCustomHqs = () => {
    try {
      const saved = localStorage.getItem(`raxon_custom_hqs_${activeCompanyId}`);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  const [activeTab, setActiveTab] = useState<'hqs' | 'employees' | 'areas'>('hqs');
  const [customHqs, setCustomHqs] = useState<any[]>(loadCustomHqs);
  const [users, setUsers] = useState<TerritoryEmployee[]>(loadEmployees);
  const [areas, setAreas] = useState<AreaItem[]>(loadAreas);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<TerritoryEmployee | null>(null);
  const [hqInput, setHqInput] = useState(existingHqs[0]?.name || 'Lucknow HQ');
  const [selectedAreaNames, setSelectedAreaNames] = useState<string[]>([]);
  
  // HQ Management State
  const [isAddHqOpen, setIsAddHqOpen] = useState(false);
  const [newHqForm, setNewHqForm] = useState({
    name: '',
    code: '',
    zone: 'North Zone',
    state: 'Uttar Pradesh',
    district: '',
    patches: 'Sector 1, Sector 2, Market Area',
    monthlyTargetPob: '300000'
  });
  const [hqToDelete, setHqToDelete] = useState<any | null>(null);

  const handleCreateHq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHqForm.name.trim()) return;

    const newHq = {
      id: `HQ-${Date.now()}`,
      name: newHqForm.name.trim(),
      code: newHqForm.code.trim() || newHqForm.name.substring(0, 3).toUpperCase(),
      zone: newHqForm.zone,
      state: newHqForm.state,
      district: newHqForm.district.trim() || newHqForm.name,
      assignedMrId: 'EMP-NEW',
      assignedMrName: 'Unassigned',
      assignedMrPhone: '',
      assignedMrEmail: '',
      assignedDivision: company.name || 'General Division',
      assignedMrs: [],
      patches: newHqForm.patches.split(',').map(p => p.trim()).filter(Boolean),
      totalDoctors: 40,
      totalChemists: 30,
      monthlyTargetPob: Number(newHqForm.monthlyTargetPob) || 300000
    };

    const updated = [newHq, ...customHqs];
    setCustomHqs(updated);
    saveCustomHeadquarters(updated, activeCompanyId);
    showToast(`Headquarter "${newHq.name}" created successfully!`);
    setIsAddHqOpen(false);
    setNewHqForm({
      name: '',
      code: '',
      zone: 'North Zone',
      state: 'Uttar Pradesh',
      district: '',
      patches: 'Sector 1, Sector 2, Market Area',
      monthlyTargetPob: '300000'
    });
  };

  const handleDeleteHqConfirm = () => {
    if (!hqToDelete) return;
    const updated = customHqs.filter((h: any) => h.id !== hqToDelete.id);
    setCustomHqs(updated);
    saveCustomHeadquarters(updated, activeCompanyId);
    showToast(`Headquarter "${hqToDelete.name}" deleted successfully.`);
    setHqToDelete(null);
  };

  // Modals for Add Area & Bulk Upload & Delete Area
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isClearAllAreasOpen, setIsClearAllAreasOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<AreaItem | null>(null);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaHq, setNewAreaHq] = useState(existingHqs[0]?.name || 'Lucknow HQ');
  const [newAreaPatch, setNewAreaPatch] = useState('Sector 1');
  const [bulkText, setBulkText] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User Management State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    role: 'Medical Representative (MR)',
    email: '',
    phone: '',
    hq: existingHqs[0]?.name || 'Lucknow HQ'
  });
  const [permissionUser, setPermissionUser] = useState<Employee | null>(null);
  const [credentialUser, setCredentialUser] = useState<Employee | null>(null);
  const [userToDelete, setUserToDelete] = useState<Employee | null>(null);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name.trim()) return;

    const newEmp: TerritoryEmployee = {
      id: `EMP-${Date.now()}`,
      name: newUserForm.name.trim(),
      role: newUserForm.role,
      email: newUserForm.email.trim() || `${newUserForm.name.toLowerCase().replace(/\s+/g, '')}@raxon.com`,
      phone: newUserForm.phone.trim() || '+91 9876543210',
      hq: newUserForm.hq.trim() || 'Lucknow HQ',
      status: 'Active' as ('Active' | 'Inactive'),
      lastActive: 'Just now',
      areaPatch: `${newUserForm.hq.trim() || 'Lucknow HQ'} / Patch 1`
    };

    const updated = [newEmp, ...users];
    setUsers(updated);
    saveCompanyEmployees(activeCompanyId, updated);
    showToast(`Employee "${newEmp.name}" created successfully!`);
    setIsAddUserOpen(false);
    setNewUserForm({
      name: '',
      role: 'Medical Representative (MR)',
      email: '',
      phone: '',
      hq: existingHqs[0]?.name || 'Lucknow HQ'
    });
  };

  const handleToggleStatus = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        return { ...u, status: nextStatus as ('Active' | 'Inactive') };
      }
      return u;
    });
    setUsers(updated);
    saveCompanyEmployees(activeCompanyId, updated);
    showToast('Employee status updated successfully.');
  };

  const handleDeleteUserConfirm = () => {
    if (!userToDelete) return;
    const updated = users.filter(u => u.id !== userToDelete.id);
    setUsers(updated);
    saveCompanyEmployees(activeCompanyId, updated);
    showToast(`Employee "${userToDelete.name}" deleted successfully.`);
    setUserToDelete(null);
  };

  useEffect(() => {
    const handleSync = () => {
      setUsers(loadEmployees());
      setAreas(loadAreas());
    };
    window.addEventListener('raxon-company-switched', handleSync);
    window.addEventListener('raxon-company-updated', handleSync);
    return () => {
      window.removeEventListener('raxon-company-switched', handleSync);
      window.removeEventListener('raxon-company-updated', handleSync);
    };
  }, [activeCompanyId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenEdit = (user: Employee & { areaPatch?: string }) => {
    setEditingUser(user);
    setHqInput(user.hq || existingHqs[0]?.name || 'Lucknow HQ');
    const existingPatch = (user as any).areaPatch || '';
    const splitAreas = existingPatch ? existingPatch.split(',').map((s: string) => s.trim()) : [];
    setSelectedAreaNames(splitAreas);
  };

  const handleSaveTerritory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const combinedAreasStr = selectedAreaNames.length > 0 ? selectedAreaNames.join(', ') : `${hqInput} / General Patch`;

    const updated = users.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          hq: hqInput.trim(),
          areaPatch: combinedAreasStr
        };
      }
      return u;
    });

    setUsers(updated);
    saveCompanyEmployees(activeCompanyId, updated);
    showToast(`Territory & HQ successfully updated for "${editingUser.name}"!`);
    setEditingUser(null);
  };

  const handleAddSingleArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;

    const newItem: AreaItem = {
      id: `area_${Date.now()}`,
      name: newAreaName.trim(),
      hq: newAreaHq.trim(),
      patch: newAreaPatch.trim()
    };

    const updatedAreas = [newItem, ...areas];
    setAreas(updatedAreas);
    saveCustomAreas(updatedAreas, activeCompanyId);
    showToast(`Area "${newItem.name}" added successfully under HQ "${newItem.hq}"!`);
    setNewAreaName('');
    setIsAddAreaOpen(false);
  };

  const handleDeleteAreaConfirm = () => {
    if (!areaToDelete) return;
    const updatedAreas = areas.filter(a => a.id !== areaToDelete.id);
    setAreas(updatedAreas);
    saveCustomAreas(updatedAreas, activeCompanyId);
    showToast(`Area / Patch "${areaToDelete.name}" deleted successfully.`);
    setAreaToDelete(null);
  };

  const handleBulkAreaUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const lines = bulkText.split('\n');
    const newItems: AreaItem[] = [];
    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes('areaname')) return;
      const parts = line.split(',').map(p => p.trim());
      if (parts[0]) {
        newItems.push({
          id: `bulk_${Date.now()}_${idx}`,
          name: parts[0],
          hq: parts[1] || existingHqs[0]?.name || 'Lucknow HQ',
          patch: parts[2] || 'Sector A'
        });
      }
    });

    if (newItems.length === 0) {
      showToast('No valid areas found in CSV text.');
      return;
    }

    const updatedAreas = [...newItems, ...areas];
    setAreas(updatedAreas);
    saveCustomAreas(updatedAreas, activeCompanyId);
    showToast(`${newItems.length} HQ-wise areas uploaded successfully in bulk!`);
    setBulkText('');
    setIsBulkUploadOpen(false);
  };

  const handleExportTerritoryReport = () => {
    if (activeTab === 'areas') {
      const headers = ['Area / Patch Name', 'Headquarters (HQ)', 'Sector / Patch'];
      const rows = filteredAreas.map(a => [
        `"${a.name}"`,
        `"${a.hq}"`,
        `"${a.patch}"`
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `areas_patches_${company.name.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Areas & Patches exported successfully as CSV!');
      return;
    }

    const headers = ['Employee Name', 'Role', 'Email', 'Headquarters', 'Assigned Area / Patch', 'Status'];
    const rows = filteredUsers.map((u: any) => [
      `"${u.name}"`,
      `"${u.role}"`,
      `"${u.email || ''}"`,
      `"${u.hq || 'Not Assigned'}"`,
      `"${u.areaPatch || 'General'}"`,
      `"${u.status || 'Active'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `territory_hq_report_${company.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Territory & HQ report exported successfully as CSV!');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.hq && u.hq.toLowerCase().includes(searchQuery.toLowerCase())) ||
    ((u as any).areaPatch && (u as any).areaPatch.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAreas = areas.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.hq.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.patch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-gray-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white text-xs ml-2">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">Field Force, Users & Territory Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {company.name}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Unified module to manage field force accounts, permissions, manual Headquarters (HQ), and Area/Patch directory.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          <button
            onClick={handleExportTerritoryReport}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>
          {activeTab === 'hqs' ? (
            <button
              onClick={() => setIsAddHqOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Headquarters
            </button>
          ) : activeTab === 'employees' ? (
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Field Employee
            </button>
          ) : (
            <>
              {areas.length > 0 && (
                <button
                  onClick={() => setIsClearAllAreasOpen(true)}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-red-600" /> Delete All Areas
                </button>
              )}
              <button
                onClick={() => setIsAddAreaOpen(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Area / Patch
              </button>
              <button
                onClick={() => setIsBulkUploadOpen(true)}
                className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-indigo-600" /> Bulk Upload
              </button>
            </>
          )}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search user, HQ, area, patch..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('hqs')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'hqs'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Head Quarter (HQ) Management ({existingHqs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'employees'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Field Force & Users ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('areas')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'areas'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Territory & Area Master Directory ({areas.length})</span>
        </button>
      </div>

      {/* Tab 1: Head Quarter Management */}
      {activeTab === 'hqs' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Headquarters (HQ) Directory</h3>
              <p className="text-xs text-gray-500">Manually add, configure and manage Headquarters. Added HQs automatically appear in dropdowns for Field Force and Territory management.</p>
            </div>
            <button
              onClick={() => setIsAddHqOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Headquarters
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">HQ Name & Code</th>
                  <th className="px-6 py-4">Zone / State / District</th>
                  <th className="px-6 py-4">Assigned Patches</th>
                  <th className="px-6 py-4">Field Force / MRs</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {existingHqs.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.state.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                      No Headquarters found matching your search.
                    </td>
                  </tr>
                ) : (
                  existingHqs.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.state.toLowerCase().includes(searchQuery.toLowerCase())).map((hq) => {
                    const isCustom = customHqs.some((c: any) => c.id === hq.id);
                    return (
                      <tr key={hq.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 flex items-center space-x-2">
                            <Building className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span>{hq.name}</span>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold font-mono">
                              {hq.code}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono mt-0.5">{hq.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-gray-800">{hq.zone}</div>
                          <div className="text-xs text-gray-500">{hq.state} • {hq.district}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {hq.patches && hq.patches.slice(0, 4).map((p: string, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                                {p}
                              </span>
                            ))}
                            {hq.patches && hq.patches.length > 4 && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                                +{hq.patches.length - 4} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                            {hq.assignedMrs?.length || 1} Assigned MRs
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isCustom ? (
                            <button
                              onClick={() => setHqToDelete(hq)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                              title="Delete Headquarters"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Default HQ</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 1: Field Force & Users Table */}
      {activeTab === 'employees' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Employee / User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Headquarters (HQ)</th>
                  <th className="px-6 py-4">Area / Patch Mapping</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions & Rights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                      No field force users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{u.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{u.id} • {u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-bold">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-gray-800 font-semibold">
                          <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>{u.hq || 'Not Assigned'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-gray-700 font-medium">
                          <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{u.areaPatch || `${u.hq || 'General'} / Patch 1`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {u.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="Assign HQ & Patch"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> HQ & Patch
                        </button>
                        <button
                          onClick={() => setPermissionUser(u)}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="Configure Rights & Permissions"
                        >
                          <Key className="w-3.5 h-3.5" /> Rights
                        </button>
                        <button
                          onClick={() => setCredentialUser(u)}
                          className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="View Login Credentials"
                        >
                          <Shield className="w-3.5 h-3.5" /> Key
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          className={`p-1.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center cursor-pointer ${
                            u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                          title={u.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                        >
                          {u.status === 'Active' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors inline-flex items-center cursor-pointer"
                          title="Permanently Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Area / Patch Master Directory */}
      {activeTab === 'areas' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Master Areas & Patches</h3>
              <p className="text-xs text-gray-500">Super Admin & Admin can create, modify and permanently delete unused or obsolete areas/patches.</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800">
              Total Areas: {areas.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Area / Patch Name</th>
                  <th className="px-6 py-4">Headquarters (HQ)</th>
                  <th className="px-6 py-4">Sector / Patch Tag</th>
                  <th className="px-6 py-4">Assigned Field Employees</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredAreas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                      No areas found. Click "Add Area / Patch" to register one.
                    </td>
                  </tr>
                ) : (
                  filteredAreas.map((a) => {
                    const assignedUsers = users.filter((u: any) => 
                      u.areaPatch && u.areaPatch.toLowerCase().includes(a.name.toLowerCase())
                    );

                    return (
                      <tr key={a.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span>{a.name}</span>
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono mt-0.5">{a.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                            {a.hq}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold">
                            {a.patch}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {assignedUsers.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {assignedUsers.map((usr: any) => (
                                <span key={usr.id} className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {usr.name} ({usr.role})
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setAreaToDelete(a)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Area / Patch"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Headquarters Modal */}
      {isAddHqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-200 space-y-4 flex flex-col max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)] my-auto overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Add New Headquarters (HQ)</h3>
              <button onClick={() => setIsAddHqOpen(false)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHq} className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">HQ Name</label>
                <input
                  type="text"
                  required
                  value={newHqForm.name}
                  onChange={e => setNewHqForm({ ...newHqForm, name: e.target.value })}
                  placeholder="e.g. Gorakhpur City HQ"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">HQ Code</label>
                  <input
                    type="text"
                    value={newHqForm.code}
                    onChange={e => setNewHqForm({ ...newHqForm, code: e.target.value })}
                    placeholder="e.g. GKP"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Zone</label>
                  <input
                    type="text"
                    value={newHqForm.zone}
                    onChange={e => setNewHqForm({ ...newHqForm, zone: e.target.value })}
                    placeholder="e.g. North Zone"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">State</label>
                  <input
                    type="text"
                    value={newHqForm.state}
                    onChange={e => setNewHqForm({ ...newHqForm, state: e.target.value })}
                    placeholder="e.g. Uttar Pradesh"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">District</label>
                  <input
                    type="text"
                    value={newHqForm.district}
                    onChange={e => setNewHqForm({ ...newHqForm, district: e.target.value })}
                    placeholder="e.g. Gorakhpur"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Initial Patches (Comma separated)</label>
                <input
                  type="text"
                  value={newHqForm.patches}
                  onChange={e => setNewHqForm({ ...newHqForm, patches: e.target.value })}
                  placeholder="Golghar, Medical Road, Civil Lines"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Monthly POB Target (₹)</label>
                <input
                  type="number"
                  value={newHqForm.monthlyTargetPob}
                  onChange={e => setNewHqForm({ ...newHqForm, monthlyTargetPob: e.target.value })}
                  placeholder="300000"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddHqOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Headquarters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Headquarters Confirm Modal */}
      {hqToDelete && (
        <ConfirmModal
          isOpen={!!hqToDelete}
          title="Delete Headquarters"
          message={`Are you sure you want to permanently delete Headquarters "${hqToDelete.name}"? This action cannot be undone.`}
          confirmText="Delete HQ"
          type="danger"
          onConfirm={handleDeleteHqConfirm}
          onClose={() => setHqToDelete(null)}
        />
      )}

      {/* Add Field Employee Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-200 space-y-4 flex flex-col max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)] my-auto overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Add Field Employee / User</h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Employee Name</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Role</label>
                <select
                  value={newUserForm.role}
                  onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="Medical Representative (MR)">Medical Representative (MR)</option>
                  <option value="Area Manager (AM)">Area Manager (AM)</option>
                  <option value="Regional Manager (RM)">Regional Manager (RM)</option>
                  <option value="Zonal Manager (ZM)">Zonal Manager (ZM)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Headquarters (HQ)</label>
                <select
                  required
                  value={newUserForm.hq}
                  onChange={e => setNewUserForm({ ...newUserForm, hq: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  {existingHqs.map(h => (
                    <option key={h.id || h.name} value={h.name}>{h.name} ({h.state || 'HQ'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="rajesh@raxon.com"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone</label>
                <input
                  type="text"
                  value={newUserForm.phone}
                  onChange={e => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Territory Modal (Configure Territory & HQ > HQ > Multiple Area Selection) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-200 space-y-4 flex flex-col max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)] my-auto overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Configure Territory & HQ</h3>
                <p className="text-xs text-gray-500 font-medium">Employee: {editingUser.name} ({editingUser.role})</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTerritory} className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Headquarters (HQ)</label>
                <select
                  required
                  value={hqInput}
                  onChange={e => setHqInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  {existingHqs.map(h => (
                    <option key={h.id || h.name} value={h.name}>{h.name} ({h.state || 'HQ'})</option>
                  ))}
                </select>
              </div>

              {/* Multiple Area Selection */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    HQ & Area / Patch &gt; Multiple Area Selection
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddAreaOpen(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Area
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-2.5 space-y-2 bg-gray-50">
                  {areas.length === 0 ? (
                    <p className="text-xs text-gray-500 italic p-2">No areas created yet. Use "Add Area" or "Bulk Area Upload".</p>
                  ) : (
                    areas.map(area => {
                      const isChecked = selectedAreaNames.includes(area.name);
                      return (
                        <div key={area.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-indigo-300">
                          <label className="flex items-center space-x-2.5 flex-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAreaNames([...selectedAreaNames, area.name]);
                                } else {
                                  setSelectedAreaNames(selectedAreaNames.filter(n => n !== area.name));
                                }
                              }}
                              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <div>
                              <div className="text-xs font-bold text-gray-900">{area.name}</div>
                              <div className="text-[10px] text-gray-500">HQ: {area.hq} • Patch: {area.patch}</div>
                            </div>
                          </label>
                          <div className="flex items-center space-x-1.5 ml-2">
                            <span className="text-[10px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                              {area.patch}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAreaToDelete(area);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete Area"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Select multiple areas/patches assigned to this employee's headquarters.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Territory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Single Area Modal */}
      {isAddAreaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-200 space-y-4 flex flex-col max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)] my-auto overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Add New Area / Patch</h3>
              <button onClick={() => setIsAddAreaOpen(false)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSingleArea} className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Area Name</label>
                <input
                  type="text"
                  required
                  value={newAreaName}
                  onChange={e => setNewAreaName(e.target.value)}
                  placeholder="e.g. Aliganj Sector Q"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Headquarters (HQ)</label>
                <select
                  required
                  value={newAreaHq}
                  onChange={e => setNewAreaHq(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  {existingHqs.map(h => (
                    <option key={h.id || h.name} value={h.name}>{h.name} ({h.state || 'HQ'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Patch / Sector</label>
                <input
                  type="text"
                  required
                  value={newAreaPatch}
                  onChange={e => setNewAreaPatch(e.target.value)}
                  placeholder="e.g. Sector 4"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddAreaOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Create Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Area Upload Modal */}
      {isBulkUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-200 space-y-4 flex flex-col max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem)] my-auto overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Bulk Area Upload</h3>
                <p className="text-xs text-gray-500">Paste multiple areas in format: <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-600">AreaName, HQName, PatchName</code> (one per line)</p>
              </div>
              <button onClick={() => setIsBulkUploadOpen(false)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkAreaUpload} className="space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Format: <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-600 font-mono">AreaName, HQName, PatchName</code></span>
                <button
                  type="button"
                  onClick={() => setBulkText(`AreaName,HQName,PatchName\nHazratganj Central, ${existingHqs[0]?.name || 'Lucknow HQ'}, Sector 1\nAliganj North, ${existingHqs[0]?.name || 'Lucknow HQ'}, Sector 2\nCivil Lines, ${existingHqs[1]?.name || 'Kanpur HQ'}, Patch A`)}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Load Sample CSV
                </button>
              </div>
              <div>
                <textarea
                  rows={6}
                  required
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  placeholder={`Hazratganj Central, Lucknow HQ, Sector 1\nAliganj North, Lucknow HQ, Sector 2\nCivil Lines, Kanpur HQ, Patch A`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBulkUploadOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Upload Bulk Areas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear All Areas Confirm Modal */}
      <ConfirmModal
        isOpen={isClearAllAreasOpen}
        title="Delete All Areas & Patches?"
        message={`Are you sure you want to delete all ${areas.length} master areas/patches for ${company.name}? You will be able to upload your genuine market patches freshly.`}
        confirmText="Yes, Delete All"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          setAreas([]);
          try {
            localStorage.setItem(`raxon_areas_${activeCompanyId}`, JSON.stringify([]));
          } catch (e) {
            console.error(e);
          }
          window.dispatchEvent(new CustomEvent('raxon-areas-updated', { detail: { companyId: activeCompanyId } }));
          showToast(`All areas & patches deleted successfully for ${company.name}.`);
          setIsClearAllAreasOpen(false);
        }}
        onClose={() => setIsClearAllAreasOpen(false)}
      />
    </div>
  );
}
