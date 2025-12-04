"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const zod_1 = require("zod");
/**
 * Global error handler middleware
 */
function errorHandler(error, _req, res, _next) {
    // Log error
    console.error('Error:', error);
    // Handle Zod validation errors
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            })),
        });
        return;
    }
    // Handle custom API errors
    if ('statusCode' in error && error.statusCode) {
        res.status(error.statusCode).json({
            error: error.message || 'An error occurred',
            code: error.code || 'API_ERROR',
        });
        return;
    }
    // Handle Firebase errors
    if (error.message.includes('Firebase') || error.message.includes('auth/')) {
        res.status(401).json({
            error: 'Authentication failed',
            code: 'AUTH_ERROR',
        });
        return;
    }
    // Default error response
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : error.message,
        code: 'INTERNAL_ERROR',
    });
}
/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Endpoint not found',
        code: 'NOT_FOUND',
        path: req.path,
    });
}
//# sourceMappingURL=error.middleware.js.map