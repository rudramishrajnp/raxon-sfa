import { supabase } from '../supabaseClient';
import { 
  ManagerAssignment, 
  CurrentManagerHierarchy, 
  ManagerAssignmentAudit,
  AMWithTeam 
} from '../types/managerHierarchy';
import { 
  getStoredUserProfiles, 
  UserProfile, 
  getLoggedInUser, 
  normalizeRole,
  getAllUsersByRole
} from '../data/userContext';
import { getActiveCompanyId } from '../data/companyContext';

const HIERARCHY_CACHE_KEY_PREFIX = 'raxon_current_hierarchy_';
const ASSIGNMENTS_CACHE_KEY_PREFIX = 'raxon_manager_assignments_';
const AUDIT_CACHE_KEY_PREFIX = 'raxon_manager_audit_';

let isRealtimeSubscribed = false;

/**
 * Initializes Supabase Realtime subscription for manager hierarchy changes
 */
export function initHierarchyRealtimeSubscription() {
  if (isRealtimeSubscribed) return;
  isRealtimeSubscribed = true;

  try {
    supabase
      .channel('public:manager_hierarchy_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'manager_assignments' }, async () => {
        await refreshHierarchyCache();
        window.dispatchEvent(new CustomEvent('raxon-hierarchy-updated'));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'current_manager_hierarchy' }, async () => {
        await refreshHierarchyCache();
        window.dispatchEvent(new CustomEvent('raxon-hierarchy-updated'));
      })
      .subscribe();
  } catch (err) {
    console.warn('[ManagerHierarchyService] Realtime subscription notice:', err);
  }
}

/**
 * Refreshes local cache for the active company
 */
export async function refreshHierarchyCache(companyId?: string): Promise<void> {
  const cId = companyId || getActiveCompanyId();
  if (!cId) return;

  try {
    // 1. Fetch current hierarchy
    const { data: hierarchyData, error: hierError } = await supabase
      .from('current_manager_hierarchy')
      .select('*')
      .eq('company_id', cId);

    if (!hierError && hierarchyData) {
      localStorage.setItem(`${HIERARCHY_CACHE_KEY_PREFIX}${cId}`, JSON.stringify(hierarchyData));
    }

    // 2. Fetch assignments
    const { data: assignData, error: assignError } = await supabase
      .from('manager_assignments')
      .select('*')
      .eq('company_id', cId);

    if (!assignError && assignData) {
      localStorage.setItem(`${ASSIGNMENTS_CACHE_KEY_PREFIX}${cId}`, JSON.stringify(assignData));
    }
  } catch (e) {
    console.warn('[ManagerHierarchyService] Cache refresh notice:', e);
  }
}

/**
 * Fetches the current manager hierarchy from authoritative Supabase tables
 */
export async function getCurrentHierarchy(companyId?: string, divisionId?: string): Promise<CurrentManagerHierarchy[]> {
  const activeCompId = companyId || getActiveCompanyId();
  if (!activeCompId) return [];

  try {
    let query = supabase
      .from('current_manager_hierarchy')
      .select('*')
      .eq('company_id', activeCompId);

    if (divisionId && divisionId !== 'ALL' && divisionId !== 'all') {
      query = query.eq('division_id', divisionId);
    }

    const { data, error } = await query;

    if (!error && data) {
      // Enrich with user profiles for display details if missing
      const profiles = getStoredUserProfiles();
      const enriched: CurrentManagerHierarchy[] = data.map((row: any) => {
        const mgr = profiles.find(p => p.id === row.manager_id);
        const usr = profiles.find(p => p.id === row.user_id);
        return {
          id: row.id || `${row.manager_id}_${row.user_id}`,
          company_id: row.company_id,
          division_id: row.division_id,
          manager_id: row.manager_id,
          manager_name: row.manager_name || mgr?.name || 'Area Manager',
          manager_email: row.manager_email || mgr?.email || '',
          manager_role: row.manager_role || 'AREA_MANAGER',
          manager_hq: mgr?.hq || '',
          manager_phone: mgr?.phone || '',
          user_id: row.user_id,
          user_name: row.user_name || usr?.name || 'Medical Representative',
          user_email: row.user_email || usr?.email || '',
          employee_role: row.employee_role || 'MEDICAL_REPRESENTATIVE',
          user_hq: usr?.hq || '',
          user_phone: usr?.phone || '',
          status: row.status || 'active',
          assigned_at: row.assigned_at || row.created_at || new Date().toISOString(),
          updated_at: row.updated_at
        };
      });

      localStorage.setItem(`${HIERARCHY_CACHE_KEY_PREFIX}${activeCompId}`, JSON.stringify(enriched));
      return enriched;
    }
  } catch (err) {
    console.warn('[ManagerHierarchyService] Remote fetch fallback to cache:', err);
  }

  // Fallback to cache
  try {
    const cached = localStorage.getItem(`${HIERARCHY_CACHE_KEY_PREFIX}${activeCompId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        if (divisionId && divisionId !== 'ALL' && divisionId !== 'all') {
          return parsed.filter(item => item.division_id === divisionId);
        }
        return parsed;
      }
    }
  } catch {}

  return [];
}

/**
 * Fetches all manager assignments (including historical if requested)
 */
export async function getManagerAssignments(companyId?: string, divisionId?: string, activeOnly: boolean = true): Promise<ManagerAssignment[]> {
  const activeCompId = companyId || getActiveCompanyId();
  if (!activeCompId) return [];

  try {
    let query = supabase
      .from('manager_assignments')
      .select('*')
      .eq('company_id', activeCompId);

    if (activeOnly) {
      query = query.eq('status', 'active');
    }

    if (divisionId && divisionId !== 'ALL' && divisionId !== 'all') {
      query = query.eq('division_id', divisionId);
    }

    const { data, error } = await query.order('assigned_at', { ascending: false });

    if (!error && data) {
      const profiles = getStoredUserProfiles();
      const enriched: ManagerAssignment[] = data.map((row: any) => {
        const mgr = profiles.find(p => p.id === row.manager_id);
        const usr = profiles.find(p => p.id === row.user_id);
        return {
          ...row,
          manager_name: mgr?.name || row.manager_name || 'Area Manager',
          user_name: usr?.name || row.user_name || 'Medical Representative',
          manager_email: mgr?.email,
          user_email: usr?.email
        };
      });
      return enriched;
    }
  } catch (err) {
    console.warn('[ManagerHierarchyService] getManagerAssignments error:', err);
  }

  return [];
}

/**
 * Authoritatively resolves an MR's current active reporting manager
 */
export async function getMyManager(userId?: string): Promise<{
  managerId: string;
  managerName: string;
  managerRole: string;
  managerEmail?: string;
  managerHq?: string;
  managerPhone?: string;
  divisionId?: string;
} | null> {
  const loggedIn = getLoggedInUser();
  const targetUserId = userId || loggedIn?.id;
  if (!targetUserId) return null;

  try {
    // 1. Try querying public.current_manager_hierarchy
    const { data, error } = await supabase
      .from('current_manager_hierarchy')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('status', 'active')
      .maybeSingle();

    if (!error && data && data.manager_id) {
      const profiles = getStoredUserProfiles();
      const mgr = profiles.find(p => p.id === data.manager_id);
      return {
        managerId: data.manager_id,
        managerName: data.manager_name || mgr?.name || 'Area Manager',
        managerRole: data.manager_role || 'AREA_MANAGER',
        managerEmail: data.manager_email || mgr?.email,
        managerHq: mgr?.hq,
        managerPhone: mgr?.phone,
        divisionId: data.division_id || mgr?.divisionId
      };
    }

    // 2. Fallback to public.manager_assignments
    const { data: assignData, error: assignError } = await supabase
      .from('manager_assignments')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('status', 'active')
      .order('assigned_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!assignError && assignData && assignData.manager_id) {
      const profiles = getStoredUserProfiles();
      const mgr = profiles.find(p => p.id === assignData.manager_id);
      return {
        managerId: assignData.manager_id,
        managerName: mgr?.name || 'Area Manager',
        managerRole: assignData.manager_role || 'AREA_MANAGER',
        managerEmail: mgr?.email,
        managerHq: mgr?.hq,
        managerPhone: mgr?.phone,
        divisionId: assignData.division_id || mgr?.divisionId
      };
    }
  } catch (err) {
    console.warn('[ManagerHierarchyService] getMyManager network check fallback to profile:', err);
  }

  // 3. Fallback to cached profile reportingToId if present
  const profiles = getStoredUserProfiles();
  const currentProfile = profiles.find(p => p.id === targetUserId);
  if (currentProfile?.reportingToId) {
    const mgr = profiles.find(p => p.id === currentProfile.reportingToId);
    if (mgr) {
      return {
        managerId: mgr.id,
        managerName: mgr.name,
        managerRole: mgr.roleTitle || 'Area Manager',
        managerEmail: mgr.email,
        managerHq: mgr.hq,
        managerPhone: mgr.phone,
        divisionId: mgr.divisionId
      };
    }
  }

  return null;
}

/**
 * Authoritatively resolves the list of MRs assigned to a specific AM
 */
export async function getMyTeam(managerId?: string): Promise<{
  userId: string;
  userName: string;
  userEmail: string;
  userHq?: string;
  userPhone?: string;
  divisionId?: string;
  status: string;
}[]> {
  const loggedIn = getLoggedInUser();
  const targetManagerId = managerId || loggedIn?.id;
  if (!targetManagerId) return [];

  try {
    // 1. Query current_manager_hierarchy
    const { data, error } = await supabase
      .from('current_manager_hierarchy')
      .select('*')
      .eq('manager_id', targetManagerId)
      .eq('status', 'active');

    if (!error && data && data.length > 0) {
      const profiles = getStoredUserProfiles();
      return data.map((row: any) => {
        const usr = profiles.find(p => p.id === row.user_id);
        return {
          userId: row.user_id,
          userName: row.user_name || usr?.name || 'Medical Representative',
          userEmail: row.user_email || usr?.email || '',
          userHq: usr?.hq || row.user_hq || '',
          userPhone: usr?.phone || row.user_phone || '',
          divisionId: row.division_id || usr?.divisionId,
          status: row.status || 'active'
        };
      });
    }

    // 2. Query manager_assignments
    const { data: assignData, error: assignError } = await supabase
      .from('manager_assignments')
      .select('*')
      .eq('manager_id', targetManagerId)
      .eq('status', 'active');

    if (!assignError && assignData && assignData.length > 0) {
      const profiles = getStoredUserProfiles();
      return assignData.map((row: any) => {
        const usr = profiles.find(p => p.id === row.user_id);
        return {
          userId: row.user_id,
          userName: usr?.name || 'Medical Representative',
          userEmail: usr?.email || '',
          userHq: usr?.hq || '',
          userPhone: usr?.phone || '',
          divisionId: row.division_id || usr?.divisionId,
          status: row.status || 'active'
        };
      });
    }
  } catch (err) {
    console.warn('[ManagerHierarchyService] getMyTeam query fallback to profile links:', err);
  }

  // 3. Fallback: match by reportingToId on profiles in the same company
  const profiles = getStoredUserProfiles();
  const assigned = profiles.filter(p => p.reportingToId === targetManagerId && normalizeRole(p.role) === 'MR');
  if (assigned.length > 0) {
    return assigned.map(u => ({
      userId: u.id,
      userName: u.name,
      userEmail: u.email,
      userHq: u.hq,
      userPhone: u.phone,
      divisionId: u.divisionId,
      status: u.status || 'active'
    }));
  }

  return [];
}

/**
 * Returns eligible Area Managers for assignment within a company/division
 */
export function getEligibleManagers(companyId: string, divisionId?: string): UserProfile[] {
  const users = getStoredUserProfiles();
  return users.filter(u => {
    if (u.companyId !== companyId) return false;
    const norm = normalizeRole(u.role);
    if (norm !== 'AM') return false;
    if (divisionId && divisionId !== 'ALL' && divisionId !== 'all' && u.divisionId && u.divisionId !== divisionId) {
      return false;
    }
    return true;
  });
}

/**
 * Returns eligible Medical Representatives for assignment within a company/division
 */
export function getEligibleMRs(companyId: string, divisionId?: string): UserProfile[] {
  const users = getStoredUserProfiles();
  return users.filter(u => {
    if (u.companyId !== companyId) return false;
    const norm = normalizeRole(u.role);
    if (norm !== 'MR') return false;
    if (divisionId && divisionId !== 'ALL' && divisionId !== 'all' && u.divisionId && u.divisionId !== divisionId) {
      return false;
    }
    return true;
  });
}

/**
 * Assigns an MR to an Area Manager with strict validation, one-active-manager enforcement, and audit recording
 */
export async function assignMrToManager(params: {
  companyId: string;
  divisionId?: string;
  managerId: string;
  mrId: string;
  assignedBy: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { companyId, divisionId, managerId, mrId, assignedBy, notes } = params;

  if (!companyId || !managerId || !mrId) {
    return { success: false, error: 'Company ID, Manager ID, and MR ID are strictly required.' };
  }

  // Validate roles from local profiles
  const profiles = getStoredUserProfiles();
  const manager = profiles.find(p => p.id === managerId);
  const mr = profiles.find(p => p.id === mrId);

  if (!manager) {
    return { success: false, error: `Manager with ID ${managerId} not found.` };
  }
  if (!mr) {
    return { success: false, error: `Medical Representative with ID ${mrId} not found.` };
  }

  const managerRole = normalizeRole(manager.role);
  const mrRole = normalizeRole(mr.role);

  // Role validation
  if (managerRole !== 'AM' && managerRole !== 'ADMIN' && managerRole !== 'SUPER_ADMIN') {
    return { success: false, error: `Invalid manager role (${managerRole}). Only Area Managers can manage MRs.` };
  }
  if (mrRole !== 'MR') {
    return { success: false, error: `Invalid employee role (${mrRole}). Target must be a Medical Representative.` };
  }

  // Company validation
  if (manager.companyId !== companyId || mr.companyId !== companyId) {
    return { success: false, error: 'Cross-company manager assignments are strictly forbidden.' };
  }

  // Division validation (if specified)
  if (divisionId && divisionId !== 'ALL') {
    if (manager.divisionId && manager.divisionId !== divisionId) {
      return { success: false, error: 'Manager does not belong to the selected division.' };
    }
    if (mr.divisionId && mr.divisionId !== divisionId) {
      return { success: false, error: 'MR does not belong to the selected division.' };
    }
  }

  const now = new Date().toISOString();
  const targetDivisionId = divisionId || manager.divisionId || mr.divisionId || null;

  try {
    // 1. End any existing active assignment for this MR (One Active Manager Rule)
    const { data: existingActive } = await supabase
      .from('manager_assignments')
      .select('*')
      .eq('company_id', companyId)
      .eq('user_id', mrId)
      .eq('status', 'active');

    let previousManagerId: string | null = null;

    if (existingActive && existingActive.length > 0) {
      previousManagerId = existingActive[0].manager_id;
      
      // If already assigned to this exact manager, no need to duplicate
      if (previousManagerId === managerId) {
        return { success: true };
      }

      // Deactivate previous active assignment
      await supabase
        .from('manager_assignments')
        .update({
          status: 'ended',
          end_date: now,
          updated_at: now
        })
        .eq('company_id', companyId)
        .eq('user_id', mrId)
        .eq('status', 'active');
    }

    // 2. Insert new assignment into public.manager_assignments
    const newAssignmentId = `asgn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const { error: insertError } = await supabase
      .from('manager_assignments')
      .insert({
        id: newAssignmentId,
        company_id: companyId,
        division_id: targetDivisionId,
        manager_id: managerId,
        user_id: mrId,
        manager_role: 'AREA_MANAGER',
        employee_role: 'MEDICAL_REPRESENTATIVE',
        status: 'active',
        assigned_by: assignedBy,
        assigned_at: now,
        start_date: now,
        notes: notes || null,
        created_at: now,
        updated_at: now
      });

    if (insertError) {
      console.warn('[ManagerHierarchyService] Insert error (table might be managed by RPC or View):', insertError);
    }

    // 3. Upsert into public.current_manager_hierarchy
    const hierarchyRowId = `hier_${companyId}_${mrId}`;
    await supabase
      .from('current_manager_hierarchy')
      .upsert({
        id: hierarchyRowId,
        company_id: companyId,
        division_id: targetDivisionId,
        manager_id: managerId,
        manager_name: manager.name,
        manager_email: manager.email,
        manager_role: 'AREA_MANAGER',
        user_id: mrId,
        user_name: mr.name,
        user_email: mr.email,
        employee_role: 'MEDICAL_REPRESENTATIVE',
        status: 'active',
        assigned_at: now,
        updated_at: now
      });

    // 4. Record in public.manager_assignment_audit
    const auditId = `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const actionType = previousManagerId ? 'REASSIGN' : 'ASSIGN';
    await supabase
      .from('manager_assignment_audit')
      .insert({
        id: auditId,
        company_id: companyId,
        division_id: targetDivisionId,
        manager_id: managerId,
        user_id: mrId,
        mr_id: mrId,
        previous_manager_id: previousManagerId,
        new_manager_id: managerId,
        action_type: actionType,
        performed_by: assignedBy,
        details: {
          manager_name: manager.name,
          mr_name: mr.name,
          notes: notes || 'Assigned via Manager Hierarchy Console'
        },
        created_at: now
      });

    // 5. Update local user profile reporting link for UI instant responsiveness
    const updatedProfiles = profiles.map(p => {
      if (p.id === mrId) {
        return {
          ...p,
          reportingToId: managerId,
          reportingToName: manager.name
        };
      }
      return p;
    });
    localStorage.setItem(`raxon_user_profiles_${companyId}`, JSON.stringify(updatedProfiles));

    // Refresh hierarchy cache & dispatch global event
    await refreshHierarchyCache(companyId);
    window.dispatchEvent(new CustomEvent('raxon-hierarchy-updated'));
    window.dispatchEvent(new CustomEvent('raxon-user-profiles-updated'));

    return { success: true };
  } catch (err: any) {
    console.error('[ManagerHierarchyService] assignMrToManager error:', err);
    return { success: false, error: err.message || 'Failed to complete manager assignment.' };
  }
}

/**
 * Bulk assigns multiple MRs to an Area Manager
 */
export async function bulkAssignMrsToManager(params: {
  companyId: string;
  divisionId?: string;
  managerId: string;
  mrIds: string[];
  assignedBy: string;
  notes?: string;
}): Promise<{ success: boolean; count: number; error?: string }> {
  const { companyId, divisionId, managerId, mrIds, assignedBy, notes } = params;
  let count = 0;
  for (const mrId of mrIds) {
    const res = await assignMrToManager({
      companyId,
      divisionId,
      managerId,
      mrId,
      assignedBy,
      notes
    });
    if (res.success) {
      count++;
    }
  }
  return { success: count > 0, count };
}

/**
 * Reassigns an MR from their current AM to a new AM
 */
export async function reassignMr(params: {
  companyId: string;
  divisionId?: string;
  newManagerId: string;
  mrId: string;
  performedBy: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  return assignMrToManager({
    companyId: params.companyId,
    divisionId: params.divisionId,
    managerId: params.newManagerId,
    mrId: params.mrId,
    assignedBy: params.performedBy,
    notes: params.notes || 'Reassigned to new Area Manager'
  });
}

/**
 * Removes / deactivates an MR's manager assignment
 */
export async function removeAssignment(params: {
  assignmentId?: string;
  companyId: string;
  mrId: string;
  managerId: string;
  performedBy: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { companyId, mrId, managerId, performedBy, notes } = params;
  const now = new Date().toISOString();

  try {
    // 1. Deactivate in manager_assignments
    await supabase
      .from('manager_assignments')
      .update({
        status: 'ended',
        end_date: now,
        updated_at: now
      })
      .eq('company_id', companyId)
      .eq('user_id', mrId)
      .eq('status', 'active');

    // 2. Remove / deactivate in current_manager_hierarchy
    await supabase
      .from('current_manager_hierarchy')
      .delete()
      .eq('company_id', companyId)
      .eq('user_id', mrId);

    // 3. Record audit
    const auditId = `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await supabase
      .from('manager_assignment_audit')
      .insert({
        id: auditId,
        company_id: companyId,
        manager_id: managerId,
        user_id: mrId,
        mr_id: mrId,
        previous_manager_id: managerId,
        new_manager_id: null,
        action_type: 'UNASSIGN',
        performed_by: performedBy,
        details: {
          notes: notes || 'Assignment unassigned by administrator'
        },
        created_at: now
      });

    // 4. Update local profiles
    const profiles = getStoredUserProfiles();
    const updatedProfiles = profiles.map(p => {
      if (p.id === mrId && p.reportingToId === managerId) {
        return {
          ...p,
          reportingToId: undefined,
          reportingToName: undefined
        };
      }
      return p;
    });
    localStorage.setItem(`raxon_user_profiles_${companyId}`, JSON.stringify(updatedProfiles));

    await refreshHierarchyCache(companyId);
    window.dispatchEvent(new CustomEvent('raxon-hierarchy-updated'));
    window.dispatchEvent(new CustomEvent('raxon-user-profiles-updated'));

    return { success: true };
  } catch (err: any) {
    console.error('[ManagerHierarchyService] removeAssignment error:', err);
    return { success: false, error: err.message || 'Failed to remove assignment.' };
  }
}

/**
 * Fetches audit log history for manager assignments
 */
export async function getAssignmentAudit(companyId?: string, divisionId?: string): Promise<ManagerAssignmentAudit[]> {
  const activeCompId = companyId || getActiveCompanyId();
  if (!activeCompId) return [];

  try {
    let query = supabase
      .from('manager_assignment_audit')
      .select('*')
      .eq('company_id', activeCompId);

    if (divisionId && divisionId !== 'ALL' && divisionId !== 'all') {
      query = query.eq('division_id', divisionId);
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(100);

    if (!error && data) {
      const profiles = getStoredUserProfiles();
      const enriched: ManagerAssignmentAudit[] = data.map((row: any) => {
        const mgr = profiles.find(p => p.id === row.manager_id || p.id === row.new_manager_id);
        const prevMgr = profiles.find(p => p.id === row.previous_manager_id);
        const mr = profiles.find(p => p.id === (row.user_id || row.mr_id));
        const performer = profiles.find(p => p.id === row.performed_by);

        return {
          ...row,
          manager_name: mgr?.name || row.details?.manager_name || 'Area Manager',
          previous_manager_name: prevMgr?.name,
          new_manager_name: mgr?.name,
          mr_name: mr?.name || row.details?.mr_name || 'Medical Representative',
          performed_by_name: performer?.name || row.performed_by || 'Admin'
        };
      });
      return enriched;
    }
  } catch (err) {
    console.warn('[ManagerHierarchyService] getAssignmentAudit error:', err);
  }

  return [];
}
