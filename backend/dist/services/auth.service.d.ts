import { User } from '../types';
export declare const authService: {
    /**
     * Authenticate user with email and password using Firebase Auth
     */
    authenticateUser(email: string, _password: string): Promise<User>;
    /**
     * Get user by email from Firestore
     */
    getUserByEmail(email: string): Promise<User | null>;
    /**
     * Generate JWT token for user session
     */
    generateToken(user: User): string;
    /**
     * Verify JWT token
     */
    verifyToken(token: string): any;
    /**
     * Verify Firebase ID token and get user
     * This is the primary authentication method
     */
    verifyFirebaseTokenAndGetUser(idToken: string): Promise<User>;
};
//# sourceMappingURL=auth.service.d.ts.map