// Firebase configuration - references existing Firebase project
// This does NOT modify the Android app's Firebase setup
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Get environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

// Check if we're in a build context (static generation)
// During build on Netlify, env vars might not be available during static page generation
// We detect this by checking if we're server-side and API key is missing
const isBuildTime = typeof window === 'undefined' && !apiKey;

// Only validate during runtime (client-side or server-side with env vars)
// Skip validation entirely during build to allow static page generation
if (!isBuildTime && (!apiKey || !authDomain || !projectId || !storageBucket)) {
  throw new Error(
    'Missing Firebase environment variables. Please check your .env.local file.\n' +
    `API Key: ${apiKey ? '✓' : '✗'}\n` +
    `Auth Domain: ${authDomain ? '✓' : '✗'}\n` +
    `Project ID: ${projectId ? '✓' : '✗'}\n` +
    `Storage Bucket: ${storageBucket ? '✓' : '✗'}`
  );
}

// Initialize Firebase (only if not already initialized and not during build)
let app: FirebaseApp | undefined;

function getApp(): FirebaseApp {
  if (app) {
    return app;
  }

  // During build time, return a placeholder to allow static generation
  if (isBuildTime) {
    // Create a minimal mock app for build time
    app = {} as FirebaseApp;
    return app;
  }

  // Runtime initialization
  if (!apiKey || !authDomain || !projectId || !storageBucket) {
    throw new Error('Firebase environment variables are required at runtime');
  }

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

// Lazy initialization for auth and db
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

export const auth: Auth = (() => {
  if (isBuildTime) {
    // Return a mock auth object during build
    return {} as Auth;
  }
  if (!authInstance) {
    authInstance = getAuth(getApp());
  }
  return authInstance;
})();

export const db: Firestore = (() => {
  if (isBuildTime) {
    // Return a mock db object during build
    return {} as Firestore;
  }
  if (!dbInstance) {
    dbInstance = getFirestore(getApp());
  }
  return dbInstance;
})();

export default getApp();

