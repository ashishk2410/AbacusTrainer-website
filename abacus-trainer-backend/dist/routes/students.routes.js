"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Students routes
const express_1 = require("express");
const students_controller_1 = require("../controllers/students.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
// All student routes require authentication
router.use(auth_middleware_1.authenticateToken);
router.use(auth_middleware_1.requireTeacherOrCentre);
/**
 * GET /api/students/by-teacher/:teacherEmail
 * Get students by teacher email
 */
router.get('/by-teacher/:teacherEmail', students_controller_1.getStudentsByTeacher);
/**
 * PUT /api/students/:email/teacher
 * Update student's teacher assignment
 * Body: { teacherEmail: string, teacherId: string }
 */
router.put('/:email/teacher', (0, validation_middleware_1.validate)({ body: validation_middleware_1.updateStudentTeacherSchema }), students_controller_1.updateStudentTeacher);
exports.default = router;
//# sourceMappingURL=students.routes.js.map