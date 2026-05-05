import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../.env') });

const buildDatabaseUrl = (): string => {
    if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
    const host = process.env.PSQL_DB_HOST ?? 'localhost';
    const name = process.env.PSQL_DB_NAME ?? 'v6y';
    const user = process.env.PSQL_DB_USER ?? 'v6y';
    const password = process.env.PSQL_DB_PASSWORD ?? 'v6y';
    const port = process.env.PSQL_DB_PORT ?? '5432';
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
};

export default defineConfig({
    schema: './prisma/schema.prisma',
    datasource: {
        url: buildDatabaseUrl(),
    },
});
