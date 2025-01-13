import fs from 'fs-extra';

const DatabaseConfig = {
    development: {
        username: process.env.PSQL_DB_USER,
        password: process.env.PSQL_DB_PASSWORD,
        database: process.env.PSQL_DB_NAME,
        host: process.env.PSQL_DB_HOST,
        dialect: 'postgres',
    },
    test: {
        username: process.env.PSQL_DB_USER,
        password: process.env.PSQL_DB_PASSWORD,
        database: process.env.PSQL_DB_NAME,
        host: process.env.PSQL_DB_HOST,
        dialect: 'postgres',
    },
    production: {
        username: process.env.PSQL_DB_USER,
        password: process.env.PSQL_DB_PASSWORD,
        database: process.env.PSQL_DB_NAME,
        host: process.env.PSQL_DB_HOST,
        dialect: 'postgres',
    },
};

const initDatabase = () => {
    fs.writeFileSync(
        '../../v6y-database/psql/config/config.json',
        JSON.stringify(DatabaseConfig, null, '\t'),
    );
};

initDatabase();
