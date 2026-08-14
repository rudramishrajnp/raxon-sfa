import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import DoctorDirectory from './pages/DoctorDirectory';
import ChemistDirectory from './pages/ChemistDirectory';
import Mtp from './pages/Mtp';
import Dcr from './pages/Dcr';
import Approvals from './pages/Approvals';

export default function App() {
  // Simulating a state to toggle roles easily
  const [role, setRole] = useState<'MR' | 'Manager'>('MR');

  return (
    <Router>
      <div className="fixed top-0 right-0 z-50 p-2 bg-black/80 text-white text-xs rounded-bl-lg flex items-center space-x-2">
        <span>Test Role:</span>
        <button onClick={() => setRole('MR')} className={`px-2 py-1 rounded ${role === 'MR' ? 'bg-indigo-500' : 'bg-gray-600'}`}>MR</button>
        <button onClick={() => setRole('Manager')} className={`px-2 py-1 rounded ${role === 'Manager' ? 'bg-indigo-500' : 'bg-gray-600'}`}>Manager</button>
      </div>
      
      <Layout userRole={role}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mtp" element={<Mtp />} />
          <Route path="/dcr" element={<Dcr />} />
          <Route path="/doctors" element={<DoctorDirectory />} />
          <Route path="/chemists" element={<ChemistDirectory />} />
          <Route path="/approvals" element={<Approvals />} />
          {/* Fallback route */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}
