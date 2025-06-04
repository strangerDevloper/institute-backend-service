import { InstituteType } from "../entity/types";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateInstitute1748723223338 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        
        await queryRunner.createTable(
            new Table({
                name: "institutes",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "institute_name",
                        type: "varchar",
                        length: "100",
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: "institute_code",
                        type: "varchar",
                        length: "100",
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: "institute_type",
                        type: "enum",
                        enum: Object.values(InstituteType),
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "address",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "latitude",
                        type: "decimal",
                        precision: 10,
                        scale: 8,
                        isNullable: true
                    },
                    {
                        name: "longitude",
                        type: "decimal",
                        precision: 11,
                        scale: 8,
                        isNullable: true
                    },
                    {
                        name: "phone_number",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "email_address",
                        type: "varchar",
                        length: "100",
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: "website_url",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "contact_person",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "is_active",
                        type: "boolean",
                        default: true,
                        isNullable: false
                    },
                    {
                        name: "timezone",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "currency",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false
                    },
                    {
                        name: "created_by",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "updated_by",
                        type: "uuid",
                        isNullable: true
                    }
                ]
            }),
            true // If table exists, drop it first
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("institutes");
    }

}
