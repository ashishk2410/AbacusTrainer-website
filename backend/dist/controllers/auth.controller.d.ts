import { Request, Response } from 'express';
/**
 * Login endpoint
 * Accepts Firebase ID token from client, verifies it, and issues JWT
 */
export declare const login: (req: Request, res: Response) => Promise<void>;
/**
 * Logout endpoint
 */
export declare const logout: (_req: Request, res: Response) => Promise<void>;
/**
 * Get current authenticated user
 */
export declare const getCurrentUser: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map