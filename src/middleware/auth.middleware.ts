import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        [key: string]: any;
    };
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Here you would typically verify JWT token or session
        // For now, we'll just check if Authorization header exists
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            res.status(401).json({ message: 'No authorization token provided' });
            return;
        }

        // Mock user data - Replace this with actual token verification
        (req as AuthenticatedRequest).user = {
            id: 'mock-user-id',
            email: 'mock@example.com'
        };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
}; 