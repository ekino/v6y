#!/usr/bin/env node
/**
 * Generates a bcrypt hash for the superadmin password.
 *
 * Usage:
 *   node create-admin-hash.mjs <plaintext-password>
 *
 * Copy the output and set it as SUPERADMIN_PASSWORD_HASH in your .env / docker-compose.
 * The hash is what init-db.sh inserts directly into the accounts table.
 *
 * Never store or commit plain-text passwords.
 */

import bcrypt from 'bcrypt';

const password = process.argv[2];

if (!password) {
    console.error('Usage: node create-admin-hash.mjs <plaintext-password>');
    process.exit(1);
}

const SALT_ROUNDS = 12;
const hash = await bcrypt.hash(password, SALT_ROUNDS);

console.log('\nBcrypt hash (copy this value into SUPERADMIN_PASSWORD_HASH in your .env):\n');
console.log(hash);
console.log('');
