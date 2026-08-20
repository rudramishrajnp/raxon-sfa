import { getActiveCompanyId } from './companyContext';
export interface UserPermissions {
  canEditDoctor: boolean;
  canDeleteDoctor: boolean;
  canEditChemist: boolean;
  canDeleteChemist: boolean;
  canAddDoctor: boolean;
  canAddChemist: boolean;
  isGeolocationEnabled: boolean;
}

export const DEFAULT_MR_PERMISSIONS: UserPermissions = {
  canEditDoctor: false,
  canDeleteDoctor: false,
  canEditChemist: false,
  canDeleteChemist: false,
  canAddDoctor: true,
  canAddChemist: true,
  isGeolocationEnabled: true,
};

export const DEFAULT_AM_PERMISSIONS: UserPermissions = {
  canEditDoctor: true,
  canDeleteDoctor: false,
  canEditChemist: true,
  canDeleteChemist: false,
  canAddDoctor: true,
  canAddChemist: true,
  isGeolocationEnabled: true,
};

export const DEFAULT_RM_PERMISSIONS: UserPermissions = {
  canEditDoctor: true,
  canDeleteDoctor: true,
  canEditChemist: true,
  canDeleteChemist: true,
  canAddDoctor: true,
  canAddChemist: true,
  isGeolocationEnabled: true,
};

export const DEFAULT_ADMIN_PERMISSIONS: UserPermissions = {
  canEditDoctor: true,
  canDeleteDoctor: true,
  canEditChemist: true,
  canDeleteChemist: true,
  canAddDoctor: true,
  canAddChemist: true,
  isGeolocationEnabled: true,
};

export function getDefaultPermissionsForRole(role: string): UserPermissions {
  const r = role.toLowerCase();
  if (r.includes('admin')) {
    return { ...DEFAULT_ADMIN_PERMISSIONS };
  }
  if (r.includes('regional') || r.includes('rm')) {
    return { ...DEFAULT_RM_PERMISSIONS };
  }
  if (r.includes('area') || r.includes('am')) {
    return { ...DEFAULT_AM_PERMISSIONS };
  }
  return { ...DEFAULT_MR_PERMISSIONS };
}

export function getPermissionsStorageKey() {
  return `raxon_user_permissions_master_${getActiveCompanyId()}`;
}

export function getAllUserPermissions(): Record<string, UserPermissions> {
  try {
    const data = localStorage.getItem(getPermissionsStorageKey());
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to load user permissions from localStorage:', e);
  }
  return {};
}

export function getUserPermissions(userId: string, role: string = 'Medical Representative (MR)'): UserPermissions {
  // Super Admin & System Admin always have full master rights
  const r = role.toLowerCase();
  if (r.includes('admin')) {
    return { ...DEFAULT_ADMIN_PERMISSIONS };
  }

  const all = getAllUserPermissions();
  if (all[userId]) {
    return {
      canAddDoctor: all[userId].canAddDoctor ?? true,
      canAddChemist: all[userId].canAddChemist ?? true,
      canEditDoctor: !!all[userId].canEditDoctor,
      canDeleteDoctor: !!all[userId].canDeleteDoctor,
      canEditChemist: !!all[userId].canEditChemist,
      canDeleteChemist: !!all[userId].canDeleteChemist,
      isGeolocationEnabled: all[userId].isGeolocationEnabled !== undefined ? all[userId].isGeolocationEnabled : true,
    };
  }

  return getDefaultPermissionsForRole(role);
}

export function saveUserPermission(userId: string, perms: UserPermissions): void {
  try {
    const all = getAllUserPermissions();
    all[userId] = perms;
    localStorage.setItem(getPermissionsStorageKey(), JSON.stringify(all));
    // Trigger custom event for real-time reactivity across tabs/pages
    window.dispatchEvent(new CustomEvent('raxon-permissions-updated', { detail: { userId, perms } }));
  } catch (e) {
    console.error('Failed to save user permissions:', e);
  }
}

export function saveAllUserPermissions(allPerms: Record<string, UserPermissions>): void {
  try {
    localStorage.setItem(getPermissionsStorageKey(), JSON.stringify(allPerms));
    window.dispatchEvent(new CustomEvent('raxon-permissions-updated', { detail: allPerms }));
  } catch (e) {
    console.error('Failed to save all user permissions:', e);
  }
}

// Active user session simulation helper
export interface ActiveUserContext {
  id: string;
  name: string;
  role: string;
  hq: string;
}

const ACTIVE_USER_STORAGE_KEY = 'raxon_active_session_user_v5';

export const INITIAL_ACTIVE_USER: ActiveUserContext = {
  id: 'ANONYMOUS',
  name: 'System User',
  role: 'Field Representative',
  hq: 'Branch Office'
};

export function getActiveUserContext(): ActiveUserContext {
  try {
    const data = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to load active user context:', e);
  }
  return INITIAL_ACTIVE_USER;
}

export function setActiveUserContext(user: ActiveUserContext): void {
  try {
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('raxon-active-user-changed', { detail: user }));
  } catch (e) {
    console.error('Failed to save active user context:', e);
  }
}
