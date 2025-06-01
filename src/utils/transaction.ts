import { DataSource, QueryRunner } from 'typeorm';
import { DatabaseError } from './errors/AppError';

export type TransactionCallback<T> = (queryRunner: QueryRunner) => Promise<T>;

export async function executeInTransaction<T>(
    dataSource: DataSource,
    callback: TransactionCallback<T>
): Promise<T> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const result = await callback(queryRunner);
        await queryRunner.commitTransaction();
        return result;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
} 