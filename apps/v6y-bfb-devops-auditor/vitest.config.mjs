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
            exclude: [
                ...configDefaults.coverage.exclude,
                '**/*Worker.ts',
                '**/*Type.ts',
                '**/ServerConfig.ts',
                '**/*AuditorManager.ts',
                '**/FrontendAuditorRouter.ts',
                '**/*Auditor.ts',
                '**/index.ts',
            ],
        },
    },
});
