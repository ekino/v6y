import react from '@vitejs/plugin-react-swc';
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
    build: {
        lib: {
            entry: resolve('.', './src/index.ts'),
            name: 'ui-kit',
            formats: ['es', 'umd'],
            fileName: (format) => `ui-kit.${format}.js`,
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
