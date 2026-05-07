import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import buildDatabaseUrl from './src/database/buildDatabaseUrl.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../.env') });

export default defineConfig({
    schema: './prisma/schema.prisma',
    datasource: {
        url: buildDatabaseUrl(),
    },
});
