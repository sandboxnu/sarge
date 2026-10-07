import { PageHeader } from '@/lib/components/core/PageHeader';
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
                    <SidebarInset className="min-h-0">
                        <PageHeader />
                        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </div>
    );
}
