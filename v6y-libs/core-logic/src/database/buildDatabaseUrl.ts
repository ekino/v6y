const buildDatabaseUrl = (): string => {
    if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
    const host = process.env.PSQL_DB_HOST ?? 'localhost';
    const name = process.env.PSQL_DB_NAME ?? 'v6y';
    const user = process.env.PSQL_DB_USER ?? 'v6y';
    const password = process.env.PSQL_DB_PASSWORD ?? 'v6y';
    const port = process.env.PSQL_DB_PORT ?? '5432';

    const url = new URL(`postgresql://${host}`);
    url.port = port;
    url.username = user;
    url.password = password;
    url.pathname = `/${name}`;
    return url.toString();
};

export default buildDatabaseUrl;
