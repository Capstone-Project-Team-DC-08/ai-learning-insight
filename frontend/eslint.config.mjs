import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'airbnb',
    'airbnb/hooks',
    'next/core-web-vitals',
    'next/typescript'
  ),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  {
    rules: {
      'no-underscore-dangle': 'off',
      'linebreak-style': 'off',
      'import/no-extraneous-dependencies': 'off',
      'quotes': 'off', // Allow both single and double quotes
      'import/extensions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react/jsx-filename-extension': 'off',
      'react/button-has-type': 'off',
      'no-console': 'off',
      'no-restricted-globals': 'off',
      'no-alert': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/no-array-index-key': 'warn',
      'no-nested-ternary': 'warn',
      'react/jsx-one-expression-per-line': 'off',
      'implicit-arrow-linebreak': 'off',
      'object-curly-newline': 'off',
      'react/jsx-curly-newline': 'off',
      'function-paren-newline': 'off',
    },
  },
];

export default eslintConfig;
