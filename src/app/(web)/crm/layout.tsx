import { Sidebar, SidebarInset, SidebarProvider } from '@/lib/components/core/Sidebar';
import { Toaster } from '@/lib/components/ui/Sonner';
import { Navbar } from '@/lib/components/core/Navbar';

export default function CRMLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-full w-full flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <SidebarProvider>
                    <Toaster />
                    <Sidebar />
                    <SidebarInset className="overflow-y-auto">{children}</SidebarInset>
                </SidebarProvider>
            </div>
        </div>
    );
}
