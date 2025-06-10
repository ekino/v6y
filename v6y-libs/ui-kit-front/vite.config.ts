import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        dts({
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            copyDtsFiles: true,
            outDir: 'dist/types',
            staticImport: true,
            insertTypesEntry: true,
            compilerOptions: {
                declarationMap: true,
            },
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    build: {
        lib: {
            entry: resolve('.', './src/index.ts'),
            name: 'ui-kit-front',
            formats: ['es', 'umd'],
            fileName: (format) => format === 'es' ? 'index.js' : `ui-kit-front.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
    css: {
        postcss: {
            plugins: [],
        },
    },
});
