import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  ArrowRight, 
  ArrowLeftRight, 
  ShieldAlert, 
  ShieldCheck, 
  History, 
  Search, 
  Filter, 
  Building2, 
  Layers, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ChevronRight, 
  ChevronDown, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Briefcase
} from 'lucide-react';
import { 
  getCurrentHierarchy, 
  getManagerAssignments, 
  getEligibleManagers, 
  getEligibleMRs, 
  assignMrToManager, 
  bulkAssignMrsToManager, 
  reassignMr, 
  removeAssignment, 
  getAssignmentAudit,
  refreshHierarchyCache 
} from '../services/managerHierarchyService';
import { 
  CurrentManagerHierarchy, 
  ManagerAssignment, 
  ManagerAssignmentAudit 
} from '../types/managerHierarchy';
import { 
  getStoredCompanies, 
  getActiveCompanyId, 
  getActiveCompany,
  Company 
} from '../data/companyContext';
import { 
  getStoredUserProfiles, 
  UserProfile, 
  getLoggedInUser, 
  normalizeRole 
} from '../data/userContext';
import { Modal } from './Modal';
import { ConfirmModal } from './ConfirmModal';

interface ManagerHierarchyManagementProps {
  embedded?: boolean;
}

export function ManagerHierarchyManagement({ embedded = false }: ManagerHierarchyManagementProps) {
  const loggedIn = getLoggedInUser();
  const userRole = normalizeRole(loggedIn?.role || 'MR');
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const isSystemAdmin = userRole === 'ADMIN';
  const canManage = isSuperAdmin || isSystemAdmin;

  const [allCompanies, setAllCompanies] = useState<Company[]>(() => getStoredCompanies());
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    if (isSuperAdmin) {
      return getActiveCompanyId() || (allCompanies[0]?.id ?? 'comp-1');
    }
    return loggedIn?.companyId || getActiveCompanyId();
  });

  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'assign' | 'audit'>('hierarchy');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Hierarchy & Audit data
  const [hierarchyList, setHierarchyList] = useState<CurrentManagerHierarchy[]>([]);
  const [auditList, setAuditList] = useState<ManagerAssignmentAudit[]>([]);

  // Assignment Form State
  const [selectedAmId, setSelectedAmId] = useState<string>('');
  const [selectedMrIds, setSelectedMrIds] = useState<string[]>([]);
  const [assignmentNotes, setAssignmentNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reassignment Modal State
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [targetMr, setTargetMr] = useState<{ id: string; name: string; currentAmId?: string; currentAmName?: string } | null>(null);
  const [newAmId, setNewAmId] = useState<string>('');
  const [reassignNotes, setReassignNotes] = useState<string>('');

  // Unassign Modal State
  const [unassignModalOpen, setUnassignModalOpen] = useState(false);
  const [targetUnassign, setTargetUnassign] = useState<{ mrId: string; mrName: string; managerId: string; managerName: string } | null>(null);

  // Available Divisions for the selected company
  const currentCompany = allCompanies.find(c => c.id === selectedCompanyId) || getActiveCompany();
  const divisions = useMemo(() => {
    return (currentCompany as any)?.divisions || [
      { id: 'DIV-01', name: 'General Medicine' },
      { id: 'DIV-02', name: 'Cardio-Diabetic' },
      { id: 'DIV-03', name: 'Dermatology' }
    ];
  }, [currentCompany]);

  // Load Hierarchy & Audit
  const loadData = async () => {
    setLoading(true);
    try {
      const [hier, audits] = await Promise.all([
        getCurrentHierarchy(selectedCompanyId, selectedDivisionId),
        getAssignmentAudit(selectedCompanyId, selectedDivisionId)
      ]);
      setHierarchyList(hier);
      setAuditList(audits);
    } catch (err) {
      console.error('Error loading hierarchy:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('raxon-hierarchy-updated', handleUpdate);
    return () => window.removeEventListener('raxon-hierarchy-updated', handleUpdate);
  }, [selectedCompanyId, selectedDivisionId]);

  // Eligible AMs & MRs
  const eligibleManagers = useMemo(() => {
    return getEligibleManagers(selectedCompanyId, selectedDivisionId);
  }, [selectedCompanyId, selectedDivisionId]);

  const eligibleMRs = useMemo(() => {
    return getEligibleMRs(selectedCompanyId, selectedDivisionId);
  }, [selectedCompanyId, selectedDivisionId]);

  // Group Hierarchy by AM
  const amGroups = useMemo(() => {
    const map = new Map<string, { am: UserProfile | null; managerName: string; managerRole: string; managerHq?: string; managerPhone?: string; mrs: CurrentManagerHierarchy[] }>();

    // First populate from eligible AMs to show all AMs even with 0 MRs
    eligibleManagers.forEach(am => {
      map.set(am.id, {
        am,
        managerName: am.name,
        managerRole: am.roleTitle || 'Area Manager',
        managerHq: am.hq,
        managerPhone: am.phone,
        mrs: []
      });
    });

    // Populate MRs
    hierarchyList.forEach(item => {
      if (!map.has(item.manager_id)) {
        map.set(item.manager_id, {
          am: null,
          managerName: item.manager_name || 'Area Manager',
          managerRole: item.manager_role || 'AREA_MANAGER',
          managerHq: item.manager_hq,
          managerPhone: item.manager_phone,
          mrs: []
        });
      }
      map.get(item.manager_id)!.mrs.push(item);
    });

    return Array.from(map.entries()).map(([amId, group]) => ({
      amId,
      ...group
    }));
  }, [eligibleManagers, hierarchyList]);

  // Filtered AM Groups based on Search Query
  const filteredAmGroups = useMemo(() => {
    if (!searchQuery.trim()) return amGroups;
    const q = searchQuery.toLowerCase();
    return amGroups.filter(g => {
      const amMatch = g.managerName.toLowerCase().includes(q) || (g.managerHq && g.managerHq.toLowerCase().includes(q));
      const mrMatch = g.mrs.some(m => (m.user_name && m.user_name.toLowerCase().includes(q)) || (m.user_hq && m.user_hq.toLowerCase().includes(q)));
      return amMatch || mrMatch;
    });
  }, [amGroups, searchQuery]);

  // Unassigned MRs (MRs in the company that have no active AM assignment)
  const assignedMrIdSet = useMemo(() => {
    return new Set(hierarchyList.map(h => h.user_id));
  }, [hierarchyList]);

  const unassignedMRs = useMemo(() => {
    return eligibleMRs.filter(mr => !assignedMrIdSet.has(mr.id));
  }, [eligibleMRs, assignedMrIdSet]);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Handle Assignment Submission
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      showToast('error', 'Unauthorized: Only Administrators can create manager assignments.');
      return;
    }
    if (!selectedAmId) {
      showToast('error', 'Please select an Area Manager.');
      return;
    }
    if (selectedMrIds.length === 0) {
      showToast('error', 'Please select at least one Medical Representative.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await bulkAssignMrsToManager({
        companyId: selectedCompanyId,
        divisionId: selectedDivisionId !== 'ALL' ? selectedDivisionId : undefined,
        managerId: selectedAmId,
        mrIds: selectedMrIds,
        assignedBy: loggedIn?.id || 'admin',
        notes: assignmentNotes
      });

      if (result.success) {
        showToast('success', `Successfully assigned ${result.count} MR(s) to the Area Manager.`);
        setSelectedMrIds([]);
        setAssignmentNotes('');
        setActiveTab('hierarchy');
        await loadData();
      } else {
        showToast('error', result.error || 'Failed to complete assignment.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'An error occurred during assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Reassignment Execution
  const handleExecuteReassign = async () => {
    if (!targetMr || !newAmId) {
      showToast('error', 'Please select the new Area Manager.');
      return;
    }

    try {
      const result = await reassignMr({
        companyId: selectedCompanyId,
        divisionId: selectedDivisionId !== 'ALL' ? selectedDivisionId : undefined,
        newManagerId: newAmId,
        mrId: targetMr.id,
        performedBy: loggedIn?.id || 'admin',
        notes: reassignNotes || `Reassigned from ${targetMr.currentAmName || 'Previous AM'}`
      });

      if (result.success) {
        showToast('success', `Successfully reassigned ${targetMr.name} to new Area Manager.`);
        setReassignModalOpen(false);
        setTargetMr(null);
        setNewAmId('');
        setReassignNotes('');
        await loadData();
      } else {
        showToast('error', result.error || 'Failed to reassign MR.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'An error occurred.');
    }
  };

  // Handle Unassign Execution
  const handleExecuteUnassign = async () => {
    if (!targetUnassign) return;

    try {
      const result = await removeAssignment({
        companyId: selectedCompanyId,
        mrId: targetUnassign.mrId,
        managerId: targetUnassign.managerId,
        performedBy: loggedIn?.id || 'admin',
        notes: 'Unassigned by administrator'
      });

      if (result.success) {
        showToast('success', `Removed assignment for ${targetUnassign.mrName}.`);
        setUnassignModalOpen(false);
        setTargetUnassign(null);
        await loadData();
      } else {
        showToast('error', result.error || 'Failed to remove assignment.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'An error occurred.');
    }
  };

  const toggleSelectAllMRs = () => {
    if (selectedMrIds.length === unassignedMRs.length) {
      setSelectedMrIds([]);
    } else {
      setSelectedMrIds(unassignedMRs.map(m => m.id));
    }
  };

  const toggleMrSelection = (id: string) => {
    setSelectedMrIds(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  return (
    <div className={embedded ? 'space-y-6' : 'p-4 sm:p-6 max-w-7xl mx-auto space-y-6'}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold shadow-md ${
          toastMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' :
          toastMessage.type === 'error' ? 'bg-rose-50 text-rose-900 border border-rose-200' :
          'bg-blue-50 text-blue-900 border border-blue-200'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> :
           toastMessage.type === 'error' ? <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" /> :
           <RefreshCw className="w-5 h-5 text-blue-600 shrink-0 animate-spin" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center font-black shadow-sm shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Manager Hierarchy & AM → MR Mapping
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold bg-indigo-50 text-indigo-800 border border-indigo-200">
                  Authoritative Supabase PostgreSQL RLS
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1">
                Configure, reassign, and audit organizational management links between Area Managers and Field Medical Representatives.
              </p>
            </div>
          </div>

          {/* Quick Stats / Refresh */}
          <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
            <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Assigned MRs: <strong>{hierarchyList.length}</strong></span>
            </div>
            <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Unassigned MRs: <strong>{unassignedMRs.length}</strong></span>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors disabled:opacity-50"
              title="Refresh Hierarchy"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Company Filter for Super Admin */}
            {isSuperAdmin && (
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold text-gray-600">Company:</span>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-gray-900 border-none focus:ring-0 cursor-pointer"
                >
                  {allCompanies.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code || c.id})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Division Filter */}
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
              <Layers className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-600">Division:</span>
              <select
                value={selectedDivisionId}
                onChange={(e) => setSelectedDivisionId(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-900 border-none focus:ring-0 cursor-pointer"
              >
                <option value="ALL">All Divisions</option>
                {divisions.map((d: any) => (
                  <option key={d.id || d.name} value={d.id || d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AM, MR, or HQ..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'hierarchy'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Hierarchy Tree ({hierarchyList.length})</span>
        </button>

        {canManage && (
          <button
            onClick={() => setActiveTab('assign')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'assign'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Assign MRs to AM</span>
            {unassignedMRs.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-3xs ${
                activeTab === 'assign' ? 'bg-indigo-400 text-white' : 'bg-amber-100 text-amber-900 font-black'
              }`}>
                {unassignedMRs.length} Unassigned
              </span>
            )}
          </button>
        )}

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Assignment Audit Log ({auditList.length})</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE HIERARCHY TREE */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-4">
          {filteredAmGroups.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-extrabold text-gray-900">No Manager-to-MR Assignments Configured</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                No active Area Manager hierarchy mapping records were found for the selected company and division.
              </p>
              {canManage && (
                <button
                  onClick={() => setActiveTab('assign')}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl inline-flex items-center gap-2 shadow-xs transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Map First AM → MR Relationship
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filteredAmGroups.map((group) => (
                <div key={group.amId} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                  {/* AM Header */}
                  <div className="bg-gradient-to-r from-gray-50 via-indigo-50/30 to-gray-50 p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                        {group.managerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-extrabold text-gray-900">{group.managerName}</h3>
                          <span className="px-2 py-0.5 rounded-full text-3xs font-black bg-indigo-100 text-indigo-900 border border-indigo-300">
                            AREA MANAGER
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-semibold mt-0.5 flex-wrap">
                          {group.managerHq && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              HQ: {group.managerHq}
                            </span>
                          )}
                          {group.managerPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {group.managerPhone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white text-indigo-900 border border-indigo-200 shadow-2xs">
                        {group.mrs.length} Assigned MR{group.mrs.length !== 1 ? 's' : ''}
                      </span>
                      {canManage && (
                        <button
                          onClick={() => {
                            setSelectedAmId(group.amId);
                            setActiveTab('assign');
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Add MRs
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Assigned MR List */}
                  <div className="p-4 sm:p-5">
                    {group.mrs.length === 0 ? (
                      <div className="py-6 text-center text-xs font-semibold text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                        No Medical Representatives currently mapped to this Area Manager.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.mrs.map((mr) => (
                          <div 
                            key={mr.id} 
                            className="p-3.5 bg-gray-50 hover:bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-all shadow-2xs flex flex-col justify-between gap-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center shrink-0">
                                  {mr.user_name?.slice(0, 2).toUpperCase() || 'MR'}
                                </div>
                                <div>
                                  <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">{mr.user_name}</h4>
                                  <p className="text-3xs font-semibold text-gray-500">
                                    {mr.user_hq ? `HQ: ${mr.user_hq}` : 'Medical Rep'}
                                  </p>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                                Active
                              </span>
                            </div>

                            <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-3xs text-gray-500 font-semibold">
                              <span>Assigned: {new Date(mr.assigned_at).toLocaleDateString()}</span>
                              {canManage && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setTargetMr({
                                        id: mr.user_id,
                                        name: mr.user_name || 'Medical Representative',
                                        currentAmId: mr.manager_id,
                                        currentAmName: mr.manager_name
                                      });
                                      setNewAmId('');
                                      setReassignModalOpen(true);
                                    }}
                                    title="Reassign to another AM"
                                    className="p-1 hover:bg-indigo-100 text-indigo-700 rounded transition-colors"
                                  >
                                    <ArrowLeftRight className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setTargetUnassign({
                                        mrId: mr.user_id,
                                        mrName: mr.user_name || 'Medical Representative',
                                        managerId: mr.manager_id,
                                        managerName: mr.manager_name || 'Area Manager'
                                      });
                                      setUnassignModalOpen(true);
                                    }}
                                    title="Unassign MR"
                                    className="p-1 hover:bg-rose-100 text-rose-700 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ASSIGN MRs TO AM */}
      {activeTab === 'assign' && canManage && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs">
          <form onSubmit={handleAssignSubmit} className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Map Medical Representatives to Area Manager</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Select an Area Manager and check the Medical Representatives to link. Reassignments will automatically terminate prior active links and record in the audit log.
              </p>
            </div>

            {/* Step 1: Choose AM */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                1. Select Target Area Manager (AM) *
              </label>
              <select
                value={selectedAmId}
                onChange={(e) => setSelectedAmId(e.target.value)}
                required
                className="w-full max-w-xl px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">-- Choose Area Manager --</option>
                {eligibleManagers.map(am => (
                  <option key={am.id} value={am.id}>
                    {am.name} • {am.hq} {am.divisionName ? `(${am.divisionName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Choose MRs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between max-w-2xl">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  2. Select Medical Representatives ({selectedMrIds.length} selected) *
                </label>
                {unassignedMRs.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleSelectAllMRs}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    {selectedMrIds.length === unassignedMRs.length ? 'Deselect All' : 'Select All Unassigned'}
                  </button>
                )}
              </div>

              {eligibleMRs.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500">
                  No Medical Representatives registered in this company/division.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-1">
                  {eligibleMRs.map(mr => {
                    const isAssigned = assignedMrIdSet.has(mr.id);
                    const currentMapping = hierarchyList.find(h => h.user_id === mr.id);
                    const isSelected = selectedMrIds.includes(mr.id);

                    return (
                      <div
                        key={mr.id}
                        onClick={() => toggleMrSelection(mr.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-500 shadow-xs'
                            : isAssigned
                            ? 'bg-gray-50/60 border-gray-200 hover:border-gray-300'
                            : 'bg-white border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // Handled by container
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                          />
                          <div className="truncate">
                            <p className="text-xs font-extrabold text-gray-900 truncate">{mr.name}</p>
                            <p className="text-3xs font-medium text-gray-500 truncate">
                              {mr.hq || 'HQ Field Rep'}
                            </p>
                          </div>
                        </div>

                        {isAssigned && (
                          <span className="text-3xs font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 shrink-0" title={`Currently mapped to ${currentMapping?.manager_name}`}>
                            {currentMapping?.manager_name ? `AM: ${currentMapping.manager_name.split(' ')[0]}` : 'Assigned'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 3: Assignment Notes */}
            <div className="space-y-2 max-w-xl">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                3. Assignment Notes / Justification (Optional)
              </label>
              <input
                type="text"
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                placeholder="e.g. Territory cycle realignment Q3"
                className="w-full px-3.5 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !selectedAmId || selectedMrIds.length === 0}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Authoritative Mapping...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Confirm & Authorize AM Mapping ({selectedMrIds.length})</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedMrIds([]);
                  setSelectedAmId('');
                  setActiveTab('hierarchy');
                }}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900">Manager Assignment Audit History</h3>
              <p className="text-xs text-gray-500 mt-0.5">Authoritative immutable log of hierarchy creation, transfers, and removals</p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700">
              {auditList.length} Records
            </span>
          </div>

          {auditList.length === 0 ? (
            <div className="p-12 text-center">
              <History className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-500">No hierarchy audit events recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase tracking-wider text-3xs border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Date / Time</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Medical Representative</th>
                    <th className="py-3 px-4">Assigned AM</th>
                    <th className="py-3 px-4">Previous AM</th>
                    <th className="py-3 px-4">Performed By</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                  {auditList.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500 font-mono text-3xs">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-3xs font-black ${
                          log.action_type === 'ASSIGN' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          log.action_type === 'REASSIGN' ? 'bg-indigo-100 text-indigo-900 border border-indigo-300' :
                          log.action_type === 'UNASSIGN' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.action_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">
                        {log.mr_name || log.user_id}
                      </td>
                      <td className="py-3 px-4 text-indigo-900 font-bold whitespace-nowrap">
                        {log.new_manager_name || log.manager_name || '—'}
                      </td>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                        {log.previous_manager_name || log.previous_manager_id || 'None'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                        {log.performed_by_name || 'Admin'}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-3xs max-w-xs truncate">
                        {log.details?.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* REASSIGNMENT MODAL */}
      {reassignModalOpen && targetMr && (
        <Modal
          isOpen={reassignModalOpen}
          onClose={() => setReassignModalOpen(false)}
          title={`Reassign Medical Representative: ${targetMr.name}`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Reassigning this MR will automatically end their previous active link to <strong>{targetMr.currentAmName || 'Current AM'}</strong> and register the change in the audit trail.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Select New Area Manager (AM) *
              </label>
              <select
                value={newAmId}
                onChange={(e) => setNewAmId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">-- Choose New AM --</option>
                {eligibleManagers
                  .filter(am => am.id !== targetMr.currentAmId)
                  .map(am => (
                    <option key={am.id} value={am.id}>
                      {am.name} • {am.hq}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Reassignment Reason / Note
              </label>
              <input
                type="text"
                value={reassignNotes}
                onChange={(e) => setReassignNotes(e.target.value)}
                placeholder="e.g. Territory reorganization"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setReassignModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReassign}
                disabled={!newAmId}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs disabled:opacity-50"
              >
                Execute Reassignment
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* UNASSIGN CONFIRM MODAL */}
      {unassignModalOpen && targetUnassign && (
        <ConfirmModal
          isOpen={unassignModalOpen}
          onClose={() => setUnassignModalOpen(false)}
          onConfirm={handleExecuteUnassign}
          title="Remove Manager Assignment"
          message={`Are you sure you want to unassign ${targetUnassign.mrName} from Area Manager ${targetUnassign.managerName}? The MR will become unassigned until mapped to a new manager.`}
          confirmText="Yes, Unassign"
          type="danger"
        />
      )}
    </div>
  );
}
