import { Sidebar } from '@/lib/components/Sidebar';
import { SidebarInset, SidebarProvider } from '@/lib/components/Sidebar';
import { Toaster } from '@/lib/components/Sonner';
import { Navbar } from '@/lib/components/Navbar';

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
