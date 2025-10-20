import { UserProvider } from '@/lib/auth/auth-client';

export default function CRMLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <UserProvider>{children}</UserProvider>;
}
