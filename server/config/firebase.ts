import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging as getAdminMessaging } from 'firebase-admin/messaging';
import { env } from './env.js';

let isFirebaseInitialized = false;
let firebaseApp: any = null;

export const initFirebase = () => {
  if (isFirebaseInitialized) return;

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseApp = initializeApp({
        credential: cert(serviceAccount)
      });
      isFirebaseInitialized = true;
      console.log('Firebase Admin initialized successfully.');
    } else {
      console.log('FIREBASE_SERVICE_ACCOUNT not provided. Skipping Firebase Admin initialization.');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
};

export const getMessaging = () => {
  if (!isFirebaseInitialized) return null;
  return getAdminMessaging(firebaseApp);
};
