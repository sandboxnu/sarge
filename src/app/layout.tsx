import type { Metadata } from 'next';
import { Nunito_Sans, Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '@/lib/components/Header';
import { UserProvider } from '@/lib/auth/auth-client';

const nunitoSans = Nunito_Sans({
    variable: '--font-nunito-sans',
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const satoshi = localFont({
    variable: '--font-satoshi',
    src: [
        { path: '../public/fonts/Satoshi-Variable.ttf', style: 'normal' },
        { path: '../public/fonts/Satoshi-VariableItalic.ttf', style: 'italic' },
    ],
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
                className={`${satoshi.variable} ${nunitoSans.variable} ${inter.variable} grid h-dvh grid-rows-[auto_1fr] antialiased`}
            >
                <UserProvider>
                    <Header />
                    <main>{children}</main>
                </UserProvider>
            </body>
        </html>
    );
}
