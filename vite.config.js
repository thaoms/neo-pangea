import { defineConfig } from 'vite';

export default () => {
    return defineConfig({
        plugins: [],
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
        envDir: '../../',
    });
};
