import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, Users, Map, Calendar, Settings, LogOut, Navigation, Pill, Building2, Shield, FileSpreadsheet, Activity, CheckSquare,
  Wifi, WifiOff, RefreshCw, Database, CheckCircle2, ShieldCheck, HardDrive, Sliders, Key, Layers, Stethoscope, ShoppingBag, Eye,
  ChevronDown, MapPin, Target, Package, CreditCard, FileCheck, Bell
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { 
  getActiveCompany, 
  getStoredCompanies, 
  setActiveCompanyId, 
  getActiveDivisionId, 
  setActiveDivisionId,
  Company 
} from '../data/companyContext';
import { useOfflineSync } from './OfflineSyncStatusBar';
import { OfflineQueueModal } from './OfflineQueueModal';
import { UserRole, UserProfile, getActiveUserForRole, normalizeRole } from '../data/userContext';
import { RaxonIcon } from './RaxonLogo';
import UserProfileModal from './UserProfileModal';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: UserRole | string;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
}

export function Layout({ children, userRole = 'MR', currentUser, onLogout }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showGlobalQueueModal, setShowGlobalQueueModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(() => currentUser || getActiveUserForRole(userRole as UserRole));
  const [company, setCompany] = useState<Company>(() => getActiveCompany());
  const [allCompanies, setAllCompanies] = useState<Company[]>(() => getStoredCompanies());
  const [activeDivisionId, setActiveDivId] = useState<string>(() => getActiveDivisionId());

  const location = useLocation();
  const normalized = normalizeRole(userRole);

  const userCompany = allCompanies.find(c => c.id === currentProfile.companyId) || company;
  const isImageLogo = userCompany.logo && (userCompany.logo.startsWith('data:image') || userCompany.logo.startsWith('http') || userCompany.logo.startsWith('/'));

  useEffect(() => {
    if (currentUser) {
      setCurrentProfile(currentUser);
      if (currentUser.companyId) {
        setCompany(getActiveCompany());
      }
    } else {
      setCurrentProfile(getActiveUserForRole(userRole as UserRole));
    }
  }, [currentUser, userRole]);

  useEffect(() => {
    const handleUserChanged = (e: any) => {
      if (e.detail) {
        // Only update header profile if no currentUser is passed, or if the update specifically matches currentUser id
        if (!currentUser || (currentUser && e.detail.id === currentUser.id)) {
          setCurrentProfile(e.detail);
        }
      }
    };
    const handleCompanySwitched = () => {
      setCompany(getActiveCompany());
      setAllCompanies(getStoredCompanies());
      setActiveDivId(getActiveDivisionId());
    };
    
    window.addEventListener('raxon-active-user-changed', handleUserChanged);
    window.addEventListener('raxon-company-switched', handleCompanySwitched);
    window.addEventListener('raxon-company-updated', handleCompanySwitched);
    window.addEventListener('raxon-division-switched', handleCompanySwitched);
    
    return () => {
      window.removeEventListener('raxon-active-user-changed', handleUserChanged);
      window.removeEventListener('raxon-company-switched', handleCompanySwitched);
      window.removeEventListener('raxon-company-updated', handleCompanySwitched);
      window.removeEventListener('raxon-division-switched', handleCompanySwitched);
    };
  }, [currentUser]);

  const { 
    isOnline, 
    isSyncing, 
    queue, 
    pendingCount, 
    auditLogs, 
    refreshQueue, 
    triggerSync, 
    syncToast,
    lastSyncTime 
  } = useOfflineSync();

  // Construct Role-Specific Isolated Navigations
  let navigation: { name: string; href: string; icon: any; badge?: string }[] = [];

  if (normalized === 'SUPER_ADMIN') {
    navigation = [
      { name: 'Platform Master Hub', href: '/super-admin', icon: Shield, badge: 'MASTER' },
      { name: 'Company Admin Control', href: '/super-admin', icon: Key },
      { name: 'Field Force & Territory', href: '/territories', icon: Users },
      { name: 'Target & Incentive Master', href: '/targets', icon: Target },
      { name: 'Sample & Input Inventory', href: '/samples', icon: Package },
      { name: 'TA / DA Expense Policy', href: '/expense-policy', icon: CreditCard },
      { name: 'RCPA Competitor Audit', href: '/rcpa', icon: FileCheck },
      { name: 'Broadcast & Circulars', href: '/broadcast', icon: Bell },
      { name: 'Subscription Quotas', href: '/super-admin', icon: Sliders },
      { name: 'System Security & Audit', href: '/audit-logs', icon: HardDrive },
      { name: 'Product Catalog', href: '/products', icon: Pill },
      { name: 'Stockist Network', href: '/stockists', icon: Building2 },
      { name: 'Doctor Database', href: '/doctors', icon: Stethoscope },
      { name: 'Review Reports', href: '/sys-admin/reports', icon: FileSpreadsheet },
    ];
  } else if (normalized === 'ADMIN') {
    navigation = [
      { name: 'Admin Hub', href: '/company-admin', icon: Building2, badge: company.code },
      { name: 'Divisions', href: '/company-admin', icon: Layers },
      { name: 'Field Force & Territory', href: '/territories', icon: Users },
      { name: 'Target & Incentive Master', href: '/targets', icon: Target },
      { name: 'Sample & Input Inventory', href: '/samples', icon: Package },
      { name: 'TA / DA Expense Master', href: '/expense-policy', icon: CreditCard },
      { name: 'RCPA Competitor Audit', href: '/rcpa', icon: FileCheck },
      { name: 'Broadcast & Circulars', href: '/broadcast', icon: Bell },
      { name: 'Company Master Controls', href: '/sys-admin/masters', icon: Calendar },
      { name: 'Product Catalog & Schemes', href: '/products', icon: Pill },
      { name: 'Doctor Master Directory', href: '/doctors', icon: Stethoscope },
      { name: 'Stockist & Outstanding', href: '/stockists', icon: Building2 },
      ...(company.featureSwitches.featureChemistPob ? [{ name: 'Chemist & POB Network', href: '/chemists', icon: ShoppingBag }] : []),
      ...(company.featureSwitches.featureGpsTracking ? [{ name: 'Field GPS Live Tracking', href: '/tracking', icon: Navigation }] : []),
      { name: 'MTP & Tour Approvals', href: '/approvals', icon: CheckSquare },
      { name: 'Security & Audit Logs', href: '/audit-logs', icon: HardDrive },
      { name: 'Reports & Export Center', href: '/sys-admin/reports', icon: FileSpreadsheet },
    ];
  } else if (normalized === 'ZM') {
    navigation = [
      { name: 'ZM Field Dashboard', href: '/', icon: Home, badge: 'ZM' },
      { name: 'Division Field Force', href: '/sys-admin/users', icon: Users },
      { name: 'Territory Management', href: '/territories', icon: MapPin },
      { name: 'Target vs Achievement', href: '/targets', icon: Target },
      { name: 'Sample Allotment Stock', href: '/samples', icon: Package },
      { name: 'TA / DA Expense Claims', href: '/expense-policy', icon: CreditCard },
      { name: 'RCPA Market Audit', href: '/rcpa', icon: FileCheck },
      { name: 'Broadcast & Circulars', href: '/broadcast', icon: Bell },
      { name: 'Division Products', href: '/products', icon: Pill },
      { name: 'Division Doctors', href: '/doctors', icon: Stethoscope },
      { name: 'Stockists & Chemists', href: '/stockists', icon: Building2 },
      ...(company.featureSwitches.featureGpsTracking ? [{ name: 'Live Team Tracking', href: '/tracking', icon: Navigation }] : []),
      { name: 'Division MTP Approvals', href: '/approvals', icon: CheckSquare },
      { name: 'Division Sales Reports', href: '/reports', icon: FileSpreadsheet },
    ];
  } else if (normalized === 'RM' || normalized === 'AM') {
    navigation = [
      { name: `${normalized === 'RM' ? 'RM' : 'AM'} Territory Dashboard`, href: '/', icon: Home },
      { name: 'Territory Management', href: '/territories', icon: MapPin },
      { name: 'Target vs Achievement', href: '/targets', icon: Target },
      { name: 'Sample & Gift Inventory', href: '/samples', icon: Package },
      { name: 'TA / DA Expense Claims', href: '/expense-policy', icon: CreditCard },
      { name: 'RCPA Doctor Audit', href: '/rcpa', icon: FileCheck },
      { name: 'Broadcast Notices', href: '/broadcast', icon: Bell },
      ...(company.featureSwitches.featureGpsTracking ? [{ name: 'Team Field Tracking', href: '/tracking', icon: Navigation }] : []),
      { name: 'Team MTP & DCR Approvals', href: '/approvals', icon: CheckSquare },
      { name: 'Territory Review Reports', href: '/reports', icon: FileSpreadsheet },
      { name: 'Products & Schemes', href: '/products', icon: Pill },
      { name: 'Stockist Directory', href: '/stockists', icon: Building2 },
      { name: 'Doctor Directory', href: '/doctors', icon: Stethoscope },
      ...(company.featureSwitches.featureChemistPob ? [{ name: 'Chemist Directory', href: '/chemists', icon: ShoppingBag }] : []),
      { name: 'My Tour Plan (MTP)', href: '/mtp', icon: Calendar },
      { name: 'My Daily Call (DCR)', href: '/dcr', icon: Map },
    ];
  } else {
    // MR (Medical Representative)
    navigation = [
      { name: 'MR Field Calling Dashboard', href: '/', icon: Home },
      { name: 'Monthly Tour Plan (MTP)', href: '/mtp', icon: Calendar },
      { name: 'Daily Call Report (DCR)', href: '/dcr', icon: Map },
      { name: 'My Targets & Incentive', href: '/targets', icon: Target },
      { name: 'My Sample Stock Bag', href: '/samples', icon: Package },
      { name: 'My Daily TA / DA Claims', href: '/expense-policy', icon: CreditCard },
      { name: 'RCPA Chemist Audit', href: '/rcpa', icon: FileCheck },
      { name: 'Company Circulars', href: '/broadcast', icon: Bell },
      { name: 'Products & Schemes', href: '/products', icon: Pill },
      { name: 'Doctor Directory', href: '/doctors', icon: Stethoscope },
      { name: 'Stockist Directory', href: '/stockists', icon: Building2 },
      ...(company.featureSwitches.featureChemistPob ? [{ name: 'Chemist Directory & POB', href: '/chemists', icon: ShoppingBag }] : []),
      { name: 'Review Reports', href: '/reports', icon: FileSpreadsheet },
    ];
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 ${normalized === 'SUPER_ADMIN' ? 'bg-purple-950 text-white' : normalized === 'ADMIN' ? 'bg-indigo-950 text-white' : 'bg-slate-900 text-white'} transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)]
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className={`flex items-center justify-between h-16 px-4 border-b shrink-0 ${normalized === 'SUPER_ADMIN' ? 'bg-purple-900/60 border-purple-800/60' : 'bg-indigo-900/40 border-indigo-800/40'}`}>
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0 border border-amber-400/50 shadow-md">
              {normalized === 'SUPER_ADMIN' ? (
                <RaxonIcon className="w-full h-full" />
              ) : isImageLogo ? (
                <img src={userCompany.logo} alt={userCompany.name} className="w-full h-full object-contain bg-white p-0.5" />
              ) : (
                <span className="text-xs font-black text-amber-500">{userCompany.logo || userCompany.name?.[0] || 'C'}</span>
              )}
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1 leading-none truncate">
                <span className="text-sm font-black tracking-tight text-white truncate max-w-[130px]" title={normalized === 'SUPER_ADMIN' ? 'Platform Admin' : userCompany.name}>
                  {normalized === 'SUPER_ADMIN' ? 'Platform Admin' : userCompany.name}
                </span>
              </div>
              <span className="text-3xs text-indigo-200 font-bold truncate block mt-0.5">
                {normalized === 'SUPER_ADMIN' ? 'Super Administrator' : (currentProfile.roleTitle || currentProfile.role)}
              </span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-300 hover:text-white p-1 rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Tenant Indicator Badge */}
        {normalized !== 'SUPER_ADMIN' && (
          <div className="px-3.5 py-2.5 bg-black/20 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded bg-white/10 overflow-hidden flex items-center justify-center shrink-0 border border-white/20">
                {isImageLogo ? (
                  <img src={userCompany.logo} alt={userCompany.name} className="w-full h-full object-contain bg-white p-0.5" />
                ) : (
                  <span className="text-2xs font-black text-amber-400">{userCompany.logo || userCompany.name?.[0] || 'C'}</span>
                )}
              </div>
              <div className="truncate">
                <div className="text-4xs uppercase tracking-widest text-indigo-300 font-extrabold">Active Company</div>
                <div className="text-xs font-black text-white truncate flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  {userCompany.name}
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-3xs font-black shrink-0">
              {userCompany.code}
            </span>
          </div>
        )}
        
        <div className="flex flex-col flex-1 overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    group flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-xl transition-all
                    ${isActive 
                      ? (normalized === 'SUPER_ADMIN' ? 'bg-purple-700 text-white shadow-sm font-extrabold' : 'bg-indigo-700 text-white shadow-sm font-extrabold')
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <item.icon className={`mr-3 flex-shrink-0 h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-4xs font-black rounded bg-black/30 text-emerald-300 uppercase">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-white/10 bg-black/20 shrink-0">
            <button
              onClick={() => {
                if (onLogout) onLogout();
                window.location.href = '/';
              }}
              className="flex items-center w-full px-3 py-2.5 text-xs font-bold text-gray-300 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="mr-3 h-4 w-4 text-gray-400" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 flex-shrink-0 bg-white border-b border-gray-200 shadow-2xs pt-[env(safe-area-inset-top,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">
          <div className="flex h-16 items-center">
            <button
              className="h-16 px-4 border-r border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden flex items-center justify-center cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={24} />
            </button>
            <div className="flex-1 px-3 sm:px-5 flex justify-between items-center gap-2">
              <div className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-2 truncate">
                <RaxonIcon className="w-7 h-7 lg:hidden shrink-0 rounded-full shadow-xs" />
                <span className="truncate">{navigation.find(n => n.href === location.pathname)?.name || 'RAXON Pharma SFA'}</span>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Tenant Switcher when in Super Admin */}
                {normalized === 'SUPER_ADMIN' && (
                  <div className="hidden md:flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 text-xs">
                    <Eye className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                    <span className="font-bold text-purple-900 text-3xs uppercase">Inspect Tenant:</span>
                    <select
                      value={company.id}
                      onChange={(e) => {
                        setActiveCompanyId(e.target.value);
                        setCompany(getActiveCompany());
                      }}
                      className="bg-transparent font-extrabold text-purple-950 focus:outline-none text-xs cursor-pointer"
                    >
                      {allCompanies.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Offline / Cloud Status indicator */}
                <button
                  onClick={() => setShowGlobalQueueModal(true)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
                    !isOnline 
                      ? 'bg-amber-100 text-amber-900 border-amber-300' 
                      : isSyncing 
                        ? 'bg-blue-50 text-blue-800 border-blue-200 animate-pulse' 
                        : pendingCount > 0
                          ? 'bg-orange-50 text-orange-800 border-orange-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw size={12} className="animate-spin text-blue-600" />
                      <span className="hidden sm:inline">Syncing...</span>
                    </>
                  ) : !isOnline ? (
                    <>
                      <WifiOff size={12} className="text-amber-700" />
                      <span>Offline</span>
                    </>
                  ) : (
                    <>
                      <Wifi size={12} className="text-emerald-600" />
                      <span className="hidden sm:inline">Cloud Sync</span>
                    </>
                  )}
                  {pendingCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-3xs font-black">
                      {pendingCount}
                    </span>
                  )}
                </button>

                {/* Role Badge Indicator & Clickable Profile Modal Trigger */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center space-x-2 pl-2 border-l border-gray-200 hover:opacity-80 transition-all text-left cursor-pointer group focus:outline-none"
                  title="Click to view profile & change password"
                >
                  <div className={`w-8 h-8 rounded-xl ${
                    normalized === 'SUPER_ADMIN' ? 'bg-purple-700' :
                    normalized === 'ADMIN' ? 'bg-indigo-700' :
                    normalized === 'ZM' ? 'bg-teal-700' :
                    normalized === 'RM' ? 'bg-amber-600' :
                    normalized === 'AM' ? 'bg-emerald-600' :
                    'bg-blue-600'
                  } text-white flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-105 transition-transform`}>
                    {currentProfile.initials || 'RP'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                      {currentProfile.name}
                    </div>
                    <div className="text-3xs font-extrabold text-gray-500 flex items-center gap-1">
                      <span className={`px-1.5 py-0.2 rounded font-black ${
                        normalized === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                        normalized === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' :
                        normalized === 'ZM' ? 'bg-teal-100 text-teal-800' :
                        normalized === 'RM' ? 'bg-amber-100 text-amber-800' :
                        normalized === 'AM' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {currentProfile.roleTitle?.split('(')[0] || userRole}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Toast Alert */}
        {syncToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{syncToast}</span>
            </div>
            <button onClick={() => setShowGlobalQueueModal(true)} className="underline text-3xs font-extrabold hover:text-emerald-100">
              View Sync Queue
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-[calc(env(safe-area-inset-bottom,0px)+2rem)] pl-[calc(env(safe-area-inset-left,0px)+0.75rem)] pr-[calc(env(safe-area-inset-right,0px)+0.75rem)]">
          {children}
        </main>
      </div>

      {/* User Personal Profile & Change Password Modal */}
      <UserProfileModal
        user={currentProfile}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onLogout={onLogout}
      />

      {/* Offline Queue Modal */}
      <OfflineQueueModal
        isOpen={showGlobalQueueModal}
        onClose={() => setShowGlobalQueueModal(false)}
        queue={queue}
        auditLogs={auditLogs}
        isOnline={isOnline}
        isSyncing={isSyncing}
        onRefresh={refreshQueue}
      />
    </div>
  );
}
