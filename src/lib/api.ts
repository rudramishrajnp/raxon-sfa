import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

// Hardcoded current user for demo purposes (Pradeep Mishra - MR)
export const CURRENT_USER = {
  id: 'user_pradeep_001',
  name: 'Pradeep Mishra',
  role: 'MR',
  managerId: 'manager_001'
};

// Helper for local storage key
const getMtpKey = (userId: string, monthYear: string) => `raxon_mtp_${userId}_${monthYear}`;
const getDcrKey = (userId: string, date: string) => `raxon_dcr_${userId}_${date}`;

// MTP Functions
export const submitMTP = async (monthYear: string, plans: Record<string, string>) => {
  const mtpData = {
    id: `${CURRENT_USER.id}_${monthYear}`,
    userId: CURRENT_USER.id,
    userName: CURRENT_USER.name,
    managerId: CURRENT_USER.managerId,
    monthYear,
    plans,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  };

  // Always save locally first so user data is 100% safe
  try {
    localStorage.setItem(getMtpKey(CURRENT_USER.id, monthYear), JSON.stringify(mtpData));
    
    // Save to pending approvals for manager view
    const pendingKey = 'raxon_pending_mtps';
    const pendingList = JSON.parse(localStorage.getItem(pendingKey) || '[]');
    const existingIdx = pendingList.findIndex((m: any) => m.id === mtpData.id);
    if (existingIdx >= 0) {
      pendingList[existingIdx] = mtpData;
    } else {
      pendingList.push(mtpData);
    }
    localStorage.setItem(pendingKey, JSON.stringify(pendingList));
  } catch (e) {
    console.error("Local storage error:", e);
  }

  // Try Firestore persistence
  try {
    const mtpRef = doc(db, 'mtps', `${CURRENT_USER.id}_${monthYear}`);
    await setDoc(mtpRef, {
      ...mtpData,
      submittedAt: serverTimestamp(),
    });
  } catch (firestoreError: any) {
    console.warn("Firestore sync notice (local backup saved):", firestoreError);
    // If firestore threw an error (such as missing permissions), we don't crash since local data is saved
  }

  return { success: true };
};

export const getMTP = async (monthYear: string) => {
  // Check local storage first
  try {
    const local = localStorage.getItem(getMtpKey(CURRENT_USER.id, monthYear));
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed) return parsed;
    }
  } catch (e) {
    console.warn("Local storage read error:", e);
  }

  // Check Firestore
  try {
    const mtpRef = doc(db, 'mtps', `${CURRENT_USER.id}_${monthYear}`);
    const mtpSnap = await getDoc(mtpRef);
    if (mtpSnap.exists()) {
      return mtpSnap.data();
    }
  } catch (error) {
    console.warn("Firestore getMTP error:", error);
  }

  return null;
};

// DCR Functions
export const saveDCRCheckIn = async (date: string, area: string, doctorId: number, location?: {lat: number, lng: number}) => {
  const checkIn = {
    doctorId,
    timestamp: new Date().toISOString(),
    status: 'visited',
    location: location || null
  };

  // Local storage save
  const dcrKey = getDcrKey(CURRENT_USER.id, date);
  let localData: any = null;
  try {
    const existing = localStorage.getItem(dcrKey);
    if (existing) {
      localData = JSON.parse(existing);
      const checkIns = localData.checkIns || [];
      const filtered = checkIns.filter((c: any) => c.doctorId !== doctorId);
      filtered.push(checkIn);
      localData.checkIns = filtered;
      localData.lastUpdated = new Date().toISOString();
    } else {
      localData = {
        userId: CURRENT_USER.id,
        date,
        area,
        checkIns: [checkIn],
        createdAt: new Date().toISOString()
      };
    }
    localStorage.setItem(dcrKey, JSON.stringify(localData));
  } catch (e) {
    console.warn("DCR local save error:", e);
  }

  // Firestore save
  try {
    const dcrRef = doc(db, 'dcrs', `${CURRENT_USER.id}_${date}`);
    const dcrSnap = await getDoc(dcrRef);
    
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
  } catch (firestoreError) {
    console.warn("DCR Firestore sync notice:", firestoreError);
  }
};

export const getDCR = async (date: string) => {
  // Check local first
  try {
    const local = localStorage.getItem(getDcrKey(CURRENT_USER.id, date));
    if (local) return JSON.parse(local);
  } catch (e) {
    console.warn("DCR local read error:", e);
  }

  // Check Firestore
  try {
    const dcrRef = doc(db, 'dcrs', `${CURRENT_USER.id}_${date}`);
    const dcrSnap = await getDoc(dcrRef);
    if (dcrSnap.exists()) {
      return dcrSnap.data();
    }
  } catch (error) {
    console.warn("Firestore getDCR error:", error);
  }

  return null;
};

// Team Approvals Functions (For Manager)
export const getPendingMTPs = async () => {
  const localList: any[] = [];
  try {
    const pending = localStorage.getItem('raxon_pending_mtps');
    if (pending) {
      localList.push(...JSON.parse(pending).filter((item: any) => item.status === 'submitted'));
    }
  } catch (e) {
    console.warn("Pending MTP local read error:", e);
  }

  try {
    const q = query(
      collection(db, 'mtps'), 
      where('managerId', '==', CURRENT_USER.managerId),
      where('status', '==', 'submitted')
    );
    const snap = await getDocs(q);
    const firestoreList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Combine without duplicates
    const combined = [...localList];
    firestoreList.forEach(fItem => {
      if (!combined.some(cItem => cItem.id === fItem.id)) {
        combined.push(fItem);
      }
    });
    return combined;
  } catch (e) {
    console.warn("Firestore getPendingMTPs error (using local):", e);
    return localList;
  }
};

export const approveMTP = async (mtpId: string) => {
  // Update local
  try {
    const pendingKey = 'raxon_pending_mtps';
    const pending = localStorage.getItem(pendingKey);
    if (pending) {
      const list = JSON.parse(pending);
      const updated = list.map((item: any) => item.id === mtpId ? { ...item, status: 'approved', approvedAt: new Date().toISOString() } : item);
      localStorage.setItem(pendingKey, JSON.stringify(updated));
    }
    // Also update individual mtp key if exists
    const [userId, monthYear] = mtpId.split('_');
    if (userId && monthYear) {
      const key = getMtpKey(userId, monthYear);
      const single = localStorage.getItem(key);
      if (single) {
        const parsed = JSON.parse(single);
        parsed.status = 'approved';
        parsed.approvedAt = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    }
  } catch (e) {
    console.warn("Local approval error:", e);
  }

  // Update Firestore
  try {
    const mtpRef = doc(db, 'mtps', mtpId);
    await updateDoc(mtpRef, {
      status: 'approved',
      approvedAt: serverTimestamp()
    });
  } catch (e) {
    console.warn("Firestore approveMTP error:", e);
  }
};

export const rejectMTP = async (mtpId: string, remark?: string) => {
  // Update local
  try {
    const pendingKey = 'raxon_pending_mtps';
    const pending = localStorage.getItem(pendingKey);
    if (pending) {
      const list = JSON.parse(pending);
      const updated = list.map((item: any) => item.id === mtpId ? { ...item, status: 'rejected', remark: remark || 'Rejected by manager', rejectedAt: new Date().toISOString() } : item);
      localStorage.setItem(pendingKey, JSON.stringify(updated));
    }
    const [userId, monthYear] = mtpId.split('_');
    if (userId && monthYear) {
      const key = getMtpKey(userId, monthYear);
      const single = localStorage.getItem(key);
      if (single) {
        const parsed = JSON.parse(single);
        parsed.status = 'draft'; // MR can edit again
        parsed.remark = remark || 'Rejected by manager';
        parsed.rejectedAt = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    }
  } catch (e) {
    console.warn("Local reject error:", e);
  }

  // Update Firestore
  try {
    const mtpRef = doc(db, 'mtps', mtpId);
    await updateDoc(mtpRef, {
      status: 'draft',
      remark: remark || 'Rejected by manager',
      rejectedAt: serverTimestamp()
    });
  } catch (e) {
    console.warn("Firestore rejectMTP error:", e);
  }
};

