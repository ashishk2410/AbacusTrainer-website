"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionsByTeacher = exports.getSessionsByStudent = void 0;
const firebase_service_1 = require("../services/firebase.service");
/**
 * Get sessions by student email
 */
const getSessionsByStudent = async (req, res) => {
    try {
        const { studentEmail } = req.params;
        if (!studentEmail) {
            res.status(400).json({
                error: 'Student email parameter is required',
                code: 'MISSING_STUDENT_EMAIL',
            });
            return;
        }
        // Verify requester has permission
        if (req.user) {
            // Teachers can only see their own students' sessions
            if (req.user.role === 'teacher') {
                const students = await firebase_service_1.firebaseService.getStudentsByTeacherEmail(req.user.email || '');
                const studentEmails = students.map((s) => s.email);
                if (!studentEmails.includes(studentEmail)) {
                    res.status(403).json({
                        error: 'You can only view sessions for your own students',
                        code: 'FORBIDDEN',
                    });
                    return;
                }
            }
            // Centres can see all students' sessions
            // Students can see their own sessions
            else if (req.user.role === 'student' && req.user.email !== studentEmail) {
                res.status(403).json({
                    error: 'You can only view your own sessions',
                    code: 'FORBIDDEN',
                });
                return;
            }
        }
        const sessions = await firebase_service_1.firebaseService.getSessionsByStudentEmail(studentEmail);
        res.json({
            data: {
                sessions,
            },
        });
    }
    catch (error) {
        console.error('Get sessions by student error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch sessions',
            code: 'FETCH_SESSIONS_FAILED',
        });
    }
};
exports.getSessionsByStudent = getSessionsByStudent;
/**
 * Get sessions by teacher email
 */
const getSessionsByTeacher = async (req, res) => {
    try {
        const { teacherEmail } = req.params;
        if (!teacherEmail) {
            res.status(400).json({
                error: 'Teacher email parameter is required',
                code: 'MISSING_TEACHER_EMAIL',
            });
            return;
        }
        // Verify requester has permission
        if (req.user && req.user.role === 'teacher' && req.user.email !== teacherEmail) {
            res.status(403).json({
                error: 'You can only view sessions for your own students',
                code: 'FORBIDDEN',
            });
            return;
        }
        const sessions = await firebase_service_1.firebaseService.getSessionsByTeacherEmail(teacherEmail);
        res.json({
            data: {
                sessions,
            },
        });
    }
    catch (error) {
        console.error('Get sessions by teacher error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch sessions',
            code: 'FETCH_SESSIONS_FAILED',
        });
    }
};
exports.getSessionsByTeacher = getSessionsByTeacher;
//# sourceMappingURL=sessions.controller.js.map