import { AppSidebar } from '@/lib/components/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/lib/components/Sidebar';

export default function CRMLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}
