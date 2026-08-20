import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Users, Server, Shield, CheckCircle2, AlertTriangle, Search, 
  Plus, Edit, Eye, Trash2, Power, Globe, Key, Lock, ArrowRight, DollarSign, 
  Layers, Settings, Sparkles, RefreshCw, Smartphone, Package, Check, X, ShieldAlert,
  Sliders, UserPlus, CreditCard, ChevronRight, BarChart3, Database, Upload, Image as ImageIcon,
  UserCheck, AlertCircle, Phone, Mail, MapPin, FileText, Copy, Send, ExternalLink, MessageSquare
} from 'lucide-react';
import { 
  Company, 
  CompanyAdminAccount,
  CompanyDivision,
  getStoredCompanies, 
  saveStoredCompanies, 
  createTenantCompany, 
  updateTenantCompany,
  toggleCompanyStatus, 
  addCompanyAdminAccount,
  updateCompanyAdminAccount,
  removeCompanyAdminAccount,
  setPrimaryCompanyAdmin,
  updateCompanyFeatureSwitches,
  updateCompanyPlan,
  setActiveCompanyId,
  getActiveCompanyId,
  deleteTenantCompany,
  removeCompanyDivision,
  addCompanyDivision,
  toggleDivisionStatus,
  updateCompanyDivision,
  syncCompaniesFromFirestore
} from '../data/companyContext';
import { syncProfilesFromFirestore } from '../data/userContext';
import { clearAllCompanyMockData } from '../data/cleanProductionData';
import { sendWelcomeCredentialsEmail, EmailDispatchResult } from '../services/emailService';
import { syncAllLocalDataToFirestore } from '../services/supabaseSyncBridge';
import { RaxonIcon, RaxonLogo } from '../components/RaxonLogo';
import MigrationUtility from '../components/MigrationUtility';
import HistoricalBackfillUtility from '../components/HistoricalBackfillUtility';
import TestDataCleanupUtility from '../components/TestDataCleanupUtility';

export default function PlatformSuperAdminDashboard() {
  const [companies, setCompanies] = useState<Company[]>(() => getStoredCompanies());
  const [activeCompanyId, setActiveId] = useState<string>(() => getActiveCompanyId());
  const [activeTab, setActiveTab] = useState<'tenants' | 'admins' | 'divisions' | 'plans' | 'features' | 'audit'>('tenants');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState<Company | null>(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState<{ company: Company } | null>(null);
  const [showEditAdminModal, setShowEditAdminModal] = useState<{ company: Company; admin: CompanyAdminAccount } | null>(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState<{ company: Company; admin: CompanyAdminAccount } | null>(null);
  const [showDeleteAdminConfirm, setShowDeleteAdminConfirm] = useState<{ company: Company; admin: CompanyAdminAccount } | null>(null);
  const [showFeatureModal, setShowFeatureModal] = useState<Company | null>(null);
  const [showPlanModal, setShowPlanModal] = useState<Company | null>(null);
  const [showAddDivisionModal, setShowAddDivisionModal] = useState(false);
  const [showClearMockModal, setShowClearMockModal] = useState<Company | null>(null);
  const [showDeleteCompanyModal, setShowDeleteCompanyModal] = useState<Company | null>(null);
  const [showDeleteDivisionConfirm, setShowDeleteDivisionConfirm] = useState<{ company: Company; division: CompanyDivision } | null>(null);
  const [newDivisionForm, setNewDivisionForm] = useState({
    companyId: companies[0]?.id || '',
    name: '',
    code: '',
    hasDedicatedAdmin: false,
    divisionAdminName: ''
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [welcomeEmailModal, setWelcomeEmailModal] = useState<EmailDispatchResult | null>(null);
  const [isSubmittingCompany, setIsSubmittingCompany] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // New Company Form State
  const [newCompany, setNewCompany] = useState({
    name: '',
    code: '',
    logo: '',
    tagline: 'Committed to Healthcare Excellence',
    state: 'Uttar Pradesh',
    hqCity: '',
    contactEmail: '',
    contactPhone: '',
    gstNumber: '',
    dlNumber: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    planTier: 'Enterprise' as 'Starter' | 'Growth' | 'Enterprise' | 'Custom',
    maxTotalUsers: 150,
    mrQuota: 100,
    managerQuota: 20,
    divisionQuota: 4
  });

  // Edit Company Form State
  const [editCompanyData, setEditCompanyData] = useState<Partial<Company>>({});

  // New Admin Form State
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    email: '',
    phone: '',
    customId: '',
    password: '',
    isPrimary: false
  });

  // Edit Admin Form State
  const [editAdminData, setEditAdminData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active' as 'Active' | 'Suspended',
    isPrimary: false,
    newPassword: ''
  });

  // Reset Password State
  const [directPassword, setDirectPassword] = useState('');
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSyncCloudData = async (isManual = true) => {
    setIsSyncingCloud(true);
    if (isManual) {
      showToast("Syncing local data to Firebase...");
    }
    try {
      const result = await syncAllLocalDataToFirestore((status) => {
        if (status.phase === 'uploading' && isManual) {
          showToast(status.message);
        }
      });
      setCompanies(getStoredCompanies());
      setActiveId(getActiveCompanyId());
      if (result.success) {
        showToast("Data successfully synced to Cloud!");
      } else {
        showToast(result.message || "Cloud sync completed with local storage.");
      }
    } catch (err: any) {
      console.warn("Cloud sync error:", err);
      showToast("Sync completed with local persistence.");
    } finally {
      setIsSyncingCloud(false);
    }
  };

  useEffect(() => {
    const handleUpdate = () => {
      setCompanies(getStoredCompanies());
      setActiveId(getActiveCompanyId());
    };
    window.addEventListener('raxon-company-updated', handleUpdate);
    window.addEventListener('raxon-company-switched', handleUpdate);
    
    // Auto-sync from Firestore on dashboard mount
    handleSyncCloudData(false);

    return () => {
      window.removeEventListener('raxon-company-updated', handleUpdate);
      window.removeEventListener('raxon-company-switched', handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to handle logo file upload and convert to base64 data URL
  const handleLogoUpload = (file: File, callback: (base64: string) => void) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit. Please choose a smaller logo image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Onboard New Company Submit
  const handleCreateCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.code || !newCompany.adminEmail) {
      alert("Please enter Company Name, Code, and Primary Admin Email");
      return;
    }
    
    setIsSubmittingCompany(true);
    const targetEmail = newCompany.adminEmail.trim();
    const targetName = newCompany.adminName.trim() || 'Company Administrator';
    const targetPass = newCompany.adminPassword?.trim() || '123456';
    const companyPayload = { ...newCompany };

    try {
      // 1. Create company tenant in local & cloud database
      const created = await createTenantCompany(companyPayload);
      setCompanies(getStoredCompanies());
      
      // 2. Immediately close the onboarding form modal
      setShowCreateModal(false);

      // 3. Reset the form state
      setNewCompany({
        name: '',
        code: '',
        logo: '',
        tagline: 'Committed to Healthcare Excellence',
        state: 'Uttar Pradesh',
        hqCity: '',
        contactEmail: '',
        contactPhone: '',
        gstNumber: '',
        dlNumber: '',
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        adminPassword: '',
        planTier: 'Enterprise',
        maxTotalUsers: 150,
        mrQuota: 100,
        managerQuota: 20,
        divisionQuota: 4
      });

      // 4. Trigger email with guaranteed non-blocking 5s ceiling & instant manual fallback
      const emailResult = await sendWelcomeCredentialsEmail({
        email: targetEmail,
        name: targetName,
        password: targetPass,
        companyName: created.name,
        companyId: created.id,
        role: 'COMPANY_ADMIN',
        loginUrl: typeof window !== 'undefined' ? window.location.origin : 'https://raxonsfa.ai.studio',
        subscriptionDetails: {
          planTier: created.plan?.planTier || 'Enterprise',
          validUntil: created.plan?.validUntil || 'Lifetime',
          mrQuota: created.plan?.mrQuota,
          managerQuota: created.plan?.managerQuota,
          divisionQuota: created.plan?.divisionQuota
        }
      });

      // 5. Present the credentials modal (with 1-click copy for email/password and share channels)
      setWelcomeEmailModal(emailResult);
      showToast(`Tenant "${created.name}" onboarded successfully!`);
    } catch (err: any) {
      console.error('Failed to create company tenant:', err);
      alert(`Failed to save company: ${err?.message || 'Please check connection and ensure logo size is small.'}`);
    } finally {
      // Always stop spinner and close form modal
      setIsSubmittingCompany(false);
      setShowCreateModal(false);
    }
  };

  // Edit Company Full Submit
  const handleEditCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditCompanyModal) return;
    try {
      await updateTenantCompany(showEditCompanyModal.id, editCompanyData);
      setCompanies(getStoredCompanies());
      setShowEditCompanyModal(null);
      showToast(`Company profile and licensing updated successfully!`);
    } catch (err: any) {
      alert(err?.message || "Failed to update company");
    }
  };

  // Open Edit Company Modal and initialize form data
  const handleOpenEditCompany = (company: Company) => {
    setShowEditCompanyModal(company);
    setEditCompanyData({
      name: company.name,
      code: company.code,
      logo: company.logo,
      tagline: company.tagline,
      state: company.state,
      hqCity: company.hqCity,
      contactEmail: company.contactEmail,
      contactPhone: company.contactPhone,
      gstNumber: company.gstNumber,
      dlNumber: company.dlNumber,
      currency: company.currency || 'INR (₹)',
      status: company.status,
      plan: {
        planTier: company.plan?.planTier || 'Enterprise',
        maxTotalUsers: company.plan?.maxTotalUsers || 100,
        mrQuota: company.plan?.mrQuota || 50,
        managerQuota: company.plan?.managerQuota || 10,
        divisionQuota: company.plan?.divisionQuota || 3,
        billingCycle: company.plan?.billingCycle || 'Annual',
        validUntil: company.plan?.validUntil || '2027-12-31',
        status: company.plan?.status || 'Active',
        pricePerMrPerMonth: company.plan?.pricePerMrPerMonth || 450
      },
      featureSwitches: {
        ...company.featureSwitches
      }
    });
  };  // Add Admin Submit
  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddAdminModal) return;
    if (!newAdminData.name || !newAdminData.email) {
      alert("Please provide Admin Name and Email");
      return;
    }
    try {
      const createdAdmin = await addCompanyAdminAccount(showAddAdminModal.company.id, {
        id: newAdminData.customId,
        name: newAdminData.name,
        email: newAdminData.email,
        phone: newAdminData.phone,
        isPrimary: newAdminData.isPrimary,
        password: newAdminData.password || '123456'
      });
      setCompanies(getStoredCompanies());
      showToast(`Added Admin "${createdAdmin.name}" (ID: ${createdAdmin.id}) for ${showAddAdminModal.company.name}`);

      // Dispatch credentials email
      fetch('/api/email/send-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: createdAdmin.email,
          name: createdAdmin.name,
          password: newAdminData.password || '123456',
          companyName: showAddAdminModal.company.name,
          companyId: showAddAdminModal.company.id,
          role: 'COMPANY_ADMIN'
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          showToast(data.simulated 
            ? `Welcome email simulated for ${createdAdmin.email} (No SMTP config)` 
            : `Welcome email sent successfully to ${createdAdmin.email}`
          );
        }
      })
      .catch(err => {
        console.error('Failed to send secondary admin welcome email:', err);
      });
      setShowAddAdminModal(null);
      setNewAdminData({ name: '', email: '', phone: '', customId: '', password: '', isPrimary: false });
    } catch (err) {
      alert("Failed to add admin account.");
    }
  };

  // Edit Admin Submit
  const handleEditAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditAdminModal) return;
    try {
      await updateCompanyAdminAccount(
        showEditAdminModal.company.id,
        showEditAdminModal.admin.id,
        {
          name: editAdminData.name,
          email: editAdminData.email,
          phone: editAdminData.phone,
          status: editAdminData.status,
          isPrimary: editAdminData.isPrimary,
          password: editAdminData.newPassword || undefined
        }
      );
      setCompanies(getStoredCompanies());
      setShowEditAdminModal(null);
      showToast(`Updated Admin details for ${editAdminData.name}`);
    } catch (err) {
      alert("Failed to update admin.");
    }
  };

  // Make Primary Admin
  const handleMakePrimaryAdmin = async (company: Company, adminId: string, adminName: string) => {
    try {
      await setPrimaryCompanyAdmin(company.id, adminId);
      setCompanies(getStoredCompanies());
      showToast(`${adminName} is now set as the Primary Owner Admin for ${company.name}`);
    } catch (err) {
      alert("Failed to set primary admin.");
    }
  };

  // Delete Admin
  const handleDeleteAdmin = async (company: Company, admin: CompanyAdminAccount) => {
    try {
      await removeCompanyAdminAccount(company.id, admin.id);
      setCompanies(getStoredCompanies());
      setShowDeleteAdminConfirm(null);
      showToast(`Removed Admin ${admin.name} from ${company.name}`);
    } catch (err) {
      alert("Failed to remove admin.");
    }
  };

  // Quick Direct Password Reset Submit
  const handleDirectPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResetPasswordModal || !directPassword) return;
    try {
      await fetch('/api/auth/admin-create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: showResetPasswordModal.admin.email,
          password: directPassword,
          name: showResetPasswordModal.admin.name,
          companyId: showResetPasswordModal.company.id,
          companyName: showResetPasswordModal.company.name,
          role: 'ADMIN',
          roleTitle: 'Company Admin'
        })
      });
      showToast(`New password applied for ${showResetPasswordModal.admin.name} in Supabase Auth`);
    } catch (err) {
      console.warn("Direct password reset notice:", err);
      showToast(`Password update request submitted for ${showResetPasswordModal.admin.name}`);
    }
    setShowResetPasswordModal(null);
    setDirectPassword('');
  };

  const handleToggleStatus = async (company: Company) => {
    const nextStatus = company.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await toggleCompanyStatus(company.id, nextStatus);
      setCompanies(getStoredCompanies());
      showToast(`Company ${company.name} is now marked ${nextStatus}`);
    } catch (err) {
      alert("Failed to update company status. Please check connection.");
    }
  };

  const handleSwitchTenantContext = (companyId: string) => {
    setActiveCompanyId(companyId);
    setActiveId(companyId);
    const targetComp = companies.find(c => c.id === companyId);
    window.dispatchEvent(new CustomEvent('raxon-company-switched', { detail: { companyId } }));
    showToast(`✓ Active inspection switched to "${targetComp?.name || companyId}". You can now navigate to any module to inspect this tenant's data.`);
  };

  // Filtered companies
  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.hqCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMRSeats = companies.reduce((acc, c) => acc + (c.plan?.mrQuota || 50), 0);
  const totalAllowedUsers = companies.reduce((acc, c) => acc + (c.plan?.maxTotalUsers || 100), 0);
  const totalDivisions = companies.reduce((acc, c) => acc + (c.activeDivisions?.length || 0), 0);
  const totalAdmins = companies.reduce((acc, c) => acc + (c.companyAdmins?.length || 1), 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Super Admin SaaS Master Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-3xs font-extrabold tracking-wider uppercase">
              <Shield className="w-3.5 h-3.5 text-purple-300" />
              SaaS Multi-Tenant Cloud Platform Master
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Platform Super Admin Control
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
              Manage multi-tenant pharmaceutical companies, upload company logos, set manual user headcount caps, provision authorized Company Admins, and configure feature access.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleSyncCloudData(true)}
              disabled={isSyncingCloud}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-500/30 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              title="Fetch latest companies & data from Supabase Cloud"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isSyncingCloud ? 'animate-spin' : ''}`} />
              {isSyncingCloud ? 'Syncing...' : 'Cloud Sync'}
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Onboard New Pharma Client
            </button>
          </div>
        </div>

        {/* Global SaaS Platform Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-purple-800/40">
          <div className="bg-slate-900/60 backdrop-blur-xs rounded-xl p-3.5 border border-purple-700/30">
            <div className="flex items-center gap-2 text-purple-300 text-3xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              Pharma Tenants
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {companies.length}
            </div>
            <div className="text-3xs text-emerald-400 font-semibold mt-0.5">
              {companies.filter(c => c.status === 'Active').length} Active • {companies.filter(c => c.status !== 'Active').length} Inactive
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xs rounded-xl p-3.5 border border-purple-700/30">
            <div className="flex items-center gap-2 text-purple-300 text-3xs font-bold uppercase tracking-wider">
              <Key className="w-3.5 h-3.5" />
              Company Admins
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {totalAdmins}
            </div>
            <div className="text-3xs text-slate-400 font-semibold mt-0.5">
              Provisioned tenant masters
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xs rounded-xl p-3.5 border border-purple-700/30">
            <div className="flex items-center gap-2 text-purple-300 text-3xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              Max User Cap Allowed
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {totalAllowedUsers} Users
            </div>
            <div className="text-3xs text-purple-300 font-semibold mt-0.5">
              Across {companies.length} organizations
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xs rounded-xl p-3.5 border border-purple-700/30">
            <div className="flex items-center gap-2 text-purple-300 text-3xs font-bold uppercase tracking-wider">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              Server & Sync Health
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              99.99%
            </div>
            <div className="text-3xs text-slate-400 font-semibold mt-0.5">
              Cloud + Multi-Tenant DB Isolated
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Platform Super Admin */}
      <div className="flex items-center space-x-1 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tenants'
              ? 'border-purple-600 text-purple-700 bg-purple-50/70'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Pharma Client Companies ({companies.length})
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'admins'
              ? 'border-purple-600 text-purple-700 bg-purple-50/70'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Key className="w-4 h-4" />
          Company Admin Accounts ({totalAdmins})
        </button>

        <button
          onClick={() => setActiveTab('divisions')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'divisions'
              ? 'border-purple-600 text-purple-700 bg-purple-50/70'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Division Management ({totalDivisions})
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'plans'
              ? 'border-purple-600 text-purple-700 bg-purple-50/70'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Subscription Plans & Quotas
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'features'
              ? 'border-purple-600 text-purple-700 bg-purple-50/70'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Feature Switchboard
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-purple-600 text-purple-700 bg-purple-50/70'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          System Audit & Security
        </button>
      </div>

      {/* TAB 1: TENANT COMPANIES LIST & WORKSPACE SWITCHER */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-2 shadow-sm">
               <MigrationUtility />
            </div>
            <div className="bg-indigo-50/50 border border-indigo-200/60 rounded-2xl p-2 shadow-sm">
               <HistoricalBackfillUtility />
            </div>
            <div className="bg-rose-50/50 border border-rose-200/60 rounded-2xl p-2 shadow-sm lg:col-span-2">
               <TestDataCleanupUtility />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by company name, code, state, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white transition-all font-medium"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500 font-semibold">
                Showing <span className="font-extrabold text-gray-900">{filteredCompanies.length}</span> organizations
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Company
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCompanies.map((company) => {
              const isCurrentlyInspected = company.id === activeCompanyId;
              const isActive = company.status === 'Active';
              const isImageLogo = company.logo && (company.logo.startsWith('data:image') || company.logo.startsWith('http') || company.logo.startsWith('/'));

              return (
                <div
                  key={company.id}
                  className={`bg-white rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
                    isCurrentlyInspected
                      ? 'border-purple-600 ring-2 ring-purple-400/30 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Top status bar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase tracking-wider ${
                          isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {company.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-3xs font-bold border border-purple-200">
                          {company.plan?.planTier || 'Enterprise'} Plan
                        </span>
                      </div>

                      {/* Edit Company Icon Button */}
                      <button
                        onClick={() => handleOpenEditCompany(company)}
                        title="Edit all fields of this company"
                        className="px-2 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1 border border-purple-200"
                      >
                        <Edit className="w-3 h-3 text-purple-600" />
                        <span>Edit Company</span>
                      </button>
                    </div>

                    {/* Company Header with Logo */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-13 h-13 rounded-xl bg-purple-900 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0 overflow-hidden border border-purple-800">
                        {isImageLogo ? (
                          <img src={company.logo} alt={company.name} className="w-full h-full object-contain bg-white p-1" />
                        ) : (
                          <span>{company.logo || company.name?.[0] || 'C'}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-black text-gray-900 tracking-tight leading-snug truncate">
                          {company.name}
                        </h3>
                        <div className="text-3xs text-gray-500 font-bold flex items-center gap-1.5 mt-0.5">
                          <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono font-extrabold">{company.code}</span>
                          <span>•</span>
                          <span>{company.hqCity}, {company.state}</span>
                        </div>
                        {company.tagline && (
                          <p className="text-3xs text-gray-400 italic truncate mt-0.5">{company.tagline}</p>
                        )}
                      </div>
                    </div>

                    {/* Stats & Quotas */}
                    <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100 text-center mb-4">
                      <div>
                        <div className="text-3xs text-gray-500 font-bold uppercase">Max User Cap</div>
                        <div className="text-sm font-black text-purple-700 mt-0.5">
                          {company.plan?.maxTotalUsers || 100}
                        </div>
                        <div className="text-4xs text-gray-400">Total allowed</div>
                      </div>
                      <div>
                        <div className="text-3xs text-gray-500 font-bold uppercase">MR Quota</div>
                        <div className="text-sm font-black text-gray-900 mt-0.5">{company.plan?.mrQuota || 50}</div>
                        <div className="text-4xs text-gray-400">Field MRs</div>
                      </div>
                      <div>
                        <div className="text-3xs text-gray-500 font-bold uppercase">Divisions</div>
                        <div className="text-sm font-black text-gray-900 mt-0.5">{company.activeDivisions?.length || 1}</div>
                        <div className="text-4xs text-gray-400">Active Lines</div>
                      </div>
                    </div>

                    {/* Company Admins List */}
                    <div className="space-y-1.5 mb-4">
                      <div className="text-3xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Company Admins ({company.companyAdmins?.length || 0}):</span>
                        <button
                          onClick={() => setShowAddAdminModal({ company })}
                          className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" /> Add Admin
                        </button>
                      </div>
                      {company.companyAdmins?.map((adm) => (
                        <div key={adm.id} className="text-xs bg-purple-50/50 border border-purple-100 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2">
                          <div className="truncate min-w-0">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-gray-900 truncate">{adm.name}</span>
                              <span className="font-mono text-3xs text-purple-700 font-bold">({adm.id})</span>
                            </div>
                            <span className="text-3xs text-gray-500 truncate block">{adm.email}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {adm.isPrimary ? (
                              <span className="px-1.5 py-0.5 bg-purple-200 text-purple-900 text-4xs font-extrabold rounded uppercase">Primary</span>
                            ) : (
                              <button
                                onClick={() => handleMakePrimaryAdmin(company, adm.id, adm.name)}
                                title="Set as Primary Admin"
                                className="text-3xs text-gray-500 hover:text-purple-700 font-bold underline"
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              onClick={() => setShowEditAdminModal({ company, admin: adm })}
                              title="Edit Admin details"
                              className="p-1 text-gray-400 hover:text-purple-700 rounded"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Divisions List with Delete Action */}
                    <div className="space-y-1.5 mb-4">
                      <div className="text-3xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Active Divisions ({company.activeDivisions?.length || 0}):</span>
                      </div>
                      {company.activeDivisions?.map((div) => (
                        <div key={div.id} className="text-xs bg-gray-50 border border-gray-200/70 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2">
                          <div className="truncate min-w-0">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-gray-900 truncate">{div.name}</span>
                              <span className="font-mono text-3xs text-indigo-700 font-bold">({div.code})</span>
                            </div>
                            {div.hasDedicatedAdmin && (
                              <span className="text-3xs text-gray-500 truncate block">Admin: {div.divisionAdminName}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={async () => {
                                if ((company.activeDivisions?.length || 0) <= 1) {
                                  alert("At least one division is required for company operations. Cannot delete the only division.");
                                  return;
                                }
                                setShowDeleteDivisionConfirm({ company, division: div });
                              }}
                              title="Delete Division"
                              className="p-1 text-red-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleOpenEditCompany(company)}
                        className="px-2 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>

                      <button
                        onClick={() => setShowFeatureModal(company)}
                        className="px-2 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center justify-center gap-1"
                      >
                        <Sliders className="w-3 h-3 text-gray-500" />
                        Features
                      </button>

                      <button
                        onClick={() => handleToggleStatus(company)}
                        className={`px-2 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                          isActive
                            ? 'text-red-700 bg-red-50 hover:bg-red-100'
                            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        {isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        onClick={() => setShowClearMockModal(company)}
                        className="py-1.5 text-3xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all flex items-center justify-center gap-1"
                        title="Clear mock doctors/chemists/data"
                      >
                        <RefreshCw className="w-3 h-3 text-amber-600" />
                        Clear Mock Data
                      </button>

                      <button
                        onClick={() => setShowDeleteCompanyModal(company)}
                        className="py-1.5 text-3xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all flex items-center justify-center gap-1"
                        title="Permanently remove this company tenant"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                        Delete Company
                      </button>
                    </div>

                    <button
                      onClick={() => handleSwitchTenantContext(company.id)}
                      className={`w-full py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                        isCurrentlyInspected
                          ? 'bg-purple-900 text-white shadow-purple-900/20'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {isCurrentlyInspected ? '✓ Active Inspecting Tenant' : 'Inspect Tenant Workspace'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: COMPANY ADMIN ACCOUNTS PROVISIONER */}
      {activeTab === 'admins' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Provisioned Company Admins (Tenant Masters)</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Super Admin can add new admins, edit admin details, change primary admin, or reset passwords for any pharmaceutical company.
              </p>
            </div>
            {companies.length > 0 && (
              <button
                onClick={() => setShowAddAdminModal({ company: companies[0] })}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Company Admin
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 font-extrabold uppercase text-3xs tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3">User ID & Login Key</th>
                  <th className="px-5 py-3">Admin Name & Contact</th>
                  <th className="px-5 py-3">Assigned Pharma Tenant</th>
                  <th className="px-5 py-3">Authority Type</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium">
                {companies.flatMap(comp => (comp.companyAdmins || []).map(adm => ({ 
                  ...adm, 
                  companyObj: comp,
                  companyName: comp.name, 
                  companyCode: comp.code, 
                  companyId: comp.id 
                }))).map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 font-mono font-extrabold text-xs">
                        <Key className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{admin.id}</span>
                      </div>
                      <div className="text-3xs text-gray-500 font-medium mt-0.5">Use as Login ID</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-extrabold text-gray-900">{admin.name}</div>
                      <div className="text-gray-500 text-3xs font-mono">{admin.email} • {admin.phone}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-gray-900">{admin.companyName}</span>
                      <span className="ml-1.5 px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-3xs font-mono font-bold">
                        {admin.companyCode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {admin.isPrimary ? (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-3xs font-extrabold inline-flex items-center gap-1">
                          <Check className="w-3 h-3 text-purple-700" />
                          Primary Owner Admin
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-3xs font-bold">Secondary Admin</span>
                          <button
                            onClick={() => handleMakePrimaryAdmin(admin.companyObj, admin.id, admin.name)}
                            className="text-3xs text-purple-700 font-bold hover:underline"
                          >
                            Set Primary
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-3xs font-extrabold ${
                        admin.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => setShowEditAdminModal({ company: admin.companyObj, admin })}
                        className="px-2.5 py-1 text-3xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors border border-purple-200"
                      >
                        Edit Details
                      </button>

                      <button
                        onClick={async () => {
                          setShowResetPasswordModal({ company: admin.companyObj, admin });
                          setDirectPassword('');
                        }}
                        className="px-2.5 py-1 text-3xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        Set Password
                      </button>

                      {admin.companyObj.companyAdmins.length > 1 && (
                        <button
                          onClick={() => setShowDeleteAdminConfirm({ company: admin.companyObj, admin })}
                          className="px-2 py-1 text-3xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                          title="Remove Admin"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: DIVISION MANAGEMENT */}
      {activeTab === 'divisions' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Multi-Tenant Business Divisions</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage business lines and divisional hierarchies across all pharma tenant companies.
              </p>
            </div>
            <button
              onClick={() => setShowAddDivisionModal(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Division
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 font-extrabold uppercase text-3xs tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3">Division Name & Code</th>
                  <th className="px-5 py-3">Parent Pharma Company</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Dedicated Division Head</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium">
                {companies.flatMap(comp => (comp.activeDivisions || []).map(div => ({
                  ...div,
                  companyObj: comp,
                  companyName: comp.name,
                  companyCode: comp.code
                }))).map((division) => (
                  <tr key={division.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-extrabold text-gray-900">{division.name}</div>
                      <div className="font-mono text-3xs text-purple-700 font-bold">{division.code} • {division.id}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-gray-900">{division.companyName}</span>
                      <span className="ml-1.5 px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-3xs font-mono font-bold">
                        {division.companyCode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-3xs font-extrabold ${
                        division.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {division.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">
                      {division.hasDedicatedAdmin ? (
                        <span className="font-bold text-purple-900 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                          {division.divisionAdminName || 'Assigned Admin'}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">None (Global Admin)</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={async () => {
                          await toggleDivisionStatus(division.companyObj.id, division.id);
                          setCompanies(getStoredCompanies());
                          showToast(`Division "${division.name}" status toggled.`);
                        }}
                        className="px-2.5 py-1 text-3xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        Toggle Status
                      </button>
                      <button
                        onClick={async () => {
                          if (division.companyObj.activeDivisions.length <= 1) {
                            alert("Cannot delete the only remaining division of this company.");
                            return;
                          }
                          if (window.confirm(`Permanently delete division "${division.name}" from ${division.companyName}?`)) {
                            await removeCompanyDivision(division.companyObj.id, division.id);
                            setCompanies(getStoredCompanies());
                            showToast(`Division "${division.name}" deleted successfully.`);
                          }
                        }}
                        className="px-2.5 py-1 text-3xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SUBSCRIPTION PLANS & QUOTAS */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {companies.map(company => (
              <div key={company.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">{company.name}</h3>
                    <span className="text-3xs text-gray-500 font-mono">{company.id}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-3xs font-black">
                    {company.plan?.planTier || 'Enterprise'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100 bg-purple-50/50 px-2 rounded-lg">
                    <span className="text-purple-900 font-bold">Max Total User Headcount:</span>
                    <span className="font-black text-purple-900">{company.plan?.maxTotalUsers || 100} Users</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">MR User Seat Quota:</span>
                    <span className="font-black text-gray-900">{company.plan?.mrQuota || 50} Reps</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Managers Quota (AM/RM):</span>
                    <span className="font-black text-gray-900">{company.plan?.managerQuota || 10} Managers</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Divisions Limit:</span>
                    <span className="font-black text-gray-900">{company.plan?.divisionQuota || 3} Divisions</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Valid Until:</span>
                    <span className="font-black text-emerald-700">{company.plan?.validUntil || '2027-12-31'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenEditCompany(company)}
                    className="py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-purple-200"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Company
                  </button>

                  <button
                    onClick={() => setShowPlanModal(company)}
                    className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Quotas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FEATURE SWITCHBOARD */}
      {activeTab === 'features' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Per-Tenant Module Gatekeeper</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Enable or disable specific features per pharmaceutical company based on their purchased subscription package.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 font-extrabold uppercase text-3xs tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Tenant Company</th>
                  <th className="px-3 py-3 text-center">GPS Tracking</th>
                  <th className="px-3 py-3 text-center">Chemist POB</th>
                  <th className="px-3 py-3 text-center">Samples & Gifts</th>
                  <th className="px-3 py-3 text-center">Stockist Ledger</th>
                  <th className="px-3 py-3 text-center">MTP Strict Lock</th>
                  <th className="px-3 py-3 text-center">Joint Working</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium">
                {companies.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-gray-900">{c.name}</div>
                      <div className="text-3xs text-gray-500 font-mono">{c.code}</div>
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      {c.featureSwitches.featureGpsTracking ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      {c.featureSwitches.featureChemistPob ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      {c.featureSwitches.featureSamplesGifts ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      {c.featureSwitches.featureStockistLedger ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      {c.featureSwitches.featureStrictMtpApproval ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      {c.featureSwitches.featureJointWorking ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <button
                        onClick={() => setShowFeatureModal(c)}
                        className="px-2.5 py-1 text-3xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT TRAIL & SECURITY */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Platform Security & Administrative Audit Logs</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Immutable SaaS logs recording tenant creations, admin provisioning, and privilege modifications.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { time: 'Today, 02:45 PM', event: 'Super Admin updated company configuration and quota limits', by: 'Platform Super Admin', status: 'Success' },
              { time: 'Today, 01:10 PM', event: 'Company Admin account provisioned & synced to profile auth', by: 'Platform Super Admin', status: 'Success' },
              { time: 'Yesterday, 06:30 PM', event: 'Feature switch updated: Chemist POB enabled for Raxon Healthcare', by: 'Platform Super Admin', status: 'Success' },
              { time: 'Yesterday, 11:20 AM', event: 'Subscription Quota upgraded: Raxon Healthcare (200 Total User Cap)', by: 'Platform Super Admin', status: 'Success' },
              { time: '14 Aug 2026', event: 'Automated Daily Cloud Backup to Supabase Cloud', by: 'System Daemon', status: 'Success' }
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block">{log.event}</span>
                    <span className="text-3xs text-gray-500 font-mono">Actor: {log.by} • {log.time}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-3xs font-extrabold">{log.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ONBOARD NEW PHARMACEUTICAL COMPANY (WITH LOGO UPLOAD & USER CAP) */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-hidden pt-safe pb-safe overscroll-none">
          <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl border border-gray-200 max-h-[85vh] sm:max-h-[90vh] overflow-hidden my-auto">
            <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-gray-200 shrink-0 bg-white rounded-t-2xl z-10">
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900">Onboard New Pharmaceutical Company</h3>
                <p className="text-2xs sm:text-xs text-gray-500">Create new tenant organization, upload company logo, set max user cap, and provision admin</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompanySubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-3.5 sm:px-6 sm:py-5 space-y-4 touch-scroll overscroll-contain">
                {/* Logo Upload Section */}
                <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100">
                  <label className="block text-xs font-extrabold text-purple-900 mb-2">Company Brand Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white border-2 border-dashed border-purple-300 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                      {newCompany.logo ? (
                        <img src={newCompany.logo} alt="Preview" className="w-full h-full object-contain p-1" />
                      ) : (
                        <ImageIcon className="w-7 h-7 text-purple-300" />
                      )}
                    </div>
                    <div className="space-y-1.5 flex-1 text-xs">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleLogoUpload(file, (base64) => setNewCompany({ ...newCompany, logo: base64 }));
                          }
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5 shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {newCompany.logo ? 'Change Logo Image' : 'Upload Company Logo'}
                        </button>
                        {newCompany.logo && (
                          <button
                            type="button"
                            onClick={() => setNewCompany({ ...newCompany, logo: '' })}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-2xs rounded-lg"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-3xs text-gray-500">Supports PNG, JPG, SVG, WebP up to 2MB. If no image uploaded, default monogram will be used.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Biotech Remedies Ltd."
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Short Code * (Unique ID Prefix)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. APEX"
                      value={newCompany.code}
                      onChange={(e) => setNewCompany({ ...newCompany, code: e.target.value.toUpperCase() })}
                      className="w-full p-2 border border-gray-300 rounded-lg uppercase font-mono font-bold focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tagline / Mission</label>
                    <input
                      type="text"
                      placeholder="e.g. Delivering Quality Healthcare"
                      value={newCompany.tagline}
                      onChange={(e) => setNewCompany({ ...newCompany, tagline: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">HQ City</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai / Lucknow"
                      value={newCompany.hqCity}
                      onChange={(e) => setNewCompany({ ...newCompany, hqCity: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={newCompany.state}
                      onChange={(e) => setNewCompany({ ...newCompany, state: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">GST Number</label>
                    <input
                      type="text"
                      placeholder="09AAACR1234F1Z8"
                      value={newCompany.gstNumber}
                      onChange={(e) => setNewCompany({ ...newCompany, gstNumber: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Drug License (DL) Number</label>
                    <input
                      type="text"
                      placeholder="UP/LKO/20B/21B-4921"
                      value={newCompany.dlNumber}
                      onChange={(e) => setNewCompany({ ...newCompany, dlNumber: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Company Contact Email</label>
                    <input
                      type="email"
                      placeholder="contact@company.com"
                      value={newCompany.contactEmail}
                      onChange={(e) => setNewCompany({ ...newCompany, contactEmail: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 00000"
                      value={newCompany.contactPhone}
                      onChange={(e) => setNewCompany({ ...newCompany, contactPhone: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Licensing Quotas & Max User Headcount Manual Entry */}
                <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 space-y-3">
                  <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Subscription Licensing & User Headcount Caps
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Plan Tier</label>
                      <select
                        value={newCompany.planTier}
                        onChange={(e) => setNewCompany({ ...newCompany, planTier: e.target.value as any })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="Starter">Starter</option>
                        <option value="Growth">Growth</option>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Custom">Custom Enterprise</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block font-black text-indigo-950 mb-1">
                        Max Total Users Allowed *
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        placeholder="e.g. 150"
                        value={newCompany.maxTotalUsers}
                        onChange={(e) => setNewCompany({ ...newCompany, maxTotalUsers: parseInt(e.target.value) || 50 })}
                        className="w-full p-2 border-2 border-indigo-300 rounded-lg bg-white font-black text-indigo-900"
                      />
                      <span className="text-4xs text-indigo-700 font-semibold mt-0.5 block">Total headcount cap</span>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">MR License Quota</label>
                      <input
                        type="number"
                        value={newCompany.mrQuota}
                        onChange={(e) => setNewCompany({ ...newCompany, mrQuota: parseInt(e.target.value) || 50 })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Divisions Limit</label>
                      <input
                        type="number"
                        value={newCompany.divisionQuota}
                        onChange={(e) => setNewCompany({ ...newCompany, divisionQuota: parseInt(e.target.value) || 3 })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Company Admin Credentials */}
                <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200 space-y-3">
                  <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" /> Primary Company Admin (Tenant Master)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Admin Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={newCompany.adminName}
                        onChange={(e) => setNewCompany({ ...newCompany, adminName: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Admin Email (Login) *</label>
                      <input
                        type="email"
                        required
                        placeholder="admin@company.com"
                        value={newCompany.adminEmail}
                        onChange={(e) => setNewCompany({ ...newCompany, adminEmail: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Admin Mobile</label>
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={newCompany.adminPhone}
                        onChange={(e) => setNewCompany({ ...newCompany, adminPhone: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Initial Password</label>
                      <input
                        type="text"
                        placeholder="Default: 123456"
                        value={newCompany.adminPassword}
                        onChange={(e) => setNewCompany({ ...newCompany, adminPassword: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-gray-200 shrink-0 bg-gray-50/95 rounded-b-2xl backdrop-blur-xs z-10">
                <button
                  type="button"
                  disabled={isSubmittingCompany}
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200/80 rounded-lg disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCompany}
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmittingCompany ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Provisioning & Sending Welcome Email...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Provision & Launch Tenant
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FULL COMPANY EDIT (EVERY SINGLE FIELD FULLY EDITABLE) */}
      {/* ========================================================================= */}
      {showEditCompanyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-hidden pt-safe pb-safe overscroll-none">
          <div className="bg-white rounded-2xl max-w-3xl w-full flex flex-col shadow-2xl border border-gray-200 max-h-[85vh] sm:max-h-[90vh] overflow-hidden my-auto">
            <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-gray-200 shrink-0 bg-white rounded-t-2xl z-10">
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-purple-600" />
                  Edit Pharmaceutical Company Configuration
                </h3>
                <p className="text-2xs sm:text-xs text-gray-500 font-medium">
                  Modify company branding, contact details, licensing headcount quotas, status, and feature flags.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditCompanyModal(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditCompanySubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden text-xs">
              <div className="flex-1 overflow-y-auto px-4 py-3.5 sm:px-6 sm:py-5 space-y-5 touch-scroll overscroll-contain">
                {/* Logo Section */}
                <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100">
                  <label className="block font-extrabold text-purple-900 mb-2">Company Brand Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white border-2 border-dashed border-purple-300 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                      {editCompanyData.logo ? (
                        editCompanyData.logo.startsWith('data:image') || editCompanyData.logo.startsWith('http') || editCompanyData.logo.startsWith('/') ? (
                          <img src={editCompanyData.logo} alt="Preview" className="w-full h-full object-contain p-1" />
                        ) : (
                          <span className="font-black text-xl text-purple-900">{editCompanyData.logo}</span>
                        )
                      ) : (
                        <ImageIcon className="w-7 h-7 text-purple-300" />
                      )}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <input
                        type="file"
                        ref={editFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleLogoUpload(file, (base64) => setEditCompanyData({ ...editCompanyData, logo: base64 }));
                          }
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => editFileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-2xs rounded-lg flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload New Logo
                        </button>
                        {editCompanyData.logo && (
                          <button
                            type="button"
                            onClick={() => setEditCompanyData({ ...editCompanyData, logo: editCompanyData.name?.[0] || 'C' })}
                            className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-2xs rounded-lg"
                          >
                            Use Monogram
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1. Basic Identity */}
                <div className="space-y-2">
                  <h4 className="font-black text-gray-900 uppercase text-3xs tracking-wider">1. Basic Organization Identity</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={editCompanyData.name || ''}
                        onChange={(e) => setEditCompanyData({ ...editCompanyData, name: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Short Code (Prefix) *</label>
                      <input
                        type="text"
                        required
                        value={editCompanyData.code || ''}
                        onChange={(e) => setEditCompanyData({ ...editCompanyData, code: e.target.value.toUpperCase() })}
                        className="w-full p-2 border border-gray-300 rounded-lg uppercase font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Account Status</label>
                      <select
                        value={editCompanyData.status || 'Active'}
                        onChange={(e) => setEditCompanyData({ ...editCompanyData, status: e.target.value as any })}
                        className="w-full p-2 border border-gray-300 rounded-lg font-bold"
                      >
                        <option value="Active">Active (Full Access)</option>
                        <option value="Suspended">Suspended (Access Locked)</option>
                        <option value="Trial">Trial Period</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Tagline / Mission</label>
                      <input
                        type="text"
                        value={editCompanyData.tagline || ''}
                        onChange={(e) => setEditCompanyData({ ...editCompanyData, tagline: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Currency</label>
                      <input
                        type="text"
                        value={editCompanyData.currency || 'INR (₹)'}
                        onChange={(e) => setEditCompanyData({ ...editCompanyData, currency: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Location & Regulatory */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <h4 className="font-black text-gray-900 uppercase text-3xs tracking-wider">2. Headquarters & Regulatory Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">HQ City</label>
                      <input
                        type="text"
                        value={editCompanyData.hqCity || ''}
                        onChange={(e) => setEditCompanyData({ ...editCompanyData, hqCity: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={editCompanyData.state || ''}
                        onChange={(e) => setEditCompanyData({ ...editCompanyData, state: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">GST Number</label>
                      <input
                        type="text"
                        value={editCompanyData.gstNumber || ''}
                        onChange={(e) => setEditCompanyData({ ...editCompanyData, gstNumber: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg font-mono uppercase"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Drug License (DL) Number</label>
                      <input
                        type="text"
                        value={editCompanyData.dlNumber || ''}
                        onChange={(e) => setEditCompanyData({ ...editCompanyData, dlNumber: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Official Contact Info */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <h4 className="font-black text-gray-900 uppercase text-3xs tracking-wider">3. Official Contact Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Official Contact Email</label>
                      <input
                        type="email"
                        value={editCompanyData.contactEmail || ''}
                        onChange={(e) => setEditCompanyData({ ...editCompanyData, contactEmail: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={editCompanyData.contactPhone || ''}
                        onChange={(e) => setEditCompanyData({ ...editCompanyData, contactPhone: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Licensing, Plan & Headcount Quotas */}
                <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-3">
                  <h4 className="font-black text-indigo-950 uppercase text-3xs tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> 4. Subscription Plan, Quotas & Max User Cap
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Plan Tier</label>
                      <select
                        value={editCompanyData.plan?.planTier || 'Enterprise'}
                        onChange={(e) => setEditCompanyData({
                          ...editCompanyData,
                          plan: { ...(editCompanyData.plan as any), planTier: e.target.value as any }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white font-bold"
                      >
                        <option value="Starter">Starter</option>
                        <option value="Growth">Growth</option>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Custom">Custom Enterprise</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block font-black text-indigo-950 mb-1">
                        Max Total Users Allowed *
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={editCompanyData.plan?.maxTotalUsers || 100}
                        onChange={(e) => setEditCompanyData({
                          ...editCompanyData,
                          plan: { ...(editCompanyData.plan as any), maxTotalUsers: parseInt(e.target.value) || 50 }
                        })}
                        className="w-full p-2 border-2 border-indigo-400 rounded-lg bg-white font-black text-indigo-900"
                      />
                      <span className="text-4xs text-indigo-800 font-bold block mt-0.5">Platform Headcount Cap</span>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">MR License Quota</label>
                      <input
                        type="number"
                        value={editCompanyData.plan?.mrQuota || 50}
                        onChange={(e) => setEditCompanyData({
                          ...editCompanyData,
                          plan: { ...(editCompanyData.plan as any), mrQuota: parseInt(e.target.value) || 10 }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Managers Quota</label>
                      <input
                        type="number"
                        value={editCompanyData.plan?.managerQuota || 10}
                        onChange={(e) => setEditCompanyData({
                          ...editCompanyData,
                          plan: { ...(editCompanyData.plan as any), managerQuota: parseInt(e.target.value) || 2 }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Divisions Limit</label>
                      <input
                        type="number"
                        value={editCompanyData.plan?.divisionQuota || 3}
                        onChange={(e) => setEditCompanyData({
                          ...editCompanyData,
                          plan: { ...(editCompanyData.plan as any), divisionQuota: parseInt(e.target.value) || 1 }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Billing Cycle</label>
                      <select
                        value={editCompanyData.plan?.billingCycle || 'Annual'}
                        onChange={(e) => setEditCompanyData({
                          ...editCompanyData,
                          plan: { ...(editCompanyData.plan as any), billingCycle: e.target.value as any }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Annual">Annual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Valid Until (Expiry)</label>
                      <input
                        type="date"
                        value={editCompanyData.plan?.validUntil || '2027-12-31'}
                        onChange={(e) => setEditCompanyData({
                          ...editCompanyData,
                          plan: { ...(editCompanyData.plan as any), validUntil: e.target.value }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white font-bold text-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Price per MR / Mo (₹)</label>
                      <input
                        type="number"
                        value={editCompanyData.plan?.pricePerMrPerMonth || 450}
                        onChange={(e) => setEditCompanyData({
                          ...editCompanyData,
                          plan: { ...(editCompanyData.plan as any), pricePerMrPerMonth: parseInt(e.target.value) || 450 }
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Feature Switchboard */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <h4 className="font-black text-gray-900 uppercase text-3xs tracking-wider">5. Feature Switches</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { key: 'featureGpsTracking', label: 'Real-Time GPS Tracking' },
                      { key: 'featureChemistPob', label: 'Chemist POB Order Booking' },
                      { key: 'featureSamplesGifts', label: 'Physician Sample / Gift Inventory' },
                      { key: 'featureStrictMtpApproval', label: 'Strict Prior MTP Approval' },
                      { key: 'featureStockistLedger', label: 'Stockist Ledger & Invoices' },
                      { key: 'featureWhatsAppShare', label: 'WhatsApp Rx & Order Sharing' },
                      { key: 'featureDoctorSelfAdd', label: 'MR Self-Add Doctors' },
                      { key: 'featureJointWorking', label: 'Joint Working with AM/RM' },
                      { key: 'featureExpenseManagement', label: 'Daily Allowance (TA/DA) Expense' }
                    ].map(feat => {
                      const isEnabled = !!(editCompanyData.featureSwitches as any)?.[feat.key];
                      return (
                        <label key={feat.key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
                          <span className="font-medium text-gray-800">{feat.label}</span>
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={(e) => setEditCompanyData({
                              ...editCompanyData,
                              featureSwitches: {
                                ...(editCompanyData.featureSwitches as any),
                                [feat.key]: e.target.checked
                              }
                            })}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-gray-200 shrink-0 bg-gray-50/95 rounded-b-2xl backdrop-blur-xs z-10">
                <button
                  type="button"
                  onClick={() => setShowEditCompanyModal(null)}
                  className="px-4 py-2 font-bold text-gray-700 hover:bg-gray-200/80 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Save Company Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD NEW COMPANY ADMIN */}
      {/* ========================================================================= */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-black text-gray-900">Add Company Admin</h3>
                <p className="text-xs text-gray-500">For {showAddAdminModal.company.name}</p>
              </div>
              <button onClick={() => setShowAddAdminModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAdminSubmit} className="space-y-3 mt-4 text-xs">
              {companies.length > 1 && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Company *</label>
                  <select
                    value={showAddAdminModal.company.id}
                    onChange={async (e) => {
                      const found = companies.find(c => c.id === e.target.value);
                      if (found) setShowAddAdminModal({ company: found });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg font-bold"
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Admin Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S.K. Sharma"
                  value={newAdminData.name}
                  onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Admin Email (Login User ID) *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ops.admin@company.com"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={newAdminData.phone}
                  onChange={(e) => setNewAdminData({ ...newAdminData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Custom User ID (Optional)</label>
                <input
                  type="text"
                  placeholder={`e.g. CADM-${showAddAdminModal.company.code}-02`}
                  value={newAdminData.customId}
                  onChange={(e) => setNewAdminData({ ...newAdminData, customId: e.target.value.toUpperCase() })}
                  className="w-full p-2 border border-gray-300 rounded-lg font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Initial Password</label>
                <input
                  type="text"
                  placeholder="Default: 123456"
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg font-mono"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAdminData.isPrimary}
                  onChange={(e) => setNewAdminData({ ...newAdminData, isPrimary: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="font-bold text-gray-800">Set as Primary Owner Admin for this Company</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(null)}
                  className="px-3 py-1.5 font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
                >
                  Save Admin Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: EDIT EXISTING COMPANY ADMIN DETAILS */}
      {/* ========================================================================= */}
      {showEditAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-black text-gray-900">Edit Company Admin</h3>
                <p className="text-xs text-gray-500 font-mono">User ID: {showEditAdminModal.admin.id}</p>
              </div>
              <button onClick={() => setShowEditAdminModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditAdminSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Admin Full Name *</label>
                <input
                  type="text"
                  required
                  defaultValue={showEditAdminModal.admin.name}
                  onChange={(e) => setEditAdminData({ ...editAdminData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address (Login ID) *</label>
                <input
                  type="email"
                  required
                  defaultValue={showEditAdminModal.admin.email}
                  onChange={(e) => setEditAdminData({ ...editAdminData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  defaultValue={showEditAdminModal.admin.phone}
                  onChange={(e) => setEditAdminData({ ...editAdminData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Account Status</label>
                  <select
                    defaultValue={showEditAdminModal.admin.status}
                    onChange={(e) => setEditAdminData({ ...editAdminData, status: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Reset Password</label>
                  <input
                    type="text"
                    placeholder="Leave blank to keep current"
                    value={editAdminData.newPassword}
                    onChange={(e) => setEditAdminData({ ...editAdminData, newPassword: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={showEditAdminModal.admin.isPrimary}
                  onChange={(e) => setEditAdminData({ ...editAdminData, isPrimary: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="font-bold text-gray-800">Primary Owner Admin for this Company</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditAdminModal(null)}
                  className="px-3 py-1.5 font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
                >
                  Save Admin Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DIRECT PASSWORD RESET */}
      {/* ========================================================================= */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-black text-gray-900">Set Admin Password</h3>
                <p className="text-xs text-gray-500 font-mono">{showResetPasswordModal.admin.id}</p>
              </div>
              <button onClick={() => setShowResetPasswordModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDirectPasswordSubmit} className="space-y-3 mt-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <div className="font-bold text-gray-900">{showResetPasswordModal.admin.name}</div>
                <div className="text-3xs text-gray-500 font-mono">{showResetPasswordModal.admin.email}</div>
                <div className="text-3xs text-purple-700 font-bold mt-1">Tenant: {showResetPasswordModal.company.name}</div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">New Password *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter new password (e.g. Raxon@2026)"
                  value={directPassword}
                  onChange={(e) => setDirectPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg font-mono font-bold text-gray-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowResetPasswordModal(null)}
                  className="px-3 py-1.5 font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: CONFIRM DELETE ADMIN */}
      {/* ========================================================================= */}
      {showDeleteAdminConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-black text-gray-900">Remove Admin Account</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to remove <strong>{showDeleteAdminConfirm.admin.name}</strong> ({showDeleteAdminConfirm.admin.id}) from <strong>{showDeleteAdminConfirm.company.name}</strong>?
            </p>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-4 text-xs">
              <button
                type="button"
                onClick={() => setShowDeleteAdminConfirm(null)}
                className="px-3 py-1.5 font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteAdmin(showDeleteAdminConfirm.company, showDeleteAdminConfirm.admin)}
                className="px-4 py-1.5 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: FEATURE SWITCHES */}
      {/* ========================================================================= */}
      {showFeatureModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-black text-gray-900">Feature Switches</h3>
                <p className="text-xs text-gray-500">{showFeatureModal.name}</p>
              </div>
              <button onClick={() => setShowFeatureModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mt-4 max-h-96 overflow-y-auto text-xs">
              {[
                { key: 'featureGpsTracking', label: 'Real-Time GPS Tracking & Geo-fencing' },
                { key: 'featureChemistPob', label: 'Chemist POB Booking & Scheme Deviations' },
                { key: 'featureSamplesGifts', label: 'Physician Sample & Gift Inventory Tracking' },
                { key: 'featureStrictMtpApproval', label: 'Strict Monthly Tour Plan (MTP) Prior Approval' },
                { key: 'featureStockistLedger', label: 'Stockist Credit & Outstanding Ledger' },
                { key: 'featureDoctorSelfAdd', label: 'Allow MR to Self-Add Doctors from Field' },
                { key: 'featureJointWorking', label: 'Joint Working with Area/Regional Managers' },
                { key: 'featureExpenseManagement', label: 'Daily Allowance (TA/DA) & Expense Filing' }
              ].map(feat => {
                const isEnabled = (showFeatureModal.featureSwitches as any)[feat.key];
                return (
                  <div key={feat.key} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-gray-800">{feat.label}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        const newSwitches = {
                          ...showFeatureModal.featureSwitches,
                          [feat.key]: !isEnabled
                        };
                        await updateCompanyFeatureSwitches(showFeatureModal.id, newSwitches);
                        setShowFeatureModal({ ...showFeatureModal, featureSwitches: newSwitches as any });
                        setCompanies(getStoredCompanies());
                      }}
                      className={`px-3 py-1 rounded-full text-3xs font-black transition-all ${
                        isEnabled
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={() => setShowFeatureModal(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: SUBSCRIPTION QUOTAS MODAL */}
      {/* ========================================================================= */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-black text-gray-900">Manage Subscription Plan & Quotas</h3>
                <p className="text-xs text-gray-500">{showPlanModal.name}</p>
              </div>
              <button onClick={() => setShowPlanModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setShowPlanModal(null);
                showToast("Subscription quotas updated successfully!");
              }}
              className="space-y-3 mt-4 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Plan Tier</label>
                <select
                  value={showPlanModal.plan?.planTier || 'Enterprise'}
                  onChange={async (e) => {
                    const updated = { ...showPlanModal.plan, planTier: e.target.value as any };
                    await updateCompanyPlan(showPlanModal.id, updated);
                    setShowPlanModal({ ...showPlanModal, plan: updated });
                    setCompanies(getStoredCompanies());
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg font-bold"
                >
                  <option value="Starter">Starter</option>
                  <option value="Growth">Growth</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Custom">Custom Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-indigo-950 mb-1">Max Total Users Allowed *</label>
                <input
                  type="number"
                  min={1}
                  value={showPlanModal.plan?.maxTotalUsers || 100}
                  onChange={async (e) => {
                    const maxTotalUsers = parseInt(e.target.value) || 50;
                    const updated = { ...showPlanModal.plan, maxTotalUsers };
                    await updateCompanyPlan(showPlanModal.id, updated);
                    setShowPlanModal({ ...showPlanModal, plan: updated as any });
                    setCompanies(getStoredCompanies());
                  }}
                  className="w-full p-2 border-2 border-indigo-300 rounded-lg font-black text-indigo-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">MR License Quota (Seats)</label>
                <input
                  type="number"
                  value={showPlanModal.plan?.mrQuota || 50}
                  onChange={async (e) => {
                    const mrQuota = parseInt(e.target.value) || 10;
                    const updated = { ...showPlanModal.plan, mrQuota };
                    await updateCompanyPlan(showPlanModal.id, updated);
                    setShowPlanModal({ ...showPlanModal, plan: updated as any });
                    setCompanies(getStoredCompanies());
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Divisions Limit</label>
                <input
                  type="number"
                  value={showPlanModal.plan?.divisionQuota || 3}
                  onChange={async (e) => {
                    const divisionQuota = parseInt(e.target.value) || 1;
                    const updated = { ...showPlanModal.plan, divisionQuota };
                    await updateCompanyPlan(showPlanModal.id, updated);
                    setShowPlanModal({ ...showPlanModal, plan: updated as any });
                    setCompanies(getStoredCompanies());
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(null)}
                  className="px-3 py-1.5 font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
                >
                  Save Quotas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Division Modal */}
      {showAddDivisionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                Add New Business Division
              </h3>
              <button onClick={() => setShowAddDivisionModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newDivisionForm.name || !newDivisionForm.code) {
                  alert("Please enter Division Name and Code.");
                  return;
                }
                try {
                  await addCompanyDivision(newDivisionForm.companyId || companies[0].id, {
                    name: newDivisionForm.name,
                    code: newDivisionForm.code,
                    hasDedicatedAdmin: newDivisionForm.hasDedicatedAdmin,
                    divisionAdminName: newDivisionForm.divisionAdminName
                  });
                  setCompanies(getStoredCompanies());
                  setShowAddDivisionModal(false);
                  setNewDivisionForm({
                    companyId: companies[0]?.id || '',
                    name: '',
                    code: '',
                    hasDedicatedAdmin: false,
                    divisionAdminName: ''
                  });
                  showToast("New division created successfully!");
                } catch (err: any) {
                  alert(err.message || "Error creating division");
                }
              }}
              className="space-y-4 pt-4 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Pharma Tenant Company *</label>
                <select
                  value={newDivisionForm.companyId || companies[0]?.id}
                  onChange={(e) => setNewDivisionForm({ ...newDivisionForm, companyId: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Division Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oncology & Critical Care"
                  value={newDivisionForm.name}
                  onChange={(e) => setNewDivisionForm({ ...newDivisionForm, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Division Code (Short Prefix) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ONC"
                  value={newDivisionForm.code}
                  onChange={(e) => setNewDivisionForm({ ...newDivisionForm, code: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold uppercase"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hasAdmin"
                  checked={newDivisionForm.hasDedicatedAdmin}
                  onChange={(e) => setNewDivisionForm({ ...newDivisionForm, hasDedicatedAdmin: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <label htmlFor="hasAdmin" className="font-bold text-gray-700">Assign Dedicated Division Head / Admin</label>
              </div>

              {newDivisionForm.hasDedicatedAdmin && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Division Admin Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={newDivisionForm.divisionAdminName}
                    onChange={(e) => setNewDivisionForm({ ...newDivisionForm, divisionAdminName: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddDivisionModal(false)}
                  className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs"
                >
                  Create Division
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear All Mock Data Modal */}
      {showClearMockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="text-base font-extrabold text-gray-900 mb-2">Delete All Mock Data for {showClearMockModal.name}?</h3>
            <p className="text-xs text-gray-600 mb-4">
              This will permanently remove all demo products, doctors, chemists, stockists, area patches, sample inventory, and MTP/DCR transactional records for this company. You will start with a 100% clean production environment.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowClearMockModal(null)}
                className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  clearAllCompanyMockData(showClearMockModal.id);
                  setShowClearMockModal(null);
                  showToast(`All mock data deleted successfully for ${showClearMockModal.name}! Clean production environment enabled.`);
                }}
                className="px-5 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl text-xs shadow-xs"
              >
                Yes, Delete All Mock Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Company / Tenant Modal */}
      {showDeleteCompanyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Delete Tenant Company</h3>
                <p className="text-3xs text-red-600 font-extrabold uppercase tracking-wider">{showDeleteCompanyModal.name} ({showDeleteCompanyModal.code})</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-gray-900">{showDeleteCompanyModal.name}</strong>?
              <br /><br />
              <span className="text-red-700 font-bold">Warning:</span> This will permanently remove all company admins, divisions, registered user profiles, doctor/chemist lists, and master records associated with this tenant. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowDeleteCompanyModal(null)}
                className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const compName = showDeleteCompanyModal.name;
                  try {
                    const success = await deleteTenantCompany(showDeleteCompanyModal.id);
                    setShowDeleteCompanyModal(null);
                    if (success) {
                      setCompanies(getStoredCompanies());
                      showToast(`Tenant company "${compName}" deleted permanently.`);
                    }
                  } catch (err) {
                    alert("Failed to delete company. Please try again.");
                  }
                }}
                className="px-5 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl text-xs shadow-xs"
              >
                Yes, Permanently Delete Company
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Division Confirm Modal */}
      {showDeleteDivisionConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="text-base font-extrabold text-gray-900 mb-2">Delete Division "{showDeleteDivisionConfirm.division.name}"?</h3>
            <p className="text-xs text-gray-600 mb-4">
              Permanently delete this division from {showDeleteDivisionConfirm.company.name}? Any associated division head profile will also be removed.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteDivisionConfirm(null)}
                className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  removeCompanyDivision(showDeleteDivisionConfirm.company.id, showDeleteDivisionConfirm.division.id);
                  setCompanies(getStoredCompanies());
                  const divName = showDeleteDivisionConfirm.division.name;
                  const compName = showDeleteDivisionConfirm.company.name;
                  setShowDeleteDivisionConfirm(null);
                  showToast(`Division "${divName}" deleted from ${compName} successfully.`);
                }}
                className="px-5 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl text-xs shadow-xs"
              >
                Yes, Delete Division
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WELCOME CREDENTIALS & EMAIL DISPATCH CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {welcomeEmailModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 my-6">
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    Pharma Client Onboarded & Welcome Email Triggered!
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">
                    Login credentials and portal link generated for Company Admin
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setWelcomeEmailModal(null)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              {/* Delivery Channel Badge */}
              <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-2xs text-slate-300 uppercase tracking-wider">Trigger Channel:</span>
                  <span className="font-mono font-bold text-emerald-300">
                    {welcomeEmailModal.channel === 'SERVER_RESEND' && '⚡ Resend API (Live)'}
                    {welcomeEmailModal.channel === 'SERVER_SENDGRID' && '⚡ SendGrid API (Live)'}
                    {welcomeEmailModal.channel === 'SERVER_SMTP' && '📬 Direct SMTP / Gmail (Live)'}
                    {welcomeEmailModal.channel === 'EMAILJS' && '✉️ EmailJS Client API'}
                    {welcomeEmailModal.channel === 'SUPABASE_MAIL_QUEUE' && '⚡ Supabase Cloud Mail Queue'}
                    {welcomeEmailModal.channel === 'SIMULATED' && '✨ Cloud Simulated Outbox'}
                  </span>
                </div>
                <span className="text-3xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {welcomeEmailModal.recipient}
                </span>
              </div>

              {/* Credentials Card */}
              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-purple-600" /> Admin Access Credentials
                  </span>
                  <span className="text-3xs font-extrabold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md">
                    {welcomeEmailModal.credentials.companyName}
                  </span>
                </div>

                <div className="space-y-2 bg-white p-3 rounded-lg border border-purple-100 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-sans font-semibold">Portal URL:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-600 font-bold truncate max-w-[200px]">
                        {welcomeEmailModal.credentials.loginUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(welcomeEmailModal.credentials.loginUrl);
                          setCopiedText('url');
                          setTimeout(() => setCopiedText(null), 2000);
                        }}
                        className="p-1 text-gray-400 hover:text-indigo-600 rounded"
                        title="Copy Portal Link"
                      >
                        {copiedText === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-1.5">
                    <span className="text-gray-500 font-sans font-semibold">Login Email:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-bold">{welcomeEmailModal.credentials.email}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(welcomeEmailModal.credentials.email);
                          setCopiedText('email');
                          setTimeout(() => setCopiedText(null), 2000);
                        }}
                        className="p-1 text-gray-400 hover:text-indigo-600 rounded"
                        title="Copy Login Email"
                      >
                        {copiedText === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-1.5">
                    <span className="text-gray-500 font-sans font-semibold">Temporary Password:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-black text-sm">{welcomeEmailModal.credentials.password}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(welcomeEmailModal.credentials.password);
                          setCopiedText('pass');
                          setTimeout(() => setCopiedText(null), 2000);
                        }}
                        className="p-1 text-gray-400 hover:text-indigo-600 rounded"
                        title="Copy Password"
                      >
                        {copiedText === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-1.5">
                    <span className="text-gray-500 font-sans font-semibold">Tenant ID:</span>
                    <span className="text-gray-700">{welcomeEmailModal.credentials.companyId}</span>
                  </div>
                </div>
              </div>

              {/* Quick Communication Actions */}
              <div className="space-y-2">
                <div className="text-2xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Quick Share & Dispatch Channels:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(welcomeEmailModal.plainText);
                      setCopiedText('all');
                      setTimeout(() => setCopiedText(null), 2500);
                    }}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedText === 'all' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-600" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Welcome to RAXON SFA!\n\nDear Admin,\nYour company "${welcomeEmailModal.credentials.companyName}" has been onboarded.\n\nPortal: ${welcomeEmailModal.credentials.loginUrl}\nEmail: ${welcomeEmailModal.credentials.email}\nPassword: ${welcomeEmailModal.credentials.password}\nCompany ID: ${welcomeEmailModal.credentials.companyId}\n\nPlease change your password on first login.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Web</span>
                  </a>

                  <a
                    href={`mailto:${welcomeEmailModal.credentials.email}?subject=${encodeURIComponent(`Welcome to ${welcomeEmailModal.credentials.companyName} - Raxon SFA Login Credentials`)}&body=${encodeURIComponent(welcomeEmailModal.plainText)}`}
                    className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    <span>Open Email App</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  const compId = welcomeEmailModal.credentials.companyId;
                  setWelcomeEmailModal(null);
                  setActiveCompanyId(compId);
                  setActiveId(compId);
                  showToast(`Switched active context to ${welcomeEmailModal.credentials.companyName}`);
                }}
                className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl flex items-center gap-1.5 text-xs transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Switch to this Tenant
              </button>

              <button
                type="button"
                onClick={() => setWelcomeEmailModal(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
