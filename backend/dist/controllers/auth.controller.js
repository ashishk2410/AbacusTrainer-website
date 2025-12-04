"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.login = void 0;
const auth_service_1 = require("../services/auth.service");
/**
 * Login endpoint
 * Accepts Firebase ID token from client, verifies it, and issues JWT
 */
const login = async (req, res) => {
    try {
        // Client should send Firebase ID token (obtained from Firebase Auth on client-side)
        const { idToken } = req.body;
        if (!idToken) {
            res.status(400).json({
                error: 'ID token is required',
                code: 'MISSING_TOKEN',
            });
            return;
        }
        // Verify Firebase ID token and get user
        const user = await auth_service_1.authService.verifyFirebaseTokenAndGetUser(idToken);
        // Check role - reject students/parents for web dashboard
        if (user.role === 'student' || user.role === 'individual') {
            res.status(403).json({
                error: 'Only Teachers and Centre heads can access this portal. Students and parents cannot login here.',
                code: 'ROLE_NOT_ALLOWED',
            });
            return;
        }
        // Generate JWT token for session management
        const jwtToken = auth_service_1.authService.generateToken(user);
        // Set httpOnly cookie (more secure than localStorage)
        res.cookie('auth_token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });
        // Also return token in response (for clients that can't use cookies)
        res.json({
            data: {
                user: {
                    user_id: user.user_id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                token: jwtToken,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(401).json({
            error: error.message || 'Authentication failed',
            code: 'AUTH_FAILED',
        });
    }
};
exports.login = login;
/**
 * Logout endpoint
 */
const logout = async (_req, res) => {
    try {
        // Clear auth cookie
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });
        res.json({
            data: {
                message: 'Logged out successfully',
            },
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: 'Logout failed',
            code: 'LOGOUT_FAILED',
        });
    }
};
exports.logout = logout;
/**
 * Get current authenticated user
 */
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: 'Not authenticated',
                code: 'NOT_AUTHENTICATED',
            });
            return;
        }
        res.json({
            data: {
                user: {
                    user_id: req.user.user_id,
                    email: req.user.email,
                    name: req.user.name,
                    role: req.user.role,
                    teacher_id: req.user.teacher_id,
                    teacher_email: req.user.teacher_email,
                    teacher_assigned_level: req.user.teacher_assigned_level,
                    student_status: req.user.student_status,
                    plan_name: req.user.plan_name,
                    plan_status: req.user.plan_status,
                },
            },
        });
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            error: 'Failed to get user',
            code: 'GET_USER_FAILED',
        });
    }
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=auth.controller.js.map