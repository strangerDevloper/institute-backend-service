import { Request, Response, NextFunction } from 'express';

interface FeatureFlags {
    [key: string]: boolean;
}

// Feature flags configuration
const featureFlags: FeatureFlags = {
    instituteManagement: true,
    // Add more feature flags as needed
};

export const checkFeatureFlag = (feature: keyof typeof featureFlags) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!featureFlags[feature]) {
            res.status(403).json({
                message: `The ${feature} feature is currently disabled`
            });
            return;
        }
        next();
    };
}; 