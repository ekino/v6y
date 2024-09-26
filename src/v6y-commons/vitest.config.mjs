import { configDefaults, defineConfig } from 'vitest/config';

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
            // @ts-expect-error TS(2488): Type 'string[] | undefined' must have a '[Symbol.i... Remove this comment to see the full error message
            exclude: [...configDefaults.coverage.exclude, '**/AppLogger.js'],
        },
    },
});
