import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

const getEnvVar = (name, fallbackName = '') => {
  let val = '';
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      val = import.meta.env[name] || (fallbackName ? import.meta.env[fallbackName] : '');
    }
  } catch (e) {}

  if (!val && typeof process !== 'undefined' && process.env) {
    val = process.env[name] || (fallbackName ? process.env[fallbackName] : '') || '';
  }
  return (val || '').toString().trim();
};

const firebaseConfig = {
  apiKey: getEnvVar('PUBLIC_FIREBASE_API_KEY', 'FIREBASE_API_KEY'),
  authDomain: getEnvVar('PUBLIC_FIREBASE_AUTH_DOMAIN', 'FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('PUBLIC_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('PUBLIC_FIREBASE_STORAGE_BUCKET', 'FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('PUBLIC_FIREBASE_APP_ID', 'FIREBASE_APP_ID')
};

export const isFirebaseConfigured = () => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== 'your-api-key');
};

export const app = isFirebaseConfigured()
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

export const db = app ? getFirestore(app) : null;

export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
};
