import { Sidebar, SidebarInset, SidebarProvider } from '@/lib/components/core/Sidebar';

export default function CRMLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-full w-full flex-col">
            <div className="flex flex-1 overflow-hidden">
                <SidebarProvider>
                    <Sidebar />
                    <SidebarInset className="overflow-y-auto">{children}</SidebarInset>
                </SidebarProvider>
            </div>
        </div>
    );
}
