import { InstituteType } from "../../entity/types";

export interface CreateInstituteDto {
    name: string;
    code: string;
    type: InstituteType;
    address: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    email: string;
    website?: string;
    description?: string;
    contactPerson?: string;
    timezone?: string;
    currency?: string;
}

export interface UpdateInstituteDto extends Partial<CreateInstituteDto> {
    isActive?: boolean;
}

export interface InstituteFilters {
    type?: InstituteType;
    isActive?: boolean;
    search?: string;
}

export interface PaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
