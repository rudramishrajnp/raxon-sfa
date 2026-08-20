export type UserRole = 'super_admin' | 'system_admin' | 'regional_manager' | 'area_manager' | 'medical_rep';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  badgeAccess: string;
  headquarters: string;
  division: string;
}

export interface DcrCall {
  id: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  time: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  pobAmount: number;
  productsSampled: string[];
  feedback: string;
  gpsVerified: boolean;
}

export interface ExpenseRecord {
  id: string;
  workType: 'HQ' | 'EX-HQ' | 'OUTSTATION';
  date: string;
  taAmount: number;
  daAmount: number;
  miscAmount: number;
  total: number;
  status: 'Approved' | 'Pending Manager' | 'Rejected';
  billUploaded: boolean;
  billUrl?: string;
}

export interface SecondarySaleRecord {
  id: string;
  stockistName: string;
  chemistName: string;
  productName: string;
  quantity: number;
  value: number;
  date: string;
  invoiceNumber: string;
}

export interface TeamMemberStatus {
  id: string;
  name: string;
  role: string;
  headquarters: string;
  status: 'On Duty' | 'In Meeting' | 'Travel' | 'Off Duty';
  callsDone: number;
  targetCalls: number;
  pobToday: number;
  lastLocation: string;
  lastSync: string;
  battery: number;
}
