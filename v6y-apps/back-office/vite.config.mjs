import * as path from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';

/**
 * https://vitest.dev/config/#configuration
 */
export default defineConfig({
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        environment: 'jsdom',
        // No test files yet (new app, tests are a tracked follow-up) - avoid
        // failing the pre-push/CI test run for a resource with zero tests.
        passWithNoTests: true,
        include: [
            ...configDefaults.include,
            'src/**/__tests__/*.{test,spec}.?(c|m)[jt]s?(x)',
            'src/**/*.{test,spec}.?(c|m)[jt]s?(x)',
        ],
        coverage: {
            provider: 'v8',
            include: ['src/**'],
            exclude: [
                ...configDefaults.coverage.exclude,
                '**/types/**',
                '**/app/**',
            ],
        },
    },
});
