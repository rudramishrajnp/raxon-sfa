import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Layers, Pill, UserCheck, CheckCircle2, AlertTriangle, 
  Search, Plus, Edit, Trash2, ArrowRight, ShieldCheck, Settings, FileSpreadsheet, 
  MapPin, Stethoscope, ShoppingBag, Sparkles, Sliders, ChevronRight, X, UserPlus,
  Key, Shield, Check, Download, Upload, FileText
} from 'lucide-react';
import { 
  Company, 
  getActiveCompany, 
  addCompanyDivision, 
  toggleDivisionDedicatedAdmin,
  CompanyDivision,
  getStoredCompanies,
  updateDivisionReportingManager,
  removeCompanyDivision
} from '../data/companyContext';
import { 
  getProductsCatalog, saveProductsCatalog, ProductMasterItem,
  getDoctorsList, saveDoctorsList, Doctor,
  getChemistsList, saveChemistsList, Chemist,
  getStockistsList, saveStockistsList, Stockist
} from '../data/masterData';
import { saveEmployeesAsProfiles } from '../data/userContext';
import { clearAllCompanyMockData } from '../data/cleanProductionData';
import { ConfirmModal } from '../components/ConfirmModal';
import { Link } from 'react-router-dom';

export default function CompanyAdminDashboard() {
  const [company, setCompany] = useState<Company>(() => getActiveCompany());
  const [activeTab, setActiveTab] = useState<'overview' | 'divisions' | 'team' | 'masters' | 'bulk-uploads'>('overview');
  
  // Bulk Upload State
  const [bulkEntity, setBulkEntity] = useState<'products' | 'doctors' | 'chemists' | 'stockists' | 'users' | 'areas'>('products');
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkSuccessMessage, setBulkSuccessMessage] = useState<string | null>(null);

  // Modals
  const [showAddDivModal, setShowAddDivModal] = useState(false);
  const [showAssignAdminModal, setShowAssignAdminModal] = useState<CompanyDivision | null>(null);
  const [showReportToModal, setShowReportToModal] = useState<CompanyDivision | null>(null);
  const [showClearMockModal, setShowClearMockModal] = useState(false);
  const [reportingAdminId, setReportingAdminId] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Division Form
  const [newDiv, setNewDiv] = useState({
    name: '',
    code: '',
    description: '',
    hasDedicatedAdmin: false,
    divisionAdminName: '',
    divisionAdminEmail: '',
    divisionAdminPhone: ''
  });

  // Assign Admin Form
  const [adminDetails, setAdminDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const handleCompanyUpdate = () => {
      setCompany(getActiveCompany());
    };
    window.addEventListener('raxon-company-updated', handleCompanyUpdate);
    window.addEventListener('raxon-company-switched', handleCompanyUpdate);
    return () => {
      window.removeEventListener('raxon-company-updated', handleCompanyUpdate);
      window.removeEventListener('raxon-company-switched', handleCompanyUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateDivision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiv.name || !newDiv.code) {
      alert("Please provide Division Name and Code");
      return;
    }
    const created = await addCompanyDivision(company.id, newDiv);
    setCompany(getActiveCompany());
    setShowAddDivModal(false);
    
    if (created.hasDedicatedAdmin && created.divisionAdminId) {
      showToast(`Division created! DSA system user registered with ID: ${created.divisionAdminId} (Password: 123456)`);
    } else {
      showToast(`Division "${newDiv.name}" created successfully!`);
    }

    setNewDiv({
      name: '',
      code: '',
      description: '',
      hasDedicatedAdmin: false,
      divisionAdminName: '',
      divisionAdminEmail: '',
      divisionAdminPhone: ''
    });
  };

  const handleAssignAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAssignAdminModal) return;
    if (!adminDetails.name || !adminDetails.email) {
      alert("Please provide Admin Name and Email");
      return;
    }
    await toggleDivisionDedicatedAdmin(company.id, showAssignAdminModal.id, adminDetails);
    
    // Refresh company to read the newly assigned admin ID
    const updatedCompany = getActiveCompany();
    setCompany(updatedCompany);
    const updatedDiv = updatedCompany.activeDivisions?.find(d => d.id === showAssignAdminModal.id);
    const adminId = updatedDiv?.divisionAdminId || 'Generated ID';

    showToast(`DSA Assigned! System user created with ID: ${adminId} (Password: 123456)`);
    setShowAssignAdminModal(null);
    setAdminDetails({ name: '', email: '', phone: '' });
  };

  const handleSetReportingManagerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReportToModal || !reportingAdminId) return;

    const matchedAdmin = company.companyAdmins?.find(a => a.id === reportingAdminId);
    if (!matchedAdmin) return;

    await updateDivisionReportingManager(company.id, showReportToModal.id, matchedAdmin.id, matchedAdmin.name);
    
    setCompany(getActiveCompany());
    showToast(`Reporting Manager for "${showReportToModal.name}" updated to "${matchedAdmin.name}".`);
    setShowReportToModal(null);
    setReportingAdminId('');
  };

  const parseCsvRows = (text: string): Record<string, string>[] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];
    
    const parseLine = (line: string) => {
      const result: string[] = [];
      let insideQuote = false;
      let currentVal = '';
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          result.push(currentVal.trim().replace(/^"|"$/g, ''));
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      result.push(currentVal.trim().replace(/^"|"$/g, ''));
      return result;
    };

    const headers = parseLine(lines[0]).map(h => h.toLowerCase());
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]);
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });
      rows.push(rowObj);
    }
    return rows;
  };

  const handleExecuteBulkUpload = () => {
    if (!bulkCsvText.trim()) {
      alert("Please paste or load CSV data first.");
      return;
    }
    const parsedRows = parseCsvRows(bulkCsvText);
    if (parsedRows.length === 0) {
      alert("No valid data rows found in CSV. Please check formatting.");
      return;
    }

    if (bulkEntity === 'products') {
      const existing = getProductsCatalog(company.id);
      const newItems: ProductMasterItem[] = parsedRows.map((r, idx) => ({
        id: `PROD-${Date.now()}-${idx}`,
        name: r.name || 'New Product',
        composition: r.composition || 'Standard Formula',
        division: r.division || company.activeDivisions?.[0]?.name || 'General',
        category: (r.category as any) || 'Tablet',
        pack: r.pack || '10\'s',
        mrp: parseFloat(r.mrp) || 100,
        ptr: parseFloat(r.ptr) || 70,
        pts: parseFloat(r.pts) || 60,
        scheme: r.scheme || '10+1',
        indications: r.indications || 'General therapeutic use',
        gst: '12%',
        status: 'Active'
      }));
      saveProductsCatalog([...existing, ...newItems], company.id);
      setBulkSuccessMessage(`Successfully imported ${newItems.length} products in bulk!`);
    } else if (bulkEntity === 'doctors') {
      const existing = getDoctorsList(company.id);
      const newItems: Doctor[] = parsedRows.map((r, idx) => ({
        id: Date.now() + idx,
        name: r.name || 'Dr. Unknown',
        specialty: r.specialty || 'General Practitioner',
        area: r.area || 'Head Office',
        subArea: r.subArea || 'Main Branch',
        qualification: r.qualification || 'MBBS',
        phone: r.phone || '',
        address: r.address || '',
        division: r.division || company.activeDivisions?.[0]?.name || 'General'
      }));
      saveDoctorsList([...existing, ...newItems], company.id);
      setBulkSuccessMessage(`Successfully imported ${newItems.length} doctors in bulk!`);
    } else if (bulkEntity === 'chemists') {
      const existing = getChemistsList(company.id);
      const newItems: Chemist[] = parsedRows.map((r, idx) => ({
        id: Date.now() + idx,
        name: r.name || 'Chemist Store',
        contactPerson: r.contactperson || r.contact_person || 'Pharmacist',
        area: r.area || 'Head Office',
        subArea: r.subArea || 'Main Branch',
        phone: r.phone || '',
        dlNumber: r.dlnumber || r.dl_number || 'DL-000',
        gstNumber: r.gstnumber || r.gst_number || '27AAAAA0000A1Z5',
        stockist: r.stockist || 'Default Stockist',
        address: r.address || '',
        division: r.division || company.activeDivisions?.[0]?.name || 'General'
      }));
      saveChemistsList([...existing, ...newItems], company.id);
      setBulkSuccessMessage(`Successfully imported ${newItems.length} chemists in bulk!`);
    } else if (bulkEntity === 'stockists') {
      const existing = getStockistsList(company.id);
      const newItems: Stockist[] = parsedRows.map((r, idx) => ({
        id: `STK-${Date.now()}-${idx}`,
        name: r.name || 'Stockist Agency',
        contactPerson: r.contactperson || r.contact_person || 'Manager',
        phone: r.phone || '',
        email: r.email || '',
        dlNumber: r.dlnumber || r.dl_number || 'DL-STK-00',
        gstNumber: r.gstnumber || r.gst_number || '27AAAAA0000A1Z5',
        address: r.address || '',
        area: r.area || 'Head Office',
        district: r.district || 'Mumbai',
        hq: r.hq || company.hqCity || 'Head Office',
        creditDays: r.creditdays || r.credit_days || '30 Days',
        creditLimit: r.creditlimit || r.credit_limit || '500000',
        outstandingValue: 0,
        status: 'Active',
        division: r.division || company.activeDivisions?.[0]?.name || 'General'
      }));
      saveStockistsList([...existing, ...newItems], company.id);
      setBulkSuccessMessage(`Successfully imported ${newItems.length} stockists in bulk!`);
    } else if (bulkEntity === 'users') {
      const employees = parsedRows.map(r => ({
        id: r.id || `EMP-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        name: r.name || 'Field Employee',
        role: r.role || 'MR',
        email: r.email || 'user@company.com',
        phone: r.phone || '',
        hq: r.hq || 'Head Office',
        status: 'Active' as const,
        territory: r.territory || 'Assigned Territory',
        divisionName: r.divisionname || r.division_name || company.activeDivisions?.[0]?.name || 'General',
        reportingToName: r.reportingtoname || r.reporting_to_name || ''
      }));
      saveEmployeesAsProfiles(company.id, employees);
      setBulkSuccessMessage(`Successfully imported ${employees.length} users/field reps in bulk!`);
    } else if (bulkEntity === 'areas') {
      const existingAreas = (() => {
        try {
          const saved = localStorage.getItem(`raxon_areas_${company.id}`);
          return saved ? JSON.parse(saved) : [];
        } catch(e) { return []; }
      })();
      const newAreas = parsedRows.map((r, idx) => ({
        id: `bulk_area_${Date.now()}_${idx}`,
        name: r.name || r.areaname || 'New Area',
        hq: r.hq || r.hqname || company.hqCity || 'Lucknow HQ',
        patch: r.patch || r.patchname || 'Sector A'
      }));
      const updatedAreas = [...newAreas, ...existingAreas];
      localStorage.setItem(`raxon_areas_${company.id}`, JSON.stringify(updatedAreas));
      setBulkSuccessMessage(`Successfully imported ${newAreas.length} HQ-wise areas in bulk!`);
    }

    setBulkCsvText('');
    setTimeout(() => setBulkSuccessMessage(null), 4000);
  };

  const divisions = company.activeDivisions || [];
  const primaryAdmin = company.companyAdmins?.find(a => a.isPrimary) || company.companyAdmins?.[0];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Company Admin Header Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 rounded-2xl p-6 text-white shadow-xl border border-indigo-800/50 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-black text-2xl shadow-lg border border-indigo-400/30 shrink-0">
              {company.logo || company.name?.[0] || 'C'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-3xs font-extrabold border border-emerald-400/30 uppercase tracking-wider">
                  {company.status} Tenant
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200 text-3xs font-mono font-bold">
                  Code: {company.code && company.code.length <= 12 && !company.code.includes('_') ? company.code : 'RAXON'}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 text-3xs font-bold">
                  {company.plan?.planTier || 'Enterprise'} Plan
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {company.name}
              </h1>
              <p className="text-indigo-200 text-xs font-medium">
                {company.hqCity}, {company.state} • Primary Admin: <span className="font-bold text-white">{primaryAdmin?.name || 'Administrator'}</span> ({primaryAdmin?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setShowClearMockModal(true)}
              className="px-3.5 py-2.5 bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 active:scale-95 border border-red-500/50 cursor-pointer"
              title="Delete all demo/mock data to start fresh with genuine market data"
            >
              <Trash2 className="w-4 h-4" />
              Delete All Mock Data
            </button>
            <button
              onClick={() => setShowAddDivModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Therapeutic Division
            </button>
          </div>
        </div>

        {/* Company Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-indigo-800/40 text-xs">
          <div className="bg-indigo-950/60 rounded-xl p-3 border border-indigo-700/30">
            <div className="text-indigo-300 text-3xs font-bold uppercase">Active Divisions</div>
            <div className="text-xl font-black text-white mt-1">{divisions.length}</div>
            <div className="text-3xs text-indigo-200 mt-0.5 font-medium">Therapeutic units</div>
          </div>
          <div className="bg-indigo-950/60 rounded-xl p-3 border border-indigo-700/30">
            <div className="text-indigo-300 text-3xs font-bold uppercase">Licensed Field Force</div>
            <div className="text-xl font-black text-white mt-1">{company.plan?.mrQuota || 50} Reps</div>
            <div className="text-3xs text-emerald-400 mt-0.5 font-medium">Active quota available</div>
          </div>
          <div className="bg-indigo-950/60 rounded-xl p-3 border border-indigo-700/30">
            <div className="text-indigo-300 text-3xs font-bold uppercase">Company Admins</div>
            <div className="text-xl font-black text-white mt-1">{company.companyAdmins?.length || 1}</div>
            <div className="text-3xs text-indigo-200 mt-0.5 font-medium">Head office accounts</div>
          </div>
          <div className="bg-indigo-950/60 rounded-xl p-3 border border-indigo-700/30">
            <div className="text-indigo-300 text-3xs font-bold uppercase">Data Isolation</div>
            <div className="text-xl font-black text-emerald-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% Secure
            </div>
            <div className="text-3xs text-indigo-200 mt-0.5 font-medium">Strict Tenant Wall</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/70'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Company Overview & Hub
        </button>

        <button
          onClick={() => setActiveTab('divisions')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'divisions'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/70'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Divisions & Division Admins ({divisions.length})
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'team'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/70'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Field Hierarchy (RM / AM / MR)
        </button>

        <button
          onClick={() => setActiveTab('masters')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'masters'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/70'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Pill className="w-4 h-4" />
          Company Masters (Products, Doctors, Stockists)
        </button>

        <button
          onClick={() => setActiveTab('bulk-uploads')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'bulk-uploads'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/70'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Bulk Data Upload Center (5 Options)
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Access Grid to Company-Specific Operations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/products" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Pill className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 mt-3">Company Products</h3>
              <p className="text-xs text-gray-500 mt-1">Manage PTS, PTR, MRP & Schemes for {company.name}</p>
            </Link>

            <Link to="/doctors" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 mt-3">Doctor Master</h3>
              <p className="text-xs text-gray-500 mt-1">Core prescribers mapped to company territory HQs</p>
            </Link>

            <Link to="/chemists" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 mt-3">Chemist & POB Network</h3>
              <p className="text-xs text-gray-500 mt-1">Order booking, stockist mapping & schemes</p>
            </Link>

            <Link to="/reports" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 mt-3">DCR & Field Reports</h3>
              <p className="text-xs text-gray-500 mt-1">Calling compliance, POB sales audit & expenses</p>
            </Link>
          </div>

          {/* Divisions Summary in Overview */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Therapeutic Divisions Overview</h3>
                <p className="text-xs text-gray-500">Each division can have a dedicated Division System Admin (DSA) or be managed directly by you.</p>
              </div>
              <button
                onClick={() => setShowAddDivModal(true)}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Division
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {divisions.map((div) => (
                <div key={div.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">{div.name}</h4>
                      <span className="text-3xs font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-700">
                        {div.code}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-3xs font-extrabold bg-emerald-100 text-emerald-800">
                      {div.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2">{div.description || 'Specialized therapeutic line'}</p>

                  <div className="pt-2 border-t border-gray-200 text-xs flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Administration:</span>
                    {div.hasDedicatedAdmin ? (
                      <span className="font-bold text-indigo-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> {div.divisionAdminName || 'Dedicated DSA'}
                      </span>
                    ) : (
                      <span className="font-bold text-gray-700">
                        Managed by Company Admin
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIVISIONS & DIVISION SYSTEM ADMINS (DSA) */}
      {activeTab === 'divisions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Therapeutic Divisions Management</h2>
              <p className="text-xs text-gray-500">
                Create therapeutic business lines and optionally appoint a **Division System Admin (DSA)**. If no DSA is appointed, you as Company Admin retain full direct control.
              </p>
            </div>
            <button
              onClick={() => setShowAddDivModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              New Division
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 font-extrabold uppercase text-3xs tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3">Division Name & Code</th>
                  <th className="px-5 py-3">Description / Focus</th>
                  <th className="px-5 py-3">Management Model</th>
                  <th className="px-5 py-3">Assigned Division Admin (DSA)</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium">
                {divisions.map((div) => (
                  <tr key={div.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-extrabold text-gray-900 text-sm">{div.name}</div>
                      <span className="text-3xs font-mono font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                        {div.code}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 max-w-xs">
                      {div.description || 'Primary pharmaceutical sales portfolio'}
                    </td>
                    <td className="px-5 py-4">
                      {div.hasDedicatedAdmin ? (
                        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 text-3xs font-extrabold border border-purple-200 flex items-center gap-1 w-fit">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Dedicated Division Admin
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-3xs font-bold flex items-center gap-1 w-fit">
                          <Building2 className="w-3.5 h-3.5 text-gray-500" /> Direct Company Admin Control
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {div.hasDedicatedAdmin ? (
                        <div className="space-y-1.5">
                          <div>
                            <div className="font-extrabold text-gray-900">{div.divisionAdminName || 'Assigned DSA'}</div>
                            <div className="text-[10px] text-gray-500 font-mono mt-0.5 flex flex-wrap items-center gap-1.5">
                              <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">User ID: {div.divisionAdminId}</span>
                              <span>{div.divisionAdminEmail}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-3xs text-slate-600 bg-slate-50 border border-slate-200/60 p-1 px-2 rounded-lg w-fit">
                            <span className="font-semibold text-slate-500">Reports To:</span>
                            <span className="font-bold text-slate-800">{div.reportingToName || 'Company Admin'}</span>
                            <button
                              type="button"
                              onClick={async () => {
                                setShowReportToModal(div);
                                setReportingAdminId(div.reportingToId || company.companyAdmins?.[0]?.id || '');
                              }}
                              className="text-indigo-600 hover:text-indigo-800 cursor-pointer p-0.5"
                              title="Edit reporting structure"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-3xs">None (Company Admin manages all)</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={async () => {
                          if (div.hasDedicatedAdmin) {
                            await toggleDivisionDedicatedAdmin(company.id, div.id);
                            setCompany(getActiveCompany());
                            showToast(`Division ${div.name} is now directly managed by Company Admin.`);
                          } else {
                            setShowAssignAdminModal(div);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          div.hasDedicatedAdmin
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                      >
                        {div.hasDedicatedAdmin ? 'Remove DSA' : 'Assign DSA'}
                      </button>

                      <button
                        onClick={async () => {
                          if (divisions.length <= 1) {
                            alert("At least one division is required for company operations. Cannot delete the only division.");
                            return;
                          }
                          if (window.confirm(`Are you sure you want to permanently delete division "${div.name}" (${div.code})? This will also remove any assigned Division System Admin.`)) {
                            await removeCompanyDivision(company.id, div.id);
                            setCompany(getActiveCompany());
                            showToast(`Division "${div.name}" deleted successfully!`);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors inline-flex items-center gap-1"
                        title="Delete Division"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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

      {/* TAB 3: TEAM & FIELD HIERARCHY */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Company Field Force Directory</h2>
              <p className="text-xs text-gray-500">
                Manage Regional Managers (RM), Area Managers (AM), and Medical Representatives (MR) strictly within {company.name}.
              </p>
            </div>
            <Link
              to="/sys-admin/users"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              Manage All Field Users
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="text-3xs font-extrabold text-amber-800 uppercase">Regional Managers (RM)</div>
              <div className="text-2xl font-black text-amber-950">4 Active RMs</div>
              <p className="text-xs text-amber-800">Heading UP East, UP West, Bihar & Delhi Regions</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <div className="text-3xs font-extrabold text-emerald-800 uppercase">Area Managers (AM)</div>
              <div className="text-2xl font-black text-emerald-950">14 Active AMs</div>
              <p className="text-xs text-emerald-800">Directly supervising field MR clusters</p>
            </div>

            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
              <div className="text-3xs font-extrabold text-indigo-800 uppercase">Medical Representatives (MR)</div>
              <div className="text-2xl font-black text-indigo-950">68 Active MRs</div>
              <p className="text-xs text-indigo-800">Assigned across Akbarpur, Faizabad, Lucknow & Kanpur HQs</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPANY MASTERS */}
      {activeTab === 'masters' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Company Master Data (100% Isolated)</h2>
            <p className="text-xs text-gray-500">
              All records here belong strictly to {company.name} and are hidden from other pharma companies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
              <div className="flex items-center gap-2 font-black text-gray-900">
                <Pill className="w-5 h-5 text-blue-600" />
                Products & Pricing
              </div>
              <p className="text-xs text-gray-600">Company formulations, packaging, PTS/PTR rates & authorized schemes.</p>
              <Link to="/products" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                Open Product Master →
              </Link>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
              <div className="flex items-center gap-2 font-black text-gray-900">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                Doctors & Specialists
              </div>
              <p className="text-xs text-gray-600">Doctor directory, visiting frequencies, core product tags.</p>
              <Link to="/doctors" className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
                Open Doctor Directory →
              </Link>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
              <div className="flex items-center gap-2 font-black text-gray-900">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
                Stockists & Chemists
              </div>
              <p className="text-xs text-gray-600">Distributors, credit limits, authorized counters & order ledgers.</p>
              <Link to="/stockists" className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1">
                Open Stockist Directory →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BULK UPLOADS CENTER */}
      {activeTab === 'bulk-uploads' && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Company Admin Bulk Data Upload Center (6 Options)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Upload and import bulk master records, areas & HQ, and user profiles securely into {company.name}.
              </p>
            </div>
            
            {/* Entity Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setBulkEntity('products')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  bulkEntity === 'products' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Pill className="w-3.5 h-3.5" /> Products
              </button>
              <button
                onClick={() => setBulkEntity('doctors')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  bulkEntity === 'doctors' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" /> Doctors
              </button>
              <button
                onClick={() => setBulkEntity('chemists')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  bulkEntity === 'chemists' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Chemists
              </button>
              <button
                onClick={() => setBulkEntity('stockists')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  bulkEntity === 'stockists' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Stockists
              </button>
              <button
                onClick={() => setBulkEntity('users')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  bulkEntity === 'users' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Users / Field Reps
              </button>
              <button
                onClick={() => setBulkEntity('areas')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  bulkEntity === 'areas' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> Areas & HQ
              </button>
            </div>
          </div>

          {bulkSuccessMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{bulkSuccessMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Instructions & Template Download */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                {bulkEntity === 'products' && 'Bulk Product Upload Instructions'}
                {bulkEntity === 'doctors' && 'Bulk Doctor Upload Instructions'}
                {bulkEntity === 'chemists' && 'Bulk Chemist Upload Instructions'}
                {bulkEntity === 'stockists' && 'Bulk Stockist Upload Instructions'}
                {bulkEntity === 'users' && 'Bulk User Upload Instructions'}
                {bulkEntity === 'areas' && 'Bulk Area & HQ Upload Instructions'}
              </h3>

              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>Prepare your CSV file or paste tabular data with the exact column headers specified below.</p>
                
                <div className="bg-white border border-slate-200 rounded-xl p-3 font-mono text-3xs text-slate-700 overflow-x-auto">
                  {bulkEntity === 'products' && 'name,composition,division,category,pack,mrp,ptr,pts,scheme,indications'}
                  {bulkEntity === 'doctors' && 'name,specialty,area,subArea,qualification,phone,address,division'}
                  {bulkEntity === 'chemists' && 'name,contactPerson,area,subArea,phone,dlNumber,gstNumber,stockist,address,division'}
                  {bulkEntity === 'stockists' && 'name,contactPerson,phone,email,dlNumber,gstNumber,address,area,district,hq,creditDays,creditLimit,division'}
                  {bulkEntity === 'users' && 'id,name,role,email,phone,hq,territory,divisionName,reportingToName'}
                  {bulkEntity === 'areas' && 'name,hq,patch'}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    let sample = '';
                    if (bulkEntity === 'products') {
                      sample = `name,composition,division,category,pack,mrp,ptr,pts,scheme,indications\nCefixime 200mg,Cefixime 200mg,General,Tablet,10's,145.00,98.50,82.00,10+1,Infections\nPantoprazole 40mg,Pantoprazole 40mg,Gastro,Capsule,15's,120.00,75.00,62.50,20+2,Acidity`;
                    } else if (bulkEntity === 'doctors') {
                      sample = `name,specialty,area,subArea,qualification,phone,address,division\nDr. Rajesh Sharma,Cardiologist,Andheri,Lokhandwala,MD,9820011223,Sterling Hospital,General\nDr. Priya Nair,Pediatrician,Bandra,Hill Road,MBBS,9811122334,Children Clinic,Gastro`;
                    } else if (bulkEntity === 'chemists') {
                      sample = `name,contactPerson,area,subArea,phone,dlNumber,gstNumber,stockist,address,division\nApo Pharmacy,Santosh,Andheri,Link Road,9821133445,DL-01,27AAA00,Vardhman Pharma,Shop 4,General\nMedPlus,Vinod,Bandra,Station,9833344556,DL-02,27BBB11,Apex,Plaza,Gastro`;
                    } else if (bulkEntity === 'stockists') {
                      sample = `name,contactPerson,phone,email,dlNumber,gstNumber,address,area,district,hq,creditDays,creditLimit,division\nVardhman Pharma,Suresh,9820055661,v@pharma.com,DL-S1,27CCC,Parel,Parel,Mumbai,Mumbai,30 Days,500000,General\nApex Agencies,Dinesh,9811166772,a@med.in,DL-S2,27DDD,Dadar,Dadar,Mumbai,Mumbai,21 Days,350000,Gastro`;
                    } else if (bulkEntity === 'users') {
                      sample = `id,name,role,email,phone,hq,territory,divisionName,reportingToName\nMR-GEN-09,Amit Verma,MR,amit@company.com,9820077889,Andheri,Andheri West,General,Rameshwar Patil\nAM-GEN-03,Sunil Gavaskar,AM,sunil@company.com,9811188990,Mumbai,Western Zone,General,Rameshwar Patil`;
                    } else if (bulkEntity === 'areas') {
                      sample = `name,hq,patch\nHazratganj Central,Lucknow HQ,Sector 1\nAliganj North,Lucknow HQ,Sector 2\nCivil Lines,Kanpur HQ,Patch A`;
                    }
                    setBulkCsvText(sample);
                  }}
                  className="w-full py-2 px-3 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Load Sample CSV Template
                </button>
              </div>
            </div>

            {/* Right: Data Input & Execute */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                  <span>Paste CSV Data or Tabular Rows *</span>
                  <span className="text-3xs text-gray-400 font-normal">Supports comma-separated format</span>
                </label>
                <textarea
                  rows={10}
                  value={bulkCsvText}
                  onChange={(e) => setBulkCsvText(e.target.value)}
                  placeholder={`Paste your CSV rows here for bulk ${bulkEntity} import...`}
                  className="w-full p-3 border border-gray-300 rounded-xl font-mono text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-gray-50/50"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-3xs text-gray-500">
                  Data will be securely added to <span className="font-bold text-gray-800">{company.name}</span> database.
                </span>

                <button
                  onClick={handleExecuteBulkUpload}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  Import {bulkEntity.toUpperCase()} in Bulk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD DIVISION */}
      {showAddDivModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-black text-gray-900">Create New Therapeutic Division</h3>
                <p className="text-xs text-gray-500">For {company.name}</p>
              </div>
              <button onClick={() => setShowAddDivModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDivision} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Division Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardio-Diabetic Division"
                  value={newDiv.name}
                  onChange={(e) => setNewDiv({ ...newDiv, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Division Short Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RX-CARD"
                  value={newDiv.code}
                  onChange={(e) => setNewDiv({ ...newDiv, code: e.target.value.toUpperCase() })}
                  className="w-full p-2 border border-gray-300 rounded-lg uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Portfolio Description</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Diabetes & Lipid Management formulations"
                  value={newDiv.description}
                  onChange={(e) => setNewDiv({ ...newDiv, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={newDiv.hasDedicatedAdmin}
                    onChange={(e) => setNewDiv({ ...newDiv, hasDedicatedAdmin: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>Assign Dedicated Division System Admin (DSA)</span>
                </label>
                <p className="text-3xs text-gray-500 ml-6">
                  If unchecked, you as Company Admin will manage this division directly.
                </p>

                {newDiv.hasDedicatedAdmin && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Admin Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Alok Nath"
                        value={newDiv.divisionAdminName}
                        onChange={(e) => setNewDiv({ ...newDiv, divisionAdminName: e.target.value })}
                        className="w-full p-1.5 border border-gray-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Admin Email</label>
                      <input
                        type="email"
                        placeholder="alok@company.com"
                        value={newDiv.divisionAdminEmail}
                        onChange={(e) => setNewDiv({ ...newDiv, divisionAdminEmail: e.target.value })}
                        className="w-full p-1.5 border border-gray-300 rounded bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddDivModal(false)}
                  className="px-3 py-1.5 font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Create Division
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN DIVISION ADMIN */}
      {showAssignAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-black text-gray-900">Assign Division System Admin (DSA)</h3>
                <p className="text-xs text-gray-500">For {showAssignAdminModal.name}</p>
              </div>
              <button onClick={() => setShowAssignAdminModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignAdminSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">DSA Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. V.K. Verma"
                  value={adminDetails.name}
                  onChange={(e) => setAdminDetails({ ...adminDetails, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">DSA Email (Login) *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. vk.verma@company.com"
                  value={adminDetails.email}
                  onChange={(e) => setAdminDetails({ ...adminDetails, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={adminDetails.phone}
                  onChange={(e) => setAdminDetails({ ...adminDetails, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAssignAdminModal(null)}
                  className="px-3 py-1.5 font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Assign DSA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT REPORTING MANAGER */}
      {showReportToModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-black text-gray-900">Configure Reporting Structure</h3>
                <p className="text-xs text-gray-500">DSA: {showReportToModal.divisionAdminName}</p>
              </div>
              <button onClick={() => setShowReportToModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSetReportingManagerSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Who does this Division Admin report to? *</label>
                <select
                  required
                  value={reportingAdminId}
                  onChange={(e) => setReportingAdminId(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-xs font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="" disabled>Select Reporting Manager</option>
                  {company.companyAdmins?.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} ({admin.id === (company.companyAdmins?.find(a => a.isPrimary)?.id) ? 'Primary Admin' : 'Company Admin'}) - ID: {admin.id}
                    </option>
                  ))}
                </select>
                <p className="text-3xs text-gray-500 mt-1.5">
                  The selected manager will receive direct reports, DCR alerts, and activity logs from this division's admin (DSA).
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowReportToModal(null)}
                  className="px-3 py-1.5 font-bold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Save Hierarchy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear All Mock Data Modal */}
      <ConfirmModal
        isOpen={showClearMockModal}
        title="Delete All Mock Data?"
        message={`Are you sure you want to completely erase all demo / sample data (Products, Doctors, Chemists, Stockists, Areas/Patches, Sample Inventory, and MTP records) for ${company.name}? You will start with a 100% clean production environment ready for your genuine field data.`}
        confirmText="Yes, Delete All Mock Data"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          clearAllCompanyMockData(company.id);
          setShowClearMockModal(false);
          showToast(`All mock data has been deleted! You now have a clean production environment for ${company.name}.`);
        }}
        onClose={() => setShowClearMockModal(false)}
      />
    </div>
  );
}
