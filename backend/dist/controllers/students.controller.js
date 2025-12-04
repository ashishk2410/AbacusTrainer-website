"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentTeacher = exports.getStudentsByTeacher = void 0;
const firebase_service_1 = require("../services/firebase.service");
/**
 * Get students by teacher email
 */
const getStudentsByTeacher = async (req, res) => {
    try {
        const { teacherEmail } = req.params;
        if (!teacherEmail) {
            res.status(400).json({
                error: 'Teacher email parameter is required',
                code: 'MISSING_TEACHER_EMAIL',
            });
            return;
        }
        // Verify requester has permission (teacher can only see their own students)
        if (req.user && req.user.role === 'teacher' && req.user.email !== teacherEmail) {
            res.status(403).json({
                error: 'You can only view your own students',
                code: 'FORBIDDEN',
            });
            return;
        }
        const students = await firebase_service_1.firebaseService.getStudentsByTeacherEmail(teacherEmail);
        res.json({
            data: {
                students,
            },
        });
    }
    catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch students',
            code: 'FETCH_STUDENTS_FAILED',
        });
    }
};
exports.getStudentsByTeacher = getStudentsByTeacher;
/**
 * Update student's teacher assignment
 */
const updateStudentTeacher = async (req, res) => {
    try {
        const { email: studentEmail } = req.params;
        const { teacherEmail, teacherId } = req.body;
        if (!studentEmail) {
            res.status(400).json({
                error: 'Student email parameter is required',
                code: 'MISSING_STUDENT_EMAIL',
            });
            return;
        }
        if (!teacherEmail || !teacherId) {
            res.status(400).json({
                error: 'Teacher email and ID are required',
                code: 'MISSING_TEACHER_INFO',
            });
            return;
        }
        // Verify requester has permission (only teachers/centres can update)
        if (!req.user || (req.user.role !== 'teacher' && req.user.role !== 'centre')) {
            res.status(403).json({
                error: 'Only teachers and centres can update student assignments',
                code: 'FORBIDDEN',
            });
            return;
        }
        // Update student's teacher
        await firebase_service_1.firebaseService.updateStudentTeacher(studentEmail, teacherEmail, teacherId);
        res.json({
            data: {
                message: 'Student teacher updated successfully',
            },
        });
    }
    catch (error) {
        console.error('Update student teacher error:', error);
        res.status(500).json({
            error: error.message || 'Failed to update student teacher',
            code: 'UPDATE_STUDENT_FAILED',
        });
    }
};
exports.updateStudentTeacher = updateStudentTeacher;
//# sourceMappingURL=students.controller.js.map