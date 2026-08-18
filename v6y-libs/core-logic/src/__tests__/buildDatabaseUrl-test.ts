import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import buildDatabaseUrl from '../database/buildDatabaseUrl.ts';

const PSQL_ENV_KEYS = [
    'DATABASE_URL',
    'PSQL_DB_HOST',
    'PSQL_DB_NAME',
    'PSQL_DB_USER',
    'PSQL_DB_PASSWORD',
    'PSQL_DB_PORT',
] as const;

describe('buildDatabaseUrl', () => {
    let savedEnv: Record<string, string | undefined>;

    beforeEach(() => {
        savedEnv = {};
        for (const key of PSQL_ENV_KEYS) {
            savedEnv[key] = process.env[key];
            delete process.env[key];
        }
    });

    afterEach(() => {
        for (const key of PSQL_ENV_KEYS) {
            if (savedEnv[key] === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = savedEnv[key];
            }
        }
    });

    it('returns DATABASE_URL verbatim when it is set', () => {
        process.env.DATABASE_URL = 'postgresql://user:pass@db.internal:5432/prod';
        expect(buildDatabaseUrl()).toBe('postgresql://user:pass@db.internal:5432/prod');
    });

    it('builds a URL from the PSQL_DB_* parts', () => {
        process.env.PSQL_DB_HOST = 'db';
        process.env.PSQL_DB_NAME = 'database';
        process.env.PSQL_DB_USER = 'admin';
        process.env.PSQL_DB_PASSWORD = 'admin';
        process.env.PSQL_DB_PORT = '5433';
        expect(buildDatabaseUrl()).toBe('postgresql://admin:admin@db:5433/database');
    });

    it('falls back to the documented defaults when nothing is set', () => {
        expect(buildDatabaseUrl()).toBe('postgresql://v6y:v6y@localhost:5432/v6y');
    });

    it('percent-encodes special characters in the credentials', () => {
        process.env.PSQL_DB_HOST = 'localhost';
        process.env.PSQL_DB_NAME = 'v6y';
        process.env.PSQL_DB_USER = 'user name';
        process.env.PSQL_DB_PASSWORD = 'p@ss:w/rd';
        process.env.PSQL_DB_PORT = '5432';
        expect(buildDatabaseUrl()).toBe(
            'postgresql://user%20name:p%40ss%3Aw%2Frd@localhost:5432/v6y',
        );
    });
});
