import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import '@blocknote/shadcn/style.css';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const satoshi = localFont({
    src: [
        {
            path: '../lib/fonts/Satoshi-Variable.woff2',
            weight: '300 900',
            style: 'normal',
        },
        {
            path: '../lib/fonts/Satoshi-VariableItalic.woff2',
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
    description: 'System for Assessment Review, Grading, and Evaluation',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${satoshi.variable} flex h-dvh flex-col antialiased`}
            >
                <AuthProvider>
                    <main className="flex-1 overflow-hidden">{children}</main>
                </AuthProvider>
            </body>
        </html>
    );
}
