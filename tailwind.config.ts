import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/**/*.{ts,tsx,js,jsx,mdx}',
        './app/**/*.{ts,tsx,js,jsx,mdx}',
        './src/app/**/*.{ts,tsx,js,jsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    'var(--font-sans)',
                    'var(--font-inter)',
                    'ui-sans-serif',
                    'system-ui',
                    '-apple-system',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                ],
            },
        },
    },
    plugins: [],
};

export default config;
