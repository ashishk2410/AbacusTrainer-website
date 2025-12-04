import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
export interface ApiError extends Error {
    statusCode?: number;
    code?: string;
}
/**
 * Global error handler middleware
 */
export declare function errorHandler(error: ApiError | ZodError | Error, _req: Request, res: Response, _next: NextFunction): void;
/**
 * 404 Not Found handler
 */
export declare function notFoundHandler(req: Request, res: Response): void;
//# sourceMappingURL=error.middleware.d.ts.map