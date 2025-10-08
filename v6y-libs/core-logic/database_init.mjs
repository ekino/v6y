import fs from 'fs-extra';
import path from 'path';

const PSQL_DB_USER = process.env.PSQL_DB_USER || 'postgres';
const PSQL_DB_PASSWORD = process.env.PSQL_DB_PASSWORD || 'postgres';
const PSQL_DB_NAME = process.env.PSQL_DB_NAME || 'v6y';
const PSQL_DB_HOST = process.env.PSQL_DB_HOST || 'v6y-postgres';
const PSQL_DB_PORT = Number(process.env.PSQL_DB_PORT || 5432);

const DatabaseConfig = {
    development: {
        username: PSQL_DB_USER,
        password: PSQL_DB_PASSWORD,
        database: PSQL_DB_NAME,
        host: PSQL_DB_HOST,
        port: PSQL_DB_PORT,
        dialect: 'postgres',
    },
    test: {
        username: PSQL_DB_USER,
        password: PSQL_DB_PASSWORD,
        database: PSQL_DB_NAME,
        host: PSQL_DB_HOST,
        port: PSQL_DB_PORT,
        dialect: 'postgres',
    },
    production: {
        username: PSQL_DB_USER,
        password: PSQL_DB_PASSWORD,
        database: PSQL_DB_NAME,
        host: PSQL_DB_HOST,
        port: PSQL_DB_PORT,
        dialect: 'postgres',
    },
};

const outPath = path.resolve(
    new URL(import.meta.url).pathname,
    '..',
    '..',
    '..',
    'v6y-database',
    'psql',
    'config',
    'config.json',
);

const initDatabase = async () => {
    try {
        const dir = path.dirname(outPath);
        await fs.ensureDir(dir);

        await fs.writeFile(outPath, JSON.stringify(DatabaseConfig, null, '\t'));

        console.log(`Wrote database config to ${outPath}`);
    } catch (err) {
        console.error('Failed to write database config:', err);
        process.exitCode = 1;
    }
};

initDatabase();
