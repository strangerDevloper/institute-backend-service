import { config } from 'dotenv';

config();

export default {
    type: 'postgres',
    //   replication: {
    //     master: {
    //       host: process.env.DB_HOST,
    //       port: 5432,
    //       username: process.env.DB_USERNAME,
    //       password: process.env.DB_PASSWORD,
    //       database: process.env.DB_NAME,
    //     },
    //     slaves: [
    //       {
    //         host: process.env.READ_DB_HOST,
    //         port: 5432,
    //         username: process.env.DB_USERNAME,
    //         password: process.env.DB_PASSWORD,
    //         database: process.env.DB_NAME,
    //       },
    //     ],
    //   },

    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    synchronize: false,
    logging: true,
    entities: ['src/entity/*.ts'],
    migrations: ['src/migrations/*.ts'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migrations',
    },
};
