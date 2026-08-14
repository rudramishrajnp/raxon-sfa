import React, { useState } from 'react';
import { 
  Menu, X, Home, Users, Map, Calendar, Settings, LogOut, Navigation
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: string;
  onLogout?: () => void;
}

export function Layout({ children, userRole = 'MR', onLogout }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  let navigation = [];

  if (userRole === 'Super Admin') {
    navigation = [
      { name: 'SaaS Dashboard', href: '/super-admin', icon: Home },
      { name: 'Companies (Tenants)', href: '/super-admin/companies', icon: Users },
      { name: 'System Admins', href: '/super-admin/admins', icon: Users },
      { name: 'Global RBAC', href: '/super-admin/rbac', icon: Settings },
      { name: 'Security Center', href: '/super-admin/security', icon: Settings },
      { name: 'Audit Logs', href: '/super-admin/audit', icon: Navigation },
      { name: 'System Monitor', href: '/super-admin/monitor', icon: Navigation },
    ];
  } else if (userRole === 'System Admin') {
    navigation = [
      { name: 'Company Dashboard', href: '/sys-admin', icon: Home },
      { name: 'Organization Structure', href: '/sys-admin/org', icon: Map },
      { name: 'User Management', href: '/sys-admin/users', icon: Users },
      { name: 'Pharma Masters', href: '/sys-admin/masters', icon: Calendar },
      { name: 'Expense & Leave', href: '/sys-admin/hr', icon: Calendar },
      { name: 'Reports & Analytics', href: '/sys-admin/reports', icon: Navigation },
    ];
  } else {
    // MR and Manager base routes
    navigation = [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'MTP (Monthly Plan)', href: '/mtp', icon: Calendar },
      { name: 'DCR (Daily Call)', href: '/dcr', icon: Map },
      { name: 'Doctor Directory', href: '/doctors', icon: Users },
      { name: 'Chemist Directory', href: '/chemists', icon: Users },
    ];

    if (userRole === 'Manager' || userRole === 'Admin') {
      navigation.push({ name: 'Team Live Tracking', href: '/tracking', icon: Navigation });
      navigation.push({ name: 'Approvals', href: '/approvals', icon: Settings });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-indigo-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 bg-indigo-950">
          <span className="text-xl font-bold">Raxon SFA</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-300 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-700'}
                  `}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-indigo-800">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-indigo-100 rounded-md hover:bg-indigo-700"
            >
              <LogOut className="mr-3 h-6 w-6" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <div className="sticky top-0 z-20 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-800">
              {navigation.find(n => n.href === location.pathname)?.name || 'Raxon SFA'}
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4 hidden md:block">Role: {userRole}</span>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                PR
              </div>
            </div>
          </div>
        </div>

        {/* Main scrollable area */}
        <main className="flex-1 bg-gray-50 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
