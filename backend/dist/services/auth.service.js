"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
// Authentication service
const firebase_1 = require("../config/firebase");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
exports.authService = {
    /**
     * Authenticate user with email and password using Firebase Auth
     */
    async authenticateUser(email, _password) {
        try {
            // Note: Firebase Admin SDK doesn't have signInWithEmailAndPassword
            // We need to use the REST API or verify the token from client
            // For now, we'll get user by email and verify they exist
            // The actual password verification happens on client-side with Firebase Auth
            // Then client sends the ID token to backend for verification
            const userRecord = await (0, firebase_1.getUserByEmail)(email);
            if (!userRecord) {
                throw new Error('Invalid email or password');
            }
            // Get user document from Firestore
            const userDoc = await (0, firebase_1.getUserDocument)(email);
            if (!userDoc) {
                throw new Error('User document not found');
            }
            return userDoc;
        }
        catch (error) {
            throw new Error(error.message || 'Authentication failed');
        }
    },
    /**
     * Get user by email from Firestore
     */
    async getUserByEmail(email) {
        return (0, firebase_1.getUserDocument)(email);
    },
    /**
     * Generate JWT token for user session
     */
    generateToken(user) {
        const payload = {
            userId: user.user_id,
            email: user.email,
            role: user.role,
        };
        return jsonwebtoken_1.default.sign(payload, env_1.default.jwt.secret, {
            expiresIn: '7d',
            issuer: 'abacus-trainer-api',
            audience: 'abacus-trainer-frontend',
        });
    },
    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, env_1.default.jwt.secret, {
                issuer: 'abacus-trainer-api',
                audience: 'abacus-trainer-frontend',
            });
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    },
    /**
     * Verify Firebase ID token and get user
     * This is the primary authentication method
     */
    async verifyFirebaseTokenAndGetUser(idToken) {
        try {
            // Verify the Firebase ID token
            const decodedToken = await firebase_1.auth.verifyIdToken(idToken);
            if (!decodedToken.email) {
                throw new Error('Email not found in token');
            }
            // Get user document from Firestore
            const userDoc = await (0, firebase_1.getUserDocument)(decodedToken.email);
            if (!userDoc) {
                throw new Error('User document not found');
            }
            return userDoc;
        }
        catch (error) {
            throw new Error(error.message || 'Token verification failed');
        }
    },
};
//# sourceMappingURL=auth.service.js.map