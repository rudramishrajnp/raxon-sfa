export interface SampleItem {
  id: string;
  name: string;
  pack: string;
}

export interface GiftItem {
  id: string;
  name: string;
  type: string;
}

export interface BrandProduct {
  id: string;
  name: string;
  composition: string;
  ptr: number;
  category: string;
}

export interface POBItemDetail {
  id?: string;
  productName: string;
  quantity: number;
  manualValue: number;
  masterScheme?: string;
  offeredScheme?: string;
  isSchemeDeviation?: boolean;
  approvalStatus?: 'Direct_Approved' | 'Pending_Manager_Approval' | 'Approved' | 'Rejected';
  approvalId?: string;
}

export interface CallReportDetail {
  callTargetType?: 'doctor' | 'chemist';
  doctorId?: number;
  doctorName?: string;
  doctorSpecialty?: string;
  chemistId?: number;
  chemistName?: string;
  timestamp: string;
  location?: { lat: number; lng: number; accuracy?: number; address?: string } | null;
  // Geo-Fencing & Verification
  geoDistanceMeters?: number;
  geoVerified?: boolean; // true if within 100m
  geoDeviationReason?: string; // Reason if > 100m
  clinicCoordinates?: { lat: number; lng: number };
  // Joint Working - Supports Multiple Managers
  isJointWorking: boolean;
  jointManagers?: string[]; // e.g. ["Rahul Sharma (AM)", "R.K. Tiwari (RM)"]
  jointManagerName: string; // Formatted summary
  jointManagerRole: string; // AM / RM / ZM / Multi
  jointWorkingNotes?: string; // Joint coaching feedback / observations
  jointSignOffStatus?: string; // Verified by AM/RM/ZM
  // Samples
  samplesGiven: { sampleName: string; quantity: number }[];
  // Gifts / Inputs
  giftsGiven: { giftName: string; quantity: number }[];
  // POB Orders (Brand, Qty, Field Scheme, Approval & MR Manual Value)
  pobOrders: POBItemDetail[];
  pobTotalValue: number;
  pobConfirmedValue?: number;
  pobPendingApprovalValue?: number;
  chemistBookedWith?: string;
  // Chemist-specific details
  stockAvailable?: boolean;
  outstandingRemarks?: string;
  // Feedback & Remarks
  callType: string;
  doctorFeedback: string;
  nextFollowUpDate?: string;
  remarks: string;
}

export const PHARMA_SAMPLES_LIST: SampleItem[] = [
  { id: 'SMP-01', name: 'Raxon-CV 625 Catch Cover (2 Tab)', pack: 'Catch Cover 2s' },
  { id: 'SMP-02', name: 'Raxodil-D Foil Pack (2 Cap)', pack: 'Foil Pack 2s' },
  { id: 'SMP-03', name: 'Raxoclav Dry Syrup 15ml', pack: 'Bottle 15ml' },
  { id: 'SMP-04', name: 'CardioRax-AM Sample 2s', pack: 'Alu-Alu 2s' },
  { id: 'SMP-05', name: 'GlyciRax-M 500 Sample 2s', pack: 'Blister 2s' },
  { id: 'SMP-06', name: 'DermaRax-KT Trial 30ml', pack: 'Mini Bottle 30ml' },
  { id: 'SMP-07', name: 'RaxoCal-D3 Max 2s', pack: 'Strip 2s' },
  { id: 'SMP-08', name: 'Montrax-LC Kid Sample 2s', pack: 'Alu-Alu 2s' },
  { id: 'SMP-09', name: 'Raxon-SP Sample 2s', pack: 'Alu-Alu 2s' },
];

export const PHARMA_GIFTS_LIST: GiftItem[] = [
  { id: 'GFT-01', name: 'Doctor Table Top Prescription Pad Holder', type: 'Promotional Input' },
  { id: 'GFT-02', name: 'Raxon Executive Ball Pen & Stylus Set', type: 'Detailing Gift' },
  { id: 'GFT-03', name: 'Table Calendar 2026 / Medical Planner', type: 'Desk Input' },
  { id: 'GFT-04', name: 'CardioRax Visual Aid 2026 (LBL Folder)', type: 'Scientific Input' },
  { id: 'GFT-05', name: 'Stethoscope ID Tag & Penlight Kit', type: 'Clinical Utility' },
  { id: 'GFT-06', name: 'Digital Table Clock with Thermometer', type: 'Executive Gift' },
];

export const PHARMA_BRANDS_LIST: BrandProduct[] = [
  { id: 'PRD-001', name: 'Raxon-CV 625 Tab', composition: 'Amoxicillin 500mg + Clavulanic Acid 125mg', ptr: 152.00, category: 'Tablet' },
  { id: 'PRD-002', name: 'Raxodil-D Cap', composition: 'Rabeprazole 20mg + Domperidone 30mg SR', ptr: 95.50, category: 'Capsule' },
  { id: 'PRD-003', name: 'Raxoclav Dry Syrup', composition: 'Amoxicillin 200mg + Clavulanate 28.5mg / 5ml', ptr: 62.00, category: 'Syrup' },
  { id: 'PRD-004', name: 'CardioRax-AM Tab', composition: 'Telmisartan 40mg + Amlodipine 5mg', ptr: 81.00, category: 'Tablet' },
  { id: 'PRD-005', name: 'GlyciRax-M 500 Tab', composition: 'Glimepiride 2mg + Metformin 500mg SR', ptr: 68.00, category: 'Tablet' },
  { id: 'PRD-006', name: 'DermaRax-KT Shampoo', composition: 'Ketoconazole 2% + Zinc Pyrithione 1%', ptr: 124.00, category: 'Lotion' },
  { id: 'PRD-007', name: 'RaxoCal-D3 Max Tab', composition: 'Calcium Citrate 1000mg + Vit D3 400IU + Zinc', ptr: 88.00, category: 'Tablet' },
  { id: 'PRD-008', name: 'Montrax-LC Kid Tab', composition: 'Levocetirizine 2.5mg + Montelukast 4mg', ptr: 58.00, category: 'Tablet' },
  { id: 'PRD-009', name: 'Raxon-SP Tab', composition: 'Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg', ptr: 82.50, category: 'Tablet' },
];

export const MANAGERS_LIST = [
  { id: 'MGR-01', name: 'Rahul Sharma', role: 'Area Manager (AM)', code: 'AM', hq: 'Lucknow HQ' },
  { id: 'MGR-02', name: 'R.K. Tiwari', role: 'Regional Manager (RM)', code: 'RM', hq: 'Uttar Pradesh East' },
  { id: 'MGR-03', name: 'V.P. Singhania', role: 'Zonal Manager (ZM)', code: 'ZM', hq: 'North Zone' },
];
