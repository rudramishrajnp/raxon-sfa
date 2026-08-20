export interface ManagerAssignment {
  id: string;
  company_id: string;
  division_id?: string | null;
  manager_id: string;
  user_id: string;
  manager_role: 'AREA_MANAGER' | 'REGIONAL_MANAGER' | 'SYSTEM_ADMIN';
  employee_role: 'MEDICAL_REPRESENTATIVE' | 'AREA_MANAGER';
  status: 'active' | 'inactive' | 'ended';
  assigned_by?: string | null;
  assigned_at: string;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  // Joined or cached metadata for UI
  manager_name?: string;
  user_name?: string;
  manager_email?: string;
  user_email?: string;
  company_name?: string;
  division_name?: string;
}

export interface CurrentManagerHierarchy {
  id: string;
  company_id: string;
  division_id?: string | null;
  manager_id: string;
  manager_name?: string;
  manager_email?: string;
  manager_role: string;
  manager_hq?: string;
  manager_phone?: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  employee_role: string;
  user_hq?: string;
  user_phone?: string;
  status: 'active' | 'inactive';
  assigned_at: string;
  updated_at?: string;
}

export interface ManagerAssignmentAudit {
  id: string;
  company_id: string;
  division_id?: string | null;
  manager_id?: string | null;
  user_id?: string | null;
  mr_id?: string | null;
  previous_manager_id?: string | null;
  new_manager_id?: string | null;
  action_type: 'ASSIGN' | 'REASSIGN' | 'UNASSIGN' | 'DEACTIVATE' | 'RESTORE';
  performed_by?: string | null;
  performed_by_name?: string | null;
  details?: Record<string, any> | null;
  created_at: string;
  // UI helper fields
  manager_name?: string;
  mr_name?: string;
  previous_manager_name?: string;
  new_manager_name?: string;
}

export interface AMWithTeam {
  managerId: string;
  managerName: string;
  managerEmail: string;
  managerRole: string;
  managerHq?: string;
  companyId: string;
  divisionId?: string | null;
  assignedMRs: {
    userId: string;
    userName: string;
    userEmail: string;
    userHq?: string;
    assignedAt: string;
    status: string;
  }[];
}
