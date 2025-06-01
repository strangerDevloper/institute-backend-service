import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { InstituteType } from "./types";

@Entity("institutes")
export class Institute {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 100, unique: true, name: "institute_name" })
    name: string;

    @Column({ type: "varchar", length: 100, unique: true, name: "institute_code" })
    code: string;

    @Column({ type: "varchar", length: 100, unique: true, name: "institute_type" })
    type: InstituteType;

    @Column({ type: "varchar", length: 255, name: "address" })
    address: string;

    @Column({ type: "decimal", precision: 10, scale: 8, nullable: true, name: "latitude" })
    latitude: number;

    @Column({ type: "decimal", precision: 11, scale: 8, nullable: true, name: "longitude" })
    longitude: number;

    @Column({ type: "varchar", length: 50, nullable: true, name: "phone_number" })
    phone: string;

    @Column({ type: "varchar", length: 100, unique: true, name: "email_address" })
    email: string;

    @Column({ type: "varchar", length: 255, nullable: true, name: "website_url" })
    website: string;

    @Column({ type: "text", nullable: true, name: "description" })
    description: string;

    @Column({ type: "varchar", length: 50, nullable: true, name: "contact_person" })
    contactPerson: string;

    @Column({ type: "boolean", default: true, name: "is_active" })
    isActive: boolean;

    @Column({ type: "varchar", length: 100, nullable: true, name: "timezone" })
    timezone: string;

    @Column({ type: "varchar", length: 50, nullable: true, name: "currency" })
    currency: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @Column({ type: "uuid", nullable: true, name: "created_by" })
    createdBy: string;

    @Column({ type: "uuid", nullable: true, name: "updated_by" })
    updatedBy: string;
}
