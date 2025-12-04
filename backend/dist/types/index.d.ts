export type UserRole = 'teacher' | 'student' | 'individual' | 'centre';
export type PlanName = 'trial' | 'premium' | 'teacher';
export type PlanStatus = 'active' | 'expired' | 'cancelled';
export type StudentStatus = 'active' | 'inactive' | 'suspended';
export interface User {
    user_id: string;
    role: UserRole;
    name: string;
    email: string;
    teacher_id?: string;
    teacher_email?: string;
    teacher_assigned_level?: number;
    ai_suggested_level?: number;
    student_status?: StudentStatus;
    subscription_expiry?: string;
    plan_name?: PlanName;
    plan_status?: PlanStatus;
    firebaseUid: string;
    createdAt: any;
    lastUpdated: any;
}
export interface Session {
    session_id: string;
    user_id: string;
    date: string;
    accuracy: number;
    speed: number;
    efficiency: number;
    questions_attempted: number;
    streak: number;
    teacher_id?: string;
    username: string;
    configuration: any;
    questions: any[];
    completed: boolean;
    score: number;
    correctAnswers: number;
    totalTimeSpent: number;
    syncedAt: any;
}
export interface TeacherInvite {
    inviteId: string;
    teacherEmail: string;
    centreId: string;
    centreEmail: string;
    status: 'pending' | 'accepted' | 'declined' | 'revoked' | 'expired';
    token: string;
    createdAt: any;
    expiresAt: any;
    acceptedAt?: any;
    declinedAt?: any;
    revokedAt?: any;
    emailSent: boolean;
    emailSentAt?: any;
}
export interface ApiResponse<T> {
    data: T;
    error?: string;
    message?: string;
}
export interface WordPressPost {
    id: number;
    slug: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    date: string;
    modified: string;
    author: number;
    featured_media: number;
    categories: number[];
    tags: number[];
    _embedded?: {
        author?: Array<{
            id: number;
            name: string;
            slug: string;
        }>;
        'wp:featuredmedia'?: Array<{
            source_url: string;
            alt_text: string;
        }>;
    };
}
export interface WordPressCategory {
    id: number;
    name: string;
    slug: string;
    count: number;
}
//# sourceMappingURL=index.d.ts.map