import { getActiveCompanyId } from './companyContext';

export interface DrilldownMR {
  id: string;
  name: string;
  hq: string;
  patch: string;
  phone: string;
  punchTime: string;
  punchStatus: 'Punched In' | 'Punched Out';
  battery: string;
  gpsAccuracy: string;
  callsDone: number;
  callsPlanned: number;
  pobToday: number;
  monthlyTarget: number;
  monthlyAchieved: number;
  status: 'In Clinic' | 'Traveling' | 'At Chemist' | 'Idle';
}

export interface DrilldownCallLog {
  id: string;
  mrId: string;
  mrName: string;
  territory: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  callTime: string;
  callType: 'Doctor Regular' | 'Doctor Core (Class A)' | 'Chemist RCPA' | 'Joint with AM';
  durationMins: number;
  detailedBrands: string[];
  samplesGiven: string;
  pobAmount: number;
  isJointCall: boolean;
  remarks: string;
}

export interface DrilldownPobOrder {
  orderId: string;
  mrName: string;
  territory: string;
  chemistName: string;
  chemistAddress: string;
  stockistName: string;
  orderTime: string;
  items: { brand: string; pack: string; qty: number; rate: number; amount: number }[];
  totalAmount: number;
  paymentMode: 'Credit (14 Days)' | 'Cash on Delivery' | 'PDC 21 Days';
  status: 'Sent to Stockist' | 'Verified' | 'Pending Dispatch';
}

export interface DrilldownQuotaItem {
  territory: string;
  repOrAm: string;
  target: number;
  achieved: number;
  percent: number;
  pobToday: number;
  topBrand: string;
  gap: number;
  requiredDailyRunRate: number;
}

export interface DrilldownAreaRegion {
  areaName: string;
  amName: string;
  hq: string;
  mrsCount: number;
  stockistsCount: number;
  target: number;
  achieved: number;
  percent: number;
  growthYoY: string;
  mtpCompliance: number;
}

export interface DrilldownZonalRegion {
  regionName: string;
  rmName: string;
  hq: string;
  amCount: number;
  mrCount: number;
  target: number;
  achieved: number;
  percent: number;
  stockistsCount: number;
  growthYoY: string;
  keyDriver: string;
}

export interface DrilldownDivision {
  name: string;
  head: string;
  target: number;
  achieved: number;
  percent: number;
  coreBrands: string[];
  fieldStrength: number;
  doctorCoverage: number;
}

// -------------------------------------------------------------
// 1. AM DASHBOARD DRILLDOWN DATA
// -------------------------------------------------------------

export const AM_AREA_MRS: DrilldownMR[] = [
  {
    id: 'EMP-1001',
    name: 'Pradeep Mishra',
    hq: 'Akbarpur',
    patch: 'Akbarpur SV Road & Link Road',
    phone: '+91 98200 10001',
    punchTime: '09:12 AM',
    punchStatus: 'Punched In',
    battery: '88%',
    gpsAccuracy: '8m (Active Lock)',
    callsDone: 5,
    callsPlanned: 8,
    pobToday: 18450,
    monthlyTarget: 385000,
    monthlyAchieved: 268900,
    status: 'In Clinic'
  },
  {
    id: 'EMP-1002',
    name: 'Rahul Sharma',
    hq: 'Faizabad',
    patch: 'Lokhandwala & Chakala',
    phone: '+91 98200 10002',
    punchTime: '08:55 AM',
    punchStatus: 'Punched In',
    battery: '76%',
    gpsAccuracy: '7m (Active Lock)',
    callsDone: 7,
    callsPlanned: 10,
    pobToday: 24200,
    monthlyTarget: 420000,
    monthlyAchieved: 310500,
    status: 'At Chemist'
  },
  {
    id: 'EMP-1005',
    name: 'Rohan Deshmukh',
    hq: 'Bandra',
    patch: 'Linking Road & Hill Road',
    phone: '+91 98200 10005',
    punchTime: '09:00 AM',
    punchStatus: 'Punched In',
    battery: '92%',
    gpsAccuracy: '6m (Active Lock)',
    callsDone: 6,
    callsPlanned: 8,
    pobToday: 14200,
    monthlyTarget: 390000,
    monthlyAchieved: 320000,
    status: 'In Clinic'
  },
  {
    id: 'EMP-1004',
    name: 'Sanjay Shinde',
    hq: 'Borivali',
    patch: 'Shimpoli & IC Colony',
    phone: '+91 98200 10004',
    punchTime: '09:45 AM',
    punchStatus: 'Punched In',
    battery: '81%',
    gpsAccuracy: '9m (Active Lock)',
    callsDone: 3,
    callsPlanned: 8,
    pobToday: 6500,
    monthlyTarget: 360000,
    monthlyAchieved: 280000,
    status: 'Traveling'
  }
];

export const AM_CALL_LOGS: DrilldownCallLog[] = [
  {
    id: 'CALL-101',
    mrId: 'EMP-1001',
    mrName: 'Pradeep Mishra',
    territory: 'Akbarpur (SV Road)',
    doctorName: 'Dr. Suresh Shah (MBBS, MD)',
    specialty: 'Consultant Physician',
    hospital: 'Shah Poly Clinic, Akbarpur West',
    callTime: '10:05 AM',
    callType: 'Doctor Core (Class A)',
    durationMins: 14,
    detailedBrands: ['XYZ-Clav 625 (Amoxy+Clav)', 'Pantoxy-DSR'],
    samplesGiven: '2x XYZ-Clav 625 Catch Cover',
    pobAmount: 0,
    isJointCall: true,
    remarks: 'Doctor agreed to prescribe XYZ-Clav in recurrent chest infections.'
  },
  {
    id: 'CALL-102',
    mrId: 'EMP-1001',
    mrName: 'Pradeep Mishra',
    territory: 'Akbarpur (Link Road)',
    doctorName: 'Dr. Anita Deshmukh (MS Ortho)',
    specialty: 'Orthopedic Surgeon',
    hospital: 'Deshmukh Bone & Joint Care',
    callTime: '10:45 AM',
    callType: 'Doctor Core (Class A)',
    durationMins: 12,
    detailedBrands: ['Acecloxy-SP', 'Calci-XYZ D3'],
    samplesGiven: '2x Acecloxy-SP Strips',
    pobAmount: 0,
    isJointCall: true,
    remarks: 'Joint call with AM Vikram Singh. Discussed post-op pain management.'
  },
  {
    id: 'CALL-103',
    mrId: 'EMP-1001',
    mrName: 'Pradeep Mishra',
    territory: 'Akbarpur (Station Road)',
    doctorName: 'Mumbai Central Pharmacy',
    specialty: 'Retail Chemist RCPA',
    hospital: 'Station Road, Akbarpur',
    callTime: '11:20 AM',
    callType: 'Chemist RCPA',
    durationMins: 18,
    detailedBrands: ['XYZ-Clav 625', 'Pantoxy-DSR', 'Acecloxy-SP'],
    samplesGiven: 'LBL & Reminder Pad',
    pobAmount: 9600,
    isJointCall: false,
    remarks: 'Booked POB of 15 boxes XYZ-Clav & 20 boxes Pantoxy-DSR.'
  },
  {
    id: 'CALL-106',
    mrId: 'EMP-1005',
    mrName: 'Amit Singh',
    territory: 'Varanasi (Lanka)',
    doctorName: 'Dr. S.K. Bhattacharya (MD Cardio)',
    specialty: 'Cardiologist',
    hospital: 'BHU Trauma Center / Lanka Clinic',
    callTime: '09:40 AM',
    callType: 'Doctor Core (Class A)',
    durationMins: 16,
    detailedBrands: ['Cardiorax-TG 20', 'Raxoloc-AM 50'],
    samplesGiven: '3x Cardiorax-TG Strips',
    pobAmount: 0,
    isJointCall: false,
    remarks: 'Detailed lipid lowering efficacy of Cardiorax-TG. Doctor positive on hospital pharmacy stocking.'
  },
  {
    id: 'CALL-107',
    mrId: 'EMP-1005',
    mrName: 'Amit Singh',
    territory: 'Varanasi (Lanka)',
    doctorName: 'BHU Gate Chemist Plaza',
    specialty: 'Hospital Chemist',
    hospital: 'Lanka Main Chauraha',
    callTime: '10:30 AM',
    callType: 'Chemist RCPA',
    durationMins: 20,
    detailedBrands: ['Cardiorax-TG 20', 'Pantorax-DSR', 'Raxon-CV 625'],
    samplesGiven: 'Reminder Pen & Stock List',
    pobAmount: 14200,
    isJointCall: false,
    remarks: 'Heavy POB booked for cardiac & antibiotic line.'
  },
  {
    id: 'CALL-108',
    mrId: 'EMP-1002',
    mrName: 'Rahul Singh',
    territory: 'Ayodhya (Civil Lines)',
    doctorName: 'Dr. Anoop Srivastava (MS Gen Surgery)',
    specialty: 'Surgeon',
    hospital: 'City Surgical Hospital, Rikabganj',
    callTime: '10:15 AM',
    callType: 'Doctor Core (Class A)',
    durationMins: 14,
    detailedBrands: ['Raxon-CV 625 IV/Tab', 'Aceclorax-SP'],
    samplesGiven: '2x Raxon-CV Strips',
    pobAmount: 0,
    isJointCall: false,
    remarks: 'Assured inclusion in elective surgical protocol.'
  },
  {
    id: 'CALL-109',
    mrId: 'EMP-1002',
    mrName: 'Rahul Singh',
    territory: 'Ayodhya (Civil Lines)',
    doctorName: 'Ayodhya Care Pharmacy',
    specialty: 'Chemist Retailer',
    hospital: 'Civil Lines Road',
    callTime: '11:45 AM',
    callType: 'Chemist RCPA',
    durationMins: 15,
    detailedBrands: ['Raxon-CV 625', 'Aceclorax-SP'],
    samplesGiven: 'Price List',
    pobAmount: 7800,
    isJointCall: false,
    remarks: 'POB order dispatched to Ayodhya Pharma Distributors.'
  },
  {
    id: 'CALL-110',
    mrId: 'EMP-1004',
    mrName: 'Sumit Verma',
    territory: 'Kanpur (Swaroop Nagar)',
    doctorName: 'Dr. V.K. Agnihotri (MD Gastro)',
    specialty: 'Gastroenterologist',
    hospital: 'Agnihotri Digestive Clinic',
    callTime: '10:30 AM',
    callType: 'Doctor Core (Class A)',
    durationMins: 15,
    detailedBrands: ['Pantorax-DSR', 'Raxoflux-L Syrup'],
    samplesGiven: '3x Pantorax-DSR Samples',
    pobAmount: 0,
    isJointCall: false,
    remarks: 'Detailed acid rebound inhibition and superior PPI profile.'
  },
  {
    id: 'CALL-111',
    mrId: 'EMP-1004',
    mrName: 'Sumit Verma',
    territory: 'Kanpur (Swaroop Nagar)',
    doctorName: 'Medical College Chemist Corner',
    specialty: 'Chemist Retailer',
    hospital: 'Gate No. 2, Medical College',
    callTime: '12:00 PM',
    callType: 'Chemist RCPA',
    durationMins: 18,
    detailedBrands: ['Pantorax-DSR', 'Raxon-CV 625'],
    samplesGiven: 'Stockist Pad',
    pobAmount: 6500,
    isJointCall: false,
    remarks: 'POB dispatched to Ganga Pharma Agencies.'
  }
];

export const AM_POB_ORDERS: DrilldownPobOrder[] = [
  {
    orderId: 'POB-GOR-0089',
    mrName: 'Pradeep Mishra',
    territory: 'Akbarpur (SV Road)',
    chemistName: 'Mumbai Central Pharmacy',
    chemistAddress: 'Main Station Road, Akbarpur West',
    stockistName: 'Mumbai Central Pharma Stockist (Akbarpur)',
    orderTime: '11:25 AM',
    items: [
      { brand: 'XYZ-Clav 625', pack: '10x10 Alu-Alu', qty: 15, rate: 165, amount: 2475 },
      { brand: 'Pantoxy-DSR', pack: '10x10 Alu-Alu', qty: 20, rate: 120, amount: 2400 },
      { brand: 'Acecloxy-SP', pack: '10x10 Strip', qty: 20, rate: 90, amount: 1800 },
      { brand: 'Calci-XYZ D3', pack: '10x15 Tab', qty: 15, rate: 80, amount: 1200 }
    ],
    totalAmount: 7875,
    paymentMode: 'Credit (14 Days)',
    status: 'Sent to Stockist'
  },
  {
    orderId: 'POB-AND-0090',
    mrName: 'Rahul Sharma',
    territory: 'Faizabad (Lokhandwala)',
    chemistName: 'Lokhandwala Chemist Plaza',
    chemistAddress: 'Market Chowk, Lokhandwala, Faizabad',
    stockistName: 'Suburban Drug Distributors (Faizabad)',
    orderTime: '01:05 PM',
    items: [
      { brand: 'Cefoxy-200', pack: '10x10 Strip', qty: 18, rate: 130, amount: 2340 },
      { brand: 'Acecloxy-SP', pack: '10x10 Strip', qty: 20, rate: 90, amount: 1800 },
      { brand: 'Coldxy-Total', pack: '20x10 Strip', qty: 15, rate: 60, amount: 900 },
      { brand: 'Pantoxy-DSR', pack: '10x10 Alu-Alu', qty: 15, rate: 120, amount: 1800 }
    ],
    totalAmount: 6840,
    paymentMode: 'Credit (14 Days)',
    status: 'Sent to Stockist'
  }
];

export const AM_MONTHLY_QUOTA: DrilldownQuotaItem[] = [
  {
    territory: 'Akbarpur HQ',
    repOrAm: 'Pradeep Mishra',
    target: 385000,
    achieved: 268900,
    percent: 69.8,
    pobToday: 18450,
    topBrand: 'XYZ-Clav 625 (₹1.2L)',
    gap: 116100,
    requiredDailyRunRate: 11610
  },
  {
    territory: 'Faizabad / Ayodhya HQ',
    repOrAm: 'Rahul Sharma',
    target: 420000,
    achieved: 310500,
    percent: 73.9,
    pobToday: 24200,
    topBrand: 'Acecloxy-SP (₹98k)',
    gap: 109500,
    requiredDailyRunRate: 10950
  },
  {
    territory: 'Bandra HQ',
    repOrAm: 'Rohan Deshmukh',
    target: 390000,
    achieved: 320000,
    percent: 82.0,
    pobToday: 14200,
    topBrand: 'Cardio-XYZ (₹1.1L)',
    gap: 70000,
    requiredDailyRunRate: 7000
  },
  {
    territory: 'Borivali HQ',
    repOrAm: 'Sanjay Shinde',
    target: 360000,
    achieved: 280000,
    percent: 77.8,
    pobToday: 6500,
    topBrand: 'Pantoxy-DSR (₹88k)',
    gap: 80000,
    requiredDailyRunRate: 8000
  }
];

// -------------------------------------------------------------
// 2. RM DASHBOARD DRILLDOWN DATA
// -------------------------------------------------------------

export const RM_AREAS_BREAKDOWN: DrilldownAreaRegion[] = [
  {
    areaName: 'Lucknow Central Area',
    amName: 'Vikram Singh',
    hq: 'Lucknow HQ',
    mrsCount: 6,
    stockistsCount: 8,
    target: 2450000,
    achieved: 1890000,
    percent: 77.1,
    growthYoY: '+16.4%',
    mtpCompliance: 96.2
  },
  {
    areaName: 'Western Suburbs Area',
    amName: 'Rohan Deshmukh',
    hq: 'Bandra HQ',
    mrsCount: 6,
    stockistsCount: 7,
    target: 2600000,
    achieved: 2210000,
    percent: 85.0,
    growthYoY: '+18.1%',
    mtpCompliance: 95.0
  },
  {
    areaName: 'Thane & Navi Mumbai',
    amName: 'Sanjay Shinde',
    hq: 'Thane HQ',
    mrsCount: 5,
    stockistsCount: 6,
    target: 2800000,
    achieved: 2350000,
    percent: 83.9,
    growthYoY: '+14.8%',
    mtpCompliance: 92.4
  },
  {
    areaName: 'Central Suburbs Area',
    amName: 'Nitin Kulkarni',
    hq: 'Dadar HQ',
    mrsCount: 5,
    stockistsCount: 7,
    target: 1950000,
    achieved: 1500000,
    percent: 76.9,
    growthYoY: '+12.5%',
    mtpCompliance: 94.1
  }
];

export const RM_HIERARCHY_TEAMS = [
  {
    amName: 'Vikram Singh',
    area: 'Lucknow Central Area',
    hq: 'Lucknow HQ',
    phone: '+91 98200 20001',
    reps: [
      { name: 'Pradeep Mishra', hq: 'Akbarpur', calls: '5/8', pob: '₹18,450', phone: '+91 98200 10001' },
      { name: 'Rahul Sharma', hq: 'Faizabad', calls: '7/10', pob: '₹24,200', phone: '+91 98200 10002' },
      { name: 'Rohan Deshmukh', hq: 'Bandra', calls: '6/8', pob: '₹14,200', phone: '+91 98200 10005' },
      { name: 'Sanjay Shinde', hq: 'Borivali', calls: '3/8', pob: '₹6,500', phone: '+91 98200 10004' }
    ]
  },
  {
    amName: 'Nitin Kulkarni (AM)',
    area: 'Central Suburbs Area',
    hq: 'Dadar HQ',
    phone: '+91 98200 20002',
    reps: [
      { name: 'Rajesh Patil', hq: 'Dadar', calls: '6/8', pob: '₹11,200', phone: '+91 98200 10011' },
      { name: 'Vipin Shah', hq: 'Kurla', calls: '5/7', pob: '₹9,800', phone: '+91 98200 10012' },
      { name: 'Siddharth Rane', hq: 'Ghatkopar', calls: '7/8', pob: '₹13,500', phone: '+91 98200 10013' },
      { name: 'Deepak More', hq: 'Mulund', calls: '4/8', pob: '₹8,400', phone: '+91 98200 10014' }
    ]
  }
];

export const RM_STOCKISTS_DATA = [
  { name: 'Mumbai Central Pharma Stockist', hq: 'Akbarpur', area: 'Mumbai Suburban', monthlyTurnover: 620000, creditLimit: 900000, outstanding: 185000, health: '99% Clean', status: 'Active' },
  { name: 'Suburban Drug Distributors', hq: 'Faizabad', area: 'Mumbai Suburban', monthlyTurnover: 580000, creditLimit: 850000, outstanding: 140000, health: '98% Clean', status: 'Active' },
  { name: 'Lucknow Health Agencies', hq: 'Lucknow', area: 'Colaba & Fort', monthlyTurnover: 780000, creditLimit: 1100000, outstanding: 210000, health: '100% Clean', status: 'Active' },
  { name: 'Metro Drug Distributors', hq: 'Bandra', area: 'Bandra West', monthlyTurnover: 490000, creditLimit: 700000, outstanding: 195000, health: '97% Clean', status: 'Active' }
];

// -------------------------------------------------------------
// 3. ZM DASHBOARD DRILLDOWN DATA
// -------------------------------------------------------------

export const ZM_REGIONS_BREAKDOWN: DrilldownZonalRegion[] = [
  {
    regionName: 'UP East Region',
    rmName: 'R.K. Tiwari',
    hq: 'Lucknow Regional HQ',
    amCount: 4,
    mrCount: 16,
    target: 3960000,
    achieved: 3439200,
    percent: 86.8,
    stockistsCount: 24,
    growthYoY: '+14.2%',
    keyDriver: 'Anti-infectives & PPIs'
  },
  {
    regionName: 'UP West & NCR',
    rmName: 'Dinesh Pandey',
    hq: 'Noida Regional HQ',
    amCount: 4,
    mrCount: 18,
    target: 4500000,
    achieved: 4185000,
    percent: 93.0,
    stockistsCount: 32,
    growthYoY: '+18.5%',
    keyDriver: 'Cardio-Diabetic Segment'
  },
  {
    regionName: 'Bihar & Jharkhand',
    rmName: 'Anil Mukhopadhyay',
    hq: 'Patna Regional HQ',
    amCount: 4,
    mrCount: 15,
    target: 4200000,
    achieved: 3696000,
    percent: 88.0,
    stockistsCount: 28,
    growthYoY: '+16.0%',
    keyDriver: 'General Therapeutics'
  },
  {
    regionName: 'Delhi, Haryana & Punjab',
    rmName: 'Gurpreet Singh',
    hq: 'Chandigarh Regional HQ',
    amCount: 4,
    mrCount: 15,
    target: 3840000,
    achieved: 3500000,
    percent: 91.1,
    stockistsCount: 28,
    growthYoY: '+19.2%',
    keyDriver: 'Ortho & Pain Portfolio'
  }
];

export const ZM_DIVISIONS_DATA: DrilldownDivision[] = [
  {
    name: 'Cardio-Diabetic Division (Cardio-Diab)',
    head: 'Dr. Alok Verma (Division GM)',
    target: 6200000,
    achieved: 5766000,
    percent: 93.0,
    coreBrands: ['Cardiorax-TG 20', 'Raxoloc-AM 50', 'Gliclaz-M Forte', 'Telmirax-40'],
    fieldStrength: 30,
    doctorCoverage: 1280
  },
  {
    name: 'Gastro-Enterology & Anti-Infectives (Gastro)',
    head: 'Sunil Mathur (Division GM)',
    target: 5800000,
    achieved: 5220000,
    percent: 90.0,
    coreBrands: ['Pantorax-DSR', 'Raxon-CV 625', 'Ceforax-200', 'Raxoflux-L Syrup'],
    fieldStrength: 32,
    doctorCoverage: 1450
  },
  {
    name: 'Orthopedics & Pain Care (Ortho)',
    head: 'Rajesh Nair (Division GM)',
    target: 4500000,
    achieved: 3834000,
    percent: 85.2,
    coreBrands: ['Aceclorax-SP', 'Calci-Max D3', 'Jointrax-Plus', 'Raxoflam Gel'],
    fieldStrength: 22,
    doctorCoverage: 980
  }
];

export const ZM_FIELD_FORCE_SUMMARY = {
  sanctioned: 88,
  onRoll: 84,
  vacant: 4,
  attendancePercent: 97.6,
  breakdown: [
    { role: 'Regional Managers (RMs)', sanctioned: 4, onRoll: 4, activeToday: 4, percent: 100 },
    { role: 'Area Managers (AMs)', sanctioned: 16, onRoll: 16, activeToday: 16, percent: 100 },
    { role: 'Medical Representatives (MRs)', sanctioned: 68, onRoll: 64, activeToday: 62, percent: 96.8 }
  ]
};

// -------------------------------------------------------------
// COMPANY ISOLATED GETTERS FOR DRILLDOWN MODALS
// -------------------------------------------------------------

export function getDrilldownMrsForCompany(_explicitCompanyId?: string): DrilldownMR[] {
  return AM_AREA_MRS;
}

export function getDrilldownCallLogsForCompany(_explicitCompanyId?: string): DrilldownCallLog[] {
  return AM_CALL_LOGS;
}

export function getDrilldownPobOrdersForCompany(_explicitCompanyId?: string): DrilldownPobOrder[] {
  return AM_POB_ORDERS;
}

export function getDrilldownAreasForCompany(_explicitCompanyId?: string): DrilldownAreaRegion[] {
  return RM_AREAS_BREAKDOWN;
}

export function getDrilldownZonalRegionsForCompany(_explicitCompanyId?: string): DrilldownZonalRegion[] {
  return ZM_REGIONS_BREAKDOWN;
}


