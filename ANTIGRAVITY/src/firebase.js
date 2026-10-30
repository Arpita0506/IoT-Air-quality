import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if valid Firebase configuration values are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_api_key_here' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'your_project_id'
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db, signInAnonymously, onAuthStateChanged, collection, addDoc, serverTimestamp, query, where, onSnapshot };

/**
 * Saves a single sensor reading to the 'sensorReadings' Firestore collection.
 * Strictly writes only the 6 required fields to satisfy security rules.
 */
export async function saveSensorReadingToFirestore(reading, ownerUid) {
  if (!db || !ownerUid) {
    throw new Error('Firestore is not initialized or user is not authenticated.');
  }

  const docData = {
    deviceId: String(reading.deviceId),
    temperature: Number(reading.temperature),
    humidity: Number(reading.humidity),
    airQualityIndex: Number(reading.airQualityIndex ?? reading.aqi),
    timestamp: serverTimestamp(),
    ownerUid: String(ownerUid),
  };

  return await addDoc(collection(db, 'sensorReadings'), docData);
}
