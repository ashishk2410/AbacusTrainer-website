import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
/**
 * Validate request body, query, or params using Zod schema
 */
export declare function validate(schema: {
    body?: z.ZodSchema<any>;
    query?: z.ZodSchema<any>;
    params?: z.ZodSchema<any>;
}): (req: Request, res: Response, next: NextFunction) => void;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const updateUserSchema: z.ZodObject<{
    updates: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        teacher_id: z.ZodOptional<z.ZodString>;
        teacher_email: z.ZodOptional<z.ZodString>;
        teacher_assigned_level: z.ZodOptional<z.ZodNumber>;
        student_status: z.ZodOptional<z.ZodEnum<["active", "inactive", "suspended"]>>;
        plan_name: z.ZodOptional<z.ZodEnum<["trial", "premium", "teacher"]>>;
        plan_status: z.ZodOptional<z.ZodEnum<["active", "expired", "cancelled"]>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        teacher_id?: string | undefined;
        teacher_email?: string | undefined;
        teacher_assigned_level?: number | undefined;
        student_status?: "active" | "inactive" | "suspended" | undefined;
        plan_name?: "teacher" | "trial" | "premium" | undefined;
        plan_status?: "active" | "expired" | "cancelled" | undefined;
    }, {
        name?: string | undefined;
        teacher_id?: string | undefined;
        teacher_email?: string | undefined;
        teacher_assigned_level?: number | undefined;
        student_status?: "active" | "inactive" | "suspended" | undefined;
        plan_name?: "teacher" | "trial" | "premium" | undefined;
        plan_status?: "active" | "expired" | "cancelled" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    updates: {
        name?: string | undefined;
        teacher_id?: string | undefined;
        teacher_email?: string | undefined;
        teacher_assigned_level?: number | undefined;
        student_status?: "active" | "inactive" | "suspended" | undefined;
        plan_name?: "teacher" | "trial" | "premium" | undefined;
        plan_status?: "active" | "expired" | "cancelled" | undefined;
    };
}, {
    updates: {
        name?: string | undefined;
        teacher_id?: string | undefined;
        teacher_email?: string | undefined;
        teacher_assigned_level?: number | undefined;
        student_status?: "active" | "inactive" | "suspended" | undefined;
        plan_name?: "teacher" | "trial" | "premium" | undefined;
        plan_status?: "active" | "expired" | "cancelled" | undefined;
    };
}>;
export declare const updateStudentTeacherSchema: z.ZodObject<{
    teacherEmail: z.ZodString;
    teacherId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    teacherEmail: string;
    teacherId: string;
}, {
    teacherEmail: string;
    teacherId: string;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
    per_page: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
    search: z.ZodOptional<z.ZodString>;
    categories: z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>;
}, "strip", z.ZodTypeAny, {
    page: number;
    per_page: number;
    search?: string | undefined;
    categories?: number | undefined;
}, {
    search?: string | undefined;
    page?: string | undefined;
    per_page?: string | undefined;
    categories?: string | undefined;
}>;
//# sourceMappingURL=validation.middleware.d.ts.map