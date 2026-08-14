import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "cosmic-journal-j9v0l",
  appId: "1:636762845490:web:92844eb07494ca3493672b",
  apiKey: "AIzaSyBIy8Z0ZxxR6QB_01i_uxIZYHV5-Er5h2Q",
  authDomain: "cosmic-journal-j9v0l.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-hi-ae59758a-d932-4d1c-918e-bd0a5b0eaceb",
  storageBucket: "cosmic-journal-j9v0l.firebasestorage.app",
  messagingSenderId: "636762845490",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
