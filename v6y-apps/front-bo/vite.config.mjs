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
        exclude: [
            ...configDefaults.exclude,
            // exclude Playwright / e2e tests so Vitest doesn't run them
            'src/**/__tests__/**e2e*.{ts,tsx,js,jsx,mts,cts}',
            '**/*.e2e.*',
            'src/**/__tests__/e2e.*',
        ],
        include: [
            ...configDefaults.include,
            'src/**/__tests__/*.{test,spec}.?(c|m)[jt]s?(x)',
            'src/**/__tests__/*-{test,spec}.?(c|m)[jt]s?(x)',
            'src/**/*.{test,spec}.?(c|m)[jt]s?(x)',
            'src/**/*-{test,spec}.?(c|m)[jt]s?(x)',
        ],
        coverage: {
            provider: 'v8',
            include: ['src/**'],
            exclude: [
                ...configDefaults.coverage.exclude,
                '**/types/**',
                '**/app/**',
                '**/api/**',
                '**/test-utils/**',
                '**/pages/**',
                '**/infrastructure/providers/**',
                '**/infrastructure/translation/**',
            ],
        },
    },
});
