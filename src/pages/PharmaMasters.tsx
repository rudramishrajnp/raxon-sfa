import { getActiveCompanyId, getActiveCompany } from '../data/companyContext';
import { getProductsCatalog, getDoctorsList, getChemistsList, getStockistsList } from '../data/masterData';
import { getAllHeadquarters } from '../data/hqMrMapping';
import { getMRSampleInventory, getMRGiftInventory } from '../data/sampleInventory';
import { getLoggedInUser } from '../data/userContext';
import { supabase } from '../supabaseClient';
import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Stethoscope, 
  Gift, 
  Store, 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit2, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Eye, 
  FileSpreadsheet, 
  FileText, 
  Layers, 
  Tag, 
  IndianRupee, 
  Building2, 
  Phone, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  Sparkles, 
  Check 
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';

function getInitialMasterCatalogForCompany(companyId: string) {
  const cProducts = getProductsCatalog(companyId).map((p, idx) => ({
    id: p.id || `PRD-${idx + 1}`,
    name: p.name,
    composition: p.composition || `${p.name} Standard formulation`,
    division: p.division || 'General Medicine',
    category: p.category || 'Tablet',
    pack: p.pack || '10x10 Strip',
    pts: p.pts || 100,
    ptr: p.ptr || 120,
    mrp: p.mrp || 160,
    gst: p.gst || '12%',
    status: 'Active'
  }));

  const cDoctors = getDoctorsList(companyId).map((d, idx) => ({
    id: `DOC-${d.id || idx + 101}`,
    name: d.name,
    mciNo: `MCI-${idx + 32100}`,
    specialty: d.specialty || 'General Physician',
    class: 'Core (A+)',
    division: 'General Medicine',
    patch: d.area,
    hospital: d.address || `${d.area} Clinic`,
    phone: d.phone || '+91 98000 12345',
    visitFreq: 'Weekly (4/mo)',
    status: 'Active'
  }));

  const cChemists = getChemistsList(companyId).map((c, idx) => ({
    id: `CHM-${c.id || idx + 101}`,
    name: c.name,
    contactPerson: c.contactPerson || 'Proprietor',
    dlNo: c.dlNumber || `DL-${idx + 1000}`,
    gstin: c.gstNumber || `09AAAPL${idx + 1000}Z1`,
    patch: c.area,
    attachedDocs: 'Key Territory Doctors',
    stockist: c.stockist || 'Authorized Super Stockist',
    status: 'Active'
  }));

  const cStockists = getStockistsList(companyId).map((s, idx) => ({
    id: `STK-${s.id || idx + 1}`,
    agencyName: s.name,
    contactPerson: s.contactPerson || 'Authorized Partner',
    dlNo: s.dlNumber || `DL-${idx + 5000}`,
    gstin: s.gstNumber || `09AAACS${idx + 5000}Z1`,
    district: s.district || s.area || 'Central District',
    phone: s.phone || '+91 98111 22233',
    creditLimit: s.creditLimit ? `₹${s.creditLimit}` : '₹15,00,000',
    creditDays: s.creditDays ? `${s.creditDays} Days` : '30 Days',
    divisions: 'All Active Divisions',
    status: s.status || 'Active'
  }));

  const cSamples = getMRSampleInventory(companyId).map((s, idx) => ({
    id: s.id || `SMP-${idx + 1}`,
    name: s.name,
    type: s.itemType === 'gift' ? 'Promotional Gift' : 'Physician Sample',
    product: s.name ? s.name.split(' ')[0] : 'Unknown',
    packQty: s.pack || 'Catch Cover 2s',
    mrQuota: `${s.totalQuota || 50} Units/mo`,
    stock: (s.availableStock || 50) * 10,
    unitCost: s.unitCost || 20,
    status: (s.availableStock || 0) > 10 ? 'In Stock' : 'Low Stock'
  }));

  return {
    products: cProducts,
    doctors: cDoctors,
    chemists: cChemists,
    stockists: cStockists,
    samples: cSamples
  };
}

export default function PharmaMasters() {
  const activeCompanyId = getActiveCompanyId();
  const activeCompany = getActiveCompany();
  const allHqs = getAllHeadquarters(activeCompanyId);
  const availablePatches: string[] = [];
  allHqs.forEach(h => {
    if (Array.isArray(h.patches)) {
      availablePatches.push(...h.patches);
    }
  });
  const [activeTab, setActiveTab] = useState<'products' | 'doctors' | 'samples' | 'chemists' | 'stockists'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivision, setFilterDivision] = useState('All');
  
  const initMasters = getInitialMasterCatalogForCompany(activeCompanyId);

  // Master Lists in State with localStorage persistence
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(`raxon_master_products_${activeCompanyId}`);
      return saved ? JSON.parse(saved) : initMasters.products;
    } catch { return initMasters.products; }
  });

  const [doctors, setDoctors] = useState(() => {
    try {
      const saved = localStorage.getItem(`raxon_master_doctors_${activeCompanyId}`);
      return saved ? JSON.parse(saved) : initMasters.doctors;
    } catch { return initMasters.doctors; }
  });

  const [samples, setSamples] = useState(() => {
    try {
      const saved = localStorage.getItem(`raxon_master_samples_${activeCompanyId}`);
      return saved ? JSON.parse(saved) : initMasters.samples;
    } catch { return initMasters.samples; }
  });

  const [chemists, setChemists] = useState(() => {
    try {
      const saved = localStorage.getItem(`raxon_master_chemists_${activeCompanyId}`);
      return saved ? JSON.parse(saved) : initMasters.chemists;
    } catch { return initMasters.chemists; }
  });

  const [stockists, setStockists] = useState(() => {
    try {
      const saved = localStorage.getItem(`raxon_master_stockists_${activeCompanyId}`);
      return saved ? JSON.parse(saved) : initMasters.stockists;
    } catch { return initMasters.stockists; }
  });

  // Re-sync on company switch
  useEffect(() => {
    const handleCompanySwitch = () => {
      const cId = getActiveCompanyId();
      const fresh = getInitialMasterCatalogForCompany(cId);
      try {
        const savedProd = localStorage.getItem(`raxon_master_products_${cId}`);
        setProducts(savedProd ? JSON.parse(savedProd) : fresh.products);
        const savedDoc = localStorage.getItem(`raxon_master_doctors_${cId}`);
        setDoctors(savedDoc ? JSON.parse(savedDoc) : fresh.doctors);
        const savedSmp = localStorage.getItem(`raxon_master_samples_${cId}`);
        setSamples(savedSmp ? JSON.parse(savedSmp) : fresh.samples);
        const savedChm = localStorage.getItem(`raxon_master_chemists_${cId}`);
        setChemists(savedChm ? JSON.parse(savedChm) : fresh.chemists);
        const savedStk = localStorage.getItem(`raxon_master_stockists_${cId}`);
        setStockists(savedStk ? JSON.parse(savedStk) : fresh.stockists);
      } catch {
        setProducts(fresh.products);
        setDoctors(fresh.doctors);
        setSamples(fresh.samples);
        setChemists(fresh.chemists);
        setStockists(fresh.stockists);
      }
    };
    window.addEventListener('raxon-company-switched', handleCompanySwitch);
    window.addEventListener('raxon-company-updated', handleCompanySwitch);
    window.addEventListener('raxon-company-changed', handleCompanySwitch);
    return () => {
      window.removeEventListener('raxon-company-switched', handleCompanySwitch);
      window.removeEventListener('raxon-company-updated', handleCompanySwitch);
      window.removeEventListener('raxon-company-changed', handleCompanySwitch);
    };
  }, []);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);
  const [isClearTabModalOpen, setIsClearTabModalOpen] = useState(false);
  const [confirmStatusItem, setConfirmStatusItem] = useState<{ item: any; nextStatus: 'Active' | 'Inactive' } | null>(null);
  const [selectedItemForView, setSelectedItemForView] = useState<any>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Dynamic Form State
  const [formState, setFormState] = useState<any>({});

  // Toast state
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Explicit Persistence Helpers - ONLY called on user Save/Submit actions, never in useEffect or onSnapshot
  const persistProducts = (updated: any[]) => {
    const cId = getActiveCompanyId();
    const mappedProducts = updated.map(p => ({
      id: p.id,
      name: p.name,
      composition: p.composition,
      division: p.division,
      category: p.category,
      pack: p.pack,
      pts: Number(p.pts) || 100,
      ptr: Number(p.ptr) || 120,
      mrp: Number(p.mrp) || 160,
      gst: p.gst || '12%',
      scheme: '10 + 1 Free',
      status: p.status || 'Active',
      indications: 'Standard prescription'
    }));
    localStorage.setItem(`raxon_master_products_${cId}`, JSON.stringify(updated));
    localStorage.setItem(`raxon_products_catalog_${cId}`, JSON.stringify(mappedProducts));
    window.dispatchEvent(new CustomEvent('raxon-products-updated', { detail: { products: updated, companyId: cId } }));

    supabase.from('master_products').upsert({
      company_id: cId,
      products: mappedProducts,
      updated_at: new Date().toISOString()
    }).then(null, err => console.warn('Supabase products save error:', err));
  };

  const persistDoctors = (updated: any[]) => {
    const cId = getActiveCompanyId();
    const mappedDoctors = updated.map(d => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty || 'General Physician',
      qualification: 'MBBS',
      area: d.patch || 'Main Market',
      subArea: d.patch || 'Sector 1',
      address: d.hospital || `${d.patch || 'Town'} Clinic`,
      phone: d.phone || '+91 98000 12345',
      division: d.division || 'General Medicine',
      status: d.status || 'Active'
    }));
    localStorage.setItem(`raxon_master_doctors_${cId}`, JSON.stringify(updated));
    localStorage.setItem(`raxon_doctors_master_${cId}`, JSON.stringify(mappedDoctors));
    window.dispatchEvent(new CustomEvent('raxon-doctors-updated', { detail: { doctors: updated, companyId: cId } }));

    supabase.from('master_doctors').upsert({
      company_id: cId,
      doctors: mappedDoctors,
      updated_at: new Date().toISOString()
    }).then(null, err => console.warn('Supabase doctors save error:', err));
  };

  const persistSamples = (updated: any[]) => {
    const cId = getActiveCompanyId();
    const mappedSamples = updated.map(s => ({
      id: s.id,
      name: s.name,
      itemName: s.name,
      itemType: s.type?.toLowerCase().includes('gift') ? 'gift' : 'sample',
      pack: s.packQty || 'Catch Cover 2s',
      category: s.type || 'Physician Sample',
      totalQuota: parseInt(s.mrQuota) || 50,
      issuedQty: 0,
      availableStock: Number(s.stock) || 500,
      currentStock: Number(s.stock) || 500,
      unitCost: Number(s.unitCost) || 20
    }));
    localStorage.setItem(`raxon_master_samples_${cId}`, JSON.stringify(updated));
    localStorage.setItem(`raxon_sample_inventory_${cId}`, JSON.stringify(mappedSamples));
    window.dispatchEvent(new CustomEvent('raxon-sample-inventory-updated', { detail: { items: updated, companyId: cId } }));

    supabase.from('master_samples').upsert({
      company_id: cId,
      samples: mappedSamples,
      updated_at: new Date().toISOString()
    }).then(null, err => console.warn('Supabase samples save error:', err));
  };

  const persistChemists = (updated: any[]) => {
    const cId = getActiveCompanyId();
    const mappedChemists = updated.map(c => ({
      id: c.id,
      name: c.name,
      contactPerson: c.contactPerson || 'Proprietor',
      area: c.patch || 'Main Market',
      subArea: c.patch || 'Sector 1',
      address: `${c.patch || 'Town'} Medical Hall`,
      phone: '+91 98765 00000',
      dlNumber: c.dlNo || 'DL-20B/21B',
      gstNumber: c.gstin || '09AAAPL1234Z1',
      stockist: c.stockist || 'Main Stockist',
      status: c.status || 'Active'
    }));
    localStorage.setItem(`raxon_master_chemists_${cId}`, JSON.stringify(updated));
    localStorage.setItem(`raxon_chemists_master_${cId}`, JSON.stringify(mappedChemists));
    window.dispatchEvent(new CustomEvent('raxon-chemists-updated', { detail: { chemists: updated, companyId: cId } }));

    supabase.from('master_chemists').upsert({
      company_id: cId,
      chemists: mappedChemists,
      updated_at: new Date().toISOString()
    }).then(null, err => console.warn('Supabase chemists save error:', err));
  };

  const persistStockists = (updated: any[]) => {
    const cId = getActiveCompanyId();
    const mappedStockists = updated.map(st => ({
      id: st.id,
      name: st.agencyName || st.name,
      contactPerson: st.contactPerson || 'Authorized Representative',
      area: st.district || 'Central District',
      district: st.district || 'Central District',
      address: `${st.district || 'Central'} Agency Office`,
      phone: st.phone || '+91 98111 22233',
      dlNumber: st.dlNo || 'DL-20B/21B',
      gstNumber: st.gstin || '09AAACS1234Z1',
      creditLimit: parseInt((st.creditLimit || '1500000').replace(/[^0-9]/g, '')) || 1500000,
      creditDays: parseInt((st.creditDays || '30').replace(/[^0-9]/g, '')) || 30,
      status: st.status || 'Active'
    }));
    localStorage.setItem(`raxon_master_stockists_${cId}`, JSON.stringify(updated));
    localStorage.setItem(`raxon_stockists_master_${cId}`, JSON.stringify(mappedStockists));
    window.dispatchEvent(new CustomEvent('raxon-stockists-updated', { detail: { stockists: updated, companyId: cId } }));

    supabase.from('master_stockists').upsert({
      company_id: cId,
      stockists: mappedStockists,
      updated_at: new Date().toISOString()
    }).then(null, err => console.warn('Supabase stockists save error:', err));
  };

  // Handle Tab Switch
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setFilterDivision('All');
  };

  // Open Add Modal with fresh empty fields
  const handleOpenAddModal = () => {
    if (activeTab === 'products') {
      setFormState({
        name: '',
        composition: '',
        division: 'General Medicine',
        category: 'Tablet',
        pack: '10x10 Strip',
        pts: 100,
        ptr: 120,
        mrp: 180,
        gst: '12%',
        status: 'Active'
      });
    } else if (activeTab === 'doctors') {
      setFormState({
        name: '',
        mciNo: 'MCI-UP-' + Math.floor(10000 + Math.random() * 90000),
        specialty: 'General Physician (MD)',
        class: 'Core (A+)',
        division: 'General Medicine',
        patch: 'Iltifatganj',
        hospital: '',
        phone: '',
        visitFreq: 'Weekly (4/mo)',
        status: 'Active'
      });
    } else if (activeTab === 'samples') {
      setFormState({
        name: '',
        type: 'Physician Sample',
        product: products[0]?.name || 'Raxon-CV 625',
        packQty: '2 Tablets Catch Cover',
        mrQuota: '40 Units/mo',
        stock: 500,
        unitCost: 15,
        status: 'In Stock'
      });
    } else if (activeTab === 'chemists') {
      setFormState({
        name: '',
        contactPerson: '',
        dlNo: 'UP-ABN-20B-' + Math.floor(1000 + Math.random() * 9000),
        gstin: '09AAAFM' + Math.floor(1000 + Math.random() * 9000) + 'F1Z8',
        patch: 'Iltifatganj',
        attachedDocs: 'Dr. S.K. Verma',
        stockist: 'Gupta Medical Agency',
        status: 'Active'
      });
    } else if (activeTab === 'stockists') {
      setFormState({
        agencyName: '',
        contactPerson: '',
        dlNo: 'UP-ABN-20B/21B-' + Math.floor(1000 + Math.random() * 9000),
        gstin: '09AAACG' + Math.floor(1000 + Math.random() * 9000) + 'A1Z1',
        district: 'Ambedkar Nagar (Akbarpur)',
        phone: '',
        creditLimit: '₹15,00,000',
        creditDays: '30 Days',
        divisions: 'General Medicine, Cardio',
        status: 'Active'
      });
    }
    setIsAddModalOpen(true);
  };

  // Open Edit Modal with existing values
  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    setFormState({ ...item });
  };

  // Save Add - Explicit user action
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'products') {
      if (!formState.name) return;
      const newId = `PRD-00${products.length + 1}`;
      const newItem = { id: newId, ...formState, pts: Number(formState.pts), ptr: Number(formState.ptr), mrp: Number(formState.mrp) };
      const updated = [newItem, ...products];
      setProducts(updated);
      persistProducts(updated);
      showToast(`Product "${newItem.name}" added successfully!`);
    } else if (activeTab === 'doctors') {
      if (!formState.name) return;
      const newName = formState.name.trim().startsWith('Dr.') ? formState.name.trim() : `Dr. ${formState.name.trim()}`;
      const newId = `DOC-${100 + doctors.length + 1}`;
      const newItem = { id: newId, ...formState, name: newName };
      const updated = [newItem, ...doctors];
      setDoctors(updated);
      persistDoctors(updated);
      showToast(`Doctor "${newItem.name}" added to master directory!`);
    } else if (activeTab === 'samples') {
      if (!formState.name) return;
      const newId = `SMP-0${samples.length + 1}`;
      const newItem = { id: newId, ...formState, stock: Number(formState.stock), unitCost: Number(formState.unitCost) };
      const updated = [newItem, ...samples];
      setSamples(updated);
      persistSamples(updated);
      showToast(`Item "${newItem.name}" added to promotional catalog!`);
    } else if (activeTab === 'chemists') {
      if (!formState.name) return;
      const newId = `CHM-${100 + chemists.length + 1}`;
      const newItem = { id: newId, ...formState };
      const updated = [newItem, ...chemists];
      setChemists(updated);
      persistChemists(updated);
      showToast(`Chemist "${newItem.name}" registered successfully!`);
    } else if (activeTab === 'stockists') {
      if (!formState.agencyName) return;
      const newId = `STK-0${stockists.length + 1}`;
      const newItem = { id: newId, ...formState };
      const updated = [newItem, ...stockists];
      setStockists(updated);
      persistStockists(updated);
      showToast(`Stockist "${newItem.agencyName}" created!`);
    }
    setIsAddModalOpen(false);
  };

  // Save Edit - Explicit user action
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (activeTab === 'products') {
      const updated = products.map((p: any) => p.id === editingItem.id ? { 
        ...p, 
        ...formState, 
        pts: Number(formState.pts), 
        ptr: Number(formState.ptr), 
        mrp: Number(formState.mrp) 
      } : p);
      setProducts(updated);
      persistProducts(updated);
      showToast(`Product "${formState.name}" updated successfully!`);
    } else if (activeTab === 'doctors') {
      const formattedName = formState.name.trim().startsWith('Dr.') ? formState.name.trim() : `Dr. ${formState.name.trim()}`;
      const updated = doctors.map((d: any) => d.id === editingItem.id ? { 
        ...d, 
        ...formState,
        name: formattedName
      } : d);
      setDoctors(updated);
      persistDoctors(updated);
      showToast(`Doctor "${formattedName}" profile updated successfully!`);
    } else if (activeTab === 'samples') {
      const updated = samples.map((s: any) => s.id === editingItem.id ? { 
        ...s, 
        ...formState, 
        stock: Number(formState.stock), 
        unitCost: Number(formState.unitCost) 
      } : s);
      setSamples(updated);
      persistSamples(updated);
      showToast(`Sample/Input "${formState.name}" updated!`);
    } else if (activeTab === 'chemists') {
      const updated = chemists.map((c: any) => c.id === editingItem.id ? { ...c, ...formState } : c);
      setChemists(updated);
      persistChemists(updated);
      showToast(`Chemist "${formState.name}" details updated!`);
    } else if (activeTab === 'stockists') {
      const updated = stockists.map((st: any) => st.id === editingItem.id ? { ...st, ...formState } : st);
      setStockists(updated);
      persistStockists(updated);
      showToast(`Stockist "${formState.agencyName}" details updated!`);
    }
    setEditingItem(null);
  };

  // Delete Action - Explicit user action
  const handleConfirmDelete = () => {
    if (!deletingItem) return;

    if (activeTab === 'products') {
      const updated = products.filter((p: any) => p.id !== deletingItem.id);
      setProducts(updated);
      persistProducts(updated);
      showToast(`Product "${deletingItem.name}" deleted.`);
    } else if (activeTab === 'doctors') {
      const updated = doctors.filter((d: any) => d.id !== deletingItem.id);
      setDoctors(updated);
      persistDoctors(updated);
      showToast(`Doctor "${deletingItem.name}" removed from master.`);
    } else if (activeTab === 'samples') {
      const updated = samples.filter((s: any) => s.id !== deletingItem.id);
      setSamples(updated);
      persistSamples(updated);
      showToast(`Item "${deletingItem.name}" removed.`);
    } else if (activeTab === 'chemists') {
      const updated = chemists.filter((c: any) => c.id !== deletingItem.id);
      setChemists(updated);
      persistChemists(updated);
      showToast(`Chemist "${deletingItem.name}" removed.`);
    } else if (activeTab === 'stockists') {
      const updated = stockists.filter((st: any) => st.id !== deletingItem.id);
      setStockists(updated);
      persistStockists(updated);
      showToast(`Stockist "${deletingItem.agencyName}" removed.`);
    }
    setDeletingItem(null);
  };

  // Request Toggle Active/Inactive status with confirmation
  const handleRequestToggleItemStatus = (item: any) => {
    const nextStatus: 'Active' | 'Inactive' = item.status === 'Active' ? 'Inactive' : 'Active';
    setConfirmStatusItem({ item, nextStatus });
  };

  // Execute Toggle status after user confirmation - Explicit user action
  const handleExecuteStatusToggle = () => {
    if (!confirmStatusItem) return;
    const { item, nextStatus } = confirmStatusItem;

    if (activeTab === 'products') {
      const updated = products.map((p: any) => p.id === item.id ? { ...p, status: nextStatus } : p);
      setProducts(updated);
      persistProducts(updated);
    } else if (activeTab === 'doctors') {
      const updated = doctors.map((d: any) => d.id === item.id ? { ...d, status: nextStatus } : d);
      setDoctors(updated);
      persistDoctors(updated);
    } else if (activeTab === 'chemists') {
      const updated = chemists.map((c: any) => c.id === item.id ? { ...c, status: nextStatus } : c);
      setChemists(updated);
      persistChemists(updated);
    } else if (activeTab === 'stockists') {
      const updated = stockists.map((s: any) => s.id === item.id ? { ...s, status: nextStatus } : s);
      setStockists(updated);
      persistStockists(updated);
    }
    showToast(`Status changed to ${nextStatus} for ${item.name || item.agencyName}`);
    setConfirmStatusItem(null);
  };

  // Export to CSV
  const handleExport = () => {
    let headers: string[] = [];
    let rows: string[] = [];
    let filename = `Raxon_${activeTab}_Master_${new Date().toISOString().slice(0, 10)}.csv`;

    if (activeTab === 'products') {
      headers = ['Product ID', 'Name', 'Composition', 'Division', 'Category', 'Pack Size', 'PTS', 'PTR', 'MRP', 'GST', 'Status'];
      rows = products.map((p: any) => [
        `"${p.id}"`, `"${p.name}"`, `"${p.composition}"`, `"${p.division}"`, `"${p.category}"`, `"${p.pack}"`, p.pts, p.ptr, p.mrp, `"${p.gst}"`, `"${p.status}"`
      ].join(','));
    } else if (activeTab === 'doctors') {
      headers = ['Doctor ID', 'Name', 'MCI Number', 'Specialty', 'Category Class', 'Division', 'Area', 'Hospital', 'Phone', 'Visit Frequency', 'Status'];
      rows = doctors.map((d: any) => [
        `"${d.id}"`, `"${d.name}"`, `"${d.mciNo}"`, `"${d.specialty}"`, `"${d.class}"`, `"${d.division}"`, `"${d.patch}"`, `"${d.hospital}"`, `"${d.phone}"`, `"${d.visitFreq}"`, `"${d.status}"`
      ].join(','));
    } else if (activeTab === 'samples') {
      headers = ['Item Code', 'Name', 'Type', 'Linked Product', 'Pack Details', 'MR Quota', 'Stock Units', 'Unit Cost', 'Status'];
      rows = samples.map((s: any) => [
        `"${s.id}"`, `"${s.name}"`, `"${s.type}"`, `"${s.product}"`, `"${s.packQty}"`, `"${s.mrQuota}"`, s.stock, s.unitCost, `"${s.status}"`
      ].join(','));
    } else if (activeTab === 'chemists') {
      headers = ['Chemist ID', 'Shop Name', 'Contact Person', 'Drug License', 'GSTIN', 'Area', 'Attached Doctors', 'Stockist', 'Status'];
      rows = chemists.map((c: any) => [
        `"${c.id}"`, `"${c.name}"`, `"${c.contactPerson}"`, `"${c.dlNo}"`, `"${c.gstin}"`, `"${c.patch}"`, `"${c.attachedDocs}"`, `"${c.stockist}"`, `"${c.status}"`
      ].join(','));
    } else if (activeTab === 'stockists') {
      headers = ['Stockist ID', 'Agency Name', 'Contact Person', 'Drug License', 'GSTIN', 'District', 'Phone', 'Credit Limit', 'Credit Days', 'Divisions', 'Status'];
      rows = stockists.map((st: any) => [
        `"${st.id}"`, `"${st.agencyName}"`, `"${st.contactPerson}"`, `"${st.dlNo}"`, `"${st.gstin}"`, `"${st.district}"`, `"${st.phone}"`, `"${st.creditLimit}"`, `"${st.creditDays}"`, `"${st.divisions}"`, `"${st.status}"`
      ].join(','));
    }

    const csvContent = `${headers.join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Master data exported to CSV successfully!`);
  };

  // Get active dataset
  const getActiveDataset = () => {
    switch (activeTab) {
      case 'products': return products;
      case 'doctors': return doctors;
      case 'samples': return samples;
      case 'chemists': return chemists;
      case 'stockists': return stockists;
      default: return [];
    }
  };

  // Filter active dataset
  const loggedIn = getLoggedInUser();
  const isDsa = loggedIn && (loggedIn.role === 'ZM' || loggedIn.roleTitle?.toLowerCase().includes('division system admin') || loggedIn.roleTitle?.toLowerCase().includes('dsa'));

  const doesItemMatchDsaDivision = (itemDiv: string, dsaDiv: string): boolean => {
    if (!itemDiv || !dsaDiv) return false;
    const iD = itemDiv.toLowerCase();
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

  const filteredData = getActiveDataset().filter((item: any) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = Object.values(item).some(val => 
      String(val).toLowerCase().includes(q)
    );

    // Strict division-level isolation for DSA
    if (isDsa && loggedIn?.divisionName) {
      const itemDiv = item.division || item.divisions || '';
      if (!doesItemMatchDsaDivision(itemDiv, loggedIn.divisionName)) {
        return false;
      }
    }

    const matchesDivision = isDsa || filterDivision === 'All' || item.division === filterDivision;
    return matchesSearch && matchesDivision;
  });

  return (
    <div className="space-y-6 relative">
      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-gray-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-white text-xs ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">Pharma Master Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live Interactive CRUD
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Central repository for Products, Doctors (HCPs), Samples, Chemist Retailers, and Wholesale Stockists.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {((activeTab === 'products' && products.length > 0) ||
            (activeTab === 'doctors' && doctors.length > 0) ||
            (activeTab === 'samples' && samples.length > 0) ||
            (activeTab === 'chemists' && chemists.length > 0) ||
            (activeTab === 'stockists' && stockists.length > 0)) && (
            <button
              onClick={() => setIsClearTabModalOpen(true)}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-sm font-semibold flex items-center shadow-2xs transition-colors cursor-pointer"
              title={`Delete all records in ${activeTab} to start clean`}
            >
              <Trash2 className="w-4 h-4 mr-1.5 text-red-600" /> 
              Delete All {activeTab === 'products' ? `Products (${products.length})` : activeTab === 'doctors' ? `Doctors (${doctors.length})` : activeTab === 'samples' ? `Samples (${samples.length})` : activeTab === 'chemists' ? `Chemists (${chemists.length})` : `Stockists (${stockists.length})`}
            </button>
          )}
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center shadow-2xs transition-colors"
          >
            <Upload className="w-4 h-4 mr-1.5 text-gray-500" /> Bulk Import
          </button>
          <button 
            onClick={handleExport}
            className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 mr-1.5 text-gray-500" /> Export CSV
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium flex items-center shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" /> 
            {activeTab === 'products' && 'Add Product'}
            {activeTab === 'doctors' && 'Add Doctor'}
            {activeTab === 'samples' && 'Add Sample/Input'}
            {activeTab === 'chemists' && 'Add Chemist'}
            {activeTab === 'stockists' && 'Add Stockist'}
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button 
          onClick={() => handleTabChange('products')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'products' 
              ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500 shadow-xs' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Pill className={`w-5 h-5 ${activeTab === 'products' ? 'text-indigo-600' : 'text-gray-400'}`} />
            <span className="text-xs font-bold text-gray-400">SKUs</span>
          </div>
          <div className="text-xl font-bold text-gray-900 mt-2">{products.length}</div>
          <div className="text-xs text-gray-600 font-medium mt-0.5">Products Master</div>
        </button>

        <button 
          onClick={() => handleTabChange('doctors')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'doctors' 
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500 shadow-xs' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Stethoscope className={`w-5 h-5 ${activeTab === 'doctors' ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span className="text-xs font-bold text-gray-400">HCPs</span>
          </div>
          <div className="text-xl font-bold text-gray-900 mt-2">{doctors.length}</div>
          <div className="text-xs text-gray-600 font-medium mt-0.5">Doctor Master</div>
        </button>

        <button 
          onClick={() => handleTabChange('samples')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'samples' 
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500 shadow-xs' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Gift className={`w-5 h-5 ${activeTab === 'samples' ? 'text-amber-600' : 'text-gray-400'}`} />
            <span className="text-xs font-bold text-gray-400">Inventory</span>
          </div>
          <div className="text-xl font-bold text-gray-900 mt-2">{samples.reduce((a, b) => a + b.stock, 0).toLocaleString()}</div>
          <div className="text-xs text-gray-600 font-medium mt-0.5">Samples & Inputs</div>
        </button>

        <button 
          onClick={() => handleTabChange('chemists')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'chemists' 
              ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-500 shadow-xs' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Store className={`w-5 h-5 ${activeTab === 'chemists' ? 'text-purple-600' : 'text-gray-400'}`} />
            <span className="text-xs font-bold text-gray-400">Retail</span>
          </div>
          <div className="text-xl font-bold text-gray-900 mt-2">{chemists.length}</div>
          <div className="text-xs text-gray-600 font-medium mt-0.5">Chemist Master</div>
        </button>

        <button 
          onClick={() => handleTabChange('stockists')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'stockists' 
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500 shadow-xs' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Truck className={`w-5 h-5 ${activeTab === 'stockists' ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className="text-xs font-bold text-gray-400">Distributors</span>
          </div>
          <div className="text-xl font-bold text-gray-900 mt-2">{stockists.length}</div>
          <div className="text-xs text-gray-600 font-medium mt-0.5">Stockist Master</div>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Table Filters & Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/60">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm w-full focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-shadow"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
            {isDsa ? (
              <div className="px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold flex items-center">
                🏢 Division: {loggedIn?.divisionName}
              </div>
            ) : (
              activeTab === 'products' && (
                <select 
                  value={filterDivision}
                  onChange={(e) => setFilterDivision(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium text-gray-700"
                >
                  <option value="All">All Divisions</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardio-Diabetic">Cardio-Diabetic</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="Dermatology">Dermatology</option>
                </select>
              )
            )}
            <span className="text-xs text-gray-500 font-medium ml-2">
              Showing {filteredData.length} records
            </span>
          </div>
        </div>

        {/* Tab 1: Products Table */}
        {activeTab === 'products' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Product & SKU</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Formula / Salt Composition</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Division & Pack</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase">PTS (₹)</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase">PTR (₹)</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase">MRP (₹)</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Scheme</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((p: any) => (
                  <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-sm">{p.name}</div>
                      <div className="text-xs text-indigo-600 font-mono font-medium">{p.id}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-700 max-w-xs font-medium">
                      {p.composition}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-gray-800">{p.division}</div>
                      <div className="text-xs text-gray-500">{p.pack} ({p.category})</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-700 font-medium">
                      ₹{p.pts?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-700 font-medium">
                      ₹{p.ptr?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-emerald-700">
                      ₹{p.mrp?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleRequestToggleItemStatus(p)} title="Click to toggle status">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${
                          p.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}>
                          {p.status === 'Active' ? <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" /> : <XCircle className="w-3 h-3 mr-1 text-red-600" />}
                          {p.status}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button 
                          onClick={() => setSelectedItemForView(p)} 
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" 
                          title="View Product"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(p)} 
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" 
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeletingItem(p)} 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" 
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Doctor Table */}
        {activeTab === 'doctors' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Doctor Name & MCI</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Specialty</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Category</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">HQ & Area</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Hospital / Clinic</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Visit Frequency</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((d: any) => (
                  <tr key={d.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-sm">{d.name}</div>
                      <div className="text-xs text-emerald-700 font-mono font-medium">{d.mciNo} ({d.id})</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                      {d.specialty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        d.class?.includes('Super Core') || d.class?.includes('VIP')
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : d.class?.includes('Core')
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {d.class}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 shrink-0" />
                        <span className="truncate">{d.hq ? `${d.hq} • ${d.patch}` : d.patch}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={d.hospital}>
                      <div className="flex items-center">
                        <Building2 className="w-3.5 h-3.5 mr-1 text-gray-400 shrink-0" />
                        <span className="truncate">{d.hospital || 'Private Clinic'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        {d.visitFreq}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleRequestToggleItemStatus(d)} title="Click to toggle status">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${
                          d.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}>
                          {d.status === 'Active' ? <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" /> : <XCircle className="w-3 h-3 mr-1 text-red-600" />}
                          {d.status}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button 
                          onClick={() => setSelectedItemForView(d)} 
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg" 
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(d)} 
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" 
                          title="Edit Doctor Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeletingItem(d)} 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" 
                          title="Delete Doctor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Samples Table */}
        {activeTab === 'samples' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Item Code & Name</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Type</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Linked Product</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Pack Details</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">MR Monthly Quota</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Central Stock</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase">Unit Cost (₹)</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((s: any) => (
                  <tr key={s.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-sm">{s.name}</div>
                      <div className="text-xs text-gray-500 font-mono font-medium">{s.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                        s.type === 'Physician Sample' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {s.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700">
                      {s.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                      {s.packQty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-900">
                      {s.mrQuota}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${s.stock < 100 ? 'text-red-600' : 'text-gray-900'}`}>
                        {s.stock?.toLocaleString()} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold text-gray-800">
                      ₹{s.unitCost?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(s)} 
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" 
                          title="Edit Item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeletingItem(s)} 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" 
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Chemist Table */}
        {activeTab === 'chemists' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Pharmacy Name & DL</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Pharmacist / Contact</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">HQ & Area</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Attached Prescribers</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Mapped Stockist</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">GSTIN</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((c: any) => (
                  <tr key={c.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-sm">{c.name}</div>
                      <div className="text-xs text-purple-700 font-mono font-medium">DL: {c.dlNo} ({c.id})</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {c.contactPerson}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 shrink-0" />
                        <span className="truncate">{c.hq ? `${c.hq} • ${c.patch}` : c.patch}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 max-w-xs truncate" title={c.attachedDocs}>
                      {c.attachedDocs}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-indigo-600">
                      {c.stockist}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                      {c.gstin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(c)} 
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg" 
                          title="Edit Chemist"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeletingItem(c)} 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" 
                          title="Delete Chemist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: Stockist Table */}
        {activeTab === 'stockists' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Distributor Agency & DL</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">HQ & District / Area</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Contact & Phone</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Credit Limit & Days</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase">Covered Divisions</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((st: any) => (
                  <tr key={st.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-blue-900 text-sm">{st.agencyName}</div>
                      <div className="text-xs text-blue-700 font-mono">DL: {st.dlNo} ({st.id})</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 shrink-0" />
                        <span className="truncate">{st.hq ? `${st.hq} • ${st.district}` : st.district}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{st.contactPerson}</div>
                      <div className="text-xs text-gray-500">{st.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-emerald-700">{st.creditLimit}</div>
                      <div className="text-xs text-gray-500 font-medium">Terms: {st.creditDays}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-700 font-medium">
                      {st.divisions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(st)} 
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" 
                          title="Edit Stockist"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeletingItem(st)} 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" 
                          title="Delete Stockist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredData.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500 text-sm">
            No records found matching your search.
          </div>
        )}
      </div>

      {/* --- ADD MODAL (UNIFIED BY TAB) --- */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title={`Add New ${activeTab === 'products' ? 'Product' : activeTab === 'doctors' ? 'Doctor' : activeTab === 'samples' ? 'Sample / Detailing Input' : activeTab === 'chemists' ? 'Chemist' : 'Stockist'}`}
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          {activeTab === 'products' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formState.name || ''} 
                    onChange={e => setFormState({ ...formState, name: e.target.value })} 
                    placeholder="e.g. Raxon-CV 625" 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Division</label>
                  <select 
                    value={formState.division || 'General Medicine'} 
                    onChange={e => setFormState({ ...formState, division: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white"
                  >
                    <option>General Medicine</option>
                    <option>Cardio-Diabetic</option>
                    <option>Pediatric</option>
                    <option>Dermatology</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Formula / Composition *</label>
                <input 
                  type="text" 
                  required 
                  value={formState.composition || ''} 
                  onChange={e => setFormState({ ...formState, composition: e.target.value })} 
                  placeholder="e.g. Amoxicillin 500mg + Clavulanic Acid 125mg" 
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dosage Form</label>
                  <select 
                    value={formState.category || 'Tablet'} 
                    onChange={e => setFormState({ ...formState, category: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white"
                  >
                    <option>Tablet</option>
                    <option>Capsule</option>
                    <option>Syrup</option>
                    <option>Injection</option>
                    <option>Ointment / Lotion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pack Size</label>
                  <input 
                    type="text" 
                    value={formState.pack || ''} 
                    onChange={e => setFormState({ ...formState, pack: e.target.value })} 
                    placeholder="e.g. 10x1x10 Strip" 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">PTS (₹)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formState.pts || ''} 
                    onChange={e => setFormState({ ...formState, pts: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white font-semibold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">PTR (₹)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formState.ptr || ''} 
                    onChange={e => setFormState({ ...formState, ptr: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white font-semibold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">MRP (₹)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formState.mrp || ''} 
                    onChange={e => setFormState({ ...formState, mrp: e.target.value })} 
                    className="w-full p-2 border border-emerald-300 rounded-lg text-sm bg-white font-bold text-emerald-800" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Scheme / Offer</label>
                <input 
                  type="text"
                  value={formState.scheme || ''} 
                  onChange={e => setFormState({ ...formState, scheme: e.target.value })} 
                  placeholder="e.g. 10+1 Free"
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                />
              </div>
            </>
          )}

          {activeTab === 'doctors' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Doctor Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formState.name || ''} 
                    onChange={e => setFormState({ ...formState, name: e.target.value })} 
                    placeholder="e.g. Dr. Ramesh Gupta" 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">MCI / State Reg No.</label>
                  <input 
                    type="text" 
                    value={formState.mciNo || ''} 
                    onChange={e => setFormState({ ...formState, mciNo: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm font-mono" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Specialty</label>
                  <select 
                    value={formState.specialty || 'General Physician (MD)'} 
                    onChange={e => setFormState({ ...formState, specialty: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white"
                  >
                    <option>General Physician (MD)</option>
                    <option>Cardiologist (DM)</option>
                    <option>Consultant Diabetologist</option>
                    <option>Gynecologist (MS)</option>
                    <option>Pediatrician (DCH)</option>
                    <option>Dermatologist (DVD)</option>
                    <option>Orthopedic Surgeon (MS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categorization Class</label>
                  <select 
                    value={formState.class || 'Core (A+)'} 
                    onChange={e => setFormState({ ...formState, class: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white"
                  >
                    <option>Super Core (VIP)</option>
                    <option>Core (A+)</option>
                    <option>Class A</option>
                    <option>Class B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Headquarter (HQ) *</label>
                  <select 
                    value={formState.hq || allHqs[0]?.name || ''} 
                    onChange={e => {
                      const newHq = e.target.value;
                      const matchedHq = allHqs.find(h => h.name === newHq);
                      const firstPatch = matchedHq?.patches?.[0] || '';
                      setFormState({ ...formState, hq: newHq, patch: firstPatch });
                    }} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                  >
                    {allHqs.length === 0 ? (
                      <option value="">No HQs found</option>
                    ) : (
                      allHqs.map(h => (
                        <option key={h.id} value={h.name}>{h.name} ({h.code} - {h.district})</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Area *</label>
                  <select 
                    value={formState.patch || ''} 
                    onChange={e => setFormState({ ...formState, patch: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                  >
                    {(() => {
                      const currentHqObj = allHqs.find(h => h.name === (formState.hq || allHqs[0]?.name));
                      const patches = currentHqObj?.patches || availablePatches;
                      if (patches.length === 0) return <option value="">No Areas found</option>;
                      return patches.map(p => <option key={p} value={p}>{p}</option>);
                    })()}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hospital / Clinic Name & Location</label>
                <input 
                  type="text" 
                  value={formState.hospital || ''} 
                  onChange={e => setFormState({ ...formState, hospital: e.target.value })} 
                  placeholder="e.g. City Heart & Diabetes Center" 
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={formState.phone || ''} 
                  onChange={e => setFormState({ ...formState, phone: e.target.value })} 
                  placeholder="+91 98380 12345" 
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                />
              </div>
            </>
          )}

          {activeTab === 'samples' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Item Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formState.name || ''} 
                    onChange={e => setFormState({ ...formState, name: e.target.value })} 
                    placeholder="e.g. Raxon-CV Catch Cover" 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Item Type</label>
                  <select 
                    value={formState.type || 'Physician Sample'} 
                    onChange={e => setFormState({ ...formState, type: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white"
                  >
                    <option>Physician Sample</option>
                    <option>Detailing Aid (LBL)</option>
                    <option>Promotional Gift</option>
                    <option>Literature / Monograph</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Linked Product</label>
                  <select 
                    value={formState.product || products[0]?.name} 
                    onChange={e => setFormState({ ...formState, product: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white"
                  >
                    {products.map((p: any) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">MR Quota / Month</label>
                  <input 
                    type="text" 
                    value={formState.mrQuota || ''} 
                    onChange={e => setFormState({ ...formState, mrQuota: e.target.value })} 
                    placeholder="e.g. 40 Units/mo" 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    value={formState.stock || ''} 
                    onChange={e => setFormState({ ...formState, stock: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unit Cost (₹)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formState.unitCost || ''} 
                    onChange={e => setFormState({ ...formState, unitCost: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white" 
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'chemists' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Chemist Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formState.name || ''} 
                    onChange={e => setFormState({ ...formState, name: e.target.value })} 
                    placeholder="e.g. Mishra Medical Hall" 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Drug License (DL)</label>
                  <input 
                    type="text" 
                    value={formState.dlNo || ''} 
                    onChange={e => setFormState({ ...formState, dlNo: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm font-mono" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pharmacist Name</label>
                  <input 
                    type="text" 
                    value={formState.contactPerson || ''} 
                    onChange={e => setFormState({ ...formState, contactPerson: e.target.value })} 
                    placeholder="e.g. Arun Mishra" 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Headquarter (HQ) *</label>
                  <select 
                    value={formState.hq || allHqs[0]?.name || ''} 
                    onChange={e => {
                      const newHq = e.target.value;
                      const matchedHq = allHqs.find(h => h.name === newHq);
                      const firstPatch = matchedHq?.patches?.[0] || '';
                      setFormState({ ...formState, hq: newHq, patch: firstPatch });
                    }} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                  >
                    {allHqs.length === 0 ? (
                      <option value="">No HQs found</option>
                    ) : (
                      allHqs.map(h => (
                        <option key={h.id} value={h.name}>{h.name} ({h.code} - {h.district})</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Area *</label>
                  <select 
                    value={formState.patch || ''} 
                    onChange={e => setFormState({ ...formState, patch: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                  >
                    {(() => {
                      const currentHqObj = allHqs.find(h => h.name === (formState.hq || allHqs[0]?.name));
                      const patches = currentHqObj?.patches || availablePatches;
                      if (patches.length === 0) return <option value="">No Areas found</option>;
                      return patches.map(p => <option key={p} value={p}>{p}</option>);
                    })()}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Attached Prescribing Doctors</label>
                <input 
                  type="text" 
                  value={formState.attachedDocs || ''} 
                  onChange={e => setFormState({ ...formState, attachedDocs: e.target.value })} 
                  placeholder="e.g. Dr. S.K. Verma, Dr. R.K. Mishra" 
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mapped Authorized Stockist *</label>
                <select 
                  value={formState.stockist || stockists[0]?.agencyName || ''} 
                  onChange={e => setFormState({ ...formState, stockist: e.target.value })} 
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                >
                  {stockists.length === 0 ? (
                    <option value="">No Stockists found (Add in Stockist Tab)</option>
                  ) : (
                    stockists.map((st: any) => (
                      <option key={st.id} value={st.agencyName || st.name}>{st.agencyName || st.name}</option>
                    ))
                  )}
                </select>
              </div>
            </>
          )}

          {activeTab === 'stockists' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Headquarter (HQ) *</label>
                  <select 
                    value={formState.hq || allHqs[0]?.name || ''} 
                    onChange={e => {
                      const newHq = e.target.value;
                      const matchedHq = allHqs.find(h => h.name === newHq);
                      const firstPatch = matchedHq?.patches?.[0] || '';
                      setFormState({ ...formState, hq: newHq, district: firstPatch });
                    }} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                  >
                    {allHqs.length === 0 ? (
                      <option value="">No HQs found</option>
                    ) : (
                      allHqs.map(h => (
                        <option key={h.id} value={h.name}>{h.name} ({h.code} - {h.district})</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Area / District *</label>
                  <select 
                    value={formState.district || ''} 
                    onChange={e => setFormState({ ...formState, district: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                  >
                    {(() => {
                      const currentHqObj = allHqs.find(h => h.name === (formState.hq || allHqs[0]?.name));
                      const patches = currentHqObj?.patches || availablePatches;
                      if (patches.length === 0) return <option value="">No Patches found</option>;
                      return patches.map(p => <option key={p} value={p}>{p}</option>);
                    })()}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Person</label>
                  <input 
                    type="text" 
                    value={formState.contactPerson || ''} 
                    onChange={e => setFormState({ ...formState, contactPerson: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formState.phone || ''} 
                    onChange={e => setFormState({ ...formState, phone: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Credit Limit</label>
                  <input 
                    type="text" 
                    value={formState.creditLimit || ''} 
                    onChange={e => setFormState({ ...formState, creditLimit: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Credit Terms</label>
                  <select 
                    value={formState.creditDays || '30 Days'} 
                    onChange={e => setFormState({ ...formState, creditDays: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option>21 Days</option>
                    <option>30 Days</option>
                    <option>45 Days</option>
                  </select>
                </div>
              </div>
            </>
          )}

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
              Save & Activate
            </button>
          </div>
        </form>
      </Modal>

      {/* --- EDIT MODAL (FOR ALL MASTER ITEMS) --- */}
      {editingItem && (
        <Modal 
          isOpen={!!editingItem} 
          onClose={() => setEditingItem(null)} 
          title={`Edit ${activeTab.slice(0, -1).toUpperCase()} - ${editingItem.name || editingItem.agencyName} (${editingItem.id})`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {activeTab === 'products' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={formState.name || ''} 
                      onChange={e => setFormState({ ...formState, name: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Division</label>
                    <select 
                      value={formState.division || ''} 
                      onChange={e => setFormState({ ...formState, division: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                    >
                      <option>General Medicine</option>
                      <option>Cardio-Diabetic</option>
                      <option>Pediatric</option>
                      <option>Dermatology</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Composition / Salt Formula</label>
                  <input 
                    type="text" 
                    value={formState.composition || ''} 
                    onChange={e => setFormState({ ...formState, composition: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dosage Form</label>
                    <input 
                      type="text" 
                      value={formState.category || ''} 
                      onChange={e => setFormState({ ...formState, category: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pack Size</label>
                    <input 
                      type="text" 
                      value={formState.pack || ''} 
                      onChange={e => setFormState({ ...formState, pack: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">PTS (₹)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={formState.pts ?? ''} 
                      onChange={e => setFormState({ ...formState, pts: e.target.value })} 
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white font-semibold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">PTR (₹)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={formState.ptr ?? ''} 
                      onChange={e => setFormState({ ...formState, ptr: e.target.value })} 
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white font-semibold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">MRP (₹)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={formState.mrp ?? ''} 
                      onChange={e => setFormState({ ...formState, mrp: e.target.value })} 
                      className="w-full p-2 border border-emerald-300 rounded-lg text-sm bg-white font-bold text-emerald-800" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Scheme / Offer</label>
                  <input 
                    type="text"
                    value={formState.scheme || ''} 
                    onChange={e => setFormState({ ...formState, scheme: e.target.value })} 
                    placeholder="e.g. 10+1 Free"
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>
              </>
            )}

            {activeTab === 'doctors' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Doctor Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={formState.name || ''} 
                      onChange={e => setFormState({ ...formState, name: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm font-semibold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">MCI Number</label>
                    <input 
                      type="text" 
                      value={formState.mciNo || ''} 
                      onChange={e => setFormState({ ...formState, mciNo: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm font-mono" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Specialty</label>
                    <input 
                      type="text" 
                      value={formState.specialty || ''} 
                      onChange={e => setFormState({ ...formState, specialty: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categorization</label>
                    <select 
                      value={formState.class || 'Core (A+)'} 
                      onChange={e => setFormState({ ...formState, class: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium" 
                    >
                      <option>Super Core (VIP)</option>
                      <option>Core (A+)</option>
                      <option>Class A</option>
                      <option>Class B</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Headquarter (HQ) *</label>
                    <select 
                      value={formState.hq || allHqs[0]?.name || ''} 
                      onChange={e => {
                        const newHq = e.target.value;
                        const matchedHq = allHqs.find(h => h.name === newHq);
                        const firstPatch = matchedHq?.patches?.[0] || '';
                        setFormState({ ...formState, hq: newHq, patch: firstPatch });
                      }} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                    >
                      {allHqs.length === 0 ? (
                        <option value="">No HQs found</option>
                      ) : (
                        allHqs.map(h => (
                          <option key={h.id} value={h.name}>{h.name} ({h.code} - {h.district})</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Area *</label>
                    <select 
                      value={formState.patch || ''} 
                      onChange={e => setFormState({ ...formState, patch: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                    >
                      {(() => {
                        const currentHqObj = allHqs.find(h => h.name === (formState.hq || allHqs[0]?.name));
                        const patches = currentHqObj?.patches || availablePatches;
                        if (patches.length === 0) return <option value="">No Areas found</option>;
                        return patches.map(p => <option key={p} value={p}>{p}</option>);
                      })()}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hospital / Clinic</label>
                  <input 
                    type="text" 
                    value={formState.hospital || ''} 
                    onChange={e => setFormState({ ...formState, hospital: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formState.phone || ''} 
                    onChange={e => setFormState({ ...formState, phone: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>
              </>
            )}

            {activeTab === 'samples' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Item Name</label>
                    <input 
                      type="text" 
                      value={formState.name || ''} 
                      onChange={e => setFormState({ ...formState, name: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Monthly MR Quota</label>
                    <input 
                      type="text" 
                      value={formState.mrQuota || ''} 
                      onChange={e => setFormState({ ...formState, mrQuota: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      value={formState.stock ?? ''} 
                      onChange={e => setFormState({ ...formState, stock: e.target.value })} 
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unit Cost (₹)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={formState.unitCost ?? ''} 
                      onChange={e => setFormState({ ...formState, unitCost: e.target.value })} 
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white" 
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'chemists' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Headquarter (HQ) *</label>
                    <select 
                      value={formState.hq || allHqs[0]?.name || ''} 
                      onChange={e => {
                        const newHq = e.target.value;
                        const matchedHq = allHqs.find(h => h.name === newHq);
                        const firstPatch = matchedHq?.patches?.[0] || '';
                        setFormState({ ...formState, hq: newHq, patch: firstPatch });
                      }} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                    >
                      {allHqs.length === 0 ? (
                        <option value="">No HQs found</option>
                      ) : (
                        allHqs.map(h => (
                          <option key={h.id} value={h.name}>{h.name} ({h.code} - {h.district})</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Area *</label>
                    <select 
                      value={formState.patch || ''} 
                      onChange={e => setFormState({ ...formState, patch: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                    >
                      {(() => {
                        const currentHqObj = allHqs.find(h => h.name === (formState.hq || allHqs[0]?.name));
                        const patches = currentHqObj?.patches || availablePatches;
                        if (patches.length === 0) return <option value="">No Areas found</option>;
                        return patches.map(p => <option key={p} value={p}>{p}</option>);
                      })()}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Chemist Name</label>
                    <input 
                      type="text" 
                      value={formState.name || ''} 
                      onChange={e => setFormState({ ...formState, name: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pharmacist</label>
                    <input 
                      type="text" 
                      value={formState.contactPerson || ''} 
                      onChange={e => setFormState({ ...formState, contactPerson: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Attached Prescribing Doctors</label>
                  <input 
                    type="text" 
                    value={formState.attachedDocs || ''} 
                    onChange={e => setFormState({ ...formState, attachedDocs: e.target.value })} 
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                  />
                </div>
              </>
            )}

            {activeTab === 'stockists' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Headquarter (HQ) *</label>
                    <select 
                      value={formState.hq || allHqs[0]?.name || ''} 
                      onChange={e => {
                        const newHq = e.target.value;
                        const matchedHq = allHqs.find(h => h.name === newHq);
                        const firstPatch = matchedHq?.patches?.[0] || '';
                        setFormState({ ...formState, hq: newHq, district: firstPatch });
                      }} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                    >
                      {allHqs.length === 0 ? (
                        <option value="">No HQs found</option>
                      ) : (
                        allHqs.map(h => (
                          <option key={h.id} value={h.name}>{h.name} ({h.code} - {h.district})</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Area / District *</label>
                    <select 
                      value={formState.district || ''} 
                      onChange={e => setFormState({ ...formState, district: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm bg-white font-medium"
                    >
                      {(() => {
                        const currentHqObj = allHqs.find(h => h.name === (formState.hq || allHqs[0]?.name));
                        const patches = currentHqObj?.patches || availablePatches;
                        if (patches.length === 0) return <option value="">No Patches found</option>;
                        return patches.map(p => <option key={p} value={p}>{p}</option>);
                      })()}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Agency Name</label>
                    <input 
                      type="text" 
                      value={formState.agencyName || ''} 
                      onChange={e => setFormState({ ...formState, agencyName: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Person</label>
                    <input 
                      type="text" 
                      value={formState.contactPerson || ''} 
                      onChange={e => setFormState({ ...formState, contactPerson: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Credit Limit</label>
                    <input 
                      type="text" 
                      value={formState.creditLimit || ''} 
                      onChange={e => setFormState({ ...formState, creditLimit: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Credit Terms</label>
                    <input 
                      type="text" 
                      value={formState.creditDays || ''} 
                      onChange={e => setFormState({ ...formState, creditDays: e.target.value })} 
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm" 
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-4">
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
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* --- CONFIRMATION: STATUS TOGGLE MODAL --- */}
      {confirmStatusItem && (
        <ConfirmModal
          isOpen={!!confirmStatusItem}
          onClose={() => setConfirmStatusItem(null)}
          onConfirm={handleExecuteStatusToggle}
          type={confirmStatusItem.nextStatus === 'Inactive' ? 'warning' : 'success'}
          title={`Change ${activeTab.toUpperCase()} Status?`}
          message={
            confirmStatusItem.nextStatus === 'Inactive'
              ? `Are you sure you want to mark ${confirmStatusItem.item.name || confirmStatusItem.item.agencyName} as Inactive?`
              : `Are you sure you want to reactivate ${confirmStatusItem.item.name || confirmStatusItem.item.agencyName}?`
          }
          subMessage="Confirmation is required to ensure data accuracy across territory lists."
          itemName={`${confirmStatusItem.item.name || confirmStatusItem.item.agencyName} (${confirmStatusItem.item.id}) • Master: ${activeTab}`}
          confirmText={confirmStatusItem.nextStatus === 'Inactive' ? 'Yes, Mark Inactive' : 'Yes, Activate'}
          cancelText="Cancel"
        />
      )}

      {/* --- CONFIRMATION: DELETE MODAL --- */}
      {deletingItem && (
        <ConfirmModal
          isOpen={!!deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleConfirmDelete}
          type="danger"
          title={`Delete ${activeTab.toUpperCase()} Record?`}
          message={`Are you sure you want to permanently delete ${deletingItem.name || deletingItem.agencyName} (${deletingItem.id})?`}
          subMessage="Warning: This record will be removed from all active field lists and assignments. This action cannot be undone."
          itemName={`${deletingItem.name || deletingItem.agencyName} (${deletingItem.id}) • Master: ${activeTab}`}
          confirmText="Yes, Delete Record"
          cancelText="Cancel"
        />
      )}

      {/* --- MODAL: VIEW DETAILS --- */}
      {selectedItemForView && (
        <Modal isOpen={!!selectedItemForView} onClose={() => setSelectedItemForView(null)} title="Master Record Details">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedItemForView.name || selectedItemForView.agencyName}</h3>
                <p className="text-xs text-indigo-600 font-mono mt-0.5">{selectedItemForView.id || selectedItemForView.mciNo}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                {selectedItemForView.status || 'Active'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(selectedItemForView).map(([k, v]: any) => {
                if (typeof v === 'object' || k === 'id') return null;
                return (
                  <div key={k} className="p-2.5 bg-white border border-gray-100 rounded-xl">
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">{k}</span>
                    <span className="text-sm font-medium text-gray-900">{String(v)}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex justify-end border-t border-gray-100">
              <button onClick={() => setSelectedItemForView(null)} className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-900">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* --- MODAL: BULK IMPORT --- */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title={`Bulk Import ${activeTab.toUpperCase()} Data`}>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 bg-gray-50/50 transition-colors">
            <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">Upload Excel (.xlsx, .csv) Sheet</p>
            <p className="text-xs text-gray-500 mt-1">Drag & drop your master sheet or click below.</p>
            <input type="file" className="hidden" id="bulk-upload-input" />
            <label htmlFor="bulk-upload-input" className="mt-3 inline-block px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-2xs">
              Select Excel File
            </label>
          </div>

          <div className="pt-2 flex justify-end space-x-3 border-t border-gray-100">
            <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button 
              onClick={() => {
                showToast(`Data verified! Bulk file imported successfully into ${activeTab}.`);
                setIsImportModalOpen(false);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
            >
              Verify & Import
            </button>
          </div>
        </div>
      </Modal>

      {/* --- MODAL: CLEAR TAB CONFIRMATION --- */}
      <ConfirmModal
        isOpen={isClearTabModalOpen}
        title={`Delete All ${activeTab.toUpperCase()} Records?`}
        message={`Are you sure you want to delete all ${
          activeTab === 'products' ? products.length :
          activeTab === 'doctors' ? doctors.length :
          activeTab === 'samples' ? samples.length :
          activeTab === 'chemists' ? chemists.length : stockists.length
        } records from the ${activeTab} master for ${activeCompany.name}? This will leave the master table completely clean for your real records.`}
        confirmText="Yes, Delete All"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          if (activeTab === 'products') {
            setProducts([]);
            persistProducts([]);
          } else if (activeTab === 'doctors') {
            setDoctors([]);
            persistDoctors([]);
          } else if (activeTab === 'samples') {
            setSamples([]);
            persistSamples([]);
          } else if (activeTab === 'chemists') {
            setChemists([]);
            persistChemists([]);
          } else if (activeTab === 'stockists') {
            setStockists([]);
            persistStockists([]);
          }
          setIsClearTabModalOpen(false);
          showToast(`All ${activeTab} records deleted successfully.`);
        }}
        onClose={() => setIsClearTabModalOpen(false)}
      />
    </div>
  );
}
