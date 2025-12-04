"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.updateStudentTeacherSchema = exports.updateUserSchema = exports.loginSchema = void 0;
exports.validate = validate;
const zod_1 = require("zod");
/**
 * Validate request body, query, or params using Zod schema
 */
function validate(schema) {
    return (req, res, next) => {
        try {
            if (schema.body) {
                req.body = schema.body.parse(req.body);
            }
            if (schema.query) {
                req.query = schema.query.parse(req.query);
            }
            if (schema.params) {
                req.params = schema.params.parse(req.params);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    code: 'VALIDATION_ERROR',
                    details: error.errors.map((err) => ({
                        path: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            else {
                next(error);
            }
        }
    };
}
// Common validation schemas
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.updateUserSchema = zod_1.z.object({
    updates: zod_1.z.object({
        name: zod_1.z.string().optional(),
        teacher_id: zod_1.z.string().optional(),
        teacher_email: zod_1.z.string().email().optional(),
        teacher_assigned_level: zod_1.z.number().min(1).max(10).optional(),
        student_status: zod_1.z.enum(['active', 'inactive', 'suspended']).optional(),
        plan_name: zod_1.z.enum(['trial', 'premium', 'teacher']).optional(),
        plan_status: zod_1.z.enum(['active', 'expired', 'cancelled']).optional(),
    }),
});
exports.updateStudentTeacherSchema = zod_1.z.object({
    teacherEmail: zod_1.z.string().email('Invalid teacher email'),
    teacherId: zod_1.z.string().min(1, 'Teacher ID is required'),
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    per_page: zod_1.z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: zod_1.z.string().optional(),
    categories: zod_1.z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
});
//# sourceMappingURL=validation.middleware.js.map