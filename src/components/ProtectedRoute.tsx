import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserProfile, normalizeRole } from '../data/userContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  currentUser: UserProfile | null;
  allowedRoles?: string[];
  requiredCompany?: boolean;
}

export function ProtectedRoute({
  children,
  currentUser,
  allowedRoles,
  requiredCompany = true
}: ProtectedRouteProps) {
  // 1. Session check: if no user is authenticated, redirect to root (Login)
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // 2. Status check: Account must be active
  if (currentUser.status && currentUser.status !== 'Active') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-6 max-w-md text-center shadow-sm">
          <ShieldAlert className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-1">Account Inactive</h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Your user account is currently inactive or suspended. Please contact your company administrator.
          </p>
        </div>
      </div>
    );
  }

  // 3. Role authorization check
  const normalizedUserRole = normalizeRole(currentUser.role);
  
  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowedRoles = allowedRoles.map(r => normalizeRole(r));
    const isAllowed = normalizedAllowedRoles.includes(normalizedUserRole);

    if (!isAllowed) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md text-center shadow-sm">
            <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-1">Access Restricted</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              You do not have the required role permissions to access this administrative section.
            </p>
            <div className="text-xs text-red-500 font-mono">
              Current Role: {currentUser.role} | Required: {allowedRoles.join(', ')}
            </div>
          </div>
        </div>
      );
    }
  }

  // 4. Company boundary check (Super Admins are exempt from company scope requirement)
  if (requiredCompany && normalizedUserRole !== 'SUPER_ADMIN' && !currentUser.companyId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl p-6 max-w-md text-center shadow-sm">
          <ShieldAlert className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-200 mb-1">Unassigned Tenant</h3>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            This account is not assigned to a registered pharmaceutical company tenant.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
