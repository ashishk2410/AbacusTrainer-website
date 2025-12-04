"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
exports.verifyIdToken = verifyIdToken;
exports.getUserByEmail = getUserByEmail;
exports.getUserDocument = getUserDocument;
// Firebase Admin SDK initialization
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const env_1 = __importDefault(require("./env"));
// Initialize Firebase Admin only once
if (!firebase_admin_1.default.apps.length) {
    try {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert({
                projectId: env_1.default.firebase.projectId,
                privateKey: env_1.default.firebase.privateKey,
                clientEmail: env_1.default.firebase.clientEmail,
            }),
        });
        console.log('✅ Firebase Admin initialized successfully');
    }
    catch (error) {
        console.error('❌ Firebase Admin initialization failed:', error);
        throw error;
    }
}
// Export Firestore and Auth instances
exports.db = firebase_admin_1.default.firestore();
exports.auth = firebase_admin_1.default.auth();
// Helper to verify Firebase ID token
async function verifyIdToken(idToken) {
    try {
        const decodedToken = await exports.auth.verifyIdToken(idToken);
        return decodedToken;
    }
    catch (error) {
        throw new Error('Invalid Firebase ID token');
    }
}
// Helper to get user by email
async function getUserByEmail(email) {
    try {
        const userRecord = await exports.auth.getUserByEmail(email);
        return userRecord;
    }
    catch (error) {
        if (error.code === 'auth/user-not-found') {
            return null;
        }
        throw error;
    }
}
// Helper to get Firestore user document
async function getUserDocument(email) {
    try {
        const userDoc = await exports.db.collection('users').doc(email).get();
        if (!userDoc.exists) {
            return null;
        }
        return {
            id: userDoc.id,
            ...userDoc.data(),
        };
    }
    catch (error) {
        console.error('Error fetching user document:', error);
        throw error;
    }
}
exports.default = firebase_admin_1.default;
//# sourceMappingURL=firebase.js.map