import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Plus, 
  Share2, 
  CreditCard, 
  ShieldCheck, 
  Calendar, 
  Store,
  CheckCircle2,
  ExternalLink,
  Edit2,
  Lock,
  DollarSign,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Save,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { 
  getStockistsList, 
  saveStockistsList, 
  Stockist, 
  AREAS,
  getStockistLedger,
  saveStockistLedger,
  StockistMonthlyLedger,
  calculateLedgerTotals
} from '../data/masterData';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { getActiveUserContext, getUserPermissions, UserPermissions } from '../data/permissionSettings';
import { getActiveCompany } from '../data/companyContext';

export default function StockistDirectory() {
  const [stockists, setStockists] = useState<Stockist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [company, setCompany] = useState(() => getActiveCompany());
  
  // Active User Permissions
  const [activeUser, setActiveUser] = useState(() => getActiveUserContext());
  const [permissions, setPermissions] = useState<UserPermissions>(() => {
    const ctx = getActiveUserContext();
    return getUserPermissions(ctx.id, ctx.role);
  });

  // Add / Edit Stockist Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStockist, setEditingStockist] = useState<Stockist | null>(null);
  const [stockistToDelete, setStockistToDelete] = useState<Stockist | null>(null);
  const [isClearAllStockistsOpen, setIsClearAllStockistsOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Stock & Sales Summary Ledger Modal
  const [summaryStockist, setSummaryStockist] = useState<Stockist | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [currentLedger, setCurrentLedger] = useState<StockistMonthlyLedger | null>(null);
  const [isEditingLedger, setIsEditingLedger] = useState(false);

  // Generate dynamic list of 6 months for the ledger selector
  const availableMonths = React.useMemo(() => {
    const months: { value: string; label: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const name = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      months.push({ value: val, label: i === 0 ? `${name} (Current)` : name });
    }
    return months;
  }, []);

  // Form Fields for Stockist Master
  const [agencyName, setAgencyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dlNumber, setDlNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [targetArea, setTargetArea] = useState(AREAS[0]);
  const [district, setDistrict] = useState('Ambedkar Nagar');
  const [creditDays, setCreditDays] = useState('30 Days');
  const [creditLimit, setCreditLimit] = useState('₹15,00,000');
  const [outstandingValue, setOutstandingValue] = useState('₹2,45,000');

  // Can Add / Edit Stockist: Only Admin & Manager
  const canManageStockists = activeUser.role === 'ADMIN' || activeUser.role === 'SUPER_ADMIN' || activeUser.role === 'MANAGER' || permissions.canAddDoctor;

  useEffect(() => {
    const refreshData = () => {
      setCompany(getActiveCompany());
      setStockists(getStockistsList());
    };
    refreshData();
    window.addEventListener('raxon-company-changed', refreshData);
    window.addEventListener('raxon-company-switched', refreshData);
    window.addEventListener('raxon-stockists-updated', refreshData);
    return () => {
      window.removeEventListener('raxon-company-changed', refreshData);
      window.removeEventListener('raxon-company-switched', refreshData);
      window.removeEventListener('raxon-stockists-updated', refreshData);
    };
  }, []);

  useEffect(() => {
    const refreshPerms = () => {
      const ctx = getActiveUserContext();
      setActiveUser(ctx);
      setPermissions(getUserPermissions(ctx.id, ctx.role));
    };
    window.addEventListener('raxon-permissions-updated', refreshPerms);
    return () => window.removeEventListener('raxon-permissions-updated', refreshPerms);
  }, []);

  // When summary modal opens or month changes, fetch ledger
  useEffect(() => {
    if (summaryStockist) {
      const ledger = getStockistLedger(summaryStockist.id, selectedMonth);
      setCurrentLedger(ledger);
    }
  }, [summaryStockist, selectedMonth]);

  const filteredStockists = stockists.filter(stk => {
    const matchesSearch = 
      stk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.dlNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.gstNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = selectedArea === 'All' || stk.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  // Handle Save Stockist
  const handleSaveStockist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageStockists) {
      setNotification('Access Denied: Only Admin and Area Managers can add or edit stockist agencies.');
      return;
    }
    if (!agencyName.trim() || !contactPerson.trim()) return;

    if (editingStockist) {
      const updated: Stockist[] = stockists.map(s => {
        if (s.id === editingStockist.id) {
          return {
            ...s,
            name: agencyName.trim(),
            contactPerson: contactPerson.trim(),
            phone: phone.trim() || '+91 94151 23987',
            email: email.trim(),
            dlNumber: dlNumber.trim() || 'UP-ABN-20B/21B-4091',
            gstNumber: gstNumber.trim() || '09AAACG1122A1Z1',
            address: address.trim() || 'Main Wholesale Market',
            area: targetArea,
            district,
            creditDays,
            creditLimit,
            outstandingValue: outstandingValue || s.outstandingValue || '₹0'
          };
        }
        return s;
      });
      setStockists(updated);
      saveStockistsList(updated);
      setEditingStockist(null);
      setNotification(`Stockist ${agencyName} updated successfully!`);
    } else {
      const newStk: Stockist = {
        id: Date.now(),
        name: agencyName.trim(),
        contactPerson: contactPerson.trim(),
        phone: phone.trim() || '+91 94151 23987',
        email: email.trim() || 'orders@pharma.com',
        dlNumber: dlNumber.trim() || 'UP-ABN-20B/21B-4091',
        gstNumber: gstNumber.trim() || '09AAACG1122A1Z1',
        address: address.trim() || 'Main Wholesale Market',
        area: targetArea,
        district: district || 'Ambedkar Nagar',
        hq: `${targetArea} HQ`,
        creditDays: creditDays || '30 Days',
        creditLimit: creditLimit || '₹10,00,000',
        outstandingValue: outstandingValue || '₹0',
        status: 'Active'
      };
      const updated: Stockist[] = [newStk, ...stockists];
      setStockists(updated);
      saveStockistsList(updated);
      setShowAddModal(false);
      setNotification(`Stockist ${newStk.name} successfully registered!`);
    }

    // Reset fields
    setAgencyName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setDlNumber('');
    setGstNumber('');
    setAddress('');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleOpenEdit = (stk: Stockist) => {
    if (!canManageStockists) {
      setNotification('Access Denied: Only Admin and Area Managers can modify stockist credentials.');
      return;
    }
    setEditingStockist(stk);
    setAgencyName(stk.name);
    setContactPerson(stk.contactPerson);
    setPhone(stk.phone);
    setEmail(stk.email || '');
    setDlNumber(stk.dlNumber);
    setGstNumber(stk.gstNumber);
    setAddress(stk.address);
    setTargetArea(stk.area);
    setDistrict(stk.district);
    setCreditDays(stk.creditDays);
    setCreditLimit(stk.creditLimit);
    setOutstandingValue(String(stk.outstandingValue || '₹0'));
  };

  const handleDeleteStockistConfirm = () => {
    if (!stockistToDelete) return;
    const updated = stockists.filter(s => String(s.id) !== String(stockistToDelete.id));
    setStockists(updated);
    saveStockistsList(updated);
    setNotification(`Stockist "${stockistToDelete.name}" successfully deleted.`);
    setStockistToDelete(null);
    setTimeout(() => setNotification(''), 4000);
  };

  // WhatsApp Connect with Stockist
  const handleWhatsAppStockist = (stk: Stockist) => {
    const text = `🏥 *RAXON PHARMA - STOCKIST CONNECT*\n\n` +
      `Respected ${stk.contactPerson} (${stk.name}),\n` +
      `Greetings from Raxon Healthcare.\n` +
      `Regarding stock availability & supply order execution for territory: *${stk.area}*.\n\n` +
      `_Sent by Raxon Field Representative_`;
    const cleanPhone = stk.phone.replace(/[^0-9]/g, '');
    const phoneParam = cleanPhone.length >= 10 ? cleanPhone : '';
    window.open(`https://api.whatsapp.com/send?phone=${phoneParam}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Open Summary
  const handleOpenSummary = (stk: Stockist) => {
    setSummaryStockist(stk);
    setIsEditingLedger(false);
  };

  // Update item in ledger
  const handleLedgerItemChange = (brandIndex: number, field: 'purchaseQty' | 'saleQty' | 'openingQty', val: number) => {
    if (!currentLedger || !currentLedger.items[brandIndex]) return;
    const items = [...currentLedger.items];
    const item = { ...items[brandIndex] };
    const rate = item.unitRate ?? item.pts ?? 0;
    
    if (field === 'openingQty') item.openingQty = Math.max(0, val);
    if (field === 'purchaseQty') item.purchaseQty = Math.max(0, val);
    if (field === 'saleQty') item.saleQty = Math.max(0, val);

    // Auto calculate closing stock
    item.closingQty = Math.max(0, item.openingQty + item.purchaseQty - item.saleQty);

    // Update values
    item.unitRate = rate;
    item.pts = rate;
    item.openingValue = item.openingQty * rate;
    item.purchaseValue = item.purchaseQty * rate;
    item.saleValue = item.saleQty * rate;
    item.closingValue = item.closingQty * rate;

    items[brandIndex] = item;
    const calc = calculateLedgerTotals(items);

    setCurrentLedger({
      ...currentLedger,
      items: calc.items,
      totalOpeningValue: calc.totalOpeningValue,
      totalPurchaseValue: calc.totalPurchaseValue,
      totalSaleValue: calc.totalSaleValue,
      totalClosingValue: calc.totalClosingValue,
      totals: calc.totals,
      updatedAt: new Date().toISOString()
    });
  };

  const handleSaveLedgerChanges = () => {
    if (!currentLedger || !summaryStockist) return;
    saveStockistLedger(currentLedger);
    setIsEditingLedger(false);
    setNotification(`Stock & sales ledger saved for ${summaryStockist.name} (${selectedMonth}). Next month opening stock auto-fed.`);
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Building2 className="h-7 w-7 text-indigo-600" />
              Stockist & Distributor Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {stockists.length} Stockists
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-50 text-purple-800 border border-purple-200">
              {company.name}
            </span>
          </div>
          <p className="text-xs text-gray-700 font-semibold mt-1">
            Authorized Wholesale Network for <strong className="text-indigo-900">{company.name}</strong> • Drug licenses, supply ledger & outstanding balances
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManageStockists && stockists.length > 0 && (
            <button
              onClick={() => setIsClearAllStockistsOpen(true)}
              className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Delete all stockists to start clean"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              Delete All ({stockists.length})
            </button>
          )}
          {canManageStockists ? (
            <button
              onClick={() => {
                setEditingStockist(null);
                setAgencyName('');
                setContactPerson('');
                setPhone('');
                setAddress('');
                setOutstandingValue('₹0');
                setShowAddModal(true);
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Stockist
            </button>
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-2xs font-semibold text-gray-600 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>Stockist Master Addition Managed by Admin/Manager</span>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-gray-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
          <button onClick={() => setNotification('')} className="text-gray-400 hover:text-white text-xs ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-3xs text-gray-500 font-bold uppercase tracking-wider">Authorized Stockists</span>
          <p className="text-xl font-extrabold text-indigo-900 mt-0.5">{stockists.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-3xs text-gray-500 font-bold uppercase tracking-wider">Active Supply Channels</span>
          <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{stockists.filter(s => s.status === 'Active').length} Active</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-3xs text-gray-500 font-bold uppercase tracking-wider">Districts Covered</span>
          <p className="text-xl font-extrabold text-purple-900 mt-0.5">
            {(() => {
              const districts = Array.from(new Set(stockists.map(s => s.district || s.hq || s.area).filter(Boolean)));
              return districts.length > 0 
                ? (districts.length <= 2 ? districts.join(' & ') : `${districts.length} Districts`) 
                : '0 Districts';
            })()}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-3xs text-gray-500 font-bold uppercase tracking-wider">Total Outstanding Due</span>
          <p className="text-xl font-extrabold text-amber-700 mt-0.5">
            ₹{(() => {
              const totalDue = stockists.reduce((sum, s) => {
                const due = (s as any).outstandingDue || (s as any).dueAmount || 0;
                return sum + (typeof due === 'number' ? due : parseFloat(String(due).replace(/[^0-9.]/g, '')) || 0);
              }, 0);
              return totalDue.toLocaleString('en-IN');
            })()}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search stockist by agency name, contact person, DL No, GSTIN, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
          >
            <option value="All">All Territories ({AREAS.length})</option>
            {AREAS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stockist List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStockists.map(stk => (
          <div 
            key={stk.id}
            className="bg-white rounded-2xl border border-gray-200 hover:border-indigo-400 p-5 shadow-2xs hover:shadow-xs transition-all space-y-3.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-3xs font-extrabold px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-md border border-indigo-100 uppercase">
                  {stk.area} • {stk.district}
                </span>
                
                {/* Clickable Stockist Name that opens Stock Sales Summary */}
                <button
                  onClick={() => handleOpenSummary(stk)}
                  className="text-left group flex items-center gap-1.5 mt-1.5 focus:outline-none"
                  title="Click to view Stock & Sales Summary"
                >
                  <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-indigo-600 group-hover:underline underline-offset-2 transition-colors">
                    {stk.name}
                  </h3>
                  <TrendingUp className="w-4 h-4 text-indigo-600 opacity-80 group-hover:opacity-100 shrink-0" />
                </button>

                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Key Person: <span className="text-gray-900 font-bold">{stk.contactPerson}</span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-3xs font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  {stk.status}
                </span>
                {stk.outstandingValue && (
                  <span className="text-2xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Due: {stk.outstandingValue}
                  </span>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-1.5 text-xs text-gray-800 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span className="font-semibold">{stk.address}</span>
            </div>

            {/* Regulatory & Commercial Credentials */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-3xs font-bold text-gray-500 block uppercase">Drug License (DL No.)</span>
                <span className="font-bold text-gray-900">{stk.dlNumber}</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-3xs font-bold text-gray-500 block uppercase">GSTIN</span>
                <span className="font-bold text-gray-900">{stk.gstNumber}</span>
              </div>
              <div className="p-2 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <span className="text-3xs font-bold text-indigo-700 block uppercase">Credit Terms</span>
                <span className="font-bold text-indigo-950">{stk.creditDays}</span>
              </div>
              <div className="p-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="text-3xs font-bold text-emerald-700 block uppercase">Credit Limit</span>
                <span className="font-extrabold text-emerald-950">{stk.creditLimit}</span>
              </div>
            </div>

            {/* Contact & Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${stk.phone}`}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-gray-300"
                >
                  <Phone className="w-3.5 h-3.5 text-gray-700" />
                  {stk.phone}
                </a>
                <button
                  onClick={() => handleOpenSummary(stk)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1 border border-indigo-200"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  Stock Summary
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleWhatsAppStockist(stk)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
                {canManageStockists && (
                  <>
                    <button
                      onClick={() => handleOpenEdit(stk)}
                      className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg border border-gray-200"
                      title="Edit stockist details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setStockistToDelete(stk)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
                      title="Delete stockist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- STOCK & SALES SUMMARY LEDGER MODAL --- */}
      {summaryStockist && currentLedger && (
        <Modal
          isOpen={!!summaryStockist}
          onClose={() => setSummaryStockist(null)}
          title={`Stock & Sales Summary: ${summaryStockist.name}`}
        >
          <div className="space-y-4 text-xs">
            {/* Header with Month Selector and Outstanding Value */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>{summaryStockist.name}</span>
                  <span className="text-gray-500 font-normal">({summaryStockist.area} Territory)</span>
                </p>
                <p className="text-2xs text-gray-600 font-semibold mt-0.5">
                  Outstanding Balance: <span className="text-amber-700 font-extrabold">{summaryStockist.outstandingValue || '₹2,45,000'}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-2xs font-bold text-gray-700">Ledger Month:</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="p-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 bg-white"
                >
                  {availableMonths.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>

                <button
                  onClick={() => setIsEditingLedger(!isEditingLedger)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors border ${
                    isEditingLedger
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {isEditingLedger ? 'Editing Mode' : 'Edit Entries'}
                </button>
              </div>
            </div>

            {/* Auto Feed Notice */}
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-2xs flex items-center justify-between font-medium">
              <span>💡 <b>Auto-Feed Enabled:</b> Previous month closing stock automatically populates this month's opening stock.</span>
              <span className="font-bold text-indigo-700">Closing = Opening + Purchase - Sale</span>
            </div>

            {/* Brand Ledger Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl max-h-[420px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-800 font-extrabold text-3xs uppercase tracking-wider sticky top-0 z-10 border-b border-gray-200">
                  <tr>
                    <th className="p-2.5">Brand / Product</th>
                    <th className="p-2.5 text-right">Unit Rate (₹)</th>
                    <th className="p-2.5 text-right bg-blue-50/50">Opening Qty</th>
                    <th className="p-2.5 text-right bg-emerald-50/50">Purchase Qty</th>
                    <th className="p-2.5 text-right bg-purple-50/50">Sale Qty</th>
                    <th className="p-2.5 text-right bg-amber-50/50">Closing Qty</th>
                    <th className="p-2.5 text-right bg-gray-50">Closing Value (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs font-semibold text-gray-900">
                  {currentLedger.items.map((item, idx) => {
                    const rate = item.unitRate ?? item.pts ?? 0;
                    const closingVal = item.closingValue ?? (item.closingQty * rate);
                    return (
                      <tr key={item.brandId || idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-2.5 font-bold text-gray-900 whitespace-nowrap">
                          {item.brandName}
                        </td>
                        <td className="p-2.5 text-right text-gray-700 font-medium">
                          ₹{rate.toFixed(2)}
                        </td>

                        {/* Opening Qty */}
                        <td className="p-2.5 text-right bg-blue-50/30">
                          {isEditingLedger ? (
                            <input
                              type="number"
                              min="0"
                              value={item.openingQty}
                              onChange={(e) => handleLedgerItemChange(idx, 'openingQty', parseInt(e.target.value) || 0)}
                              className="w-16 p-1 border border-blue-300 rounded text-right font-bold text-gray-900 bg-white"
                            />
                          ) : (
                            <span className="font-bold text-blue-900">{item.openingQty}</span>
                          )}
                        </td>

                        {/* Purchase Qty */}
                        <td className="p-2.5 text-right bg-emerald-50/30">
                          {isEditingLedger ? (
                            <input
                              type="number"
                              min="0"
                              value={item.purchaseQty}
                              onChange={(e) => handleLedgerItemChange(idx, 'purchaseQty', parseInt(e.target.value) || 0)}
                              className="w-16 p-1 border border-emerald-300 rounded text-right font-bold text-gray-900 bg-white"
                            />
                          ) : (
                            <span className="font-bold text-emerald-900">+{item.purchaseQty}</span>
                          )}
                        </td>

                        {/* Sale Qty */}
                        <td className="p-2.5 text-right bg-purple-50/30">
                          {isEditingLedger ? (
                            <input
                              type="number"
                              min="0"
                              value={item.saleQty}
                              onChange={(e) => handleLedgerItemChange(idx, 'saleQty', parseInt(e.target.value) || 0)}
                              className="w-16 p-1 border border-purple-300 rounded text-right font-bold text-gray-900 bg-white"
                            />
                          ) : (
                            <span className="font-bold text-purple-900">-{item.saleQty}</span>
                          )}
                        </td>

                        {/* Closing Qty */}
                        <td className="p-2.5 text-right bg-amber-50/30 font-extrabold text-amber-950">
                          {item.closingQty}
                        </td>

                        {/* Closing Value */}
                        <td className="p-2.5 text-right font-extrabold text-gray-900 bg-gray-50/50">
                          ₹{closingVal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Grand Total Footer */}
                <tfoot className="bg-gray-900 text-white font-extrabold text-xs sticky bottom-0 z-10">
                  <tr>
                    <td className="p-3 uppercase tracking-wider" colSpan={2}>
                      Grand Total Values
                    </td>
                    <td className="p-3 text-right text-blue-300">
                      ₹{(currentLedger.totalOpeningValue ?? currentLedger.totals?.openingValue ?? 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right text-emerald-300">
                      ₹{(currentLedger.totalPurchaseValue ?? currentLedger.totals?.purchaseValue ?? 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right text-purple-300">
                      ₹{(currentLedger.totalSaleValue ?? currentLedger.totals?.saleValue ?? 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right text-amber-300" colSpan={2}>
                      ₹{(currentLedger.totalClosingValue ?? currentLedger.totals?.closingValue ?? 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Totals Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <span className="text-3xs font-bold text-blue-700 block uppercase">Total Opening Value</span>
                <span className="text-sm font-extrabold text-blue-950">
                  ₹{(currentLedger.totalOpeningValue ?? currentLedger.totals?.openingValue ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-3xs font-bold text-emerald-700 block uppercase">Total Purchase Value</span>
                <span className="text-sm font-extrabold text-emerald-950">
                  ₹{(currentLedger.totalPurchaseValue ?? currentLedger.totals?.purchaseValue ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-center">
                <span className="text-3xs font-bold text-purple-700 block uppercase">Total Sale Value</span>
                <span className="text-sm font-extrabold text-purple-950">
                  ₹{(currentLedger.totalSaleValue ?? currentLedger.totals?.saleValue ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <span className="text-3xs font-bold text-amber-800 block uppercase">Total Closing Stock Value</span>
                <span className="text-sm font-extrabold text-amber-950">
                  ₹{(currentLedger.totalClosingValue ?? currentLedger.totals?.closingValue ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-3xs text-gray-500 font-semibold">
                Last calculated: {new Date(currentLedger.updatedAt).toLocaleTimeString()}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSummaryStockist(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100"
                >
                  Close
                </button>
                {isEditingLedger && (
                  <button
                    type="button"
                    onClick={handleSaveLedgerChanges}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-xs flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Save & Cascade Next Month
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Stockist Modal */}
      {(showAddModal || editingStockist) && (
        <Modal
          isOpen={showAddModal || !!editingStockist}
          onClose={() => {
            setShowAddModal(false);
            setEditingStockist(null);
          }}
          title={editingStockist ? `Edit Stockist: ${editingStockist.name}` : "Add New Stockist / Distributor"}
        >
          <form onSubmit={handleSaveStockist} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-gray-900 mb-1">Agency / Firm Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Gupta Medical Agency"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-900 mb-1">Key Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Gupta"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900 bg-white placeholder-gray-400 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-900 mb-1">Phone / Mobile *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 94151 23987"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900 bg-white placeholder-gray-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-900 mb-1">Drug License (DL No.) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UP-ABN-20B/21B-4091"
                  value={dlNumber}
                  onChange={(e) => setDlNumber(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900 bg-white placeholder-gray-400 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-900 mb-1">GSTIN *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 09AAACG1122A1Z1"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900 bg-white placeholder-gray-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-900 mb-1">Primary Territory / Area *</label>
                <select
                  value={targetArea}
                  onChange={(e) => setTargetArea(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900 bg-white outline-none"
                >
                  {AREAS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-900 mb-1">District *</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900 bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-900 mb-1">Full Wholesale Warehouse Address *</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Shop 1-3, Pharma Wholesale Complex, Station Road, Akbarpur"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-semibold text-gray-900 bg-white placeholder-gray-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-900 mb-1">Approved Credit Days</label>
                <input
                  type="text"
                  value={creditDays}
                  onChange={(e) => setCreditDays(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl font-bold text-gray-900 bg-white outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-900 mb-1">Credit Limit (₹)</label>
                <input
                  type="text"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl font-bold text-gray-900 bg-white outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-900 mb-1">Outstanding Balance (₹)</label>
                <input
                  type="text"
                  value={outstandingValue}
                  onChange={(e) => setOutstandingValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl font-bold text-gray-900 bg-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStockist(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold shadow-xs"
              >
                {editingStockist ? "Update Stockist" : "Save Stockist"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Stockist Confirmation Modal */}
      {stockistToDelete && (
        <ConfirmModal
          isOpen={!!stockistToDelete}
          title="Delete Stockist"
          message={`Are you sure you want to permanently delete stockist "${stockistToDelete.name}" (${stockistToDelete.area})? This will also remove their stock summary records.`}
          confirmText="Delete Stockist"
          type="danger"
          onConfirm={handleDeleteStockistConfirm}
          onClose={() => setStockistToDelete(null)}
        />
      )}

      {/* Clear All Stockists Confirmation Modal */}
      <ConfirmModal
        isOpen={isClearAllStockistsOpen}
        title="Delete All Stockists?"
        message={`Are you sure you want to delete all ${stockists.length} stockists for ${company.name}? You will be able to upload your genuine stockist records cleanly.`}
        confirmText="Yes, Delete All Stockists"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          setStockists([]);
          saveStockistsList([], company.id);
          setIsClearAllStockistsOpen(false);
          setNotification('All stockists deleted successfully. Ready for fresh import.');
          setTimeout(() => setNotification(''), 4000);
        }}
        onClose={() => setIsClearAllStockistsOpen(false)}
      />
    </div>
  );
}
