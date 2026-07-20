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
            provider: 'v8',
            include: ['src/**'],
            exclude: [
                ...configDefaults.coverage.exclude,
                '**/*Resolver.ts',
                '**/*Type.ts',
                '**/*Types.ts',
                '**/ServerConfig.ts',
                '**/index.ts',
            ],
        },
    },
});
