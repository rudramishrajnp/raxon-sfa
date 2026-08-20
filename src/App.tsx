import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import DoctorDirectory from './pages/DoctorDirectory';
import ChemistDirectory from './pages/ChemistDirectory';
import ProductList from './pages/ProductList';
import StockistDirectory from './pages/StockistDirectory';
import Mtp from './pages/Mtp';
import Dcr from './pages/Dcr';
import Approvals from './pages/Approvals';
import Tracking from './pages/Tracking';
import PlatformSuperAdminDashboard from './pages/PlatformSuperAdminDashboard';
import CompanyAdminDashboard from './pages/CompanyAdminDashboard';
import OrganizationStructure from './pages/OrganizationStructure';
import UserManagement from './pages/UserManagement';
import PharmaMasters from './pages/PharmaMasters';
import ReportsAndExports from './pages/ReportsAndExports';
import TerritoryManagement from './pages/TerritoryManagement';
import TargetManagement from './pages/TargetManagement';
import SampleInventory from './pages/SampleInventory';
import ExpensePolicyMaster from './pages/ExpensePolicyMaster';
import RcpaAudit from './pages/RcpaAudit';
import BroadcastNotice from './pages/BroadcastNotice';
import AuditLogs from './pages/AuditLogs';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { getActiveCompanyId, setActiveCompanyId, initCompanyFirestoreSync } from './data/companyContext';
import { UserRole, UserProfile, normalizeRole, getStoredUserProfiles, saveStoredUserProfiles, syncProfilesFromFirestore, initUserProfilesFirestoreSync, setActiveUserById } from './data/userContext';
import { initMasterDataFirestoreSync } from './data/masterData';
import { initHeadquartersFirestoreSync } from './data/hqMrMapping';
import { initSampleInventoryFirestoreSync } from './data/sampleInventory';
import { initApiFirestoreSync } from './lib/api';
import { setActiveUserContext } from './data/permissionSettings';
import { supabase } from './supabaseClient';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthInitializing, setIsAuthInitializing] = useState<boolean>(true);
  const [companyKey, setCompanyKey] = useState(() => getActiveCompanyId());
  const isMountedRef = useRef(true);

  // Authoritative Session Verification & Supabase Auth Lifecycle
  useEffect(() => {
    isMountedRef.current = true;

    // Initialize real-time data sync bridges
    initCompanyFirestoreSync();
    initUserProfilesFirestoreSync();
    initMasterDataFirestoreSync();
    initHeadquartersFirestoreSync();
    initSampleInventoryFirestoreSync();
    initApiFirestoreSync();

    async function verifyAuthoritativeSession() {
      try {
        const { data: { session }, error: sessionErr } = await supabase.auth.getSession();

        if (sessionErr || !session || !session.user) {
          if (isMountedRef.current) {
            setCurrentUser(null);
            setIsAuthInitializing(false);
          }
          return;
        }

        const authUser = session.user;
        const authUid = authUser.id;
        const authEmail = authUser.email?.toLowerCase() || '';

        // Query authoritative profile from Supabase user_profiles table
        let userProfile: UserProfile | null = null;
        try {
          const { data: cloudProfile } = await supabase
            .from('user_profiles')
            .select('*')
            .or(`id.eq.${authUid},email.ilike.${authEmail}`)
            .maybeSingle();

          if (cloudProfile) {
            const rawData = cloudProfile.data || {};
            userProfile = {
              id: cloudProfile.id,
              name: cloudProfile.name || rawData.name || authUser.user_metadata?.name || 'User',
              role: (cloudProfile.role || rawData.role || authUser.user_metadata?.role || 'MR') as UserRole,
              roleTitle: rawData.roleTitle || cloudProfile.role || 'Sales Representative',
              email: cloudProfile.email || authEmail,
              phone: cloudProfile.phone || rawData.phone || '',
              companyId: cloudProfile.company_id || rawData.companyId || authUser.user_metadata?.company_id || '',
              companyName: rawData.companyName || '',
              divisionId: cloudProfile.division_id || rawData.divisionId || '',
              divisionName: rawData.divisionName || '',
              hq: rawData.hq || 'Headquarters',
              territory: rawData.territory || 'Assigned Territory',
              initials: rawData.initials || (cloudProfile.name ? cloudProfile.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'U'),
              avatarBg: rawData.avatarBg || 'bg-indigo-900',
              status: cloudProfile.status || rawData.status || 'Active',
              metrics: rawData.metrics || {}
            };
          }
        } catch (dbErr) {
          console.warn('[Zero-Trust Auth] user_profiles query notice:', dbErr);
        }

        // Fallback to cached profile if Supabase query failed but valid session is confirmed
        if (!userProfile) {
          const localProfiles = getStoredUserProfiles();
          const matched = localProfiles.find(p => p.id === authUid || (p.email && p.email.toLowerCase() === authEmail));
          if (matched) {
            userProfile = matched;
          }
        }

        if (userProfile && userProfile.status === 'Active' && isMountedRef.current) {
          if (userProfile.companyId) {
            setActiveCompanyId(userProfile.companyId);
            setCompanyKey(userProfile.companyId);
          }
          setActiveUserContext({
            id: userProfile.id,
            name: userProfile.name,
            role: userProfile.roleTitle || userProfile.role,
            hq: userProfile.hq || 'Corporate Office'
          });
          setCurrentUser(userProfile);
        } else if (isMountedRef.current) {
          // Inactive or missing profile fails closed
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('[Zero-Trust Auth] Session verification error:', err);
        if (isMountedRef.current) {
          setCurrentUser(null);
        }
      } finally {
        if (isMountedRef.current) {
          setIsAuthInitializing(false);
        }
      }
    }

    verifyAuthoritativeSession();

    // 2. Real-time Supabase Auth state subscriber
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (isMountedRef.current) {
          setCurrentUser(null);
          localStorage.removeItem('raxon_current_active_user_id');
          localStorage.setItem('raxon_user_logged_out', 'true');
        }
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session.user && isMountedRef.current && !currentUser) {
          verifyAuthoritativeSession();
        }
      }
    });

    const handleCompanySwitched = (e: any) => {
      setCompanyKey(e?.detail?.companyId || getActiveCompanyId());
    };
    window.addEventListener('raxon-company-switched', handleCompanySwitched);

    return () => {
      isMountedRef.current = false;
      subscription?.unsubscribe();
      window.removeEventListener('raxon-company-switched', handleCompanySwitched);
    };
  }, []);

  const handleLogin = (user: UserProfile) => {
    localStorage.removeItem('raxon_user_logged_out');
    localStorage.setItem('raxon_current_active_user_id', user.id);
    
    // Cache profile for offline continuity
    const profiles = getStoredUserProfiles();
    const exists = profiles.find(p => p.id === user.id);
    if (!exists) {
      saveStoredUserProfiles([user, ...profiles]);
    }
    
    if (user.companyId) {
      setActiveCompanyId(user.companyId);
    }

    setActiveUserContext({
      id: user.id,
      name: user.name,
      role: user.roleTitle || user.role,
      hq: user.hq || 'Corporate Office'
    });
    
    setCurrentUser(user);
    setCompanyKey(user.companyId || getActiveCompanyId());
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut notice:', err);
    }
    localStorage.setItem('raxon_user_logged_out', 'true');
    localStorage.removeItem('raxon_current_active_user_id');
    setCurrentUser(null);
  };

  // 1. Explicit Authentication Initialization Gate
  if (isAuthInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-10 h-10 text-indigo-400 animate-pulse" />
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white">RAXON SFA</h1>
            <p className="text-xs text-slate-400 font-mono">Zero-Trust Security Verification</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Verifying authoritative session...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Gate
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const role = currentUser.role;
  const normalized = normalizeRole(role);

  return (
    <Router>
      <Layout key={`${companyKey}_${currentUser.id}`} userRole={role} currentUser={currentUser} onLogout={handleLogout}>
        <Routes>
          {/* Main Field / Dashboard */}
          <Route path="/" element={
            normalized === 'SUPER_ADMIN' ? <PlatformSuperAdminDashboard /> :
            normalized === 'ADMIN' ? <CompanyAdminDashboard /> :
            <Dashboard role={role as any} currentUser={currentUser} />
          } />
          
          {/* Operational Field Routes (MR, AM, RM, ZM, ADMIN, SUPER_ADMIN) */}
          <Route path="/mtp" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM', 'MR']}>
              <Mtp role={role as any} />
            </ProtectedRoute>
          } />
          <Route path="/dcr" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM', 'MR']}>
              <Dcr />
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM', 'MR']}>
              <ProductList />
            </ProtectedRoute>
          } />
          <Route path="/stockists" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM', 'MR']}>
              <StockistDirectory />
            </ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM', 'MR']}>
              <DoctorDirectory />
            </ProtectedRoute>
          } />
          <Route path="/chemists" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM', 'MR']}>
              <ChemistDirectory />
            </ProtectedRoute>
          } />
          <Route path="/approvals" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM']}>
              <Approvals />
            </ProtectedRoute>
          } />
          <Route path="/tracking" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM']}>
              <Tracking />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM', 'MR']}>
              <ReportsAndExports />
            </ProtectedRoute>
          } />
          <Route path="/territories" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM']}>
              <TerritoryManagement />
            </ProtectedRoute>
          } />
          <Route path="/targets" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM']}>
              <TargetManagement />
            </ProtectedRoute>
          } />
          <Route path="/samples" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM', 'MR']}>
              <SampleInventory />
            </ProtectedRoute>
          } />
          <Route path="/expense-policy" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM']}>
              <ExpensePolicyMaster />
            </ProtectedRoute>
          } />
          <Route path="/rcpa" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM', 'MR']}>
              <RcpaAudit />
            </ProtectedRoute>
          } />
          <Route path="/broadcast" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ZM', 'RM', 'AM', 'MR']}>
              <BroadcastNotice />
            </ProtectedRoute>
          } />
          <Route path="/audit-logs" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AuditLogs />
            </ProtectedRoute>
          } />
          
          {/* SaaS Super Admin Route (Strictly SUPER_ADMIN) */}
          <Route path="/super-admin" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN']} requiredCompany={false}>
              <PlatformSuperAdminDashboard />
            </ProtectedRoute>
          } />

          {/* Company Admin & Organization Management Routes */}
          <Route path="/company-admin" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <CompanyAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/sys-admin" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <CompanyAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/sys-admin/org" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <OrganizationStructure />
            </ProtectedRoute>
          } />
          <Route path="/sys-admin/users" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/sys-admin/masters" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <PharmaMasters />
            </ProtectedRoute>
          } />
          <Route path="/sys-admin/reports" element={
            <ProtectedRoute currentUser={currentUser} allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <ReportsAndExports />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={
            normalized === 'SUPER_ADMIN' ? <PlatformSuperAdminDashboard /> : 
            normalized === 'ADMIN' ? <CompanyAdminDashboard /> : 
            <Dashboard role={role as any} currentUser={currentUser} />
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

