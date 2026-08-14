import React, { useState } from 'react';
import { Search, Plus, Edit2, Key, Shield, UserX, CheckCircle2, XCircle, Download, FileSpreadsheet, Filter } from 'lucide-react';
import { Modal } from '../components/Modal';

// Mock Data
const USERS = [
  { id: 'EMP-1001', name: 'Pradeep Mishra', role: 'Medical Representative (MR)', email: 'pradeep.m@raxon.com', phone: '+91 9876543210', hq: 'Lucknow HQ', status: 'Active', lastActive: '2 mins ago' },
  { id: 'EMP-1002', name: 'Rahul Sharma', role: 'Area Manager (AM)', email: 'rahul.s@raxon.com', phone: '+91 9876543211', hq: 'Lucknow HQ', status: 'Active', lastActive: '1 hour ago' },
  { id: 'EMP-1003', name: 'R.K. Tiwari', role: 'Regional Manager (RM)', email: 'rk.tiwari@raxon.com', phone: '+91 9876543212', hq: 'Uttar Pradesh East', status: 'Active', lastActive: '5 hours ago' },
  { id: 'EMP-1004', name: 'Sumit Verma', role: 'Medical Representative (MR)', email: 'sumit.v@raxon.com', phone: '+91 9876543213', hq: 'Kanpur HQ', status: 'Inactive', lastActive: '2 days ago' },
  { id: 'EMP-1005', name: 'Amit Singh', role: 'Medical Representative (MR)', email: 'amit.s@raxon.com', phone: '+91 9876543214', hq: 'Varanasi HQ', status: 'Active', lastActive: '10 mins ago' },
  { id: 'EMP-1006', name: 'System Admin', role: 'System Admin', email: 'admin@raxon.com', phone: '+91 9000000000', hq: 'Head Office', status: 'Active', lastActive: 'Just now' },
];

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredUsers = USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage employees, assign roles, and configure territory access.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-xs transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Employee
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="All">All Roles</option>
              <option value="System Admin">System Admin</option>
              <option value="RM">Regional Manager (RM)</option>
              <option value="AM">Area Manager (AM)</option>
              <option value="MR">Medical Representative (MR)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role & Assignment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                        {user.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.role}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{user.hq}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-start">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'Active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {user.status}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">Last active: {user.lastActive}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="Edit User">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-amber-600 transition-colors" title="Reset Password">
                        <Key className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600 transition-colors" title={user.status === 'Active' ? 'Deactivate' : 'Activate'}>
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Employee">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50" placeholder="EMP-1007" readOnly />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="employee@raxon.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input type="tel" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="+91" />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-1 text-indigo-600" /> Role & Access Assignment
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Role</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                  <option>Medical Representative (MR)</option>
                  <option>Area Manager (AM)</option>
                  <option>Regional Manager (RM)</option>
                  <option>System Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Organization Unit (Territory/HQ)</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                  <option>Select Territory...</option>
                  <optgroup label="Uttar Pradesh East">
                    <option>Lucknow HQ</option>
                    <option>Varanasi HQ</option>
                  </optgroup>
                  <optgroup label="Uttar Pradesh West">
                    <option>Kanpur HQ</option>
                  </optgroup>
                </select>
                <p className="text-xs text-gray-500 mt-1">The user will only have access to data within this assigned unit.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-4">
            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              Create User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
