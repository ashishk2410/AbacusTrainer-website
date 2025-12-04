"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Sessions routes
const express_1 = require("express");
const sessions_controller_1 = require("../controllers/sessions.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All session routes require authentication
router.use(auth_middleware_1.authenticateToken);
/**
 * GET /api/sessions/by-student/:studentEmail
 * Get sessions by student email
 */
router.get('/by-student/:studentEmail', sessions_controller_1.getSessionsByStudent);
/**
 * GET /api/sessions/by-teacher/:teacherEmail
 * Get sessions by teacher email
 */
router.get('/by-teacher/:teacherEmail', sessions_controller_1.getSessionsByTeacher);
exports.default = router;
//# sourceMappingURL=sessions.routes.js.map