import stylistic from '@stylistic/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    stylistic.configs.customize({
        indent: 4,
        quotes: 'single',
        semi: true,
        jsx: true,
    }),
    {
        name: 'Root eslint',
        files: ['**/*.ts', '**/*.tsx', '**/*.cjs', '**/*.mjs', '**/*.js'],
        ignores: ['dist'],
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            'newline-before-return': 'error',
            '@typescript-eslint/no-require-imports': 'off',
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: typescriptParser,
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
    },
];
