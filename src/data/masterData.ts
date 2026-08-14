export interface Doctor {
  id: number;
  name: string;
  area: string;
  subArea: string;
  specialty: string;
  phone?: string;
  qualification?: string;
}

export interface Chemist {
  id: number;
  name: string;
  area: string;
  subArea: string;
  contactPerson: string;
  phone?: string;
}

export const AREAS = [
  "Akbarpur 1",
  "Shahzadpur",
  "District Hospital",
  "Medical college",
  "Tanda",
  "Baskhari",
  "Jalalpur",
  "Malipur",
  "Dostpur",
  "Maharua",
  "Iltifatganj",
  "Akbarpur 2"
];

export const INITIAL_DOCTORS: Doctor[] = [
  // Iltifatganj
  { id: 101, name: "Dr. Mohd. Tariq", area: "Iltifatganj", subArea: "Main Bazar Chowk", specialty: "General Physician", qualification: "MBBS", phone: "+91 98391 22341" },
  { id: 102, name: "Dr. Shailendra Verma", area: "Iltifatganj", subArea: "Thana Road", specialty: "Pediatrician", qualification: "MBBS, DCH", phone: "+91 94502 88412" },
  { id: 103, name: "Dr. Asif Khan", area: "Iltifatganj", subArea: "Kasba Hospital Mod", specialty: "Consultant Physician", qualification: "BAMS", phone: "+91 91254 77890" },
  { id: 104, name: "Dr. Rehana Bano", area: "Iltifatganj", subArea: "Katra Chauraha", specialty: "Gynecologist", qualification: "MBBS, DGO", phone: "+91 99365 44123" },

  // Akbarpur 1
  { id: 1, name: "Dr. Arvind Upadhyay", area: "Akbarpur 1", subArea: "Patel Nagar", specialty: "Consultant Physician", qualification: "MD Medicine", phone: "+91 98380 11223" },
  { id: 2, name: "Dr. V.K. Srivastava", area: "Akbarpur 1", subArea: "Station Road", specialty: "Cardiologist", qualification: "DM Cardio", phone: "+91 94150 44556" },
  { id: 3, name: "Dr. Pooja Tiwari", area: "Akbarpur 1", subArea: "Civil Lines", specialty: "Gynecologist", qualification: "MS Gynae", phone: "+91 99190 77889" },
  { id: 4, name: "Dr. Alok Mishra", area: "Akbarpur 1", subArea: "Old Tehsil", specialty: "Orthopedic", qualification: "MS Ortho", phone: "+91 97920 33445" },

  // Shahzadpur
  { id: 5, name: "Dr. S.P. Gupta", area: "Shahzadpur", subArea: "Dostpur Mod", specialty: "Cardiologist", qualification: "MD Medicine", phone: "+91 98390 12345" },
  { id: 6, name: "Dr. R.N. Yadav", area: "Shahzadpur", subArea: "Malipur Mod", specialty: "Orthopedic", qualification: "MS Ortho", phone: "+91 94500 67890" },
  { id: 7, name: "Dr. Anjali Agarwal", area: "Shahzadpur", subArea: "Chowk Bazar", specialty: "Pediatrician", qualification: "MBBS, MD Ped", phone: "+91 91200 99887" },
  { id: 8, name: "Dr. Sunil Kumar", area: "Shahzadpur", subArea: "Cinema Road", specialty: "General Physician", qualification: "MBBS", phone: "+91 93350 44556" },

  // District Hospital
  { id: 9, name: "Dr. M.L. Pandey", area: "District Hospital", subArea: "Emergency Wing", specialty: "General Surgeon", qualification: "MS Gen Surgery", phone: "+91 98381 22334" },
  { id: 10, name: "Dr. R.C. Maurya", area: "District Hospital", subArea: "OPD Complex", specialty: "Chest & TB Specialist", qualification: "DTCD", phone: "+91 94151 55667" },
  { id: 11, name: "Dr. Sunita Rai", area: "District Hospital", subArea: "MCH Wing", specialty: "Senior Gynecologist", qualification: "MD", phone: "+91 99191 88990" },

  // Medical college
  { id: 12, name: "Dr. Neha Sharma", area: "Medical college", subArea: "Department of OBGYN", specialty: "Gynecologist", qualification: "MS OBG", phone: "+91 97921 44556" },
  { id: 13, name: "Dr. Prateek Shukla", area: "Medical college", subArea: "Medicine Dept", specialty: "Associate Professor (Med)", qualification: "MD Med", phone: "+91 98392 33445" },
  { id: 14, name: "Dr. K.K. Singh", area: "Medical college", subArea: "Pediatrics OPD", specialty: "HOD Pediatrics", qualification: "MD Ped", phone: "+91 94501 77889" },

  // Tanda
  { id: 15, name: "Dr. Firoz Ahmad", area: "Tanda", subArea: "Mubarakpur Mod", specialty: "Consultant Physician", qualification: "MD", phone: "+91 91250 11223" },
  { id: 16, name: "Dr. S.K. Jaiswal", area: "Tanda", subArea: "Chowk Bazar", specialty: "Diabetologist", qualification: "MBBS, C.Diab", phone: "+91 93360 44556" },
  { id: 17, name: "Dr. Zeba Fatima", area: "Tanda", subArea: "Aliganj Road", specialty: "Gynecologist", qualification: "DGO", phone: "+91 98382 77889" },
  { id: 18, name: "Dr. Suresh Tripathi", area: "Tanda", subArea: "Hospital Road", specialty: "General Surgeon", qualification: "MS", phone: "+91 94152 33445" },

  // Baskhari
  { id: 19, name: "Dr. Vivek Chaurasia", area: "Baskhari", subArea: "Baskhari Chauraha", specialty: "General Physician", qualification: "MBBS", phone: "+91 99192 66778" },
  { id: 20, name: "Dr. Nisar Ahmed", area: "Baskhari", subArea: "Kichhauchha Mod", specialty: "Pediatrician", qualification: "DCH", phone: "+91 97922 99001" },
  { id: 21, name: "Dr. Rashmi Pandey", area: "Baskhari", subArea: "Main Bazar", specialty: "Gynecologist", qualification: "MBBS", phone: "+91 98393 22334" },

  // Jalalpur
  { id: 22, name: "Dr. A.K. Singh", area: "Jalalpur", subArea: "Jalalpur Market", specialty: "General Physician", qualification: "MBBS, MD", phone: "+91 94502 55667" },
  { id: 23, name: "Dr. R.K. Verma", area: "Jalalpur", subArea: "Jalalpur Chauraha", specialty: "Pediatrician", qualification: "MBBS, DCH", phone: "+91 91251 88990" },
  { id: 24, name: "Dr. Meena Srivastava", area: "Jalalpur", subArea: "Station Road", specialty: "Gynecologist", qualification: "MS", phone: "+91 93351 11223" },
  { id: 25, name: "Dr. D.P. Yadav", area: "Jalalpur", subArea: "Sabzi Mandi Road", specialty: "Orthopedic", qualification: "D.Ortho", phone: "+91 98383 44556" },

  // Malipur
  { id: 26, name: "Dr. Anand Prakash", area: "Malipur", subArea: "Station Chauraha", specialty: "General Physician", qualification: "MBBS", phone: "+91 94153 77889" },
  { id: 27, name: "Dr. Geeta Devi", area: "Malipur", subArea: "Main Market", specialty: "Gynecologist", qualification: "BAMS", phone: "+91 99193 33445" },
  { id: 28, name: "Dr. Manoj Kumar", area: "Malipur", subArea: "Hospital Road", specialty: "Consultant Physician", qualification: "MD", phone: "+91 97923 66778" },

  // Dostpur
  { id: 29, name: "Dr. Rajesh Chauhan", area: "Dostpur", subArea: "Dostpur Block Mod", specialty: "General Physician", qualification: "MBBS", phone: "+91 98394 99001" },
  { id: 30, name: "Dr. Rekha Verma", area: "Dostpur", subArea: "Main Bazar", specialty: "Gynecologist", qualification: "DGO", phone: "+91 94503 22334" },
  { id: 31, name: "Dr. Vinod Sharma", area: "Dostpur", subArea: "Bus Stand", specialty: "Pediatrician", qualification: "DCH", phone: "+91 91252 55667" },

  // Maharua
  { id: 32, name: "Dr. Anil K. Mishra", area: "Maharua", subArea: "Maharua Gola", specialty: "General Physician", qualification: "MBBS, MD", phone: "+91 93352 88990" },
  { id: 33, name: "Dr. S.K. Srivastava", area: "Maharua", subArea: "Chauraha", specialty: "Consultant Physician", qualification: "BAMS", phone: "+91 98384 11223" },
  { id: 34, name: "Dr. Vandana Singh", area: "Maharua", subArea: "Near PHC", specialty: "Gynecologist", qualification: "MBBS", phone: "+91 94154 44556" },

  // Akbarpur 2
  { id: 35, name: "Dr. H.N. Tiwari", area: "Akbarpur 2", subArea: "Lohia Nagar", specialty: "Cardiologist", qualification: "MD, DM", phone: "+91 99194 77889" },
  { id: 36, name: "Dr. Preeti Gupta", area: "Akbarpur 2", subArea: "bypass Road", specialty: "Dermatologist", qualification: "DVD, MD", phone: "+91 97924 33445" },
  { id: 37, name: "Dr. R.P. Soni", area: "Akbarpur 2", subArea: "Shahzadpur Thana Road", specialty: "ENT Specialist", qualification: "MS ENT", phone: "+91 98395 66778" }
];

export const INITIAL_CHEMISTS: Chemist[] = [
  // Iltifatganj
  { id: 201, name: "Al-Shifa Medical Agency", area: "Iltifatganj", subArea: "Main Bazar", contactPerson: "Rizwan Ahmad", phone: "+91 98391 88412" },
  { id: 202, name: "Gupta Pharma & Surgical", area: "Iltifatganj", subArea: "Kasba Mod", contactPerson: "Sandeep Gupta", phone: "+91 94502 11223" },
  { id: 203, name: "National Drug House", area: "Iltifatganj", subArea: "Thana Road", contactPerson: "Mohd. Shakeel", phone: "+91 91254 33445" },

  // Akbarpur 1
  { id: 1, name: "Balaji Medical Store", area: "Akbarpur 1", subArea: "Patel Nagar", contactPerson: "Ramesh Balaji", phone: "+91 98380 55667" },
  { id: 2, name: "Shree Ram Medical Hall", area: "Akbarpur 1", subArea: "Station Road", contactPerson: "Vikas Shukla", phone: "+91 94150 88990" },

  // Shahzadpur
  { id: 3, name: "Life Care Pharma", area: "Shahzadpur", subArea: "Dostpur Mod", contactPerson: "Amit Singh", phone: "+91 99190 11223" },
  { id: 4, name: "Kisan Medical Agency", area: "Shahzadpur", subArea: "Chowk Bazar", contactPerson: "Harish Chandra", phone: "+91 97920 44556" },

  // District Hospital
  { id: 5, name: "Apollo Pharmacy (Opp. DH)", area: "District Hospital", subArea: "Gate No 1", contactPerson: "Manoj Yadav", phone: "+91 98390 77889" },
  { id: 6, name: "Jan Aushadhi Kendra", area: "District Hospital", subArea: "Main Road", contactPerson: "Sanjay Verma", phone: "+91 94500 33445" },

  // Medical college
  { id: 7, name: "Medanta Pharma Store", area: "Medical college", subArea: "Campus Gate", contactPerson: "Dinesh Tripathi", phone: "+91 91200 66778" },

  // Tanda
  { id: 8, name: "Bombay Medical Store", area: "Tanda", subArea: "Mubarakpur Mod", contactPerson: "Tariq Anwer", phone: "+91 93350 99001" },
  { id: 9, name: "Jaiswal Medical Hall", area: "Tanda", subArea: "Chowk", contactPerson: "Sunil Jaiswal", phone: "+91 98381 22334" },

  // Baskhari
  { id: 10, name: "Faizan Medical Agency", area: "Baskhari", subArea: "Kichhauchha Mod", contactPerson: "Faizan Khan", phone: "+91 94151 55667" },

  // Jalalpur
  { id: 11, name: "Gupta Medical Store", area: "Jalalpur", subArea: "Jalalpur Market", contactPerson: "Raju Gupta", phone: "+91 99191 88990" },
  { id: 12, name: "Yadav Pharmacy", area: "Jalalpur", subArea: "Jalalpur Chauraha", contactPerson: "Suresh Yadav", phone: "+91 97921 11223" },

  // Malipur
  { id: 13, name: "Maa Durga Medical Hall", area: "Malipur", subArea: "Station Chauraha", contactPerson: "Pramod Singh", phone: "+91 98392 44556" },

  // Dostpur
  { id: 14, name: "Chauhan Medical Store", area: "Dostpur", subArea: "Block Mod", contactPerson: "Rajeev Chauhan", phone: "+91 94501 77889" },

  // Maharua
  { id: 15, name: "Shiva Medical Agency", area: "Maharua", subArea: "Gola Bazar", contactPerson: "Shivendra Pratap", phone: "+91 91250 33445" },

  // Akbarpur 2
  { id: 16, name: "Apex Pharmacy", area: "Akbarpur 2", subArea: "Lohia Nagar", contactPerson: "Gaurav Soni", phone: "+91 93360 66778" }
];

// Helper functions with localStorage persistence
export const getDoctorsList = (): Doctor[] => {
  try {
    const saved = localStorage.getItem('raxon_doctors_master');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Doctors master read error:", e);
  }
  return INITIAL_DOCTORS;
};

export const saveDoctorsList = (doctors: Doctor[]) => {
  try {
    localStorage.setItem('raxon_doctors_master', JSON.stringify(doctors));
  } catch (e) {
    console.error("Doctors master save error:", e);
  }
};

export const getChemistsList = (): Chemist[] => {
  try {
    const saved = localStorage.getItem('raxon_chemists_master');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Chemists master read error:", e);
  }
  return INITIAL_CHEMISTS;
};

export const saveChemistsList = (chemists: Chemist[]) => {
  try {
    localStorage.setItem('raxon_chemists_master', JSON.stringify(chemists));
  } catch (e) {
    console.error("Chemists master save error:", e);
  }
};
