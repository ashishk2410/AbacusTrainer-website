"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireTeacherOrCentre = void 0;
exports.authenticateToken = authenticateToken;
exports.requireRole = requireRole;
const firebase_1 = require("../config/firebase");
const auth_service_1 = require("../services/auth.service");
/**
 * Middleware to authenticate requests using Firebase ID token
 * Token can be in Authorization header or httpOnly cookie
 */
async function authenticateToken(req, res, next) {
    try {
        // Try to get token from Authorization header
        const authHeader = req.headers.authorization;
        const tokenFromHeader = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        // Try to get token from cookie
        const tokenFromCookie = req.cookies?.auth_token;
        // Use header token first, fallback to cookie
        const token = tokenFromHeader || tokenFromCookie;
        if (!token) {
            res.status(401).json({
                error: 'Authentication required',
                code: 'AUTH_REQUIRED',
            });
            return;
        }
        // Verify Firebase ID token
        const decodedToken = await (0, firebase_1.verifyIdToken)(token);
        // Get user document from Firestore
        const userDoc = await auth_service_1.authService.getUserByEmail(decodedToken.email || '');
        if (!userDoc) {
            res.status(401).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND',
            });
            return;
        }
        // Attach user to request
        req.firebaseUser = decodedToken;
        req.user = userDoc;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({
            error: 'Invalid or expired token',
            code: 'INVALID_TOKEN',
        });
    }
}
/**
 * Middleware to check if user has required role
 */
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Authentication required',
                code: 'AUTH_REQUIRED',
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Insufficient permissions',
                code: 'FORBIDDEN',
            });
            return;
        }
        next();
    };
}
/**
 * Middleware to ensure user is teacher or centre (for web dashboard)
 */
exports.requireTeacherOrCentre = requireRole('teacher', 'centre');
//# sourceMappingURL=auth.middleware.js.map