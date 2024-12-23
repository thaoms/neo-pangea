import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default () => {
    return defineConfig({
        plugins: [
            react(),
        ],
        build: {
            target: 'es2022',
        },
        server: {
            host: true,
            port: 3001,
        },
        css: {
            modules: {
                localsConvention: 'camelCaseOnly',
            },
        },
    });
};
