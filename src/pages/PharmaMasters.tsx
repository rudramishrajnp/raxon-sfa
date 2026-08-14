import React, { useState } from 'react';
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
  File as FileIcon,
  Layers,
  Tag,
  IndianRupee,
  Building2,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { Modal } from '../components/Modal';

// --- MOCK MASTER DATA ---
const PRODUCTS_DATA = [
  { id: 'PRD-001', name: 'Raxon-CV 625', composition: 'Amoxicillin 500mg + Clavulanic Acid 125mg', division: 'General Medicine', category: 'Tablet', pack: '10x1x10 Strip', pts: 135.50, ptr: 152.00, mrp: 210.00, gst: '12%', status: 'Active' },
  { id: 'PRD-002', name: 'Raxodil-D', composition: 'Rabeprazole 20mg + Domperidone 30mg SR', division: 'General Medicine', category: 'Capsule', pack: '10x10 Strip', pts: 85.00, ptr: 95.50, mrp: 138.00, gst: '12%', status: 'Active' },
  { id: 'PRD-003', name: 'Raxoclav Dry Syrup', composition: 'Amoxicillin 200mg + Clavulanate 28.5mg / 5ml', division: 'Pediatric', category: 'Syrup', pack: '30ml with WFI', pts: 55.20, ptr: 62.00, mrp: 89.00, gst: '12%', status: 'Active' },
  { id: 'PRD-004', name: 'CardioRax-AM', composition: 'Telmisartan 40mg + Amlodipine 5mg', division: 'Cardio-Diabetic', category: 'Tablet', pack: '10x10 Alu-Alu', pts: 72.00, ptr: 81.00, mrp: 115.00, gst: '12%', status: 'Active' },
  { id: 'PRD-005', name: 'GlyciRax-M 500', composition: 'Glimepiride 2mg + Metformin 500mg SR', division: 'Cardio-Diabetic', category: 'Tablet', pack: '10x15 Blister', pts: 60.00, ptr: 68.00, mrp: 98.00, gst: '12%', status: 'Active' },
  { id: 'PRD-006', name: 'DermaRax-KT', composition: 'Ketoconazole 2% + Zinc Pyrithione 1%', division: 'Dermatology', category: 'Lotion/Shampoo', pack: '100ml Bottle', pts: 110.00, ptr: 124.00, mrp: 175.00, gst: '18%', status: 'Active' },
  { id: 'PRD-007', name: 'RaxoCal-D3 Max', composition: 'Calcium Citrate 1000mg + Vit D3 400IU + Zinc', division: 'General Medicine', category: 'Tablet', pack: '3x10 Strip', pts: 78.00, ptr: 88.00, mrp: 125.00, gst: '12%', status: 'Active' },
];

const DOCTORS_DATA = [
  { id: 'DOC-101', name: 'Dr. S.K. Verma', mciNo: 'MCI-UP-48921', specialty: 'General Physician (MD)', class: 'Core (A+)', division: 'General Medicine', patch: 'Iltifatganj', hospital: 'Verma City Clinic', phone: '+91 9415012345', visitFreq: 'Weekly (4/mo)', status: 'Active' },
  { id: 'DOC-102', name: 'Dr. P.N. Agarwal', mciNo: 'MCI-UP-31290', specialty: 'Cardiologist (DM)', class: 'Super Core (VIP)', division: 'Cardio-Diabetic', patch: 'Akbarpur 1', hospital: 'Heart Care Center, Ambedkar Nagar', phone: '+91 9839098765', visitFreq: 'Bi-Weekly (2/mo)', status: 'Active' },
  { id: 'DOC-103', name: 'Dr. Rashmi Tiwari', mciNo: 'MCI-UP-67812', specialty: 'Gynecologist (MS)', class: 'Class A', division: 'General Medicine', patch: 'Shahzadpur', hospital: 'Matritva Nursing Home', phone: '+91 9450055443', visitFreq: 'Weekly (4/mo)', status: 'Active' },
  { id: 'DOC-104', name: 'Dr. R.K. Mishra', mciNo: 'MCI-UP-23901', specialty: 'Consultant Diabetologist', class: 'Core (A+)', division: 'Cardio-Diabetic', patch: 'Iltifatganj', hospital: 'Mishra Diabetes & Hormone Clinic', phone: '+91 9838011223', visitFreq: 'Weekly (4/mo)', status: 'Active' },
  { id: 'DOC-105', name: 'Dr. Anoop Srivastava', mciNo: 'MCI-UP-89124', specialty: 'Pediatrician (DCH)', class: 'Class B', division: 'Pediatric', patch: 'Akbarpur 1', hospital: 'Child Health Clinic', phone: '+91 9918077889', visitFreq: 'Monthly (1/mo)', status: 'Active' },
  { id: 'DOC-106', name: 'Dr. Vandana Saxena', mciNo: 'MCI-UP-54321', specialty: 'Dermatologist (DVD)', class: 'Class A', division: 'Dermatology', patch: 'Gomti Nagar', hospital: 'Skin & Laser Center', phone: '+91 9795033445', visitFreq: 'Bi-Weekly (2/mo)', status: 'Active' },
];

const SAMPLES_INPUTS_DATA = [
  { id: 'SMP-01', name: 'Raxon-CV 625 Catch Cover', type: 'Physician Sample', product: 'Raxon-CV 625', packQty: '2x1 Tablets Catch Cover', mrQuota: '40 Units/mo', stock: 1250, unitCost: 14.50, status: 'In Stock' },
  { id: 'SMP-02', name: 'Raxodil-D 2-Cap Foil Pack', type: 'Physician Sample', product: 'Raxodil-D', packQty: '2 Capsules Strip', mrQuota: '50 Units/mo', stock: 2400, unitCost: 8.20, status: 'In Stock' },
  { id: 'INP-01', name: 'CardioRax Visual Aid 2026', type: 'Detailing Aid (LBL)', product: 'CardioRax-AM', packQty: 'Hardcover Laminated Tab Aid', mrQuota: '1 Unit/MR', stock: 180, unitCost: 350.00, status: 'In Stock' },
  { id: 'INP-02', name: 'Doctor Table Top Prescription Pad Holder', type: 'Promotional Gift', product: 'General Medicine Brand', packQty: 'Acrylic Executive Stand', mrQuota: '15 Units/MR', stock: 450, unitCost: 85.00, status: 'In Stock' },
  { id: 'SMP-03', name: 'Raxoclav Syrup Sample 15ml', type: 'Physician Sample', product: 'Raxoclav Dry Syrup', packQty: '15ml Mini Bottle', mrQuota: '30 Units/mo', stock: 80, unitCost: 18.00, status: 'Low Stock' },
];

const CHEMISTS_DATA = [
  { id: 'CHM-101', name: 'Mishra Medical Hall', contactPerson: 'Arun Mishra', dlNo: 'UP-ABN-20B-1092', gstin: '09AAAFM1234F1Z8', patch: 'Iltifatganj', attachedDocs: 'Dr. S.K. Verma, Dr. R.K. Mishra', stockist: 'Gupta Medical Agency', status: 'Active' },
  { id: 'CHM-102', name: 'Gupta Chemist & Druggist', contactPerson: 'Manoj Gupta', dlNo: 'UP-ABN-20B-3451', gstin: '09BBBFG5678K1ZA', patch: 'Akbarpur 1', attachedDocs: 'Dr. P.N. Agarwal, Dr. Anoop Srivastava', stockist: 'Ambika Pharma Distributors', status: 'Active' },
  { id: 'CHM-103', name: 'Standard Pharmacy', contactPerson: 'Sandeep Tiwari', dlNo: 'UP-ABN-20B-8871', gstin: '09CCCFS9012L1Z3', patch: 'Shahzadpur', attachedDocs: 'Dr. Rashmi Tiwari', stockist: 'Gupta Medical Agency', status: 'Active' },
  { id: 'CHM-104', name: 'City Medicos', contactPerson: 'Vikas Jaiswal', dlNo: 'UP-LKO-20B-5542', gstin: '09DDDFJ3344M1Z5', patch: 'Gomti Nagar', attachedDocs: 'Dr. Vandana Saxena', stockist: 'Awadh Pharma Distributors', status: 'Active' },
];

const STOCKISTS_DATA = [
  { id: 'STK-01', agencyName: 'Gupta Medical Agency', contactPerson: 'Ramesh Gupta', dlNo: 'UP-ABN-20B/21B-4091', gstin: '09AAACG1122A1Z1', district: 'Ambedkar Nagar (Akbarpur)', phone: '+91 9415123987', creditLimit: '₹15,00,000', creditDays: '30 Days', divisions: 'General, Cardio, Pediatric', status: 'Active' },
  { id: 'STK-02', agencyName: 'Ambika Pharma Distributors', contactPerson: 'Pramod Agrahari', dlNo: 'UP-ABN-20B/21B-6532', gstin: '09BBBCA3344B1Z2', district: 'Ambedkar Nagar (Shahzadpur)', phone: '+91 9838045612', creditLimit: '₹12,00,000', creditDays: '21 Days', divisions: 'General Medicine, Derma', status: 'Active' },
  { id: 'STK-03', agencyName: 'Awadh Pharma Distributors', contactPerson: 'Deepak Mehrotra', dlNo: 'UP-LKO-20B/21B-9011', gstin: '09CCCAD7788C1Z3', district: 'Lucknow Central', phone: '+91 9450099881', creditLimit: '₹35,00,000', creditDays: '45 Days', divisions: 'All Divisions (Super Stockist)', status: 'Active' },
];

export default function PharmaMasters() {
  const [activeTab, setActiveTab] = useState<'products' | 'doctors' | 'samples' | 'chemists' | 'stockists'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivision, setFilterDivision] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [selectedItemForView, setSelectedItemForView] = useState<any>(null);

  // Stats calculation
  const totalProducts = PRODUCTS_DATA.length;
  const totalDoctors = DOCTORS_DATA.length;
  const totalSamples = SAMPLES_INPUTS_DATA.reduce((acc, curr) => acc + curr.stock, 0);
  const totalStockists = STOCKISTS_DATA.length;

  // Handle Dynamic Tab Data
  const getTabInfo = () => {
    switch (activeTab) {
      case 'products':
        return {
          title: 'Product Master (SKU Directory)',
          desc: 'Manage pharmaceutical formulations, composition, pack sizes, and pricing (PTS/PTR/MRP).',
          addLabel: 'Add Product',
          headers: ['Product Code & Name', 'Composition / Formula', 'Division & Category', 'Pack Size', 'PTS (₹)', 'PTR (₹)', 'MRP (₹)', 'Status', 'Actions']
        };
      case 'doctors':
        return {
          title: 'Doctor Master Directory',
          desc: 'Manage licensed HCPs, MCI numbers, specialty, categorization (Core/VIP), and patch mapping.',
          addLabel: 'Add Doctor',
          headers: ['Doctor Name & MCI', 'Specialty', 'Category', 'Territory / Patch', 'Hospital / Clinic', 'Visit Frequency', 'Status', 'Actions']
        };
      case 'samples':
        return {
          title: 'Physician Samples & Detailing Inputs',
          desc: 'Manage catch covers, promotional visual aids, LBLs, brand reminders, and MR monthly quotas.',
          addLabel: 'Add Sample/Input',
          headers: ['Item Code & Name', 'Type', 'Linked Product', 'Pack Details', 'MR Monthly Quota', 'Central Stock', 'Unit Cost (₹)', 'Status', 'Actions']
        };
      case 'chemists':
        return {
          title: 'Chemist & Retail Pharmacy Master',
          desc: 'Manage authorized retail chemist shops, drug license numbers (DL), attached doctors, and mapped stockists.',
          addLabel: 'Add Chemist',
          headers: ['Pharmacy Name & DL', 'Contact Person', 'Territory / Patch', 'Attached Prescribers', 'Mapped Stockist', 'GSTIN', 'Status', 'Actions']
        };
      case 'stockists':
        return {
          title: 'Stockist & Distributor Master',
          desc: 'Manage wholesale distributors, credit limits, payment terms, and division supply rights.',
          addLabel: 'Add Stockist',
          headers: ['Stockist Name & DL', 'District / HQ', 'Contact Details', 'Credit Terms', 'Active Divisions', 'GSTIN', 'Status', 'Actions']
        };
    }
  };

  const { title, desc, addLabel, headers } = getTabInfo();

  // Export functionality
  const handleExport = (format: string) => {
    setIsExportMenuOpen(false);
    if (format === 'excel' || format === 'csv') {
      let dataToExport: any[] = [];
      if (activeTab === 'products') dataToExport = PRODUCTS_DATA;
      else if (activeTab === 'doctors') dataToExport = DOCTORS_DATA;
      else if (activeTab === 'samples') dataToExport = SAMPLES_INPUTS_DATA;
      else if (activeTab === 'chemists') dataToExport = CHEMISTS_DATA;
      else if (activeTab === 'stockists') dataToExport = STOCKISTS_DATA;

      const keys = Object.keys(dataToExport[0] || {});
      const csvHeader = keys.join(',');
      const csvRows = dataToExport.map(row => keys.map(k => `"${row[k] || ''}"`).join(',')).join('\n');
      const csvString = `${csvHeader}\n${csvRows}`;

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `PharmaMaster_${activeTab.toUpperCase()}_Export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Exporting ${activeTab.toUpperCase()} to ${format.toUpperCase()} generated.`);
    }
  };

  // Filter Data
  const getFilteredData = () => {
    const q = searchQuery.toLowerCase();
    switch (activeTab) {
      case 'products':
        return PRODUCTS_DATA.filter(p => 
          (p.name.toLowerCase().includes(q) || p.composition.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) &&
          (filterDivision === 'All' || p.division.includes(filterDivision))
        );
      case 'doctors':
        return DOCTORS_DATA.filter(d => 
          (d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.patch.toLowerCase().includes(q) || d.hospital.toLowerCase().includes(q)) &&
          (filterDivision === 'All' || d.division.includes(filterDivision))
        );
      case 'samples':
        return SAMPLES_INPUTS_DATA.filter(s => 
          s.name.toLowerCase().includes(q) || s.product.toLowerCase().includes(q) || s.type.toLowerCase().includes(q)
        );
      case 'chemists':
        return CHEMISTS_DATA.filter(c => 
          c.name.toLowerCase().includes(q) || c.contactPerson.toLowerCase().includes(q) || c.patch.toLowerCase().includes(q) || c.stockist.toLowerCase().includes(q)
        );
      case 'stockists':
        return STOCKISTS_DATA.filter(st => 
          st.agencyName.toLowerCase().includes(q) || st.district.toLowerCase().includes(q) || st.contactPerson.toLowerCase().includes(q)
        );
      default:
        return [];
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6">
      {/* Top Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Products (SKUs)</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</h3>
            <p className="text-xs text-indigo-600 font-medium mt-0.5">3 Active Divisions</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Pill className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered Doctors</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalDoctors}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">100% MCI Verified</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Central Samples Stock</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalSamples.toLocaleString()}</h3>
            <p className="text-xs text-amber-600 font-medium mt-0.5">Catch covers & Gifts</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Gift className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stockists & Dist.</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalStockists}</h3>
            <p className="text-xs text-blue-600 font-medium mt-0.5">Authorized Wholesale Hubs</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            {activeTab === 'products' && <Pill className="w-6 h-6 mr-2 text-indigo-600" />}
            {activeTab === 'doctors' && <Stethoscope className="w-6 h-6 mr-2 text-emerald-600" />}
            {activeTab === 'samples' && <Gift className="w-6 h-6 mr-2 text-amber-600" />}
            {activeTab === 'chemists' && <Store className="w-6 h-6 mr-2 text-purple-600" />}
            {activeTab === 'stockists' && <Truck className="w-6 h-6 mr-2 text-blue-600" />}
            {title}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{desc}</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Import / Bulk Upload */}
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-2xs flex items-center transition-colors"
          >
            <Upload className="w-4 h-4 mr-1.5 text-gray-500" /> Bulk Import
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-2xs flex items-center transition-colors"
            >
              <Download className="w-4 h-4 mr-1.5 text-gray-500" /> Export
            </button>
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-30">
                <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center">
                  <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" /> Excel / CSV Sheet
                </button>
                <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center">
                  <FileIcon className="w-4 h-4 mr-2 text-red-500" /> PDF Document
                </button>
                <button onClick={() => handleExport('word')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-600" /> Word File
                </button>
              </div>
            )}
          </div>

          {/* Add New Master Button */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" /> {addLabel}
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="bg-white border-b border-gray-200 rounded-t-xl overflow-x-auto shadow-2xs">
        <nav className="flex space-x-2 p-2" aria-label="Tabs">
          {[
            { id: 'products', label: 'Products Master', icon: Pill, count: PRODUCTS_DATA.length },
            { id: 'doctors', label: 'Doctor Directory', icon: Stethoscope, count: DOCTORS_DATA.length },
            { id: 'samples', label: 'Samples & Detailing Inputs', icon: Gift, count: SAMPLES_INPUTS_DATA.length },
            { id: 'chemists', label: 'Chemist & Pharmacies', icon: Store, count: CHEMISTS_DATA.length },
            { id: 'stockists', label: 'Stockists & Distributors', icon: Truck, count: STOCKISTS_DATA.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchQuery('');
                }}
                className={`
                  whitespace-nowrap px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs border border-indigo-100' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-indigo-200 text-indigo-900 font-bold' : 'bg-gray-100 text-gray-600'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-b-xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/60">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search in ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-shadow"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {(activeTab === 'products' || activeTab === 'doctors') && (
              <select 
                value={filterDivision} 
                onChange={(e) => setFilterDivision(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-700"
              >
                <option value="All">All Divisions</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Cardio-Diabetic">Cardio-Diabetic</option>
                <option value="Pediatric">Pediatric</option>
                <option value="Dermatology">Dermatology</option>
              </select>
            )}
            <button className="flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-2xs">
              <Filter className="w-4 h-4 mr-1.5 text-gray-500" /> More Filters
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((h, i) => (
                  <th 
                    key={i} 
                    className={`px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* --- TAB 1: PRODUCTS --- */}
              {activeTab === 'products' && (filteredData as typeof PRODUCTS_DATA).map((p) => (
                <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-indigo-700 text-sm">{p.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{p.id}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate" title={p.composition}>
                    {p.composition}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {p.division}
                    </span>
                    <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {p.pack}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₹{p.pts.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₹{p.ptr.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-700">
                    ₹{p.mrp.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => setSelectedItemForView(p)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-gray-100" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-amber-600 rounded-md hover:bg-gray-100" title="Edit Product">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* --- TAB 2: DOCTORS --- */}
              {activeTab === 'doctors' && (filteredData as typeof DOCTORS_DATA).map((d) => (
                <tr key={d.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900 text-sm">{d.name}</div>
                    <div className="text-xs text-emerald-700 font-mono font-medium">{d.mciNo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {d.specialty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      d.class.includes('VIP') ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                      d.class.includes('Core') ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {d.class}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {d.patch}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={d.hospital}>
                    <div className="flex items-center">
                      <Building2 className="w-3.5 h-3.5 mr-1 text-gray-400 shrink-0" />
                      <span className="truncate">{d.hospital}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {d.visitFreq}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => setSelectedItemForView(d)} className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-md hover:bg-gray-100" title="View Profile">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-amber-600 rounded-md hover:bg-gray-100" title="Edit Doctor">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* --- TAB 3: SAMPLES & INPUTS --- */}
              {activeTab === 'samples' && (filteredData as typeof SAMPLES_INPUTS_DATA).map((s) => (
                <tr key={s.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900 text-sm">{s.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{s.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                      s.type === 'Physician Sample' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {s.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700">
                    {s.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {s.packQty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {s.mrQuota}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">{s.stock.toLocaleString()} units</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                    ₹{s.unitCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      s.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1.5 text-gray-400 hover:text-amber-600 rounded-md hover:bg-gray-100" title="Edit Item">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* --- TAB 4: CHEMISTS --- */}
              {activeTab === 'chemists' && (filteredData as typeof CHEMISTS_DATA).map((c) => (
                <tr key={c.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900 text-sm">{c.name}</div>
                    <div className="text-xs text-purple-700 font-mono font-medium">DL: {c.dlNo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {c.contactPerson}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {c.patch}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={c.attachedDocs}>
                    {c.attachedDocs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                    {c.stockist}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                    {c.gstin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1.5 text-gray-400 hover:text-purple-600 rounded-md hover:bg-gray-100" title="Edit Chemist">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* --- TAB 5: STOCKISTS --- */}
              {activeTab === 'stockists' && (filteredData as typeof STOCKISTS_DATA).map((st) => (
                <tr key={st.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-blue-900 text-sm">{st.agencyName}</div>
                    <div className="text-xs text-blue-700 font-mono">DL: {st.dlNo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {st.district}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{st.contactPerson}</div>
                    <div className="text-xs text-gray-500">{st.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-emerald-700">{st.creditLimit}</div>
                    <div className="text-xs text-gray-500 font-medium">Credit: {st.creditDays}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-800">
                      {st.divisions}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                    {st.gstin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {st.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100" title="Edit Stockist">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No records found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: ADD NEW ENTITY MODAL --- */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={addLabel}>
        <div className="space-y-4">
          {/* PRODUCT FORM */}
          {activeTab === 'products' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand / Product Name</label>
                  <input type="text" placeholder="e.g. Raxon-CV 625" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">SKU / Item Code</label>
                  <input type="text" defaultValue="PRD-008" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Generic Formula / Composition</label>
                <input type="text" placeholder="e.g. Amoxicillin 500mg + Clavulanic Acid 125mg" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Division</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white outline-none">
                    <option>General Medicine</option>
                    <option>Cardio-Diabetic</option>
                    <option>Pediatric</option>
                    <option>Dermatology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dosage Form / Category</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white outline-none">
                    <option>Tablet</option>
                    <option>Capsule</option>
                    <option>Syrup / Suspension</option>
                    <option>Injection</option>
                    <option>Ointment / Gel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pack Size</label>
                  <input type="text" placeholder="e.g. 10x10 Alu-Alu" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">PTS (Price to Stockist)</label>
                  <input type="number" placeholder="₹ 0.00" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">PTR (Price to Retailer)</label>
                  <input type="number" placeholder="₹ 0.00" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">MRP</label>
                  <input type="number" placeholder="₹ 0.00" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white font-bold text-emerald-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">GST Rate</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option>12% (Medicines)</option>
                    <option>18% (Cosmeceuticals)</option>
                    <option>5% (Nutraceuticals)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* DOCTOR FORM */}
          {activeTab === 'doctors' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Doctor Full Name</label>
                  <input type="text" placeholder="e.g. Dr. A.K. Gupta" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">MCI / State Medical Council Reg No.</label>
                  <input type="text" placeholder="e.g. MCI-UP-12345" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Specialty</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option>General Physician (MD/MBBS)</option>
                    <option>Cardiologist (DM)</option>
                    <option>Diabetologist / Endocrine</option>
                    <option>Gynecologist (MS/DGO)</option>
                    <option>Pediatrician (MD/DCH)</option>
                    <option>Orthopedic Surgeon (MS)</option>
                    <option>Dermatologist (MD/DVD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Classification Category</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white font-semibold">
                    <option>Super Core (VIP Key Opinion Leader)</option>
                    <option>Core (A+ High Prescriber)</option>
                    <option>Class A (Regular Potential)</option>
                    <option>Class B (Moderate Potential)</option>
                    <option>Class C (Low Potential)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Visit Frequency</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option>Weekly (4 Visits / Month)</option>
                    <option>Bi-Weekly (2 Visits / Month)</option>
                    <option>Monthly (1 Visit / Month)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Territory / Patch Mapping</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option>Iltifatganj (Lucknow HQ)</option>
                    <option>Akbarpur 1 (Ambedkar Nagar)</option>
                    <option>Shahzadpur</option>
                    <option>Gomti Nagar (Lucknow HQ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Mobile Number</label>
                  <input type="tel" placeholder="+91 9876543210" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hospital / Clinic Address</label>
                <input type="text" placeholder="Clinic Name, Chamber No, Street, City" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </>
          )}

          {/* SAMPLES FORM */}
          {activeTab === 'samples' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Sample / Input Name</label>
                  <input type="text" placeholder="e.g. Raxon-CV Catch Cover 2T" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Type</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option>Physician Sample</option>
                    <option>Detailing Aid (LBL / Visual Aid)</option>
                    <option>Promotional Gift / Brand Reminder</option>
                    <option>Scientific Literature / Journal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Linked Formulation</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option>Raxon-CV 625</option>
                    <option>Raxodil-D</option>
                    <option>CardioRax-AM</option>
                    <option>Raxoclav Dry Syrup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Monthly MR Allocation Quota</label>
                  <input type="text" placeholder="e.g. 40 Units / Month" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Initial Central Stock Qty</label>
                  <input type="number" placeholder="e.g. 2000" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unit Cost (₹)</label>
                  <input type="number" placeholder="₹ 15.00" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white" />
                </div>
              </div>
            </>
          )}

          {/* CHEMIST FORM */}
          {activeTab === 'chemists' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Chemist Shop / Pharmacy Name</label>
                  <input type="text" placeholder="e.g. Gupta Medical Hall" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Drug License (DL) Number</label>
                  <input type="text" placeholder="e.g. UP-ABN-20B-1092" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Person / Pharmacist</label>
                  <input type="text" placeholder="e.g. Arun Kumar" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">GSTIN Number</label>
                  <input type="text" placeholder="09AAAFM1234F1Z8" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Territory / Patch</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option>Iltifatganj</option>
                    <option>Akbarpur 1</option>
                    <option>Shahzadpur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mapped Authorized Stockist</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option>Gupta Medical Agency</option>
                    <option>Ambika Pharma Distributors</option>
                    <option>Awadh Pharma Distributors</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* STOCKIST FORM */}
          {activeTab === 'stockists' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Distributor / Agency Name</label>
                  <input type="text" placeholder="e.g. Gupta Medical Agency" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Wholesale DL Number (20B/21B)</label>
                  <input type="text" placeholder="e.g. UP-ABN-20B/21B-4091" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Person</label>
                  <input type="text" placeholder="e.g. Ramesh Gupta" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input type="tel" placeholder="+91 9415123456" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">District / HQ Location</label>
                  <input type="text" placeholder="Ambedkar Nagar" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Credit Limit</label>
                  <input type="text" placeholder="₹ 15,00,000" className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Credit Terms</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option>21 Days</option>
                    <option>30 Days</option>
                    <option>45 Days</option>
                    <option>Advance Payment</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Modal Action Buttons */}
          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-2">
            <button 
              onClick={() => setIsAddModalOpen(false)} 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                alert(`New record added successfully to ${activeTab.toUpperCase()}!`);
                setIsAddModalOpen(false);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-2xs"
            >
              Save & Activate
            </button>
          </div>
        </div>
      </Modal>

      {/* --- MODAL 2: BULK IMPORT MODAL --- */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title={`Bulk Import ${activeTab.toUpperCase()} Data`}>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 bg-gray-50/50 transition-colors">
            <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">Upload Excel (.xlsx, .csv) Sheet</p>
            <p className="text-xs text-gray-500 mt-1">Drag and drop your master sheet or click to browse files.</p>
            <input type="file" className="hidden" id="bulk-upload-input" />
            <label htmlFor="bulk-upload-input" className="mt-3 inline-block px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-2xs">
              Select Excel File
            </label>
          </div>

          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex items-start space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-900">
              <span className="font-bold">Need sample format?</span> Download our predefined Excel template containing columns for {activeTab} onboarding.
              <div className="mt-1">
                <button onClick={() => handleExport('excel')} className="font-bold underline hover:text-indigo-950">
                  Download Standard .CSV Template
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3 border-t border-gray-100">
            <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button 
              onClick={() => {
                alert(`File validated! 12 items imported successfully into ${activeTab}.`);
                setIsImportModalOpen(false);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Start Import & Verify
            </button>
          </div>
        </div>
      </Modal>

      {/* --- MODAL 3: VIEW RECORD DETAILS --- */}
      {selectedItemForView && (
        <Modal isOpen={!!selectedItemForView} onClose={() => setSelectedItemForView(null)} title="Master Record Detail View">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedItemForView.name || selectedItemForView.agencyName}</h3>
                  <p className="text-xs text-indigo-600 font-mono mt-0.5">{selectedItemForView.id || selectedItemForView.mciNo || selectedItemForView.dlNo}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  {selectedItemForView.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(selectedItemForView).map(([k, v]: any) => {
                if (typeof v === 'object') return null;
                return (
                  <div key={k} className="p-2.5 bg-white border border-gray-100 rounded-lg">
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">{k}</span>
                    <span className="text-sm font-medium text-gray-900">{String(v)}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex justify-end border-t border-gray-100">
              <button onClick={() => setSelectedItemForView(null)} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
