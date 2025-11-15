// Firebase configuration - references existing Firebase project
// This does NOT modify the Android app's Firebase setup
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Validate environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

if (!apiKey || !authDomain || !projectId || !storageBucket) {
  throw new Error(
    'Missing Firebase environment variables. Please check your .env.local file.\n' +
    `API Key: ${apiKey ? '✓' : '✗'}\n` +
    `Auth Domain: ${authDomain ? '✓' : '✗'}\n` +
    `Project ID: ${projectId ? '✓' : '✗'}\n` +
    `Storage Bucket: ${storageBucket ? '✓' : '✗'}`
  );
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
};

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;

