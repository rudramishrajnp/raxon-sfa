import { getActiveCompanyId, getActiveCompany, getStoredCompanies, setActiveCompanyId } from '../data/companyContext';
import { getAllHeadquarters } from '../data/hqMrMapping';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Key, 
  Shield, 
  UserX, 
  UserCheck,
  CheckCircle2, 
  XCircle, 
  Download, 
  Filter, 
  Trash2, 
  Copy, 
  Check, 
  RefreshCw,
  Mail,
  Phone as PhoneIcon,
  Building,
  User as UserIcon,
  AlertTriangle,
  Stethoscope,
  Building2,
  Lock,
  Unlock,
  Sliders,
  X,
  Navigation,
  MapPin
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { UserPermissionModal } from '../components/UserPermissionModal';
import { 
  UserPermissions, 
  getUserPermissions, 
  saveUserPermission, 
  getAllUserPermissions, 
  saveAllUserPermissions, 
  getDefaultPermissionsForRole 
} from '../data/permissionSettings';
import { getUsersByCompany, UserProfile, getStoredUserProfiles, saveEmployeesAsProfiles, getLoggedInUser, getRoleRank, resetUserPunchIn } from '../data/userContext';
import { generateSecureTemporaryPassword } from '../utils/security';
import { supabase } from '../supabaseClient';

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  hq: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
  reportingToId?: string;
  reportingToName?: string;
  divisionId?: string;
  divisionName?: string;
}

function getInitialEmployeesForCompany(companyId: string): Employee[] {
  const compUsers = getUsersByCompany(companyId);
  if (compUsers.length > 0) {
    return compUsers.map(u => ({
      id: u.id,
      name: u.name,
      role: u.roleTitle || u.role,
      email: u.email,
      phone: u.phone,
      hq: u.hq || 'Head Office',
      status: u.status || 'Active',
      lastActive: 'Recently Active',
      reportingToId: u.reportingToId,
      reportingToName: u.reportingToName
    }));
  }
  return [];
}

export default function UserManagement() {
  const activeCompanyId = getActiveCompanyId();
  const activeCompany = getActiveCompany();
  
  const loadDynamicEmployees = (cId: string) => {
    const compUsers = getUsersByCompany(cId).map(u => ({
      id: u.id,
      name: u.name,
      role: u.roleTitle || u.role,
      email: u.email,
      phone: u.phone,
      hq: u.hq || 'Head Office',
      status: u.status || 'Active',
      lastActive: 'Recently Active',
      reportingToId: u.reportingToId,
      reportingToName: u.reportingToName,
      divisionId: u.divisionId,
      divisionName: u.divisionName
    }));

    try {
      const saved = localStorage.getItem(`raxon_users_master_${cId}`);
      if (saved) {
        const parsed = JSON.parse(saved) as Employee[];
        const parsedIds = new Set(parsed.map(u => u.id.toLowerCase()));
        compUsers.forEach(cu => {
          if (!parsedIds.has(cu.id.toLowerCase())) {
            parsed.push(cu);
          } else {
            const idx = parsed.findIndex(u => u.id.toLowerCase() === cu.id.toLowerCase());
            if (idx >= 0) {
              parsed[idx] = { 
                ...parsed[idx], 
                name: cu.name, 
                role: cu.role, 
                email: cu.email, 
                phone: cu.phone,
                reportingToId: cu.reportingToId,
                reportingToName: cu.reportingToName,
                divisionId: cu.divisionId,
                divisionName: cu.divisionName
              };
            }
          }
        });
        return parsed;
      }
      return compUsers;
    } catch {
      return compUsers;
    }
  };

  const [users, setUsers] = useState<Employee[]>(() => loadDynamicEmployees(activeCompanyId));

  // Re-sync on company change
  useEffect(() => {
    const refreshUsers = () => {
      const cId = getActiveCompanyId();
      setUsers(loadDynamicEmployees(cId));
    };
    window.addEventListener('raxon-company-switched', refreshUsers);
    window.addEventListener('raxon-company-updated', refreshUsers);
    return () => {
      window.removeEventListener('raxon-company-switched', refreshUsers);
      window.removeEventListener('raxon-company-updated', refreshUsers);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Tab selection
  const [activeTab, setActiveTab] = useState<'employees' | 'permissions'>('employees');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Employee | null>(null);
  const [resettingUser, setResettingUser] = useState<Employee | null>(null);
  const [deletingUser, setDeletingUser] = useState<Employee | null>(null);
  const [confirmStatusUser, setConfirmStatusUser] = useState<{ user: Employee; nextStatus: 'Active' | 'Inactive' } | null>(null);
  const [permissionManagingUser, setPermissionManagingUser] = useState<Employee | null>(null);

  // User permissions map state for reactivity
  const [permissionsMap, setPermissionsMap] = useState<Record<string, UserPermissions>>(() => getAllUserPermissions());

  const companyAdmins = (activeCompany?.companyAdmins || []).map(adm => ({
    id: adm.id,
    name: adm.name,
    role: 'Company Admin'
  }));

  const potentialManagers = [
    ...companyAdmins,
    ...users.filter(u => 
      (!editingUser || u.id !== editingUser.id) && 
      !companyAdmins.some(ca => ca.id.toLowerCase() === u.id.toLowerCase()) &&
      (u.role.includes('Admin') || u.role.includes('RM') || u.role.includes('AM') || u.role.includes('DSA') || u.role.includes('Zone') || u.role.includes('ZM'))
    )
  ].filter(mgr => {
    const loggedIn = getLoggedInUser();
    if (!loggedIn) return true;

    // 1. ZM/DSA Division Filter for potential supervisors
    const isDsa = loggedIn.role === 'ZM' || loggedIn.roleTitle?.toLowerCase().includes('division system admin') || loggedIn.roleTitle?.toLowerCase().includes('dsa');
    if (isDsa && loggedIn.divisionName) {
      const dsaDiv = loggedIn.divisionName.toLowerCase();
      const mRole = mgr.role.toLowerCase();
      // DSA should not see Company Admin in potential managers
      if (mRole.includes('company admin') || mRole === 'admin') return false;
    }

    // 2. Hide reporting managers & upper management
    const loggedInRank = getRoleRank(loggedIn.roleTitle || loggedIn.role);
    const mgrRank = getRoleRank(mgr.role);
    if (mgrRank > loggedInRank && mgr.id.toLowerCase() !== loggedIn.id.toLowerCase()) {
      return false;
    }

    // Hide direct/indirect supervisors in reporting chain
    let isSupervisor = false;
    let currentId = loggedIn.reportingToId;
    const visited = new Set<string>();
    while (currentId) {
      const cidLower = currentId.toLowerCase();
      if (visited.has(cidLower)) break;
      visited.add(cidLower);
      
      if (mgr.id.toLowerCase() === cidLower) {
        isSupervisor = true;
        break;
      }
      const mProfile = users.find(u => u.id.toLowerCase() === cidLower);
      currentId = mProfile?.reportingToId;
    }

    if (isSupervisor) return false;
    return true;
  });

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    role: 'Medical Representative (MR)',
    email: '',
    phone: '',
    hq: 'Lucknow HQ',
    status: 'Active' as 'Active' | 'Inactive',
    reportingToId: '',
    reportingToName: ''
  });

  const [formPermissions, setFormPermissions] = useState<UserPermissions>({
    canEditDoctor: false,
    canDeleteDoctor: false,
    canEditChemist: false,
    canDeleteChemist: false,
    canAddDoctor: true,
    canAddChemist: true,
    isGeolocationEnabled: true,
  });

  const [selectedSubordinateIds, setSelectedSubordinateIds] = useState<string[]>([]);
  const [subordinateRoleFilter, setSubordinateRoleFilter] = useState<'ALL' | 'ADMINS' | 'RM' | 'AM' | 'MR'>('ALL');

  // Password Reset state
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync permissions map when updated event fires
  useEffect(() => {
    const handlePermissionsUpdated = () => {
      setPermissionsMap(getAllUserPermissions());
    };
    window.addEventListener('raxon-permissions-updated', handlePermissionsUpdated);
    return () => window.removeEventListener('raxon-permissions-updated', handlePermissionsUpdated);
  }, []);

  // Persist to localStorage and sync to global profiles
  useEffect(() => {
    const syncData = async () => {
      try {
        localStorage.setItem(`raxon_users_master_${activeCompanyId}`, JSON.stringify(users));
        await saveEmployeesAsProfiles(activeCompanyId, users);
      } catch (e) {
        console.error(e);
      }
    };
    syncData();
  }, [users, activeCompanyId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    const loggedIn = getLoggedInUser();
    setFormData({
      name: '',
      role: 'Medical Representative (MR)',
      email: '',
      phone: '',
      hq: 'Lucknow HQ',
      status: 'Active',
      reportingToId: loggedIn ? loggedIn.id : '',
      reportingToName: loggedIn ? loggedIn.name : ''
    });
    setFormPermissions(getDefaultPermissionsForRole('Medical Representative (MR)'));
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: Employee) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      role: user.role,
      email: user.email,
      phone: user.phone,
      hq: user.hq,
      status: user.status,
      reportingToId: user.reportingToId || '',
      reportingToName: user.reportingToName || ''
    });
    const subIds = users.filter(u => u.reportingToId === user.id).map(u => u.id);
    setSelectedSubordinateIds(subIds);
    setFormPermissions(getUserPermissions(user.id, user.role));
  };

  // Quick toggle in permissions matrix
  const handleMatrixToggle = (userId: string, userRole: string, permKey: keyof UserPermissions) => {
    const current = getUserPermissions(userId, userRole);
    const updated: UserPermissions = {
      ...current,
      [permKey]: !current[permKey]
    };
    saveUserPermission(userId, updated);
    setPermissionsMap(prev => ({
      ...prev,
      [userId]: updated
    }));
    const permLabel = permKey === 'canEditDoctor' ? 'Doctor Edit' :
                       permKey === 'canDeleteDoctor' ? 'Doctor Delete' :
                       permKey === 'canEditChemist' ? 'Chemist Edit' : 'Chemist Delete';
    const statusText = updated[permKey] ? 'ENABLED' : 'DISABLED';
    showToast(`${permLabel} permission ${statusText} for ${users.find(u => u.id === userId)?.name || userId}`);
  };

  // Batch permission update
  const handleBatchRolePermission = (roleName: string, permKey: keyof UserPermissions, value: boolean) => {
    const all = { ...getAllUserPermissions() };
    const targetUsers = users.filter(u => u.role.toLowerCase().includes(roleName.toLowerCase()));
    targetUsers.forEach(u => {
      const current = all[u.id] || getDefaultPermissionsForRole(u.role);
      all[u.id] = { ...current, [permKey]: value };
    });
    saveAllUserPermissions(all);
    setPermissionsMap(all);
    showToast(`Updated ${permKey} for all ${targetUsers.length} ${roleName} users!`);
  };

  // Save Add Employee
  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Please enter both employee name and email address.');
      return;
    }

    const loggedIn = getLoggedInUser();
    const nextIdNum = 1000 + users.length + 1;
    const newUser: Employee = {
      id: `EMP-${nextIdNum}`,
      name: formData.name.trim(),
      role: formData.role,
      email: formData.email.trim(),
      phone: formData.phone.trim() || '+91 98765 43210',
      hq: formData.hq,
      status: formData.status,
      lastActive: 'Just now',
      reportingToId: formData.reportingToId || undefined,
      reportingToName: formData.reportingToName || undefined,
      divisionId: loggedIn?.divisionId,
      divisionName: loggedIn?.divisionName
    };

    const updated = [newUser, ...users];
    setUsers(updated);
    try {
      localStorage.setItem(`raxon_users_master_${activeCompanyId}`, JSON.stringify(updated));
      await saveEmployeesAsProfiles(activeCompanyId, updated);
    } catch (err) {
      console.error(err);
    }

    saveUserPermission(newUser.id, formPermissions);
    setPermissionsMap(prev => ({ ...prev, [newUser.id]: formPermissions }));
    setIsAddModalOpen(false);
    showToast(`Employee "${newUser.name}" (${newUser.id}) successfully added with configured permissions!`);

    // Dispatch welcome email to the newly created employee
    const activeComp = getActiveCompany();
    const tempPassword = generateSecureTemporaryPassword(12);
    
    supabase.auth.getSession().then(({ data }) => {
      const token = data?.session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      fetch('/api/email/send-credentials', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: newUser.email,
          name: newUser.name,
          password: tempPassword,
          companyName: activeComp?.name || 'Raxon SFA',
          companyId: activeCompanyId,
          role: newUser.role
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          showToast(data.simulated 
            ? `Welcome email simulated for ${newUser.email} (No SMTP config)` 
            : `Welcome email sent successfully to ${newUser.email}`
          );
        } else {
          console.warn('Welcome email warning:', data.error || data.message);
        }
      })
      .catch(err => {
        console.error('Failed to send credentials welcome email:', err);
      });
    });
  };

  // Save Edit Employee
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Please enter both employee name and email address.');
      return;
    }

    const loggedIn = getLoggedInUser();
    const updated = users.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: formData.name.trim(),
          role: formData.role,
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          hq: formData.hq,
          status: formData.status,
          reportingToId: formData.reportingToId || undefined,
          reportingToName: formData.reportingToName || undefined,
          divisionId: u.divisionId || loggedIn?.divisionId,
          divisionName: u.divisionName || loggedIn?.divisionName
        };
      }
      return u;
    });

    const finalUsers = updated.map(u => {
      if (u.id === editingUser.id) return u;
      const isSelectedSub = selectedSubordinateIds.includes(u.id);
      if (isSelectedSub) {
        return {
          ...u,
          reportingToId: editingUser.id,
          reportingToName: formData.name.trim()
        };
      } else if (u.reportingToId === editingUser.id) {
        return {
          ...u,
          reportingToId: undefined,
          reportingToName: undefined
        };
      }
      return u;
    });

    setUsers(finalUsers);
    try {
      localStorage.setItem(`raxon_users_master_${activeCompanyId}`, JSON.stringify(finalUsers));
      await saveEmployeesAsProfiles(activeCompanyId, finalUsers);
    } catch (err) {
      console.error(err);
    }

    saveUserPermission(editingUser.id, formPermissions);
    setPermissionsMap(prev => ({ ...prev, [editingUser.id]: formPermissions }));
    setEditingUser(null);
    showToast(`User details, hierarchy & permissions for "${formData.name}" updated successfully!`);
  };

  // Request Toggle Status with Confirmation
  const handleRequestToggleStatus = (user: Employee) => {
    const nextStatus: 'Active' | 'Inactive' = user.status === 'Active' ? 'Inactive' : 'Active';
    setConfirmStatusUser({ user, nextStatus });
  };

  // Confirm Status Execution
  const handleExecuteStatusToggle = async () => {
    if (!confirmStatusUser) return;
    const { user, nextStatus } = confirmStatusUser;
    const updated = users.map(u => {
      if (u.id === user.id) {
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
    try {
      localStorage.setItem(`raxon_users_master_${activeCompanyId}`, JSON.stringify(updated));
      await saveEmployeesAsProfiles(activeCompanyId, updated);
    } catch (e) {
      console.error(e);
    }
    showToast(`User "${user.name}" status changed to ${nextStatus}.`);
    setConfirmStatusUser(null);
  };

  // Delete User Execution
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    const updated = users.filter(u => u.id !== deletingUser.id);
    setUsers(updated);
    try {
      localStorage.setItem(`raxon_users_master_${activeCompanyId}`, JSON.stringify(updated));
      await saveEmployeesAsProfiles(activeCompanyId, updated);
    } catch (e) {
      console.error(e);
    }
    showToast(`Employee "${deletingUser.name}" deleted successfully.`);
    setDeletingUser(null);
  };

  // Open Password Reset
  const handleOpenResetPassword = (user: Employee) => {
    setResettingUser(user);
    const pass = generateSecureTemporaryPassword(12);
    setGeneratedPassword(pass);
    setIsCopied(false);
  };

  // Copy Password
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    showToast('Password copied to clipboard!');
  };

  // Export Users to CSV
  const handleExportCSV = () => {
    const headers = ['Employee ID', 'Name', 'Role', 'Email', 'Phone', 'Assigned Territory/HQ', 'Status', 'Last Active'];
    const rows = users.map(u => [
      `"${u.id}"`,
      `"${u.name}"`,
      `"${u.role}"`,
      `"${u.email}"`,
      `"${u.phone}"`,
      `"${u.hq}"`,
      `"${u.status}"`,
      `"${u.lastActive}"`
    ].join(','));

    const csvContent = `${headers.join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Raxon_Employee_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Employee list exported to CSV successfully!');
  };

  // Filtered Users
  const filteredUsers = users
    .filter(user => {
      // 1. Division Isolation for DSA
      const loggedIn = getLoggedInUser();
      const isDsa = loggedIn && (loggedIn.role === 'ZM' || loggedIn.roleTitle?.toLowerCase().includes('division system admin') || loggedIn.roleTitle?.toLowerCase().includes('dsa'));
      if (isDsa && loggedIn?.divisionName) {
        const dsaDiv = loggedIn.divisionName.toLowerCase();
        const uDiv = (user.divisionName || '').toLowerCase();
        const reportsToDsa = user.reportingToId && user.reportingToId.toLowerCase() === loggedIn.id.toLowerCase();
        const isSelf = user.id.toLowerCase() === loggedIn.id.toLowerCase();
        
        let reportsIndirectly = false;
        let current: any = user;
        const visited = new Set<string>();
        while (current && current.reportingToId) {
          const parentId = current.reportingToId.toLowerCase();
          if (visited.has(parentId)) break;
          visited.add(parentId);
          if (parentId === loggedIn.id.toLowerCase()) {
            reportsIndirectly = true;
            break;
          }
          current = users.find(u => u.id.toLowerCase() === parentId);
        }

        if (!isSelf && !reportsToDsa && !reportsIndirectly && !uDiv.includes(dsaDiv)) {
          return false;
        }
      }
      return true;
    })
    .filter(user => {
      // 2. Hide reporting managers & upper management for all roles
      const loggedIn = getLoggedInUser();
      if (!loggedIn) return true;
      
      const loggedInRank = getRoleRank(loggedIn.roleTitle || loggedIn.role);
      const userRank = getRoleRank(user.role);
      
      // Hide anyone with a strictly higher role rank
      if (userRank > loggedInRank && user.id.toLowerCase() !== loggedIn.id.toLowerCase()) {
        return false;
      }

      // Hide direct/indirect supervisors in reporting chain
      let isSupervisor = false;
      let currentId = loggedIn.reportingToId;
      const visited = new Set<string>();
      while (currentId) {
        const cidLower = currentId.toLowerCase();
        if (visited.has(cidLower)) break;
        visited.add(cidLower);
        
        if (user.id.toLowerCase() === cidLower) {
          isSupervisor = true;
          break;
        }
        const mgr = users.find(u => u.id.toLowerCase() === cidLower);
        currentId = mgr?.reportingToId;
      }

      if (isSupervisor) return false;
      return true;
    })
    .filter(user => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = user.name.toLowerCase().includes(q) || 
                            user.id.toLowerCase().includes(q) ||
                            user.email.toLowerCase().includes(q) ||
                            user.hq.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'All' || user.role.includes(roleFilter);
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });

  return (
    <div className="space-y-6 relative">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-gray-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white text-xs ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Super Admin Company Selector Banner */}
      {(() => {
        const loggedIn = getLoggedInUser();
        const isSuperAdmin = loggedIn?.role === 'SUPER_ADMIN' || (loggedIn?.roleTitle && loggedIn.roleTitle.toLowerCase().includes('super admin'));
        if (!isSuperAdmin) return null;
        const companies = getStoredCompanies();
        return (
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-black">Super Admin Tenant Selector</h2>
              </div>
              <p className="text-xs text-purple-200 mt-1">
                Select a company tenant below to inspect and manage its Field Force, Users, and Permissions.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {companies.map(comp => (
                <button
                  key={comp.id}
                  onClick={async () => {
                    setActiveCompanyId(comp.id);
                    window.dispatchEvent(new CustomEvent('raxon-company-switched', { detail: { companyId: comp.id } }));
                    showToast(`Switched to company tenant: ${comp.name}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCompanyId === comp.id
                      ? 'bg-amber-400 text-purple-950 shadow-md font-black scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {comp.name} ({comp.code})
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">User Management & Permissions</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {users.length} Total Users
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Create employees, assign territories, and manage <b>Doctor & Chemist Edit/Delete rights</b> per user.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 shadow-2xs transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2 text-gray-500" /> Export CSV
          </button>
          <button 
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium flex items-center shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Employee
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 bg-white rounded-2xl p-1.5 shadow-2xs">
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'employees'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <UserIcon className="w-4 h-4 mr-2" /> All Employees ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all ml-2 ${
            activeTab === 'permissions'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Shield className="w-4 h-4 mr-2 text-amber-300" /> Doctor & Chemist Access Control (एडिट/डिलीट अधिकार)
        </button>
      </div>

      {/* TAB 1: EMPLOYEES DIRECTORY */}
      {activeTab === 'employees' && (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/60">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, HQ, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm w-full focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-shadow"
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium text-gray-700"
              >
                <option value="All">All Roles</option>
                <option value="System Admin">System Admin</option>
                <option value="RM">Regional Manager (RM)</option>
                <option value="AM">Area Manager (AM)</option>
                <option value="MR">Medical Representative (MR)</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium text-gray-700"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role & Assignment</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Permissions</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const p = getUserPermissions(user.id, user.role);
                  return (
                    <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200">
                            {user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                          </div>
                          <div className="ml-3.5">
                            <div className="text-sm font-bold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500 font-mono font-medium">{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{user.role}</div>
                        <div className="text-xs text-indigo-700 font-medium mt-0.5 flex items-center">
                          <Building className="w-3 h-3 mr-1 text-gray-400" />
                          {user.hq}
                        </div>
                        {user.reportingToName && (
                          <div className="text-[10px] text-slate-500 font-semibold mt-1 flex items-center bg-slate-50 border border-slate-200/50 p-0.5 px-1.5 rounded w-fit">
                            <span className="text-slate-400 font-medium mr-1">Reports To:</span>
                            <span className="text-slate-700 font-bold">{user.reportingToName}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-800 flex items-center">
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-0.5">
                          <PhoneIcon className="w-3 h-3 mr-1.5 text-gray-400" />
                          {user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1 items-center max-w-xs">
                          <span className={`text-3xs px-2 py-0.5 rounded font-bold ${
                            p.canEditDoctor ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-400 line-through'
                          }`}>
                            Doc Edit
                          </span>
                          <span className={`text-3xs px-2 py-0.5 rounded font-bold ${
                            p.canDeleteDoctor ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-400 line-through'
                          }`}>
                            Doc Del
                          </span>
                          <span className={`text-3xs px-2 py-0.5 rounded font-bold ${
                            p.canEditChemist ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400 line-through'
                          }`}>
                            Chem Edit
                          </span>
                          <span className={`text-3xs px-2 py-0.5 rounded font-bold ${
                            p.canDeleteChemist ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-400 line-through'
                          }`}>
                            Chem Del
                          </span>
                          <span className={`text-3xs px-2 py-0.5 rounded font-bold flex items-center gap-0.5 ${
                            p.isGeolocationEnabled ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Navigation className="w-2.5 h-2.5" />
                            {p.isGeolocationEnabled ? 'GPS ON' : 'GPS OFF'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleRequestToggleStatus(user)}
                          title="Click to toggle Active / Inactive"
                          className="group cursor-pointer text-left"
                        >
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-800 border border-green-200 group-hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200 group-hover:bg-red-200'
                          }`}>
                            {user.status === 'Active' ? <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600" /> : <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" />}
                            {user.status}
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">Last active: {user.lastActive}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-1">
                          {/* Manage Master Permissions Modal Trigger */}
                          <button 
                            onClick={() => setPermissionManagingUser(user)}
                            className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors" 
                            title="Manage Doctor & Chemist Edit/Delete Permissions"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenEdit(user)}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                            title="Edit User Profile"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {(() => {
                            const profile = getStoredUserProfiles().find(p => p.id.toLowerCase() === user.id.toLowerCase());
                            if (profile?.metrics?.punchInLocked) {
                              return (
                                <button 
                                  onClick={async () => {
                                    await resetUserPunchIn(user.id);
                                    setUsers(loadDynamicEmployees(activeCompanyId));
                                  }}
                                  className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors animate-pulse" 
                                  title="Reset & Unlock Punch-In"
                                >
                                  <Unlock className="w-4 h-4 text-amber-600" />
                                </button>
                              );
                            }
                            return null;
                          })()}
                          <button 
                            onClick={() => handleOpenResetPassword(user)}
                            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                            title="Reset & Generate Password"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleRequestToggleStatus(user)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === 'Active' 
                                ? 'text-gray-500 hover:text-red-600 hover:bg-red-50' 
                                : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => setDeletingUser(user)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No users found matching your search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR & CHEMIST PERMISSIONS MATRIX */}
      {activeTab === 'permissions' && (
        <div className="space-y-5">
          {/* Summary Banner & Stats */}
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-6 text-white shadow-xs">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-amber-300" />
                  <h2 className="text-xl font-bold">Doctor & Chemist Permission Matrix</h2>
                </div>
                <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
                  System Administrator can configure which Medical Representatives or Managers have Edit and Delete permissions in the Doctor and Chemist directories.
                </p>
              </div>

              {/* Quick Preset Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleBatchRolePermission('Medical Representative', 'canEditDoctor', true)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/20 transition-colors"
                >
                  Allow All MR Doc Edit
                </button>
                <button
                  onClick={() => handleBatchRolePermission('Medical Representative', 'canDeleteDoctor', false)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/20 transition-colors"
                >
                  Revoke MR Doc Delete
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
                <div className="text-2xs text-indigo-200 font-semibold flex items-center">
                  <Stethoscope className="w-3.5 h-3.5 mr-1" /> Doc Edit Enabled
                </div>
                <div className="text-xl font-bold mt-1">
                  {users.filter(u => getUserPermissions(u.id, u.role).canEditDoctor).length} / {users.length} Users
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
                <div className="text-2xs text-red-200 font-semibold flex items-center">
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Doc Delete Enabled
                </div>
                <div className="text-xl font-bold mt-1">
                  {users.filter(u => getUserPermissions(u.id, u.role).canDeleteDoctor).length} / {users.length} Users
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
                <div className="text-2xs text-emerald-200 font-semibold flex items-center">
                  <Building2 className="w-3.5 h-3.5 mr-1" /> Chemist Edit Enabled
                </div>
                <div className="text-xl font-bold mt-1">
                  {users.filter(u => getUserPermissions(u.id, u.role).canEditChemist).length} / {users.length} Users
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
                <div className="text-2xs text-red-200 font-semibold flex items-center">
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Chemist Delete Enabled
                </div>
                <div className="text-xl font-bold mt-1">
                  {users.filter(u => getUserPermissions(u.id, u.role).canDeleteChemist).length} / {users.length} Users
                </div>
              </div>
            </div>
          </div>

          {/* Permissions Matrix Interactive Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/60">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter users by name, role or HQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm w-full focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-shadow"
                />
              </div>
              <div className="text-xs text-gray-500">
                Click any toggle below to immediately update employee permissions.
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User & Role</th>
                    <th className="px-4 py-3.5 text-center text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50/50">
                      🩺 Doctor Edit
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-bold text-red-700 uppercase tracking-wider bg-red-50/30">
                      🩺 Doctor Delete
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50/50">
                      💊 Chemist Edit
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-bold text-red-700 uppercase tracking-wider bg-red-50/30">
                      💊 Chemist Delete
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/60">
                      📍 Geolocation (GPS)
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Detailed Config</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const p = getUserPermissions(user.id, user.role);
                    const isAdmin = user.role.toLowerCase().includes('admin');

                    return (
                      <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-9 w-9 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                              {user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-bold text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500 font-medium">{user.role} • {user.hq}</div>
                            </div>
                          </div>
                        </td>

                        {/* Doctor Edit Toggle */}
                        <td className="px-4 py-4 whitespace-nowrap text-center bg-indigo-50/20">
                          {isAdmin ? (
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Always ON</span>
                          ) : (
                            <button
                              onClick={() => handleMatrixToggle(user.id, user.role, 'canEditDoctor')}
                              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                                p.canEditDoctor
                                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                            >
                              {p.canEditDoctor ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                              {p.canEditDoctor ? 'Enabled' : 'Disabled'}
                            </button>
                          )}
                        </td>

                        {/* Doctor Delete Toggle */}
                        <td className="px-4 py-4 whitespace-nowrap text-center bg-red-50/10">
                          {isAdmin ? (
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Always ON</span>
                          ) : (
                            <button
                              onClick={() => handleMatrixToggle(user.id, user.role, 'canDeleteDoctor')}
                              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                                p.canDeleteDoctor
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                            >
                              {p.canDeleteDoctor ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                              {p.canDeleteDoctor ? 'Enabled' : 'Disabled'}
                            </button>
                          )}
                        </td>

                        {/* Chemist Edit Toggle */}
                        <td className="px-4 py-4 whitespace-nowrap text-center bg-emerald-50/20">
                          {isAdmin ? (
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Always ON</span>
                          ) : (
                            <button
                              onClick={() => handleMatrixToggle(user.id, user.role, 'canEditChemist')}
                              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                                p.canEditChemist
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                            >
                              {p.canEditChemist ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                              {p.canEditChemist ? 'Enabled' : 'Disabled'}
                            </button>
                          )}
                        </td>

                        {/* Chemist Delete Toggle */}
                        <td className="px-4 py-4 whitespace-nowrap text-center bg-red-50/10">
                          {isAdmin ? (
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Always ON</span>
                          ) : (
                            <button
                              onClick={() => handleMatrixToggle(user.id, user.role, 'canDeleteChemist')}
                              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                                p.canDeleteChemist
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                            >
                              {p.canDeleteChemist ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                              {p.canDeleteChemist ? 'Enabled' : 'Disabled'}
                            </button>
                          )}
                        </td>

                        {/* Geolocation GPS Tracking Toggle */}
                        <td className="px-4 py-4 whitespace-nowrap text-center bg-emerald-50/30">
                          <button
                            onClick={() => handleMatrixToggle(user.id, user.role, 'isGeolocationEnabled')}
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                              p.isGeolocationEnabled
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                            title="Click to turn GPS location tracking ON/OFF for this employee"
                          >
                            <Navigation className={`w-3.5 h-3.5 mr-1.5 ${p.isGeolocationEnabled ? 'text-white animate-pulse' : 'text-gray-400'}`} />
                            {p.isGeolocationEnabled ? 'GPS ON' : 'GPS OFF'}
                          </button>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setPermissionManagingUser(user)}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Sliders className="w-3.5 h-3.5 mr-1" /> Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 1: ADD EMPLOYEE --- */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Employee" maxWidth="max-w-2xl">
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="e.g. Vikas Jaiswal" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Employee ID (Auto)</label>
              <input 
                type="text" 
                readOnly
                value={`EMP-${1000 + users.length + 1}`}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-gray-100 text-gray-600 font-mono outline-none" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="vikas.j@raxon.com" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile Number</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="+91 94150 12345" 
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-1 text-indigo-600" /> Role & Territory Assignment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">System Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setFormData({ ...formData, role: newRole });
                    setFormPermissions(getDefaultPermissionsForRole(newRole));
                  }}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                >
                  <option>Medical Representative (MR)</option>
                  <option>Area Manager (AM)</option>
                  <option>Regional Manager (RM)</option>
                  <option>System Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Assigned Territory / HQ *</label>
                <select 
                  required
                  value={formData.hq}
                  onChange={(e) => setFormData({ ...formData, hq: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                >
                  <option value="">Select Headquarters (Add in HQ Management)</option>
                  {getAllHeadquarters(activeCompanyId).map(h => (
                    <option key={h.id} value={h.name}>{h.name} ({h.code} - {h.district})</option>
                  ))}
                </select>
                {getAllHeadquarters(activeCompanyId).length === 0 && (
                  <p className="text-3xs text-amber-600 mt-1 font-semibold">No Headquarters found. Please create Head Quarters in HQ Management tab first.</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Reports To / Supervisor</label>
                <select
                  value={formData.reportingToId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedName = potentialManagers.find(m => m.id === selectedId)?.name || '';
                    setFormData({ 
                      ...formData, 
                      reportingToId: selectedId, 
                      reportingToName: selectedName 
                    });
                  }}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                >
                  <option value="">No Direct Supervisor (Ultimate Authority)</option>
                  {potentialManagers.map(mgr => (
                    <option key={mgr.id} value={mgr.id}>
                      {mgr.name} ({mgr.role}) - ID: {mgr.id}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-500 mt-1">
                  Defines the reporting hierarchy. Users added by an admin are managed under their assigned supervisor.
                </p>
              </div>
            </div>
          </div>

          {/* Doctor & Chemist Permissions Assignment */}
          <div className="border-t border-gray-100 pt-4 mt-2 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Doctor & Chemist Edit/Delete Master Permissions
            </h4>
            <p className="text-2xs text-gray-500 mb-3">
              Configure what this employee is allowed to modify or remove in Master Directories.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <label className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors">
                <input
                  type="checkbox"
                  checked={formPermissions.canEditDoctor}
                  onChange={(e) => setFormPermissions({ ...formPermissions, canEditDoctor: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-gray-800">🩺 Edit Doctors</span>
              </label>

              <label className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300 transition-colors">
                <input
                  type="checkbox"
                  checked={formPermissions.canDeleteDoctor}
                  onChange={(e) => setFormPermissions({ ...formPermissions, canDeleteDoctor: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <span className="text-xs font-semibold text-gray-800">🩺 Delete Doctors</span>
              </label>

              <label className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300 transition-colors">
                <input
                  type="checkbox"
                  checked={formPermissions.canEditChemist}
                  onChange={(e) => setFormPermissions({ ...formPermissions, canEditChemist: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-gray-800">💊 Edit Chemists</span>
              </label>

              <label className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300 transition-colors">
                <input
                  type="checkbox"
                  checked={formPermissions.canDeleteChemist}
                  onChange={(e) => setFormPermissions({ ...formPermissions, canDeleteChemist: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <span className="text-xs font-semibold text-gray-800">💊 Delete Chemists</span>
              </label>

              <label className="flex items-center space-x-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 cursor-pointer hover:border-emerald-400 transition-colors col-span-2">
                <input
                  type="checkbox"
                  checked={formPermissions.isGeolocationEnabled}
                  onChange={(e) => setFormPermissions({ ...formPermissions, isGeolocationEnabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  📍 Enforce Geolocation (GPS Tracking & Punch-in)
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-4">
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
              Save Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL 2: EDIT EMPLOYEE --- */}
      {editingUser && (
        <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title={`Edit Employee - ${editingUser.name} (${editingUser.id})`} maxWidth="max-w-2xl">
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Employee ID</label>
                <input 
                  type="text" 
                  readOnly
                  value={editingUser.id}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-gray-100 text-gray-600 font-mono outline-none" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4 mt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">System Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                >
                  <option>Medical Representative (MR)</option>
                  <option>Area Manager (AM)</option>
                  <option>Regional Manager (RM)</option>
                  <option>System Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Territory / HQ *</label>
                <select 
                  required
                  value={formData.hq}
                  onChange={(e) => setFormData({ ...formData, hq: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                >
                  <option value="">Select Headquarters</option>
                  {getAllHeadquarters(activeCompanyId).map(h => (
                    <option key={h.id} value={h.name}>{h.name} ({h.code} - {h.district})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="sm:col-span-3 mt-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Reports To / Supervisor</label>
                <select
                  value={formData.reportingToId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedName = potentialManagers.find(m => m.id === selectedId)?.name || '';
                    setFormData({ 
                      ...formData, 
                      reportingToId: selectedId, 
                      reportingToName: selectedName 
                    });
                  }}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                >
                  <option value="">No Direct Supervisor (Ultimate Authority)</option>
                  {potentialManagers.map(mgr => (
                    <option key={mgr.id} value={mgr.id}>
                      {mgr.name} ({mgr.role}) - ID: {mgr.id}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-500 mt-1">
                  Defines the reporting hierarchy. Users added by an admin are managed under their assigned supervisor.
                </p>
              </div>

              {/* Subordinates Multi-Select Section */}
              <div className="sm:col-span-3 mt-3 border-t border-gray-100 pt-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Subordinates / Team Members Reporting To This User (Multiple Select)
                  </label>
                  {/* Role Filter Tabs */}
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-3xs font-bold">
                    {(['ALL', 'ADMINS', 'RM', 'AM', 'MR'] as const).map(tab => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setSubordinateRoleFilter(tab)}
                        className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                          subordinateRoleFilter === tab
                            ? 'bg-indigo-600 text-white shadow-2xs font-black'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-xl p-2.5 space-y-2 bg-gray-50">
                  {(() => {
                    const editingUserRank = getRoleRank(editingUser.role);
                    const filteredList = users.filter(emp => {
                      if (emp.id === editingUser.id) return false;
                      const empRank = getRoleRank(emp.role);
                      if (empRank >= editingUserRank) return false;

                      if (subordinateRoleFilter === 'ALL') return true;
                      if (subordinateRoleFilter === 'ADMINS') return empRank === 4;
                      if (subordinateRoleFilter === 'RM') return emp.role.toLowerCase().includes('rm') || emp.role.toLowerCase().includes('regional');
                      if (subordinateRoleFilter === 'AM') return emp.role.toLowerCase().includes('am') || emp.role.toLowerCase().includes('area');
                      if (subordinateRoleFilter === 'MR') return emp.role.toLowerCase().includes('mr') || emp.role.toLowerCase().includes('representative');
                      return true;
                    });

                    if (filteredList.length === 0) {
                      return (
                        <p className="text-xs text-gray-500 italic p-2 text-center">
                          No eligible subordinates found matching this role filter and corporate hierarchy.
                        </p>
                      );
                    }

                    return filteredList.map(emp => {
                      const isChecked = selectedSubordinateIds.includes(emp.id);
                      return (
                        <label key={emp.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 cursor-pointer">
                          <div className="flex items-center space-x-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSubordinateIds([...selectedSubordinateIds, emp.id]);
                                } else {
                                  setSelectedSubordinateIds(selectedSubordinateIds.filter(id => id !== emp.id));
                                }
                              }}
                              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <div>
                              <div className="text-xs font-bold text-gray-900">{emp.name} ({emp.id})</div>
                              <div className="text-[10px] text-gray-500">{emp.role} • HQ: {emp.hq}</div>
                            </div>
                          </div>
                          {emp.reportingToName && (
                            <span className="text-[10px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                              Reports To: {emp.reportingToName}
                            </span>
                          )}
                        </label>
                      );
                    });
                  })()}
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Selected team members will instantly have their reporting manager set to this user upon saving. Filtered automatically by corporate hierarchy.
                </p>
              </div>
            </div>

            {/* Doctor & Chemist Permissions Assignment */}
            <div className="border-t border-gray-100 pt-4 mt-2 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center">
                <Shield className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Doctor & Chemist Edit/Delete Master Permissions
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                <label className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={formPermissions.canEditDoctor}
                    onChange={(e) => setFormPermissions({ ...formPermissions, canEditDoctor: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-xs font-semibold text-gray-800">🩺 Edit Doctors</span>
                </label>

                <label className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={formPermissions.canDeleteDoctor}
                    onChange={(e) => setFormPermissions({ ...formPermissions, canDeleteDoctor: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="text-xs font-semibold text-gray-800">🩺 Delete Doctors</span>
                </label>

                <label className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-emerald-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={formPermissions.canEditChemist}
                    onChange={(e) => setFormPermissions({ ...formPermissions, canEditChemist: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-gray-800">💊 Edit Chemists</span>
                </label>

                <label className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={formPermissions.canDeleteChemist}
                    onChange={(e) => setFormPermissions({ ...formPermissions, canDeleteChemist: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="text-xs font-semibold text-gray-800">💊 Delete Chemists</span>
                </label>

                <label className="flex items-center space-x-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 cursor-pointer hover:border-emerald-400 transition-colors col-span-2">
                  <input
                    type="checkbox"
                    checked={formPermissions.isGeolocationEnabled}
                    onChange={(e) => setFormPermissions({ ...formPermissions, isGeolocationEnabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                    📍 Enforce Geolocation (GPS Tracking & Punch-in)
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-4">
              <button 
                type="button" 
                onClick={() => setEditingUser(null)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-xs"
              >
                Update & Save
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* --- MODAL: GRANULAR USER PERMISSION SETTINGS --- */}
      {permissionManagingUser && (
        <UserPermissionModal
          isOpen={!!permissionManagingUser}
          onClose={() => setPermissionManagingUser(null)}
          user={permissionManagingUser}
          onSaved={() => {
            setPermissionsMap(getAllUserPermissions());
            showToast(`Master permissions updated for ${permissionManagingUser.name}!`);
          }}
        />
      )}

      {/* --- MODAL 3: RESET PASSWORD --- */}
      {resettingUser && (
        <Modal isOpen={!!resettingUser} onClose={() => setResettingUser(null)} title={`Reset Password - ${resettingUser.name}`}>
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
              <Key className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <span className="font-bold">Generate Temporary Credentials:</span> A temporary login password has been generated for <b>{resettingUser.name}</b> ({resettingUser.email}).
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
              <label className="block text-xs font-bold text-gray-600 uppercase">Generated Temporary Password</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  readOnly 
                  value={generatedPassword} 
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-mono text-sm font-bold text-indigo-700 tracking-wider outline-none"
                />
                <button 
                  onClick={handleCopyPassword}
                  className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium flex items-center shrink-0 transition-colors"
                >
                  {isCopied ? <Check className="w-4 h-4 mr-1 text-emerald-300" /> : <Copy className="w-4 h-4 mr-1" />}
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[11px] text-gray-500">The employee will be required to change this on their next mobile login.</p>
            </div>

            <div className="pt-3 flex justify-end space-x-3 border-t border-gray-100">
              <button 
                onClick={() => setResettingUser(null)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                Close
              </button>
              <button 
                onClick={async () => {
                  showToast(`New password applied for ${resettingUser.name}.`);
                  setResettingUser(null);
                }} 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium shadow-xs"
              >
                Save & Notify Employee
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* --- CONFIRMATION 1: STATUS CHANGE MODAL --- */}
      {confirmStatusUser && (
        <ConfirmModal
          isOpen={!!confirmStatusUser}
          onClose={() => setConfirmStatusUser(null)}
          onConfirm={handleExecuteStatusToggle}
          type={confirmStatusUser.nextStatus === 'Inactive' ? 'warning' : 'success'}
          title={confirmStatusUser.nextStatus === 'Inactive' ? 'यूज़र को Inactive करें? / Deactivate User?' : 'यूज़र को Active करें? / Activate User?'}
          message={
            confirmStatusUser.nextStatus === 'Inactive'
              ? `क्या आप वाकई ${confirmStatusUser.user.name} को Inactive करना चाहते हैं? वे ऐप में लॉगिन नहीं कर पाएंगे।`
              : `क्या आप वाकई ${confirmStatusUser.user.name} को फिर से Active करना चाहते हैं?`
          }
          subMessage="गलती से टच होने से बचाने के लिए यह पुष्टि आवश्यक है।"
          itemName={`${confirmStatusUser.user.name} (${confirmStatusUser.user.id}) • ${confirmStatusUser.user.role} • ${confirmStatusUser.user.hq}`}
          confirmText={confirmStatusUser.nextStatus === 'Inactive' ? 'हाँ, Deactivate करें' : 'हाँ, Activate करें'}
          cancelText="नहीं, रद्द करें (Cancel)"
        />
      )}

      {/* --- CONFIRMATION 2: DELETE MODAL --- */}
      {deletingUser && (
        <ConfirmModal
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleConfirmDelete}
          type="danger"
          title="Delete Employee Account?"
          message={`Are you sure you want to permanently delete ${deletingUser.name} from the organization?`}
          subMessage="Warning: This action cannot be undone. Please confirm to ensure data security."
          itemName={`${deletingUser.name} (${deletingUser.id}) • ${deletingUser.role} • ${deletingUser.hq}`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
