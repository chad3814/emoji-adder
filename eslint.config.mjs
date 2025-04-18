import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends(
        'next/core-web-vitals',
        'next/typescript',
        'plugin:prettier/recommended', // Add Prettier recommended config
    ),
    {
        rules: {
            indent: ['error', 4, { SwitchCase: 1 }], // Enforce 4 spaces for indentation
            'prettier/prettier': ['error'], // Enforce Prettier formatting as an ESLint error
        },
    },
];

export default eslintConfig;
