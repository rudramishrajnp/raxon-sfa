import React, { useState } from 'react';
import { Map, Plus, Search, Filter, Edit2, ChevronRight, CheckCircle2, XCircle, Download, FileSpreadsheet, File as FileIcon, FileText } from 'lucide-react';
import { Modal } from '../components/Modal';

// Mock Data
const DIVISIONS = [
  { id: 'DIV-01', name: 'General Medicine', head: 'Rajiv Sharma', regionsCount: 5, status: 'Active' },
  { id: 'DIV-02', name: 'Cardio-Diabetic', head: 'Dr. Anita Desai', regionsCount: 4, status: 'Active' },
  { id: 'DIV-03', name: 'Dermatology', head: 'Vikram Singh', regionsCount: 3, status: 'Active' },
];

const REGIONS = [
  { id: 'REG-01', name: 'Uttar Pradesh East', division: 'General Medicine', head: 'R.K. Tiwari (RM)', areasCount: 8, status: 'Active' },
  { id: 'REG-02', name: 'Uttar Pradesh West', division: 'General Medicine', head: 'Sanjay Verma (RM)', areasCount: 6, status: 'Active' },
  { id: 'REG-03', name: 'Bihar', division: 'General Medicine', head: 'Amit Kumar (RM)', areasCount: 7, status: 'Active' },
  { id: 'REG-04', name: 'Delhi NCR', division: 'Cardio-Diabetic', head: 'Neha Gupta (RM)', areasCount: 5, status: 'Active' },
];

const AREAS = [
  { id: 'HQ-01', name: 'Lucknow HQ', region: 'Uttar Pradesh East', head: 'Rahul Sharma (AM)', patchesCount: 12, status: 'Active' },
  { id: 'HQ-02', name: 'Varanasi HQ', region: 'Uttar Pradesh East', head: 'Anand Prakash (AM)', patchesCount: 10, status: 'Active' },
  { id: 'HQ-03', name: 'Gorakhpur HQ', region: 'Uttar Pradesh East', head: 'Vivek Singh (AM)', patchesCount: 8, status: 'Active' },
  { id: 'HQ-04', name: 'Kanpur HQ', region: 'Uttar Pradesh West', head: 'Priyanka Patel (AM)', patchesCount: 14, status: 'Active' },
];

const PATCHES = [
  { id: 'PT-01', name: 'Iltifatganj', area: 'Lucknow HQ', assignedMR: 'Pradeep Mishra', doctorsCount: 4, status: 'Active' },
  { id: 'PT-02', name: 'Akbarpur 1', area: 'Lucknow HQ', assignedMR: 'Pradeep Mishra', doctorsCount: 6, status: 'Active' },
  { id: 'PT-03', name: 'Shahzadpur', area: 'Lucknow HQ', assignedMR: 'Pradeep Mishra', doctorsCount: 4, status: 'Active' },
  { id: 'PT-04', name: 'Gomti Nagar', area: 'Lucknow HQ', assignedMR: 'Sumit Verma', doctorsCount: 12, status: 'Active' },
  { id: 'PT-05', name: 'Alambagh', area: 'Lucknow HQ', assignedMR: 'Amit Singh', doctorsCount: 9, status: 'Active' },
];

export default function OrganizationStructure() {
  const [activeTab, setActiveTab] = useState<'Divisions' | 'Regions' | 'Areas' | 'Patches'>('Areas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const tabs = ['Divisions', 'Regions', 'Areas', 'Patches'];

  const handleExport = (format: string) => {
    setIsExportMenuOpen(false);
    
    if (format === 'excel' || format === 'csv') {
      const headers = getTableHeaders().filter(h => h !== 'Actions').join(',');
      const rows = data.map((row: any) => {
        // Exclude the last two elements roughly to match headers
        return Object.values(row).map(val => `"${val}"`).join(',');
      }).join('\n');
      
      const csvContent = `${headers}\n${rows}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Organization_${activeTab}_Data.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Exporting to ${format.toUpperCase()} is currently simulated in this preview environment. Use Excel (CSV) for actual data download.`);
    }
  };

  const getTableHeaders = () => {
    switch (activeTab) {
      case 'Divisions': return ['Division Code', 'Division Name', 'Division Head', 'Total Regions', 'Status', 'Actions'];
      case 'Regions': return ['Region Code', 'Region Name', 'Parent Division', 'Regional Manager', 'Total HQs', 'Status', 'Actions'];
      case 'Areas': return ['Area / HQ Code', 'HQ Name', 'Parent Region', 'Area Manager', 'Total Patches', 'Status', 'Actions'];
      case 'Patches': return ['Patch Code', 'Patch Name', 'Parent HQ', 'Assigned MR', 'Doctors Count', 'Status', 'Actions'];
      default: return [];
    }
  };

  const getTableData = () => {
    switch (activeTab) {
      case 'Divisions': return DIVISIONS;
      case 'Regions': return REGIONS;
      case 'Areas': return AREAS;
      case 'Patches': return PATCHES;
      default: return [];
    }
  };

  const data = getTableData().filter((item: any) => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Structure</h1>
          <p className="text-gray-500 text-sm mt-1">Manage Divisions, Regions, Area HQs, and Patches hierarchy.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {activeTab === 'Areas' ? 'Area/HQ' : activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto relative">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-2xs w-full sm:w-auto justify-center">
              <Filter className="w-4 h-4 mr-2 text-gray-500" /> Filters
            </button>
            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-2xs w-full sm:w-auto justify-center"
              >
                <Download className="w-4 h-4 mr-2 text-gray-500" /> Export
              </button>
              
              {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                  <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center transition-colors">
                    <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" /> Excel (CSV)
                  </button>
                  <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center transition-colors">
                    <FileIcon className="w-4 h-4 mr-2 text-red-500" /> PDF Document
                  </button>
                  <button onClick={() => handleExport('word')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center transition-colors">
                    <FileText className="w-4 h-4 mr-2 text-blue-600" /> Word Document
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {getTableHeaders().map((header, idx) => (
                  <th 
                    key={idx} 
                    className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${header === 'Actions' ? 'text-right' : ''}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row: any, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600 cursor-pointer hover:underline">
                    {row.name}
                  </td>
                  
                  {/* Dynamic Columns based on Tab */}
                  {activeTab === 'Divisions' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.head}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{row.regionsCount} Regions</td>
                    </>
                  )}
                  {activeTab === 'Regions' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.division}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.head}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{row.areasCount} HQs</td>
                    </>
                  )}
                  {activeTab === 'Areas' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.head}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{row.patchesCount} Patches</td>
                    </>
                  )}
                  {activeTab === 'Patches' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.area}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.assignedMR}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{row.doctorsCount} Doctors</td>
                    </>
                  )}

                  {/* Common Status and Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {row.status === 'Active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors mr-3">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={`Add New ${activeTab === 'Areas' ? 'Area/HQ' : activeTab.slice(0, -1)}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder={`Enter ${activeTab.slice(0, -1)} Name`} />
          </div>
          
          {activeTab !== 'Divisions' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Entity</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                <option>Select Parent...</option>
                {/* Options would be dynamic based on the active tab */}
                <option>General Medicine (Division)</option>
                <option>Cardio-Diabetic (Division)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Head / Manager (Optional)</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
              <option>Select Employee...</option>
              <option>Pradeep Mishra</option>
              <option>Rahul Sharma</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              Save {activeTab.slice(0, -1)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
