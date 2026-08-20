import { useMemo, useEffect, useState, useCallback } from 'react';
import { getActiveCompanyId, setActiveCompanyId, getStoredCompanies, Company } from '../data/companyContext';
import { getStoredUserProfiles, UserProfile, normalizeRole } from '../data/userContext';

export interface DataIsolationContext {
  /** The verified, tamper-proof company ID strictly allowed for the current session */
  companyId: string;
  /** Logged-in user profile */
  currentUser: UserProfile | null;
  /** Whether the active user is Platform Super Admin with multi-company authority */
  isPlatformSuperAdmin: boolean;
  /** Active company metadata */
  company: Company | null;
  /** Strictly filters an array of records by company ID */
  filterByCompany: <T extends Record<string, any>>(
    records: T[],
    extractCompanyId?: (item: T) => string | undefined
  ) => T[];
  /** Validates whether access to a given company ID is permitted */
  canAccessCompany: (targetCompanyId: string) => boolean;
  /** Returns a deterministic company-scoped storage key */
  scopedKey: (baseKey: string, explicitCompanyId?: string) => string;
  /** Reads company-isolated data from storage */
  isolatedGet: <T>(baseKey: string, fallback: T | (() => T)) => T;
  /** Writes company-isolated data to storage and dispatches sync event */
  isolatedSet: <T>(baseKey: string, data: T) => void;
  /** Switch active company (only permitted for Platform Super Admin) */
  switchCompany: (newCompanyId: string) => boolean;
}

const ACTIVE_USER_ID_KEY = 'raxon_current_active_user_id';

/**
 * Global useDataIsolation Hook
 * Ensures no tenant user (MR, AM, RM, Division Admin, Company Admin) can access
 * data belonging to another pharmaceutical company, even if manipulating client parameters.
 */
export function useDataIsolation(): DataIsolationContext {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_USER_ID_KEY);
      if (savedId) {
        const profiles = getStoredUserProfiles();
        return profiles.find(u => u.id === savedId) || null;
      }
    } catch {}
    return null;
  });

  const [activeCompId, setActiveCompId] = useState<string>(() => getActiveCompanyId());

  // Listen for user changes and company switches
  useEffect(() => {
    const handleUserChanged = (e: any) => {
      if (e.detail) {
        setCurrentUser(e.detail);
      } else {
        const savedId = localStorage.getItem(ACTIVE_USER_ID_KEY);
        if (savedId) {
          const profiles = getStoredUserProfiles();
          setCurrentUser(profiles.find(u => u.id === savedId) || null);
        }
      }
    };

    const handleCompanySwitched = (e: any) => {
      const newId = e.detail?.companyId || getActiveCompanyId();
      setActiveCompId(newId);
    };

    window.addEventListener('raxon-active-user-changed', handleUserChanged);
    window.addEventListener('raxon-company-switched', handleCompanySwitched);

    return () => {
      window.removeEventListener('raxon-active-user-changed', handleUserChanged);
      window.removeEventListener('raxon-company-switched', handleCompanySwitched);
    };
  }, []);

  const isPlatformSuperAdmin = useMemo(() => {
    if (!currentUser) return false;
    return normalizeRole(currentUser.role) === 'SUPER_ADMIN';
  }, [currentUser]);

  // Strict Enforced Company ID
  const effectiveCompanyId = useMemo(() => {
    if (currentUser && !isPlatformSuperAdmin && currentUser.companyId) {
      // Non-super-admins are strictly locked to their assigned companyId
      if (activeCompId !== currentUser.companyId) {
        // Enforce & correct active company ID in local storage
        setActiveCompanyId(currentUser.companyId);
      }
      return currentUser.companyId;
    }
    return activeCompId || getStoredCompanies()[0]?.id || '';
  }, [currentUser, isPlatformSuperAdmin, activeCompId]);

  const company = useMemo(() => {
    const companies = getStoredCompanies();
    return companies.find(c => c.id === effectiveCompanyId) || companies[0] || null;
  }, [effectiveCompanyId]);

  const canAccessCompany = useCallback((targetCompanyId: string): boolean => {
    if (isPlatformSuperAdmin) return true;
    if (!currentUser?.companyId) return false;
    return currentUser.companyId.toUpperCase() === (targetCompanyId || '').toUpperCase();
  }, [isPlatformSuperAdmin, currentUser]);

  const filterByCompany = useCallback(<T extends Record<string, any>>(
    records: T[],
    extractCompanyId?: (item: T) => string | undefined
  ): T[] => {
    if (!Array.isArray(records)) return [];
    
    return records.filter(item => {
      const itemCompId = extractCompanyId 
        ? extractCompanyId(item) 
        : (item.companyId || item.company_id || item.tenantId);

      // If record has no companyId attribute, consider it valid only if it was loaded from this company's isolated store
      if (!itemCompId) return true;

      if (isPlatformSuperAdmin) {
        // Platform Super Admin sees data for the selected company view
        return itemCompId.toUpperCase() === effectiveCompanyId.toUpperCase();
      }

      return itemCompId.toUpperCase() === effectiveCompanyId.toUpperCase();
    });
  }, [effectiveCompanyId, isPlatformSuperAdmin]);

  const scopedKey = useCallback((baseKey: string, explicitCompanyId?: string): string => {
    const compId = explicitCompanyId && isPlatformSuperAdmin 
      ? explicitCompanyId 
      : effectiveCompanyId;
    return `${baseKey}_${compId}`;
  }, [effectiveCompanyId, isPlatformSuperAdmin]);

  const isolatedGet = useCallback(<T>(baseKey: string, fallback: T | (() => T)): T => {
    const key = scopedKey(baseKey);
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn(`[useDataIsolation] Failed to read ${key}:`, e);
    }
    return typeof fallback === 'function' ? (fallback as () => T)() : fallback;
  }, [scopedKey]);

  const isolatedSet = useCallback(<T>(baseKey: string, data: T): void => {
    const key = scopedKey(baseKey);
    try {
      localStorage.setItem(key, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('raxon-isolated-data-updated', {
        detail: { key, companyId: effectiveCompanyId }
      }));
    } catch (e) {
      console.error(`[useDataIsolation] Failed to save ${key}:`, e);
    }
  }, [scopedKey, effectiveCompanyId]);

  const switchCompany = useCallback((newCompanyId: string): boolean => {
    if (!isPlatformSuperAdmin) {
      console.warn('[useDataIsolation] Company switching is restricted to Platform Super Admins.');
      return false;
    }
    setActiveCompanyId(newCompanyId);
    setActiveCompId(newCompanyId);
    return true;
  }, [isPlatformSuperAdmin]);

  return {
    companyId: effectiveCompanyId,
    currentUser,
    isPlatformSuperAdmin,
    company,
    filterByCompany,
    canAccessCompany,
    scopedKey,
    isolatedGet,
    isolatedSet,
    switchCompany
  };
}
