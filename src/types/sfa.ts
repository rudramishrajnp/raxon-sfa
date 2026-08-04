export interface SystemHealth {
  status: string;
  time?: string;
  dbConnected?: boolean;
}

export interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
}

export interface AttendanceRecord {
  id: string;
  user: string;
  role: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  location: string;
  status: 'PRESENT' | 'LATE' | 'LEAVE' | 'ABSENT';
}

export interface DcrRecord {
  id: string;
  repName: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  samplesGiven: number;
  feedback: string;
  time: string;
}

export interface SalesRecord {
  id: string;
  distributor: string;
  product: string;
  quantity: number;
  amount: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

export interface ExpenseRecord {
  id: string;
  repName: string;
  type: string;
  amount: number;
  date: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}
