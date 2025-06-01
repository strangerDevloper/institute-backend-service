import { Request, Response, NextFunction } from 'express';
import { InstituteService } from './institute.service';
import { CreateInstituteDto, UpdateInstituteDto, InstituteFilters, PaginationOptions } from './institute.interface';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { ValidationError } from '../../utils/errors/AppError';
import { AppDataSource } from '../../config/db';
import { executeInTransaction } from '../../utils/transaction';

export class InstituteController {
    private service: InstituteService;

    constructor() {
        this.service = new InstituteService(AppDataSource);
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto = req.body as CreateInstituteDto;
            const userId = (req as AuthenticatedRequest).user?.id;

            if (!userId) {
                throw new ValidationError('User ID is required');
            }

            const institute = await executeInTransaction(AppDataSource, async (queryRunner) => {
                // Here you can call multiple services within the same transaction
                return await this.service.create(dto, userId, queryRunner);
            });

            res.status(201).json(institute);
        } catch (error) {
            next(error);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const institute = await this.service.findById(id);
            res.json(institute);
        } catch (error) {
            next(error);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters: InstituteFilters = {
                type: req.query.type as any,
                isActive: req.query.isActive === 'true',
                search: req.query.search as string
            };

            const pagination: PaginationOptions = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                sortBy: req.query.sortBy as string,
                sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC'
            };

            const result = await this.service.findAll(filters, pagination);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const dto = req.body as UpdateInstituteDto;
            const userId = (req as AuthenticatedRequest).user?.id;

            if (!userId) {
                throw new ValidationError('User ID is required');
            }

            const institute = await executeInTransaction(AppDataSource, async (queryRunner) => {
                // Here you can call multiple services within the same transaction
                return await this.service.update(id, dto, userId, queryRunner);
            });

            res.json(institute);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            
            await executeInTransaction(AppDataSource, async (queryRunner) => {
                // Here you can call multiple services within the same transaction
                return await this.service.delete(id, queryRunner);
            });

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async softDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = (req as AuthenticatedRequest).user?.id;

            if (!userId) {
                throw new ValidationError('User ID is required');
            }

            const institute = await executeInTransaction(AppDataSource, async (queryRunner) => {
                // Here you can call multiple services within the same transaction
                return await this.service.softDelete(id, userId, queryRunner);
            });

            res.json(institute);
        } catch (error) {
            next(error);
        }
    }

    // Example of a method that calls multiple services in a single transaction
    async complexOperation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { instituteId } = req.params;
            const userId = (req as AuthenticatedRequest).user?.id;

            if (!userId) {
                throw new ValidationError('User ID is required');
            }

            const result = await executeInTransaction(AppDataSource, async (queryRunner) => {
                // Example: Update institute and perform other related operations
                const updatedInstitute = await this.service.update(
                    instituteId,
                    { isActive: false },
                    userId,
                    queryRunner
                );

                // You can call other services here with the same queryRunner
                // const otherResult = await otherService.someOperation(queryRunner);

                return {
                    institute: updatedInstitute,
                    // otherData: otherResult
                };
            });

            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}
