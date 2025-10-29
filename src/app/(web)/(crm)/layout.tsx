import SideNav from '@/lib/components/Sidebar';

export default function CRMLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-full">
            <SideNav />
            <main className="flex-1">{children}</main>
        </div>
    );
}
