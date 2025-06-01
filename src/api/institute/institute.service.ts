import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Institute } from '../../entity/Institue';
import { CreateInstituteDto, UpdateInstituteDto, InstituteFilters, PaginationOptions } from './institute.interface';
import { NotFoundError, ValidationError, DatabaseError } from '../../utils/errors/AppError';

export class InstituteService {
    private repository: Repository<Institute>;
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Institute);
        this.dataSource = dataSource;
    }

    async create(dto: CreateInstituteDto, userId: string, queryRunner?: QueryRunner): Promise<Institute> {
        const manager = queryRunner?.manager || this.repository.manager;

        // Validate unique constraints
        const existingByCode = await this.findByCode(dto.code);
        if (existingByCode) {
            throw new ValidationError('Institute code already exists');
        }

        const existingByEmail = await this.findByEmail(dto.email);
        if (existingByEmail) {
            throw new ValidationError('Institute email already exists');
        }

        const institute = manager.create(Institute, {
            ...dto,
            createdBy: userId,
            updatedBy: userId
        });

        return await manager.save(institute);
    }

    async findById(id: string): Promise<Institute> {
        try {
            const institute = await this.repository.findOne({ where: { id } });
            if (!institute) {
                throw new NotFoundError('Institute');
            }
            return institute;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Failed to fetch institute');
        }
    }

    async findByCode(code: string): Promise<Institute | null> {
        try {
            return await this.repository.findOne({ where: { code } });
        } catch (error) {
            throw new DatabaseError('Failed to fetch institute by code');
        }
    }

    async findByEmail(email: string): Promise<Institute | null> {
        try {
            return await this.repository.findOne({ where: { email } });
        } catch (error) {
            throw new DatabaseError('Failed to fetch institute by email');
        }
    }

    async findAll(filters: InstituteFilters, pagination: PaginationOptions) {
        try {
            const query = this.repository.createQueryBuilder('institute');

            // Apply filters
            if (filters.type) {
                query.andWhere('institute.type = :type', { type: filters.type });
            }
            if (filters.isActive !== undefined) {
                query.andWhere('institute.isActive = :isActive', { isActive: filters.isActive });
            }
            if (filters.search) {
                query.andWhere(
                    '(institute.name ILIKE :search OR institute.code ILIKE :search OR institute.email ILIKE :search)',
                    { search: `%${filters.search}%` }
                );
            }

            // Apply pagination
            query
                .skip((pagination.page - 1) * pagination.limit)
                .take(pagination.limit);

            // Apply sorting
            if (pagination.sortBy) {
                query.orderBy(`institute.${pagination.sortBy}`, pagination.sortOrder);
            }

            const [items, total] = await query.getManyAndCount();

            return {
                items,
                total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: Math.ceil(total / pagination.limit)
            };
        } catch (error) {
            throw new DatabaseError('Failed to fetch institutes');
        }
    }

    async update(id: string, dto: UpdateInstituteDto, userId: string, queryRunner?: QueryRunner): Promise<Institute> {
        const manager = queryRunner?.manager || this.repository.manager;
        const institute = await this.findById(id);

        // Check unique constraints if email or code is being updated
        if (dto.email && dto.email !== institute.email) {
            const existingByEmail = await this.findByEmail(dto.email);
            if (existingByEmail) {
                throw new ValidationError('Institute email already exists');
            }
        }

        if (dto.code && dto.code !== institute.code) {
            const existingByCode = await this.findByCode(dto.code);
            if (existingByCode) {
                throw new ValidationError('Institute code already exists');
            }
        }

        Object.assign(institute, {
            ...dto,
            updatedBy: userId
        });

        return await manager.save(institute);
    }

    async delete(id: string, queryRunner?: QueryRunner): Promise<boolean> {
        const manager = queryRunner?.manager || this.repository.manager;
        const institute = await this.findById(id);
        await manager.remove(institute);
        return true;
    }

    async softDelete(id: string, userId: string, queryRunner?: QueryRunner): Promise<Institute> {
        const manager = queryRunner?.manager || this.repository.manager;
        const institute = await this.findById(id);
        
        institute.isActive = false;
        institute.updatedBy = userId;

        return await manager.save(institute);
    }
}
