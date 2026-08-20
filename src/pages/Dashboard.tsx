import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, getActiveUserForRole, normalizeRole } from '../data/userContext';
import { MRDashboard } from '../components/dashboards/MRDashboard';
import { AMDashboard } from '../components/dashboards/AMDashboard';
import { RMDashboard } from '../components/dashboards/RMDashboard';
import { ZMDashboard } from '../components/dashboards/ZMDashboard';
import SystemAdminDashboard from './SystemAdminDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';

interface DashboardProps {
  role?: UserRole;
  currentUser?: UserProfile | null;
}

export default function Dashboard({ role = 'MR', currentUser }: DashboardProps) {
  const [activeUser, setActiveUser] = useState<UserProfile>(() => currentUser || getActiveUserForRole(role));

  // Sync activeUser with currentUser prop
  useEffect(() => {
    if (currentUser) {
      setActiveUser(currentUser);
    } else {
      setActiveUser(getActiveUserForRole(role));
    }
  }, [role, currentUser]);

  // Listen to custom event if active user changes within same role
  useEffect(() => {
    const handleUserChanged = (e: any) => {
      if (e.detail) {
        setActiveUser(e.detail);
      }
    };
    window.addEventListener('raxon-active-user-changed', handleUserChanged);
    return () => window.removeEventListener('raxon-active-user-changed', handleUserChanged);
  }, []);

  const currentRole = currentUser ? normalizeRole(currentUser.role) : normalizeRole(role as any);

  if (currentRole === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  if (currentRole === 'ADMIN') {
    return <SystemAdminDashboard />;
  }

  if (currentRole === 'ZM') {
    return <ZMDashboard user={activeUser} />;
  }

  if (currentRole === 'RM') {
    return <RMDashboard user={activeUser} />;
  }

  if (currentRole === 'AM') {
    return <AMDashboard user={activeUser} />;
  }

  // Default: MR (Medical Representative)
  return <MRDashboard user={activeUser} onUserChange={setActiveUser} />;
}
