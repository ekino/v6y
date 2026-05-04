import pg from 'pg';

const { Client } = pg;

const requiredVars = [
    'PSQL_DB_HOST',
    'PSQL_DB_NAME',
    'PSQL_DB_USER',
    'PSQL_DB_PASSWORD',
    'PSQL_DB_PORT',
    'SUPERADMIN_USERNAME',
    'SUPERADMIN_EMAIL',
    'SUPERADMIN_PASSWORD',
];

for (const v of requiredVars) {
    if (!process.env[v]) {
        console.error(`ERROR: Missing required env var: ${v}`);
        process.exit(1);
    }
}

const client = new Client({
    host: process.env.PSQL_DB_HOST,
    port: parseInt(process.env.PSQL_DB_PORT),
    database: process.env.PSQL_DB_NAME,
    user: process.env.PSQL_DB_USER,
    password: process.env.PSQL_DB_PASSWORD,
});

await client.connect();

const { rows } = await client.query(
    'SELECT id FROM accounts WHERE email = $1',
    [process.env.SUPERADMIN_EMAIL],
);

if (rows.length > 0) {
    console.log(`Superadmin '${process.env.SUPERADMIN_EMAIL}' already exists, skipping.`);
} else {
    await client.query(
        `INSERT INTO accounts (username, email, password, role, created_at, updated_at)
         VALUES ($1, $2, $3, 'SUPERADMIN', NOW(), NOW())`,
        [
            process.env.SUPERADMIN_USERNAME,
            process.env.SUPERADMIN_EMAIL,
            process.env.SUPERADMIN_PASSWORD,
        ],
    );
    console.log(`Superadmin '${process.env.SUPERADMIN_EMAIL}' created successfully.`);
}

await client.end();
