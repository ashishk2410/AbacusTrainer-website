import { Request, Response, NextFunction } from 'express';
import { User } from '../types';
declare global {
    namespace Express {
        interface Request {
            user?: User;
            firebaseUser?: any;
        }
    }
}
/**
 * Middleware to authenticate requests using Firebase ID token
 * Token can be in Authorization header or httpOnly cookie
 */
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Middleware to check if user has required role
 */
export declare function requireRole(...allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to ensure user is teacher or centre (for web dashboard)
 */
export declare const requireTeacherOrCentre: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map