export type UserRole = 'super_admin' | 'system_admin' | 'regional_manager' | 'area_manager' | 'medical_rep';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  badgeAccess: string;
  headquarters?: string;
  division?: string;
  avatarUrl?: string;
  token?: string;
}

export interface DcrCall {
  id: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  time: string;
  status: 'Completed' | 'Pending' | 'Cancelled' | 'In Progress';
  pobAmount: number;
  productsSampled: string[];
  feedback: string;
  gpsVerified: boolean;
  jointWorkWith?: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  taAmount: number;
  daAmount: number;
  miscAmount: number;
  total: number;
  status: 'Approved' | 'Pending Manager' | 'Pending Finance' | 'Rejected';
  billUploaded: boolean;
  billUrl?: string;
}

export interface SecondarySaleRecord {
  id: string;
  stockistName: string;
  territory: string;
  openingStock: number;
  receivedQty: number;
  soldQty: number;
  closingStock: number;
  saleValue: number;
  month: string;
}

export interface TeamMemberStatus {
  id: string;
  name: string;
  role: string;
  headquarters: string;
  status: 'On Duty' | 'In Meeting' | 'Travel' | 'Offline';
  callsDone: number;
  targetCalls: number;
  pobToday: number;
  lastLocation: string;
  lastSync: string;
  battery: number;
}
