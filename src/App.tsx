import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import DoctorDirectory from './pages/DoctorDirectory';
import ChemistDirectory from './pages/ChemistDirectory';
import Mtp from './pages/Mtp';
import Dcr from './pages/Dcr';

export default function App() {
  return (
    <Router>
      <Layout userRole="MR">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mtp" element={<Mtp />} />
          <Route path="/dcr" element={<Dcr />} />
          <Route path="/doctors" element={<DoctorDirectory />} />
          <Route path="/chemists" element={<ChemistDirectory />} />
          {/* Fallback route */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}
