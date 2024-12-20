import stylistic from '@stylistic/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactRefresh from 'eslint-plugin-react-refresh';
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
            'react-refresh': reactRefresh,
        },
        rules: {
            'newline-before-return': 'error',
            'react-refresh/only-export-components': 'warn',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
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
