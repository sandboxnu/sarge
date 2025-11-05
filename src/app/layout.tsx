import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { UserProvider } from '@/lib/auth/auth-client';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const satoshi = localFont({
    src: [
        {
            path: '../lib/fonts/WEB/fonts/Satoshi-Variable.woff2',
            weight: '300 900',
            style: 'normal',
        },
        {
            path: '../lib/fonts/WEB/fonts/Satoshi-VariableItalic.woff2',
            weight: '300 900',
            style: 'italic',
        },
    ],
    variable: '--font-satoshi',
    display: 'swap',
    fallback: ['inter'],
});

export const metadata: Metadata = {
    title: 'Sarge',
    description: 'Standardized Assessment Review, Grading, & Evaluation',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${satoshi.variable} grid h-dvh grid-rows-[auto_1fr] antialiased`}
            >
                <UserProvider>
                    <main>{children}</main>
                </UserProvider>
            </body>
        </html>
    );
}
