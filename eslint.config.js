import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['public/build/**', 'vendor/**', 'node_modules/**'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,ts,tsx}'],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
    },
    {
        files: ['resources/js/**/*.{ts,tsx}'],
        plugins: { 'react-hooks': reactHooks },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'error',
        },
    },
);