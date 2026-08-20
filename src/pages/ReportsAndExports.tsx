import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Calendar, 
  Filter, 
  Users, 
  Building2, 
  Pill, 
  CheckCircle, 
  TrendingUp, 
  FileText, 
  Building, 
  MapPin,
  Search,
  Sparkles,
  ArrowDownToLine,
  Phone,
  Stethoscope,
  ShieldCheck,
  Award,
  ChevronRight,
  Clock
} from 'lucide-react';
import { getActiveCompany } from '../data/companyContext';
import { getDoctorsList, getChemistsList, getStockistsList, getProductsCatalog, getStockistLedger } from '../data/masterData';
import { getUsersByCompany } from '../data/userContext';

export default function ReportsAndExports() {
  const company = getActiveCompany();
  const [selectedReportType, setSelectedReportType] = useState<
    'call_detail' | 'doctor_coverage' | 'chemist_secondary' | 'stockist_ledger' | 'dcr_compliance' | 'master_directory'
  >('call_detail');

  // Date Range state for Call Detail Report & general reporting
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-15');
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('All');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  const doctors = getDoctorsList(company.id);
  const chemists = getChemistsList(company.id);
  const stockists = getStockistsList(company.id);
  const products = getProductsCatalog(company.id);

  // Dynamic MR, AM, RM, ZM Hierarchy List from company users
  const companyUsers = getUsersByCompany(company.id);
  const mrList = companyUsers.filter(u => ['MR', 'MEDICAL_REPRESENTATIVE'].includes(u.role)).map(u => u.name);
  const amList = companyUsers.filter(u => ['AM', 'AREA_MANAGER'].includes(u.role)).map(u => u.name);
  const rmList = companyUsers.filter(u => ['RM', 'REGIONAL_MANAGER'].includes(u.role)).map(u => u.name);
  const zmList = companyUsers.filter(u => ['DIVISION_SYSTEM_ADMIN', 'ZM', 'COMPANY_ADMIN', 'Admin'].includes(u.role)).map(u => u.name);

  const MR_NAMES = mrList.length > 0 ? mrList : ['Aman Singh', 'Rahul Verma', 'Vikram Singh', 'Sunil Kumar', 'Rajesh Gupta', 'Manoj Sharma'];
  const AM_NAMES = amList.length > 0 ? amList : ['Rohan Sharma', 'Vikram Pandey', 'Manish Agarwal'];
  const RM_NAMES = rmList.length > 0 ? rmList : ['V.K. Tiwari', 'Dr. S.K. Srivastava'];
  const ZM_NAMES = zmList.length > 0 ? zmList : ['System Administrator'];

  // Dynamic Call Detail Report Calculation based strictly on [startDate, endDate]
  const callDetailReportData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return doctors.map((doc, idx) => {
      // Deterministic MR, AM, RM, ZM assignment based on area / index
      const mrName = MR_NAMES[idx % MR_NAMES.length];
      const amName = AM_NAMES[idx % AM_NAMES.length];
      const rmName = RM_NAMES[idx % RM_NAMES.length];
      const zmName = ZM_NAMES[0];
      const hqName = doc.area.includes('Akbarpur') ? 'Ambedkar Nagar HQ' : 
                     doc.area.includes('Shahzadpur') ? 'Shahzadpur HQ' : 
                     doc.area.includes('Tanda') ? 'Tanda HQ' : 
                     doc.area.includes('Hospital') ? 'Ambedkar Nagar HQ' : 
                     doc.area.includes('Medical') ? 'Ambedkar Nagar HQ' : 
                     `${doc.area} HQ`;

      // Generate possible visit days in August 2026
      const mrPossibleDays = [2, 4, 6, 8, 10, 11, 13, 14, 17, 20, 24, 27].filter(d => (d + idx) % 3 !== 0);
      const amPossibleDays = [6, 11, 20].filter(d => (d + idx) % 2 === 0);
      const rmPossibleDays = [11, 24].filter(d => (d + idx) % 4 === 0);
      const zmPossibleDays = [14].filter(d => (d + idx) % 6 === 0);

      // Filter dates between startDate and endDate
      const filterDates = (days: number[]) => {
        return days
          .map(d => {
            const dateStr = `2026-08-${String(d).padStart(2, '0')}`;
            return {
              dateObj: new Date(dateStr),
              formatted: `${String(d).padStart(2, '0')}/08/2026`
            };
          })
          .filter(item => item.dateObj >= start && item.dateObj <= end)
          .map(item => item.formatted);
      };

      const mrVisitDates = filterDates(mrPossibleDays);
      const amVisitDates = filterDates(amPossibleDays);
      const rmVisitDates = filterDates(rmPossibleDays);
      const zmVisitDates = filterDates(zmPossibleDays);

      return {
        srNo: idx + 1,
        id: doc.id,
        doctorName: doc.name,
        speciality: doc.specialty,
        qualification: doc.qualification || 'MBBS',
        contact: doc.phone || '+91 98391 22341',
        address: doc.address || `${doc.subArea}, ${doc.area}`,
        subarea: doc.subArea,
        area: doc.area,
        hq: hqName,
        mrName,
        mrVisitsCount: mrVisitDates.length,
        mrVisitDates: mrVisitDates.length > 0 ? mrVisitDates.join(', ') : '-',
        amName,
        amVisitsCount: amVisitDates.length,
        amVisitDates: amVisitDates.length > 0 ? amVisitDates.join(', ') : '-',
        rmName,
        rmVisitsCount: rmVisitDates.length,
        rmVisitDates: rmVisitDates.length > 0 ? rmVisitDates.join(', ') : '-',
        zmName,
        zmVisitsCount: zmVisitDates.length,
        zmVisitDates: zmVisitDates.length > 0 ? zmVisitDates.join(', ') : '-',
      };
    });
  }, [doctors, startDate, endDate]);

  // Filtered Call Detail Data for View
  const filteredCallDetails = useMemo(() => {
    return callDetailReportData.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subarea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mrName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.amName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesArea = selectedAreaFilter === 'All' || item.area === selectedAreaFilter;
      const matchesSpecialty = selectedSpecialtyFilter === 'All' || item.speciality === selectedSpecialtyFilter;

      return matchesSearch && matchesArea && matchesSpecialty;
    });
  }, [callDetailReportData, searchQuery, selectedAreaFilter, selectedSpecialtyFilter]);

  // Summary Metrics for Call Detail Report
  const callDetailStats = useMemo(() => {
    let totalMRVisits = 0;
    let totalAMVisits = 0;
    let totalRMVisits = 0;
    let totalZMVisits = 0;
    let visitedDoctors = 0;

    filteredCallDetails.forEach(d => {
      totalMRVisits += d.mrVisitsCount;
      totalAMVisits += d.amVisitsCount;
      totalRMVisits += d.rmVisitsCount;
      totalZMVisits += d.zmVisitsCount;
      if (d.mrVisitsCount > 0) visitedDoctors++;
    });

    return {
      totalDoctors: filteredCallDetails.length,
      visitedDoctors,
      totalMRVisits,
      totalAMVisits,
      totalRMVisits,
      totalZMVisits,
      totalHierarchyVisits: totalMRVisits + totalAMVisits + totalRMVisits + totalZMVisits
    };
  }, [filteredCallDetails]);

  // Mocked rich reporting data for other review meetings
  const doctorReportData = useMemo(() => {
    return doctors.map((doc, idx) => {
      const visits = ((idx * 3 + 2) % 4) + 1; // 1 to 4 calls
      const pobVal = (idx % 2 === 0 ? 12500 : 8400) + (idx * 450);
      const samplesGiven = (idx % 3) + 2;
      const lastVisit = `2026-08-${String((idx % 14) + 1).padStart(2, '0')}`;
      return {
        id: doc.id,
        name: doc.name,
        specialty: doc.specialty,
        area: doc.area,
        subArea: doc.subArea,
        qualification: doc.qualification || 'MBBS',
        visitsCount: visits,
        targetVisits: 2,
        coveragePct: Math.min(100, Math.round((visits / 2) * 100)),
        pobBooked: pobVal,
        samplesUnits: samplesGiven,
        lastVisitDate: lastVisit,
        status: visits >= 2 ? 'Target Met' : 'Partial'
      };
    });
  }, [doctors]);

  const chemistReportData = useMemo(() => {
    return chemists.map((chem, idx) => {
      const ordersCount = (idx % 3) + 1;
      const pobVal = 14500 + (idx * 620);
      const linkedStockist = chem.stockist || (stockists[idx % stockists.length]?.name || 'Standard Agency');
      return {
        id: chem.id,
        name: chem.name,
        contactPerson: chem.contactPerson,
        area: chem.area,
        subArea: chem.subArea,
        phone: chem.phone || 'N/A',
        dlNumber: chem.dlNumber || '20B/21B-DL-001',
        stockist: linkedStockist,
        ordersCount,
        pobValue: pobVal,
        availabilityStatus: idx % 4 === 0 ? 'High Stock' : 'Adequate'
      };
    });
  }, [chemists, stockists]);

  const stockistReportData = useMemo(() => {
    return stockists.map((stk) => {
      const ledger = getStockistLedger(stk.id, selectedMonth);
      return {
        id: stk.id,
        name: stk.name,
        contactPerson: stk.contactPerson,
        phone: stk.phone,
        area: stk.area,
        hq: stk.hq,
        dlNumber: stk.dlNumber,
        gstNumber: stk.gstNumber,
        openingValue: ledger.totalOpeningValue || ledger.totals?.openingValue || 0,
        purchaseValue: ledger.totalPurchaseValue || ledger.totals?.purchaseValue || 0,
        saleValue: ledger.totalSaleValue || ledger.totals?.saleValue || 0,
        closingValue: ledger.totalClosingValue || ledger.totals?.closingValue || 0,
        outstandingValue: stk.outstandingValue || '₹0'
      };
    });
  }, [stockists, selectedMonth]);

  const dcrComplianceData = useMemo(() => {
    return [
      { empId: 'EMP-1001', name: mrList[0] || 'Aman Singh', role: 'MR', hq: 'Akbarpur / Ambedkar Nagar', totalDays: 14, daysWorked: 13, leaves: 0, holidays: 1, docCallsDone: 142, chemistCallsDone: 68, pobTotal: 184500, compliancePct: 93 },
      { empId: 'EMP-1002', name: amList[0] || 'Rohan Sharma', role: 'AM', hq: 'Lucknow Central', totalDays: 14, daysWorked: 14, leaves: 0, holidays: 0, docCallsDone: 96, chemistCallsDone: 42, pobTotal: 245000, compliancePct: 100 },
      { empId: 'EMP-1004', name: mrList[1] || 'Vikram Singh', role: 'MR', hq: 'Varanasi North', totalDays: 14, daysWorked: 12, leaves: 1, holidays: 1, docCallsDone: 128, chemistCallsDone: 54, pobTotal: 142000, compliancePct: 86 },
      { empId: 'EMP-1005', name: rmList[0] || 'V.K. Tiwari', role: 'RM', hq: 'UP East Region', totalDays: 14, daysWorked: 14, leaves: 0, holidays: 0, docCallsDone: 78, chemistCallsDone: 36, pobTotal: 310000, compliancePct: 100 },
    ];
  }, [mrList, amList, rmList]);

  // Set quick date range presets
  const handleDatePreset = (preset: 'month' | 'last15' | 'last7' | 'first10') => {
    if (preset === 'month') {
      setStartDate('2026-08-01');
      setEndDate('2026-08-31');
    } else if (preset === 'last15') {
      setStartDate('2026-08-01');
      setEndDate('2026-08-15');
    } else if (preset === 'last7') {
      setStartDate('2026-08-08');
      setEndDate('2026-08-15');
    } else if (preset === 'first10') {
      setStartDate('2026-08-01');
      setEndDate('2026-08-10');
    }
  };

  // CSV Export Utility with exact 21 requested columns for Call Detail Report
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `${company.code}_CALL_DETAIL_REPORT_${startDate}_to_${endDate}.csv`;

    if (selectedReportType === 'call_detail') {
      // Exact 21 columns as requested by the user:
      // sr no, doctor name, speciality,qualification,contact,address,subarea,area,Hq,Mr Name ,No. of Visit,Visit Dates,AM Name ,No. of Visit,Visit Dates,RM Name ,No. of Visit, Visit Dates,ZM Name ,No. of Visit,Visit Dates
      headers = [
        'sr no',
        'doctor name',
        'speciality',
        'qualification',
        'contact',
        'address',
        'subarea',
        'area',
        'Hq',
        'Mr Name',
        'No. of Visit',
        'Visit Dates',
        'AM Name',
        'No. of Visit',
        'Visit Dates',
        'RM Name',
        'No. of Visit',
        'Visit Dates',
        'ZM Name',
        'No. of Visit',
        'Visit Dates'
      ];

      rows = filteredCallDetails.map(item => [
        item.srNo,
        item.doctorName,
        item.speciality,
        item.qualification,
        item.contact,
        item.address,
        item.subarea,
        item.area,
        item.hq,
        item.mrName,
        item.mrVisitsCount,
        item.mrVisitDates,
        item.amName,
        item.amVisitsCount,
        item.amVisitDates,
        item.rmName,
        item.rmVisitsCount,
        item.rmVisitDates,
        item.zmName,
        item.zmVisitsCount,
        item.zmVisitDates
      ]);
    } else if (selectedReportType === 'doctor_coverage') {
      filename = `${company.code}_Doctor_Coverage_${selectedMonth}.csv`;
      headers = ['Doctor ID', 'Doctor Name', 'Specialty', 'Area', 'Sub-Area', 'Qualification', 'Visits Count', 'Target Visits', 'Coverage %', 'POB Booked (INR)', 'Samples Given (Units)', 'Last Visit Date', 'Status'];
      rows = doctorReportData.map(d => [d.id, d.name, d.specialty, d.area, d.subArea, d.qualification, d.visitsCount, d.targetVisits, `${d.coveragePct}%`, d.pobBooked, d.samplesUnits, d.lastVisitDate, d.status]);
    } else if (selectedReportType === 'chemist_secondary') {
      filename = `${company.code}_Chemist_Secondary_${selectedMonth}.csv`;
      headers = ['Chemist ID', 'Chemist Name', 'Contact Person', 'Area', 'Sub-Area', 'Phone', 'DL Number', 'Mapped Stockist', 'Orders Booked', 'Total POB Value (INR)', 'Stock Availability'];
      rows = chemistReportData.map(c => [c.id, c.name, c.contactPerson, c.area, c.subArea, c.phone, c.dlNumber, c.stockist, c.ordersCount, c.pobValue, c.availabilityStatus]);
    } else if (selectedReportType === 'stockist_ledger') {
      filename = `${company.code}_Stockist_SSS_${selectedMonth}.csv`;
      headers = ['Stockist ID', 'Agency Name', 'Contact Person', 'Phone', 'HQ', 'Area', 'DL Number', 'GSTIN', 'Opening Stock Value (INR)', 'Purchase Value (INR)', 'Secondary Sale Value (INR)', 'Closing Stock Value (INR)', 'Outstanding'];
      rows = stockistReportData.map(s => [s.id, s.name, s.contactPerson, s.phone, s.hq, s.area, s.dlNumber, s.gstNumber, s.openingValue, s.purchaseValue, s.saleValue, s.closingValue, s.outstandingValue]);
    } else if (selectedReportType === 'dcr_compliance') {
      filename = `${company.code}_Field_Compliance_${selectedMonth}.csv`;
      headers = ['Emp ID', 'Employee Name', 'Role', 'Headquarter', 'Total Days', 'Days Worked', 'Leaves', 'Doctor Calls Done', 'Chemist Calls Done', 'Total POB Booked (INR)', 'Field Compliance %'];
      rows = dcrComplianceData.map(r => [r.empId, r.name, r.role, r.hq, r.totalDays, r.daysWorked, r.leaves, r.docCallsDone, r.chemistCallsDone, r.pobTotal, `${r.compliancePct}%`]);
    } else {
      filename = `${company.code}_Master_Address_Book.csv`;
      headers = ['Type', 'Name', 'Area', 'Sub-Area / Landmark', 'Contact Phone', 'Category / Specialty'];
      rows = [
        ...doctors.map(d => ['Doctor', d.name, d.area, d.subArea, d.phone || 'N/A', d.specialty]),
        ...chemists.map(c => ['Chemist', c.name, c.area, c.subArea, c.phone || 'N/A', 'Retail Pharmacy']),
        ...stockists.map(s => ['Stockist', s.name, s.area, s.hq, s.phone, 'Wholesale Agency'])
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Distinct Areas & Specialties for Dropdowns
  const uniqueAreas = useMemo(() => Array.from(new Set(doctors.map(d => d.area))), [doctors]);
  const uniqueSpecialties = useMemo(() => Array.from(new Set(doctors.map(d => d.specialty))), [doctors]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-900 text-2xs font-black rounded-md uppercase tracking-wider">
              {company.name}
            </span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-xs font-bold text-gray-500">Business Intelligence & Export Hub</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Review Meeting & Executive Report Pack</h1>
          <p className="text-xs font-semibold text-gray-600">
            Generate, filter date-wise, and 1-click export audit-ready field performance, doctor call details, & sales statements
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            title="Download CSV report directly for selected Date Range"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Export to Excel (CSV)</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Print / PDF Meeting Pack</span>
          </button>
        </div>
      </div>

      {/* Primary Report Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedReportType('call_detail')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
            selectedReportType === 'call_detail'
              ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm ring-2 ring-indigo-500/20'
              : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${selectedReportType === 'call_detail' ? 'text-amber-300' : 'text-indigo-600'}`} />
          <span>1. Call Detail Report (MR / AM / RM / ZM Visits)</span>
          <span className="ml-1 px-1.5 py-0.2 bg-emerald-500 text-white rounded text-3xs font-black">21 COLUMNS</span>
        </button>

        <button
          onClick={() => setSelectedReportType('doctor_coverage')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
            selectedReportType === 'doctor_coverage'
              ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm ring-2 ring-indigo-500/20'
              : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
          <span>2. Doctor Call Coverage & POB</span>
        </button>

        <button
          onClick={() => setSelectedReportType('chemist_secondary')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
            selectedReportType === 'chemist_secondary'
              ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm ring-2 ring-indigo-500/20'
              : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>3. Chemist Secondary Orders</span>
        </button>

        <button
          onClick={() => setSelectedReportType('stockist_ledger')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
            selectedReportType === 'stockist_ledger'
              ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm ring-2 ring-indigo-500/20'
              : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
          <span>4. Stockist Stock & Sales (SSS)</span>
        </button>

        <button
          onClick={() => setSelectedReportType('dcr_compliance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
            selectedReportType === 'dcr_compliance'
              ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm ring-2 ring-indigo-500/20'
              : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
          <span>5. MTP & DCR Compliance</span>
        </button>

        <button
          onClick={() => setSelectedReportType('master_directory')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
            selectedReportType === 'master_directory'
              ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm ring-2 ring-indigo-500/20'
              : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>6. Master Address Book</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MANDATORY DATE RANGE SELECTOR BEFORE EXPORT (Kab Se Kab Tak Ka Report)    */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900">
                {selectedReportType === 'call_detail' 
                  ? 'Select Call Detail Report Date Range (Kab Se Kab Tak Ka Report Chahiye)' 
                  : 'Report Cycle & Date Filters'}
              </h2>
              <p className="text-3xs font-semibold text-gray-500">
                Choose Start Date and End Date to filter all doctor visit counts & visit dates dynamically before export
              </p>
            </div>
          </div>

          {/* Quick Date Range Preset Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-3xs font-bold text-gray-400 uppercase mr-1">Quick Select:</span>
            <button
              onClick={() => handleDatePreset('last15')}
              className={`px-2.5 py-1 rounded-lg text-3xs font-extrabold transition-all cursor-pointer ${
                startDate === '2026-08-01' && endDate === '2026-08-15'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Aug 1 - Aug 15 (Current)
            </button>
            <button
              onClick={() => handleDatePreset('last7')}
              className={`px-2.5 py-1 rounded-lg text-3xs font-extrabold transition-all cursor-pointer ${
                startDate === '2026-08-08' && endDate === '2026-08-15'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => handleDatePreset('first10')}
              className={`px-2.5 py-1 rounded-lg text-3xs font-extrabold transition-all cursor-pointer ${
                startDate === '2026-08-01' && endDate === '2026-08-10'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              First 10 Days
            </button>
            <button
              onClick={() => handleDatePreset('month')}
              className={`px-2.5 py-1 rounded-lg text-3xs font-extrabold transition-all cursor-pointer ${
                startDate === '2026-08-01' && endDate === '2026-08-31'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Full Month (Aug 2026)
            </button>
          </div>
        </div>

        {/* Date Inputs Grid & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Start Date (From Date) */}
          <div className="bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100">
            <label className="block text-3xs font-black text-indigo-900 uppercase mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-600" /> Start Date (From)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-indigo-300 rounded-lg text-xs font-black text-indigo-950 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* End Date (To Date) */}
          <div className="bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100">
            <label className="block text-3xs font-black text-indigo-900 uppercase mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-600" /> End Date (To)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-indigo-300 rounded-lg text-xs font-black text-indigo-950 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Area / Territory Filter */}
          <div>
            <label className="block text-3xs font-bold text-gray-600 uppercase mb-1">Filter by Area</label>
            <select
              value={selectedAreaFilter}
              onChange={(e) => setSelectedAreaFilter(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
            >
              <option value="All">All Areas ({uniqueAreas.length})</option>
              {uniqueAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div>
            <label className="block text-3xs font-bold text-gray-600 uppercase mb-1">Speciality</label>
            <select
              value={selectedSpecialtyFilter}
              onChange={(e) => setSelectedSpecialtyFilter(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
            >
              <option value="All">All Specialities ({uniqueSpecialties.length})</option>
              {uniqueSpecialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-3xs font-bold text-gray-600 uppercase mb-1">Doctor / Rep Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Doctor / MR / AM name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white placeholder-gray-400"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Highlights for the Selected Date Range */}
      {selectedReportType === 'call_detail' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl text-center">
            <span className="text-3xs font-bold text-indigo-700 block uppercase">Selected Doctors</span>
            <span className="text-lg font-black text-indigo-950">{callDetailStats.totalDoctors}</span>
            <span className="text-3xs text-indigo-600 font-semibold block mt-0.5">{callDetailStats.visitedDoctors} Visited in Range</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-center">
            <span className="text-3xs font-bold text-blue-700 block uppercase">MR Solo Visits</span>
            <span className="text-lg font-black text-blue-950">{callDetailStats.totalMRVisits} Visits</span>
            <span className="text-3xs text-blue-600 font-semibold block mt-0.5">{startDate} to {endDate}</span>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-center">
            <span className="text-3xs font-bold text-purple-700 block uppercase">AM Joint Visits</span>
            <span className="text-lg font-black text-purple-950">{callDetailStats.totalAMVisits} Visits</span>
            <span className="text-3xs text-purple-600 font-semibold block mt-0.5">Field Coaching</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
            <span className="text-3xs font-bold text-emerald-700 block uppercase">RM Joint Visits</span>
            <span className="text-lg font-black text-emerald-950">{callDetailStats.totalRMVisits} Visits</span>
            <span className="text-3xs text-emerald-600 font-semibold block mt-0.5">Key KOL Audits</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center">
            <span className="text-3xs font-bold text-amber-800 block uppercase">ZM Strategic Calls</span>
            <span className="text-lg font-black text-amber-950">{callDetailStats.totalZMVisits} Visits</span>
            <span className="text-3xs text-amber-700 font-semibold block mt-0.5">Zonal KOL Connect</span>
          </div>
          <div className="bg-slate-900 text-white p-3 rounded-xl text-center shadow-xs">
            <span className="text-3xs font-bold text-slate-300 block uppercase">Total Hierarchy Calls</span>
            <span className="text-lg font-black text-amber-400">{callDetailStats.totalHierarchyVisits}</span>
            <span className="text-3xs text-slate-300 font-semibold block mt-0.5">Multi-Tier Field Effort</span>
          </div>
        </div>
      )}

      {/* Active Table Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-gray-900">
                {selectedReportType === 'call_detail' && 'CALL DETAIL REPORT (21 Field Hierarchy Columns)'}
                {selectedReportType === 'doctor_coverage' && 'Doctor Call Coverage & POB Performance'}
                {selectedReportType === 'chemist_secondary' && 'Chemist Secondary Sales & Order Summary'}
                {selectedReportType === 'stockist_ledger' && `Stockist Stock & Sales Statement (${selectedMonth})`}
                {selectedReportType === 'dcr_compliance' && 'MTP Field Compliance & Activity Summary'}
                {selectedReportType === 'master_directory' && 'Company Master Address Book & GPS Registry'}
              </h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-3xs font-black rounded uppercase">
                Date Filter Active
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">
              Filtered Date Interval: <strong className="text-indigo-900">{startDate}</strong> to <strong className="text-indigo-900">{endDate}</strong> • Showing {filteredCallDetails.length} Doctors
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-3xs font-extrabold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <Download className="w-3 h-3" />
              Download {filteredCallDetails.length} Rows CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[580px]">
          {/* ========================================================================= */}
          {/* 1. CALL DETAIL REPORT (EXACT 21 COLUMNS)                                  */}
          {/* ========================================================================= */}
          {selectedReportType === 'call_detail' && (
            <table className="w-full text-left border-collapse text-2xs min-w-[1700px]">
              <thead className="bg-indigo-950 text-white uppercase tracking-wider sticky top-0 z-10 font-black">
                <tr>
                  <th className="p-2.5 border-b border-indigo-900 w-12 text-center">Sr No</th>
                  <th className="p-2.5 border-b border-indigo-900 min-w-[150px]">Doctor Name</th>
                  <th className="p-2.5 border-b border-indigo-900 min-w-[130px]">Speciality</th>
                  <th className="p-2.5 border-b border-indigo-900 min-w-[100px]">Qualification</th>
                  <th className="p-2.5 border-b border-indigo-900 min-w-[110px]">Contact</th>
                  <th className="p-2.5 border-b border-indigo-900 min-w-[180px]">Address</th>
                  <th className="p-2.5 border-b border-indigo-900 min-w-[100px]">Sub Area</th>
                  <th className="p-2.5 border-b border-indigo-900 min-w-[100px]">Area</th>
                  <th className="p-2.5 border-b border-indigo-900 min-w-[120px]">HQ</th>
                  
                  {/* MR Tier */}
                  <th className="p-2.5 border-b border-indigo-900 bg-blue-900/60 min-w-[120px]">MR Name</th>
                  <th className="p-2.5 border-b border-indigo-900 bg-blue-900/60 text-center min-w-[80px]">MR Visits</th>
                  <th className="p-2.5 border-b border-indigo-900 bg-blue-900/60 min-w-[160px]">MR Visit Dates</th>
                  
                  {/* AM Tier */}
                  <th className="p-2.5 border-b border-indigo-900 bg-indigo-900/60 min-w-[120px]">AM Name</th>
                  <th className="p-2.5 border-b border-indigo-900 bg-indigo-900/60 text-center min-w-[80px]">AM Visits</th>
                  <th className="p-2.5 border-b border-indigo-900 bg-indigo-900/60 min-w-[140px]">AM Visit Dates</th>
                  
                  {/* RM Tier */}
                  <th className="p-2.5 border-b border-indigo-900 bg-purple-900/60 min-w-[120px]">RM Name</th>
                  <th className="p-2.5 border-b border-indigo-900 bg-purple-900/60 text-center min-w-[80px]">RM Visits</th>
                  <th className="p-2.5 border-b border-indigo-900 bg-purple-900/60 min-w-[140px]">RM Visit Dates</th>
                  
                  {/* ZM Tier */}
                  <th className="p-2.5 border-b border-indigo-900 bg-emerald-900/60 min-w-[120px]">ZM Name</th>
                  <th className="p-2.5 border-b border-indigo-900 bg-emerald-900/60 text-center min-w-[80px]">ZM Visits</th>
                  <th className="p-2.5 border-b border-indigo-900 bg-emerald-900/60 min-w-[140px]">ZM Visit Dates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-semibold text-gray-900">
                {filteredCallDetails.map((row) => (
                  <tr key={row.id} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="p-2.5 text-center font-bold text-gray-500 bg-gray-50/50">{row.srNo}</td>
                    <td className="p-2.5 font-extrabold text-indigo-950 whitespace-nowrap">{row.doctorName}</td>
                    <td className="p-2.5 text-gray-700 whitespace-nowrap">{row.speciality}</td>
                    <td className="p-2.5 text-gray-600 whitespace-nowrap">{row.qualification}</td>
                    <td className="p-2.5 text-gray-600 font-mono text-3xs whitespace-nowrap">{row.contact}</td>
                    <td className="p-2.5 text-gray-700 text-3xs max-w-[200px] truncate" title={row.address}>{row.address}</td>
                    <td className="p-2.5 text-gray-600 whitespace-nowrap">{row.subarea}</td>
                    <td className="p-2.5 font-bold text-gray-800 whitespace-nowrap">{row.area}</td>
                    <td className="p-2.5 text-gray-600 text-3xs whitespace-nowrap">{row.hq}</td>
                    
                    {/* MR Info */}
                    <td className="p-2.5 font-bold text-blue-900 bg-blue-50/30 whitespace-nowrap">{row.mrName}</td>
                    <td className="p-2.5 text-center font-black text-blue-900 bg-blue-50/30">
                      <span className={`px-2 py-0.5 rounded-full ${row.mrVisitsCount > 0 ? 'bg-blue-100 text-blue-900' : 'text-gray-400'}`}>
                        {row.mrVisitsCount}
                      </span>
                    </td>
                    <td className="p-2.5 text-3xs font-mono text-blue-950 bg-blue-50/30 whitespace-nowrap">{row.mrVisitDates}</td>
                    
                    {/* AM Info */}
                    <td className="p-2.5 font-bold text-indigo-900 bg-indigo-50/30 whitespace-nowrap">{row.amName}</td>
                    <td className="p-2.5 text-center font-black text-indigo-900 bg-indigo-50/30">
                      <span className={`px-2 py-0.5 rounded-full ${row.amVisitsCount > 0 ? 'bg-indigo-100 text-indigo-900' : 'text-gray-400'}`}>
                        {row.amVisitsCount}
                      </span>
                    </td>
                    <td className="p-2.5 text-3xs font-mono text-indigo-950 bg-indigo-50/30 whitespace-nowrap">{row.amVisitDates}</td>
                    
                    {/* RM Info */}
                    <td className="p-2.5 font-bold text-purple-900 bg-purple-50/30 whitespace-nowrap">{row.rmName}</td>
                    <td className="p-2.5 text-center font-black text-purple-900 bg-purple-50/30">
                      <span className={`px-2 py-0.5 rounded-full ${row.rmVisitsCount > 0 ? 'bg-purple-100 text-purple-900' : 'text-gray-400'}`}>
                        {row.rmVisitsCount}
                      </span>
                    </td>
                    <td className="p-2.5 text-3xs font-mono text-purple-950 bg-purple-50/30 whitespace-nowrap">{row.rmVisitDates}</td>
                    
                    {/* ZM Info */}
                    <td className="p-2.5 font-bold text-emerald-900 bg-emerald-50/30 whitespace-nowrap">{row.zmName}</td>
                    <td className="p-2.5 text-center font-black text-emerald-900 bg-emerald-50/30">
                      <span className={`px-2 py-0.5 rounded-full ${row.zmVisitsCount > 0 ? 'bg-emerald-100 text-emerald-900' : 'text-gray-400'}`}>
                        {row.zmVisitsCount}
                      </span>
                    </td>
                    <td className="p-2.5 text-3xs font-mono text-emerald-950 bg-emerald-50/30 whitespace-nowrap">{row.zmVisitDates}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 2. DOCTOR COVERAGE REPORT */}
          {selectedReportType === 'doctor_coverage' && (
            <table className="w-full text-left border-collapse">
              <thead className="bg-indigo-950 text-white text-2xs uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Doctor Name</th>
                  <th className="p-3">Specialty</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Sub-Area</th>
                  <th className="p-3 text-center">Visits</th>
                  <th className="p-3 text-center">Target</th>
                  <th className="p-3 text-center">Coverage</th>
                  <th className="p-3 text-right">POB Booked</th>
                  <th className="p-3 text-center">Samples Given</th>
                  <th className="p-3 text-center">Last Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs font-semibold text-gray-900">
                {doctorReportData.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-gray-500 font-bold">{idx + 1}</td>
                    <td className="p-3 font-extrabold text-indigo-950">{row.name}</td>
                    <td className="p-3 text-gray-700">{row.specialty}</td>
                    <td className="p-3 font-bold text-gray-800">{row.area}</td>
                    <td className="p-3 text-gray-600">{row.subArea}</td>
                    <td className="p-3 text-center font-extrabold text-indigo-900">{row.visitsCount}</td>
                    <td className="p-3 text-center text-gray-500">{row.targetVisits}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-2xs font-extrabold ${row.coveragePct >= 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {row.coveragePct}%
                      </span>
                    </td>
                    <td className="p-3 text-right font-extrabold text-emerald-800">₹{row.pobBooked.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-center text-purple-900 font-bold">{row.samplesUnits} Units</td>
                    <td className="p-3 text-center text-gray-600">{row.lastVisitDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 3. CHEMIST SECONDARY SALES */}
          {selectedReportType === 'chemist_secondary' && (
            <table className="w-full text-left border-collapse">
              <thead className="bg-emerald-950 text-white text-2xs uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Chemist Name</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Sub-Area</th>
                  <th className="p-3">DL Number</th>
                  <th className="p-3">Mapped Stockist</th>
                  <th className="p-3 text-center">Orders</th>
                  <th className="p-3 text-right">POB Value</th>
                  <th className="p-3 text-center">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs font-semibold text-gray-900">
                {chemistReportData.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-gray-500 font-bold">{idx + 1}</td>
                    <td className="p-3 font-extrabold text-emerald-950">{row.name}</td>
                    <td className="p-3 text-gray-700">{row.contactPerson}</td>
                    <td className="p-3 font-bold text-gray-800">{row.area}</td>
                    <td className="p-3 text-gray-600">{row.subArea}</td>
                    <td className="p-3 text-gray-500 text-2xs">{row.dlNumber}</td>
                    <td className="p-3 font-bold text-indigo-900">{row.stockist}</td>
                    <td className="p-3 text-center font-bold text-purple-900">{row.ordersCount}</td>
                    <td className="p-3 text-right font-extrabold text-emerald-800">₹{row.pobValue.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-2xs font-extrabold bg-green-100 text-green-800">
                        {row.availabilityStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 4. STOCKIST LEDGER STATEMENT (SSS) */}
          {selectedReportType === 'stockist_ledger' && (
            <table className="w-full text-left border-collapse">
              <thead className="bg-amber-950 text-white text-2xs uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Stockist Agency</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Area / HQ</th>
                  <th className="p-3">DL No. / GSTIN</th>
                  <th className="p-3 text-right">Opening Value</th>
                  <th className="p-3 text-right">Purchase Value</th>
                  <th className="p-3 text-right">Secondary Sales</th>
                  <th className="p-3 text-right">Closing Stock</th>
                  <th className="p-3 text-right">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs font-semibold text-gray-900">
                {stockistReportData.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-gray-500 font-bold">{idx + 1}</td>
                    <td className="p-3 font-extrabold text-amber-950">{row.name}</td>
                    <td className="p-3 text-gray-700">{row.contactPerson}</td>
                    <td className="p-3 font-bold text-gray-800">{row.area} ({row.hq})</td>
                    <td className="p-3 text-2xs text-gray-500">{row.dlNumber}<br/>{row.gstNumber}</td>
                    <td className="p-3 text-right font-bold text-blue-900">₹{row.openingValue.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-bold text-emerald-900">₹{row.purchaseValue.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-bold text-purple-900">₹{row.saleValue.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-extrabold text-amber-950 bg-amber-50/50">₹{row.closingValue.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-extrabold text-red-900">{row.outstandingValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 5. DCR COMPLIANCE & ACTIVITY */}
          {selectedReportType === 'dcr_compliance' && (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-900 text-white text-2xs uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-3">Emp ID</th>
                  <th className="p-3">Employee Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Headquarter</th>
                  <th className="p-3 text-center">Days Worked</th>
                  <th className="p-3 text-center">Doctor Calls</th>
                  <th className="p-3 text-center">Chemist Calls</th>
                  <th className="p-3 text-right">POB Booked</th>
                  <th className="p-3 text-center">Compliance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs font-semibold text-gray-900">
                {dcrComplianceData.map((row) => (
                  <tr key={row.empId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-bold text-indigo-700">{row.empId}</td>
                    <td className="p-3 font-extrabold text-gray-900">{row.name}</td>
                    <td className="p-3 font-bold text-gray-600">{row.role}</td>
                    <td className="p-3 text-gray-800">{row.hq}</td>
                    <td className="p-3 text-center font-bold text-green-900">{row.daysWorked} / {row.totalDays} Days</td>
                    <td className="p-3 text-center font-bold text-blue-900">{row.docCallsDone} Calls</td>
                    <td className="p-3 text-center font-bold text-purple-900">{row.chemistCallsDone} Calls</td>
                    <td className="p-3 text-right font-extrabold text-emerald-800">₹{row.pobTotal.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-emerald-100 text-emerald-800">
                        {row.compliancePct}% Compliance
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 6. MASTER DIRECTORY */}
          {selectedReportType === 'master_directory' && (
            <table className="w-full text-left border-collapse">
              <thead className="bg-indigo-950 text-white text-2xs uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-3">Record Type</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Patch / Area</th>
                  <th className="p-3">Sub-Area / Landmark</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Specialty / Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs font-semibold text-gray-900">
                {doctors.slice(0, 10).map((d) => (
                  <tr key={`doc-${d.id}`} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-indigo-700">Doctor</td>
                    <td className="p-3 font-extrabold text-gray-900">{d.name}</td>
                    <td className="p-3 font-bold text-gray-800">{d.area}</td>
                    <td className="p-3 text-gray-600">{d.subArea}</td>
                    <td className="p-3 text-gray-700">{d.phone || 'N/A'}</td>
                    <td className="p-3 text-indigo-900 font-semibold">{d.specialty}</td>
                  </tr>
                ))}
                {chemists.slice(0, 10).map((c) => (
                  <tr key={`chem-${c.id}`} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-emerald-700">Chemist</td>
                    <td className="p-3 font-extrabold text-gray-900">{c.name}</td>
                    <td className="p-3 font-bold text-gray-800">{c.area}</td>
                    <td className="p-3 text-gray-600">{c.subArea}</td>
                    <td className="p-3 text-gray-700">{c.phone || 'N/A'}</td>
                    <td className="p-3 text-emerald-900 font-semibold">{c.contactPerson}</td>
                  </tr>
                ))}
                {stockists.map((s) => (
                  <tr key={`stk-${s.id}`} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-amber-800">Stockist</td>
                    <td className="p-3 font-extrabold text-gray-900">{s.name}</td>
                    <td className="p-3 font-bold text-gray-800">{s.area}</td>
                    <td className="p-3 text-gray-600">{s.hq}</td>
                    <td className="p-3 text-gray-700">{s.phone}</td>
                    <td className="p-3 text-amber-900 font-semibold">{s.contactPerson}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
