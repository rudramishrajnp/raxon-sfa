import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import DoctorDirectory from './pages/DoctorDirectory';
import ChemistDirectory from './pages/ChemistDirectory';
import Mtp from './pages/Mtp';
import Dcr from './pages/Dcr';
import Approvals from './pages/Approvals';
import Tracking from './pages/Tracking';
import SystemAdminDashboard from './pages/SystemAdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import OrganizationStructure from './pages/OrganizationStructure';
import UserManagement from './pages/UserManagement';

export default function App() {
  // Simulating a state to toggle roles easily
  const [role, setRole] = useState<'MR' | 'Manager' | 'System Admin' | 'Super Admin'>('MR');

  return (
    <Router>
      <div className="fixed top-0 right-0 z-50 p-2 bg-black/80 text-white text-xs rounded-bl-lg flex items-center space-x-2 flex-wrap gap-y-2 max-w-full">
        <span className="shrink-0">Test Role:</span>
        <button onClick={() => setRole('MR')} className={`px-2 py-1 rounded ${role === 'MR' ? 'bg-indigo-500' : 'bg-gray-600'}`}>MR</button>
        <button onClick={() => setRole('Manager')} className={`px-2 py-1 rounded ${role === 'Manager' ? 'bg-indigo-500' : 'bg-gray-600'}`}>Manager</button>
        <button onClick={() => setRole('System Admin')} className={`px-2 py-1 rounded ${role === 'System Admin' ? 'bg-indigo-500' : 'bg-gray-600'}`}>System Admin</button>
        <button onClick={() => setRole('Super Admin')} className={`px-2 py-1 rounded ${role === 'Super Admin' ? 'bg-indigo-500' : 'bg-gray-600'}`}>Super Admin</button>
      </div>
      
      <Layout userRole={role}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mtp" element={<Mtp />} />
          <Route path="/dcr" element={<Dcr />} />
          <Route path="/doctors" element={<DoctorDirectory />} />
          <Route path="/chemists" element={<ChemistDirectory />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/tracking" element={<Tracking />} />
          {/* Admin Routes */}
          <Route path="/sys-admin" element={<SystemAdminDashboard />} />
          <Route path="/sys-admin/org" element={<OrganizationStructure />} />
          <Route path="/sys-admin/users" element={<UserManagement />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          {/* Fallback route */}
          <Route path="*" element={
            role === 'Super Admin' ? <SuperAdminDashboard /> : 
            role === 'System Admin' ? <SystemAdminDashboard /> : 
            <Dashboard />
          } />
        </Routes>
      </Layout>
    </Router>
  );
}
