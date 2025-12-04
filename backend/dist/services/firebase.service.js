"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseService = void 0;
// Firebase/Firestore service layer
const firebase_1 = require("../config/firebase");
exports.firebaseService = {
    /**
     * Get users by role from Firestore
     */
    async getUsersByRole(role) {
        try {
            const snapshot = await firebase_1.db
                .collection('users')
                .where('role', '==', role)
                .get();
            return snapshot.docs.map((doc) => ({
                user_id: doc.id,
                email: doc.data().email || doc.id,
                ...doc.data(),
            }));
        }
        catch (error) {
            console.error('Error fetching users by role:', error);
            throw new Error('Failed to fetch users');
        }
    },
    /**
     * Get user by email from Firestore
     */
    async getUserByEmail(email) {
        try {
            const doc = await firebase_1.db.collection('users').doc(email).get();
            if (!doc.exists) {
                return null;
            }
            return {
                user_id: doc.id,
                email: doc.data()?.email || doc.id,
                ...doc.data(),
            };
        }
        catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Failed to fetch user');
        }
    },
    /**
     * Update user in Firestore
     */
    async updateUser(email, updates) {
        try {
            await firebase_1.db.collection('users').doc(email).update({
                ...updates,
                lastUpdated: new Date(),
            });
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    },
    /**
     * Get students by teacher email
     */
    async getStudentsByTeacherEmail(teacherEmail) {
        try {
            const snapshot = await firebase_1.db
                .collection('users')
                .where('role', '==', 'student')
                .where('teacher_email', '==', teacherEmail)
                .get();
            return snapshot.docs.map((doc) => ({
                user_id: doc.id,
                email: doc.data().email || doc.id,
                ...doc.data(),
            }));
        }
        catch (error) {
            console.error('Error fetching students:', error);
            throw new Error('Failed to fetch students');
        }
    },
    /**
     * Update student's teacher assignment
     */
    async updateStudentTeacher(studentEmail, teacherEmail, teacherId) {
        try {
            const batch = firebase_1.db.batch();
            // Update student document
            const studentRef = firebase_1.db.collection('users').doc(studentEmail);
            batch.update(studentRef, {
                teacher_email: teacherEmail,
                teacher_id: teacherId,
                lastUpdated: new Date(),
            });
            // Update all student sessions
            const sessionsSnapshot = await firebase_1.db
                .collection('sessions')
                .where('user_id', '==', studentEmail)
                .get();
            sessionsSnapshot.docs.forEach((doc) => {
                batch.update(doc.ref, {
                    teacher_id: teacherId,
                });
            });
            await batch.commit();
        }
        catch (error) {
            console.error('Error updating student teacher:', error);
            throw new Error('Failed to update student teacher');
        }
    },
    /**
     * Get sessions by student email
     */
    async getSessionsByStudentEmail(studentEmail) {
        try {
            const snapshot = await firebase_1.db
                .collection('sessions')
                .where('user_id', '==', studentEmail)
                .orderBy('date', 'desc')
                .get();
            return snapshot.docs.map((doc) => ({
                session_id: doc.id,
                ...doc.data(),
            }));
        }
        catch (error) {
            console.error('Error fetching sessions:', error);
            throw new Error('Failed to fetch sessions');
        }
    },
    /**
     * Get sessions by teacher email
     */
    async getSessionsByTeacherEmail(teacherEmail) {
        try {
            const snapshot = await firebase_1.db
                .collection('sessions')
                .where('teacher_id', '==', teacherEmail)
                .orderBy('date', 'desc')
                .get();
            return snapshot.docs.map((doc) => ({
                session_id: doc.id,
                ...doc.data(),
            }));
        }
        catch (error) {
            console.error('Error fetching sessions:', error);
            throw new Error('Failed to fetch sessions');
        }
    },
};
//# sourceMappingURL=firebase.service.js.map