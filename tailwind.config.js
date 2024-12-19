/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    content: {
        relative: true,
        files: [
            'index.html',
            './src/**/*',
        ],
    },
    theme: {
        // extend: {
        //     colors: {
        //         ...colors,
        //     },
        //     borderWidth: {
        //         1: '1px',
        //     },
        fontFamily: {
            sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        },
        // },
    },
    plugins: [],
};
