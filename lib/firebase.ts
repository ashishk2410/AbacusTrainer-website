// Firebase configuration - references existing Firebase project
// This does NOT modify the Android app's Firebase setup
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Get environment variables
function getEnvVars() {
  // In Next.js, NEXT_PUBLIC_ vars are available at build time and embedded in the client bundle
  // They should be available as process.env.NEXT_PUBLIC_* in both server and client
  const vars = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  };
  
  // Debug in development (only log once, not on every call)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && !(window as any).__firebaseEnvLogged) {
    (window as any).__firebaseEnvLogged = true;
    const allPresent = vars.apiKey && vars.authDomain && vars.projectId && vars.storageBucket;
    if (!allPresent) {
      console.warn('[Firebase] Missing env vars:', {
        apiKey: vars.apiKey ? '✓' : '✗',
        authDomain: vars.authDomain ? '✓' : '✗',
        projectId: vars.projectId ? '✓' : '✗',
        storageBucket: vars.storageBucket ? '✓' : '✗',
      });
    } else {
      console.log('[Firebase] All environment variables loaded ✓');
    }
  }
  
  return vars;
}

// Check if environment variables are available
function hasEnvVars(): boolean {
  const { apiKey, authDomain, projectId, storageBucket } = getEnvVars();
  const hasAll = !!(apiKey && authDomain && projectId && storageBucket);
  
  // Debug logging (only in development)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    if (!hasAll) {
      console.warn('Firebase env vars check:', {
        apiKey: apiKey ? '✓' : '✗',
        authDomain: authDomain ? '✓' : '✗',
        projectId: projectId ? '✓' : '✗',
        storageBucket: storageBucket ? '✓' : '✗',
      });
    }
  }
  
  return hasAll;
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

// Create a more complete mock auth object for when env vars are missing
// This needs to be compatible with Firebase's internal validation
function createMockAuth(): any {
  const mockApp = {
    name: '[DEFAULT]',
    options: {},
    automaticDataCollectionEnabled: false,
    _delegate: {
      name: '[DEFAULT]',
    },
  };
  
  const mockAuth = {
    app: mockApp,
    currentUser: null,
    settings: {
      appVerificationDisabledForTesting: false,
    },
    _delegate: {
      app: mockApp,
      currentUser: null,
      settings: {
        appVerificationDisabledForTesting: false,
      },
    },
    onAuthStateChanged: (callback: any) => {
      callback(null);
      return () => {};
    },
    signInWithEmailAndPassword: () => {
      return Promise.reject(new Error('Firebase environment variables are not configured. Please set them in Netlify environment variables.'));
    },
    signOut: () => {
      return Promise.reject(new Error('Firebase environment variables are not configured. Please set them in Netlify environment variables.'));
    },
  };
  
  // Make it look more like a real Auth instance
  Object.setPrototypeOf(mockAuth, Object.prototype);
  
  return mockAuth;
}

// Lazy getters - only initialize when accessed and env vars are available
export const auth: Auth = new Proxy({} as Auth, {
  get(target, prop) {
    // Check env vars first
    const envVarsAvailable = hasEnvVars();
    
    // Debug logging
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      if (!envVarsAvailable && prop === 'currentUser') {
        console.warn('[Firebase Auth] Env vars not available, using mock');
      }
    }
    
    // If env vars are missing, return a mock that won't crash
    if (!envVarsAvailable) {
      const mockAuth = createMockAuth();
      return mockAuth[prop as string];
    }
    
    // Env vars are available - initialize real Firebase
    try {
      if (!authInstance) {
        authInstance = getAuth(getApp());
      }
      const value = (authInstance as any)[prop];
      if (typeof value === 'function') {
        return value.bind(authInstance);
      }
      return value;
    } catch (error) {
      console.error('[Firebase Auth] Initialization error:', error);
      // Fallback to mock if initialization fails
      const mockAuth = createMockAuth();
      return mockAuth[prop as string];
    }
  }
});

// Initialize Firestore instance if env vars are available
// This ensures db is always the real Firestore instance when env vars are present
if (hasEnvVars()) {
  try {
    dbInstance = getFirestore(getApp());
  } catch (error) {
    console.error('[Firebase] Error initializing Firestore:', error);
  }
}

// Export db - use the real Firestore instance if available, otherwise use a Proxy that throws
// This ensures collection() from firebase/firestore recognizes it as a valid Firestore instance
export const db: Firestore = dbInstance || new Proxy({} as Firestore, {
  get() {
    throw new Error('Firebase environment variables are not configured. Please set them in Netlify environment variables.');
  }
});

export default getApp;

