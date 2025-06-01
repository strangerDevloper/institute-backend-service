# Institute Domain Documentation

## Overview
The Institute domain handles the management of educational institutions in our multi-tenant system. Each institute represents a tenant that can be served through our service.

## Domain Model

### Institute Entity
```typescript
interface Institute {
    id: string;                  // UUID primary key
    name: string;                // Institute name (unique)
    code: string;                // Institute code (unique)
    type: InstituteType;         // Type of institution (school/college/university/other)
    address: string;             // Physical address
    latitude?: number;           // Geographic latitude (10,8 precision)
    longitude?: number;          // Geographic longitude (11,8 precision)
    phone?: string;              // Contact number
    email: string;               // Official email (unique)
    website?: string;            // Institute website URL
    description?: string;        // Detailed description
    contactPerson?: string;      // Primary contact person
    isActive: boolean;           // Active status flag
    timezone?: string;           // Operating timezone
    currency?: string;           // Default currency
    createdAt: Date;            // Creation timestamp
    updatedAt: Date;            // Last update timestamp
    createdBy?: string;         // Creator's UUID
    updatedBy?: string;         // Last updater's UUID
}
```

### Institute Types
```typescript
enum InstituteType {
    SCHOOL = 'school',
    COLLEGE = 'college',
    UNIVERSITY = 'university',
    OTHER = 'other'
}
```

## API Endpoints

### Base URL: `/api/institutes`

#### Public Endpoints

1. **List Institutes**
   - Method: `GET /`
   - Query Parameters:
     - `type`: InstituteType (optional)
     - `isActive`: boolean (optional)
     - `search`: string (optional)
     - `page`: number (default: 1)
     - `limit`: number (default: 10)
     - `sortBy`: string (default: 'createdAt')
     - `sortOrder`: 'ASC' | 'DESC' (default: 'DESC')
   - Response: `PaginatedResponse<Institute>`

2. **Get Institute by ID**
   - Method: `GET /:id`
   - Response: `Institute`

#### Protected Endpoints (Requires Authentication)

3. **Create Institute**
   - Method: `POST /`
   - Body: `CreateInstituteDto`
   - Response: `Institute`
   - Validations:
     - Unique code check
     - Unique email check

4. **Update Institute**
   - Method: `PUT /:id`
   - Body: `UpdateInstituteDto`
   - Response: `Institute`
   - Validations:
     - Unique code check (if code is being updated)
     - Unique email check (if email is being updated)

5. **Delete Institute**
   - Method: `DELETE /:id`
   - Response: `204 No Content`

6. **Soft Delete Institute**
   - Method: `PATCH /:id/deactivate`
   - Response: `Institute`
   - Effect: Sets `isActive` to false

## DTOs (Data Transfer Objects)

### CreateInstituteDto
```typescript
interface CreateInstituteDto {
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
```

### UpdateInstituteDto
```typescript
interface UpdateInstituteDto extends Partial<CreateInstituteDto> {
    isActive?: boolean;
}
```

## Feature Flags

The Institute domain is protected by the `instituteManagement` feature flag. All endpoints will return a 403 error if this feature is disabled.

## Authentication

Protected endpoints require a valid authentication token in the Authorization header. The token should be in the format:
```
Authorization: Bearer <token>
```

## Error Responses

1. **400 Bad Request**
   - When unique constraints are violated
   - When required fields are missing
   - When field validations fail

2. **401 Unauthorized**
   - When authentication token is missing
   - When authentication token is invalid

3. **403 Forbidden**
   - When feature flag is disabled
   - When user doesn't have required permissions

4. **404 Not Found**
   - When institute with specified ID doesn't exist

5. **500 Internal Server Error**
   - When unexpected server errors occur

## Database Schema

```sql
CREATE TABLE "institutes" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "institute_name" VARCHAR(100) NOT NULL UNIQUE,
    "institute_code" VARCHAR(100) NOT NULL UNIQUE,
    "institute_type" VARCHAR(50) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "phone_number" VARCHAR(50),
    "email_address" VARCHAR(100) NOT NULL UNIQUE,
    "website_url" VARCHAR(255),
    "description" TEXT,
    "contact_person" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "timezone" VARCHAR(100),
    "currency" VARCHAR(50),
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    "created_by" UUID,
    "updated_by" UUID
);

CREATE INDEX idx_institute_type ON institutes(institute_type);
CREATE INDEX idx_is_active ON institutes(is_active);
```

## Usage Examples

### Create an Institute
```typescript
const newInstitute = await instituteService.create({
    name: "Example University",
    code: "EXU001",
    type: InstituteType.UNIVERSITY,
    address: "123 Education St",
    email: "admin@exu.edu",
    timezone: "UTC",
    currency: "USD"
}, userId);
```

### Update an Institute
```typescript
const updatedInstitute = await instituteService.update(instituteId, {
    website: "https://www.exu.edu",
    contactPerson: "John Doe",
    phone: "+1-234-567-8900"
}, userId);
```

### Search Institutes
```typescript
const results = await instituteService.findAll(
    { 
        type: InstituteType.UNIVERSITY,
        isActive: true,
        search: "Example"
    },
    {
        page: 1,
        limit: 10,
        sortBy: "name",
        sortOrder: "ASC"
    }
);
``` 