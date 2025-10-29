import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
// import tailwindcss from 'eslint-plugin-tailwindcss'; // Disabled - v4 compatibility issue

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    // Global ignores
    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'build/**',
            'dist/**',
            'src/generated/**', // Ignore Prisma generated client files lolz
            'prisma/**', // Ignore Prisma seed/teardown scripts
            'next-env.d.ts',
            'tailwind.config.ts',
            'next.config.ts',
        ],
    },

    // Base Next.js configuration
    ...compat.extends('next/core-web-vitals', 'next/typescript'),

    // TypeScript configuration
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },
        rules: {
            // TypeScript specific rules
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'inline-type-imports',
                },
            ],

            // General rules
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'prefer-const': 'error',
            'no-var': 'error',
            'object-shorthand': 'error',
            'prefer-template': 'error',

            // Enforce absolute imports with @/ alias
            // Allow CSS files and app root level files to use './' for styles and adjacent files
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['../*', '../*/**'],
                            message:
                                'Use absolute imports with @/ alias instead of relative imports (e.g., "@/lib/utils/errors" instead of "../../utils/errors")',
                        },
                    ],
                    paths: [
                        {
                            name: '../*',
                            message:
                                'Use absolute imports with @/ alias instead of relative imports.',
                        },
                        {
                            name: '../../*',
                            message:
                                'Use absolute imports with @/ alias instead of relative imports.',
                        },
                        {
                            name: '../../../*',
                            message:
                                'Use absolute imports with @/ alias instead of relative imports.',
                        },
                    ],
                },
            ],
        },
    },

    // Tailwind CSS configuration - disabled until plugin supports v4
    // Note: eslint-plugin-tailwindcss doesn't support Tailwind CSS v4 yet
    // Prettier with prettier-plugin-tailwindcss will handle class ordering instead

    // Prettier integration - must be last to override other configs
    ...compat.extends('prettier'),
];

export default eslintConfig;
