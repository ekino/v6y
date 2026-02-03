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
            // During tests, make sure imports to next/navigation can be resolved
            'next/navigation': path.resolve(__dirname, './test-mocks/next-navigation.ts'),
        },
    },
    test: {
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        environment: 'jsdom',
        exclude: [...configDefaults.exclude],
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
                '**/chatbot/**',
                '**/ProtectedRoute.tsx',
                '**/test-utils/**',
                '**/apps-stats/**',
                '**/pages/**',
                '**/infrastructure/providers/**',
            ],
        },
    },
});
