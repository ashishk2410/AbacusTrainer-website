"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Users routes
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
// All user routes require authentication
router.use(auth_middleware_1.authenticateToken);
/**
 * GET /api/users/by-role/:role
 * Get users by role (teacher, student, centre, individual)
 */
router.get('/by-role/:role', auth_middleware_1.requireTeacherOrCentre, users_controller_1.getUsersByRole);
/**
 * GET /api/users/:email
 * Get user by email
 */
router.get('/:email', users_controller_1.getUserByEmail);
/**
 * PUT /api/users/:email
 * Update user
 * Body: { updates: { ... } }
 */
router.put('/:email', auth_middleware_1.requireTeacherOrCentre, (0, validation_middleware_1.validate)({ body: validation_middleware_1.updateUserSchema }), users_controller_1.updateUser);
exports.default = router;
//# sourceMappingURL=users.routes.js.map