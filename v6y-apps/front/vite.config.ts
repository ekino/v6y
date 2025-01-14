import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';

/**
 * https://vitest.dev/config/#configuration
 */
export default defineConfig({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
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
            exclude: [...configDefaults.coverage.exclude, '**/types/**', '**/app/**', '**/api/**'],
        },
    },
});
