
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Geolocation } from '@capacitor/geolocation';
import React, { useState } from 'react';
import {
  Fingerprint,
  Scan,
  ShieldCheck,
  Building2,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  Search,
  Plus,
  Clock,
  Briefcase,
  User,
  Settings,
  Mail,
  Lock,
  Download,
  Filter,
  RefreshCw,
  Bell,
  Sliders,
  Database
} from 'lucide-react';
import { UserProfile, UserRole, DcrCall, ExpenseRecord, SecondarySaleRecord, TeamMemberStatus } from './types/sfa';

// Demo Credentials preset matching Image 2
const DEMO_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Pradeep Mishra',
    email: 'pradeep.mishra.kalyan@gmail.com',
    role: 'super_admin',
    roleTitle: 'Super Admin',
    badgeAccess: 'Global Access',
    headquarters: 'Mumbai HQ',
    division: 'Cardio-Diabetic'
  },
  {
    id: '2',
    name: 'System Admin User',
    email: 'admin@raxon.com',
    role: 'system_admin',
    roleTitle: 'System Admin',
    badgeAccess: 'Full Access',
    headquarters: 'Delhi Corporate',
    division: 'All Divisions'
  },
  {
    id: '3',
    name: 'Regional Manager',
    email: 'regional.mgr@raxon.com',
    role: 'regional_manager',
    roleTitle: 'Regional Manager',
    badgeAccess: 'Region Level',
    headquarters: 'North Region',
    division: 'Oncology & Specialty'
  },
  {
    id: '4',
    name: 'Area Manager',
    email: 'area.mgr@raxon.com',
    role: 'area_manager',
    roleTitle: 'Area Manager',
    badgeAccess: 'Area Level',
    headquarters: 'Chandigarh Area',
    division: 'General Healthcare'
  },
  {
    id: '5',
    name: 'Dr. Rahul Sharma',
    email: 'dr.rahul@raxon.com',
    role: 'medical_rep',
    roleTitle: 'Medical Representative',
    badgeAccess: 'Field Rep',
    headquarters: 'Ludhiana Territory',
    division: 'Cardio Care'
  }
];

const INITIAL_CALLS: DcrCall[] = [
  {
    id: 'CALL-101',
    doctorName: 'Dr. A. K. Verma',
    specialty: 'Cardiologist',
    hospital: 'Max Super Specialty Hospital',
    time: '09:30 AM',
    status: 'Completed',
    pobAmount: 45000,
    productsSampled: ['Raxacard 50mg', 'Metoprol-XL'],
    feedback: 'Interested in bulk hospital supply contract. Requested sample pack for clinic.',
    gpsVerified: true
  },
  {
    id: 'CALL-102',
    doctorName: 'Dr. Priya Sundaram',
    specialty: 'Diabetologist',
    hospital: 'Apollo Clinic Center',
    time: '11:15 AM',
    status: 'Completed',
    pobAmount: 28000,
    productsSampled: ['Raxaglip 100mg', 'Insugen-R'],
    feedback: 'Promised high prescription share for new Raxaglip batch.',
    gpsVerified: true
  },
  {
    id: 'CALL-103',
    doctorName: 'Dr. Rajesh Malhotra',
    specialty: 'General Physician',
    hospital: 'City Care Clinic',
    time: '02:00 PM',
    status: 'In Progress',
    pobAmount: 15000,
    productsSampled: ['Raxamox CV 625'],
    feedback: 'Waiting in OPD queue. Detailing starter kit ready.',
    gpsVerified: true
  },
  {
    id: 'CALL-104',
    doctorName: 'Dr. Sunita Rao',
    specialty: 'Pediatrician',
    hospital: 'Fortis Healthcare',
    time: '04:30 PM',
    status: 'Pending',
    pobAmount: 0,
    productsSampled: [],
    feedback: 'Scheduled evening visit.',
    gpsVerified: false
  }
];

const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'EXP-8801', workType: 'OUTSTATION',
    date: '2026-08-12',
    taAmount: 450,
    daAmount: 350,
    miscAmount: 120,
    total: 920,
    status: 'Approved',
    billUploaded: true,
    billUrl: 'fuel_receipt_12aug.pdf'
  },
  {
    id: 'EXP-8802', workType: 'EX-HQ',
    date: '2026-08-11',
    taAmount: 600,
    daAmount: 350,
    miscAmount: 250,
    total: 1200,
    status: 'Pending Manager',
    billUploaded: true,
    billUrl: 'toll_hotel_receipt.pdf'
  },
  {
    id: 'EXP-8803', workType: 'HQ', 
    date: '2026-08-10',
    taAmount: 320,
    daAmount: 350,
    miscAmount: 0,
    total: 670,
    
    status: 'Approved',
    billUploaded: false
  }
];

const INITIAL_TEAM: TeamMemberStatus[] = [
  {
    id: 'TM-1',
    name: 'Dr. Rahul Sharma',
    role: 'Medical Rep',
    headquarters: 'Ludhiana',
    status: 'On Duty',
    callsDone: 3,
    targetCalls: 10,
    pobToday: 88000,
    lastLocation: 'Max Super Specialty Hospital (Geofenced)',
    lastSync: '2 mins ago',
    battery: 88
  },
  {
    id: 'TM-2',
    name: 'Vikram Sethi',
    role: 'Medical Rep',
    headquarters: 'Jalandhar',
    status: 'On Duty',
    callsDone: 5,
    targetCalls: 12,
    pobToday: 112000,
    lastLocation: 'Civil Hospital Road',
    lastSync: '5 mins ago',
    battery: 74
  },
  {
    id: 'TM-3',
    name: 'Ananya Roy',
    role: 'Area Manager',
    headquarters: 'Chandigarh',
    status: 'In Meeting',
    callsDone: 2,
    targetCalls: 6,
    pobToday: 65000,
    lastLocation: 'Regional Distribution Office',
    lastSync: '12 mins ago',
    battery: 92
  },
  {
    id: 'TM-4',
    name: 'Suresh Kumar',
    role: 'Medical Rep',
    headquarters: 'Amritsar',
    status: 'Travel',
    callsDone: 1,
    targetCalls: 10,
    pobToday: 22000,
    lastLocation: 'GT Road Toll Plaza',
    lastSync: '25 mins ago',
    battery: 45
  }
];

