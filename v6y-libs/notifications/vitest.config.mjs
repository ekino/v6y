import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
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
                '**/*Type.ts',
                '**/index.ts',
            ],
        },
    },
});
