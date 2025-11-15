// Type definitions matching existing Firestore data structures
// These match the Android app's data models

export type UserRole = "teacher" | "student" | "individual" | "centre";
export type PlanName = "trial" | "premium" | "teacher";
export type PlanStatus = "active" | "expired" | "cancelled";
export type StudentStatus = "active" | "inactive" | "suspended";
export type InviteStatus = "pending" | "accepted" | "declined" | "revoked" | "expired";
export type TaskStatus = "not_started" | "in_progress" | "completed" | "cancelled" | "closed";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export interface User {
  user_id: string; // Email address (document ID)
  role: UserRole;
  name: string;
  email: string;
  teacher_id?: string; // For students: teacher's Firebase UID
  teacher_email?: string; // For students: teacher's email
  teacher_assigned_level?: number; // 1-10 scale
  ai_suggested_level?: number;
  student_status?: StudentStatus;
  subscription_expiry?: string; // ISO date format
  plan_name?: PlanName;
  plan_status?: PlanStatus;
  firebaseUid: string;
  createdAt: any; // Timestamp
  lastUpdated: any; // Timestamp
}

export interface Session {
  session_id: string;
  user_id: string; // Student email
  date: string; // ISO date format
  accuracy: number; // 0-100
  speed: number;
  efficiency: number; // prompts per minute
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
  syncedAt: any; // Timestamp
}

export interface TeacherInvite {
  inviteId: string;
  teacherEmail: string;
  centreId: string; // Centre's Firebase UID
  centreEmail: string;
  status: InviteStatus;
  token: string; // Unique acceptance token
  createdAt: any; // Timestamp
  expiresAt: any; // Timestamp - createdAt + 48 hours
  acceptedAt?: any; // Timestamp
  declinedAt?: any; // Timestamp
  revokedAt?: any; // Timestamp
  emailSent: boolean;
  emailSentAt?: any; // Timestamp
}

export interface Task {
  taskId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  targetDate: string; // ISO date
  achievableDate: string; // ISO date
  status: TaskStatus;
  completionPercent: number; // 0-100
  remarks?: string;
  createdBy: string; // Teacher email
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
}

export interface StudentPlan {
  planId: string;
  studentId: string; // Student email
  teacherId: string; // Teacher email
  tasks: Task[];
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
}

export interface StudentAnalytics {
  strengths: string[];
  weaknesses: string[];
  improvementAreas: ImprovementArea[];
  performanceTrends: {
    accuracyTrend: DataPoint[];
    speedTrend: DataPoint[];
    overallProgress: number; // -100 to 100
  };
  cognitiveMetrics: {
    concentration: number; // 0-1
    memory: number;
    visualization: number;
    reactionTime: number;
    mathAccuracy: number;
    overallScore: number;
  };
}

export interface ImprovementArea {
  title: string;
  description: string;
  priority: TaskPriority;
}

export interface DataPoint {
  date: string;
  value: number;
}


