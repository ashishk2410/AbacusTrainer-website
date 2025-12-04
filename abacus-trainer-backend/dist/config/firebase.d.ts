import admin from 'firebase-admin';
export declare const db: admin.firestore.Firestore;
export declare const auth: import("firebase-admin/lib/auth/auth").Auth;
export declare function verifyIdToken(idToken: string): Promise<import("firebase-admin/lib/auth/token-verifier").DecodedIdToken>;
export declare function getUserByEmail(email: string): Promise<import("firebase-admin/lib/auth/user-record").UserRecord | null>;
export declare function getUserDocument(email: string): Promise<{
    id: string;
} | null>;
export default admin;
//# sourceMappingURL=firebase.d.ts.map