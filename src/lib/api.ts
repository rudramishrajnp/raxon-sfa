import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, serverTimestamp, orderBy } from 'firebase/firestore';

// Hardcoded current user for demo purposes (Pradeep Mishra - MR)
export const CURRENT_USER = {
  id: 'user_pradeep_001',
  name: 'Pradeep Mishra',
  role: 'MR',
  managerId: 'manager_001'
};

// MTP Functions
export const submitMTP = async (monthYear: string, plans: Record<string, string>) => {
  const mtpRef = doc(db, 'mtps', `${CURRENT_USER.id}_${monthYear}`);
  await setDoc(mtpRef, {
    userId: CURRENT_USER.id,
    userName: CURRENT_USER.name,
    managerId: CURRENT_USER.managerId,
    monthYear,
    plans,
    status: 'submitted',
    submittedAt: serverTimestamp(),
  });
};

export const getMTP = async (monthYear: string) => {
  const mtpRef = doc(db, 'mtps', `${CURRENT_USER.id}_${monthYear}`);
  const mtpSnap = await getDoc(mtpRef);
  if (mtpSnap.exists()) {
    return mtpSnap.data();
  }
  return null;
};

// DCR Functions
export const saveDCRCheckIn = async (date: string, area: string, doctorId: number, location?: {lat: number, lng: number}) => {
  const dcrRef = doc(db, 'dcrs', `${CURRENT_USER.id}_${date}`);
  const dcrSnap = await getDoc(dcrRef);
  
  const checkIn = {
    doctorId,
    timestamp: new Date().toISOString(),
    status: 'visited',
    location: location || null
  };

  if (dcrSnap.exists()) {
    const existingData = dcrSnap.data();
    const checkIns = existingData.checkIns || [];
    const filteredCheckIns = checkIns.filter((c: any) => c.doctorId !== doctorId);
    filteredCheckIns.push(checkIn);
    
    await updateDoc(dcrRef, {
      checkIns: filteredCheckIns,
      lastUpdated: serverTimestamp()
    });
  } else {
    await setDoc(dcrRef, {
      userId: CURRENT_USER.id,
      date,
      area,
      checkIns: [checkIn],
      createdAt: serverTimestamp()
    });
  }
};

export const getDCR = async (date: string) => {
  const dcrRef = doc(db, 'dcrs', `${CURRENT_USER.id}_${date}`);
  const dcrSnap = await getDoc(dcrRef);
  if (dcrSnap.exists()) {
    return dcrSnap.data();
  }
  return null;
};

// Team Approvals Functions (For Manager)
export const getPendingMTPs = async () => {
  const q = query(
    collection(db, 'mtps'), 
    where('managerId', '==', CURRENT_USER.managerId),
    where('status', '==', 'submitted')
  );
  
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const approveMTP = async (mtpId: string) => {
  const mtpRef = doc(db, 'mtps', mtpId);
  await updateDoc(mtpRef, {
    status: 'approved',
    approvedAt: serverTimestamp()
  });
};
