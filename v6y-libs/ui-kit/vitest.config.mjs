import react from '@vitejs/plugin-react-swc';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * https://vitest.dev/config/#configuration
 */
export default defineConfig({
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
