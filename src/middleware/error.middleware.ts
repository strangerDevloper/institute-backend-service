import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors/AppError';
import { QueryFailedError } from 'typeorm';

interface ErrorResponse {
    status: 'error' | 'fail';
    message: string;
    errors?: any;
    stack?: string;
}

export const errorHandler: ErrorRequestHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let errorResponse: ErrorResponse = {
        status: 'error',
        message: 'Internal server error'
    };

    // Development mode - include stack trace
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    // Handle AppError instances
    if (err instanceof AppError) {
        errorResponse = {
            status: err.statusCode < 500 ? 'fail' : 'error',
            message: err.message
        };
        res.status(err.statusCode).json(errorResponse);
        return;
    }

    // Handle TypeORM errors
    if (err instanceof QueryFailedError) {
        // Handle unique constraint violations
        if (err.message.includes('duplicate key')) {
            errorResponse = {
                status: 'fail',
                message: 'Duplicate entry found',
                errors: extractDuplicateField(err.message)
            };
            res.status(409).json(errorResponse);
            return;
        }

        // Handle other database errors
        errorResponse = {
            status: 'error',
            message: 'Database operation failed'
        };
        res.status(500).json(errorResponse);
        return;
    }

    // Handle validation errors (if using class-validator)
    if (err.name === 'ValidationError') {
        errorResponse = {
            status: 'fail',
            message: 'Validation failed',
            errors: err.message
        };
        res.status(400).json(errorResponse);
        return;
    }

    // Handle all other errors
    res.status(500).json(errorResponse);
};

function extractDuplicateField(errorMessage: string): string {
    // Extract field name from error message
    const matches = errorMessage.match(/Key \((.*?)\)=/);
    if (matches && matches[1]) {
        return `${matches[1]} already exists`;
    }
    return 'Duplicate entry found';
} 