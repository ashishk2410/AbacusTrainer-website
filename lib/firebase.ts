// Firebase configuration - references existing Firebase project
// This does NOT modify the Android app's Firebase setup
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Get environment variables
function getEnvVars() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  };
}

// Validate environment variables - only throw when actually trying to use Firebase
function validateEnvVars() {
  const { apiKey, authDomain, projectId, storageBucket } = getEnvVars();
  
  if (!apiKey || !authDomain || !projectId || !storageBucket) {
    throw new Error(
      'Missing Firebase environment variables. Please check your .env.local file or Netlify environment variables.\n' +
      `API Key: ${apiKey ? '✓' : '✗'}\n` +
      `Auth Domain: ${authDomain ? '✓' : '✗'}\n` +
      `Project ID: ${projectId ? '✓' : '✗'}\n` +
      `Storage Bucket: ${storageBucket ? '✓' : '✗'}`
    );
  }
  
  return { apiKey, authDomain, projectId, storageBucket };
}

// Initialize Firebase (only when actually needed)
let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

function getApp(): FirebaseApp {
  if (app) {
    return app;
  }

  // Validate environment variables when actually trying to use Firebase
  const { apiKey, authDomain, projectId, storageBucket } = validateEnvVars();

  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
  };

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  return app;
}

// Lazy getters - only initialize when accessed
export const auth: Auth = new Proxy({} as Auth, {
  get(target, prop) {
    if (!authInstance) {
      authInstance = getAuth(getApp());
    }
    const value = (authInstance as any)[prop];
    if (typeof value === 'function') {
      return value.bind(authInstance);
    }
    return value;
  }
});

export const db: Firestore = new Proxy({} as Firestore, {
  get(target, prop) {
    if (!dbInstance) {
      dbInstance = getFirestore(getApp());
    }
    const value = (dbInstance as any)[prop];
    if (typeof value === 'function') {
      return value.bind(dbInstance);
    }
    return value;
  }
});

export default getApp;

