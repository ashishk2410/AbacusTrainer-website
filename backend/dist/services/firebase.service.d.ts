import { User, Session } from '../types';
export declare const firebaseService: {
    /**
     * Get users by role from Firestore
     */
    getUsersByRole(role: string): Promise<User[]>;
    /**
     * Get user by email from Firestore
     */
    getUserByEmail(email: string): Promise<User | null>;
    /**
     * Update user in Firestore
     */
    updateUser(email: string, updates: Partial<User>): Promise<void>;
    /**
     * Get students by teacher email
     */
    getStudentsByTeacherEmail(teacherEmail: string): Promise<User[]>;
    /**
     * Update student's teacher assignment
     */
    updateStudentTeacher(studentEmail: string, teacherEmail: string, teacherId: string): Promise<void>;
    /**
     * Get sessions by student email
     */
    getSessionsByStudentEmail(studentEmail: string): Promise<Session[]>;
    /**
     * Get sessions by teacher email
     */
    getSessionsByTeacherEmail(teacherEmail: string): Promise<Session[]>;
};
//# sourceMappingURL=firebase.service.d.ts.map