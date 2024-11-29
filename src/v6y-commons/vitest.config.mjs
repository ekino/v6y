import SequelizeMock from 'sequelize-mock';
import { configDefaults, defineConfig } from 'vitest/config';

const dbMock = new SequelizeMock();
export const AccountMock = dbMock.define('AccountModelType', {
    _id: 1,
    email: 'john.doe@email.com',
    password: 'password',
    role: 'user',
});

/**
 * https://vitest.dev/config/#configuration
 */
export default defineConfig({
    test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude],
        include: [
            ...configDefaults.include,
            'src/**/*.{test,spec}.?(c|m)[jt]s?(x)',
            'src/**/*-{test,spec}.?(c|m)[jt]s?(x)',
        ],
        coverage: {
            include: ['src/**'],
            exclude: [
                ...configDefaults.coverage.exclude,
                '**/types/**',
                '**/config/**',
                '**/database/**',
                '**/**Worker*.*',
            ],
        },
        setupFiles: ['dotenv/config'],
    },
});
