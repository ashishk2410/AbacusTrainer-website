"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserByEmail = exports.getUsersByRole = void 0;
const firebase_service_1 = require("../services/firebase.service");
/**
 * Get users by role
 */
const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        if (!role) {
            res.status(400).json({
                error: 'Role parameter is required',
                code: 'MISSING_ROLE',
            });
            return;
        }
        const users = await firebase_service_1.firebaseService.getUsersByRole(role);
        res.json({
            data: {
                users,
            },
        });
    }
    catch (error) {
        console.error('Get users by role error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch users',
            code: 'FETCH_USERS_FAILED',
        });
    }
};
exports.getUsersByRole = getUsersByRole;
/**
 * Get user by email
 */
const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            res.status(400).json({
                error: 'Email parameter is required',
                code: 'MISSING_EMAIL',
            });
            return;
        }
        const user = await firebase_service_1.firebaseService.getUserByEmail(email);
        if (!user) {
            res.status(404).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND',
            });
            return;
        }
        res.json({
            data: {
                user,
            },
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch user',
            code: 'FETCH_USER_FAILED',
        });
    }
};
exports.getUserByEmail = getUserByEmail;
/**
 * Update user
 */
const updateUser = async (req, res) => {
    try {
        const { email } = req.params;
        const { updates } = req.body;
        if (!email) {
            res.status(400).json({
                error: 'Email parameter is required',
                code: 'MISSING_EMAIL',
            });
            return;
        }
        // Check if user exists
        const existingUser = await firebase_service_1.firebaseService.getUserByEmail(email);
        if (!existingUser) {
            res.status(404).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND',
            });
            return;
        }
        // Update user
        await firebase_service_1.firebaseService.updateUser(email, updates);
        // Get updated user
        const updatedUser = await firebase_service_1.firebaseService.getUserByEmail(email);
        res.json({
            data: {
                user: updatedUser,
                message: 'User updated successfully',
            },
        });
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            error: error.message || 'Failed to update user',
            code: 'UPDATE_USER_FAILED',
        });
    }
};
exports.updateUser = updateUser;
//# sourceMappingURL=users.controller.js.map