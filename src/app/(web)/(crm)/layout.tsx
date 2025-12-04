import { AppSidebar } from '@/lib/components/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/lib/components/Sidebar';
import { Toaster } from '@/lib/components/Sonner';

export default function CRMLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <Toaster />
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}
