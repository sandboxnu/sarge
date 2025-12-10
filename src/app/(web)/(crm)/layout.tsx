import { AppSidebar } from '@/lib/components/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/lib/components/Sidebar';
import { Toaster } from '@/lib/components/Sonner';
import { TopNav } from '@/lib/components/TopNav';

export default function CRMLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-full w-full flex-col">
            <TopNav />
            <div className="flex flex-1 overflow-hidden">
                <SidebarProvider>
                    <Toaster />
                    <AppSidebar />
                    <SidebarInset className="overflow-y-auto">{children}</SidebarInset>
                </SidebarProvider>
            </div>
        </div>
    );
}
